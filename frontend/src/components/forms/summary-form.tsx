"use client";
import { useState } from "react";
import { toast } from "sonner";
import { cn, extractYouTubeID } from "@/lib/utils";
import { api } from "@/data/data-api";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";

import { services } from "@/data/services";

type ITranscriptResponse = {
  fullTranscript: string;
  title?: string;
  videoId?: string;
  thumbnailUrl?: string;
};

interface IErrors {
  message: string | null;
  name: string;
}

const INITIAL_STATE = {
  message: null,
  name: ""
};

export function SummaryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IErrors>(INITIAL_STATE);
  const [value, setValue] = useState<string>("");

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("A: submitting");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const videoId = formData.get("videoId") as string;
    const processedVideoId = extractYouTubeID(videoId);
    // console.log("B: processedVideoId", processedVideoId);

    if (!processedVideoId) {
      toast.error("Invalid Youtube Video ID");
      setLoading(false);
      setValue("");
      setError({
        ...INITIAL_STATE,
        message: "Invalid Youtube Video ID",
        name: "Invalid Id"
      });
      return;
    }

    let currentToastId: string | number | undefined;

    try {
      // Step 1: Get transcript
      currentToastId = toast.loading("Getting transcript...");

      const transcriptResponse = await api.post<
        ITranscriptResponse,
        { videoId: string }
      >("/api/transcript", { videoId: processedVideoId });

      // console.log("C: transcriptResponse", transcriptResponse);

      if (!transcriptResponse.success) {
        toast.dismiss(currentToastId);
        toast.error(transcriptResponse.error?.message);
        return;
      }

      const fullTranscript = transcriptResponse.data?.fullTranscript;

      console.log("D: fullTranscript", fullTranscript);

      if (!fullTranscript) {
        toast.dismiss(currentToastId);
        toast.error("Unexpected: transcript missing from server response");
        return;
      }

      // console.log("//////////// full transcript", fullTranscript);

      // Step 2: Generate summary
      toast.dismiss(currentToastId);
      currentToastId = toast.loading("Generating summary...");

      const summaryResponse = await api.post<
        string,
        { fullTranscript: string }
      >(
        "/api/summarize",
        { fullTranscript: fullTranscript },
        { timeoutMs: 120000 }
      );

      if (!summaryResponse.success) {
        toast.dismiss(currentToastId);
        toast.error(summaryResponse.error?.message);
        return;
      }

      const summaryData = summaryResponse.data;

      if (!summaryData) {
        toast.dismiss(currentToastId);
        toast.error("No summary generated");
        return;
      }

      console.log("sammery", summaryData);

      // Step 3: Save summary to database
      toast.dismiss(currentToastId);
      currentToastId = toast.loading("Saving summary...");

      const saveResponse = await services.summarize.saveSummaryService({
        title:
          transcriptResponse.data?.title || `Summary for ${processedVideoId}`,
        content: summaryResponse.data,
        videoId: processedVideoId
      });

      if (!saveResponse.success) {
        toast.dismiss(currentToastId);
        toast.error(saveResponse.error?.message);
        return;
      }

      console.log("SAVE RESPONSE:", saveResponse);
      toast.dismiss(currentToastId);
      currentToastId = undefined;
      toast.success("Summary Created and Saved!");
      setValue("");

      // Redirect to the summary details page
      router.push("/dashboard/summaries/" + saveResponse.data?.documentId);

      toast.success("Summary Created and Saved!");
      setValue("");

      // Redirect to the summary details page
      router.push("/dashboard/summaries/" + saveResponse.data?.documentId);

      toast.success("Summary Created and Saved!");
      setValue("");

      toast.dismiss(currentToastId);
      toast.success("Summary Created and Saved!");
      setValue("");

      // Redirect to the summary details page
    } catch (error) {
      if (currentToastId) toast.dismiss(currentToastId);
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create summary"
      );
    } finally {
      setLoading(false);
    }
  }

  function clearError() {
    setError(INITIAL_STATE);
    if (error.message) setValue("");
  }

  const errorStyles = error.message
    ? "outline-1 outline outline-red-500 placeholder:text-red-700"
    : "";

  return (
    <div className="w-full flex-1 mx-4">
      <form onSubmit={handleFormSubmit} className="flex gap-2 items-center">
        <Input
          name="videoId"
          placeholder={
            error.message ? error.message : "Youtube Video ID or URL"
          }
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onMouseDown={clearError}
          className={cn(
            "w-full focus:text-black focus-visible:ring-pink-500",
            errorStyles
          )}
          required
        />

        <SubmitButton
          text="Create Summary"
          loadingText="Creating Summary"
          className="bg-pink-500"
          loading={loading}
        />
      </form>
    </div>
  );
}
