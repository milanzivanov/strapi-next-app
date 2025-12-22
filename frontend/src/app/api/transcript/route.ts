import { NextRequest } from "next/server";
import { actions } from "@/data/actions";
import { services } from "@/data/services";

export const maxDuration = 150;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await services.auth.getUserMeService();
  const token = await actions.auth.getAuthTokenAction();

  if (!user.success || !token) {
    return new Response(
      JSON.stringify({ data: null, error: "Not authenticated" }),
      { status: 401 }
    );
  }

  let videoId: string | undefined;
  try {
    const body = await req.json();
    videoId = body?.videoId;
  } catch {
    videoId = undefined;
  }

  if (!videoId || typeof videoId !== "string") {
    return new Response(
      JSON.stringify({ data: null, error: "No videoId provided" }),
      { status: 400 }
    );
  }

  try {
    const transcriptData = await services.summarize.generateTranscript(videoId);

    if (!transcriptData?.fullTranscript) {
      // Important: treat as error, not success
      return new Response(
        JSON.stringify({ data: null, error: "No transcript data found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ data: transcriptData, error: null }));
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(JSON.stringify({ error: "Unknown error" }));
  }
}
