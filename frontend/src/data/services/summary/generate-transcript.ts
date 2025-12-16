import { Client, Caption } from "youtubei";

import { TranscriptData, TranscriptSegment } from "@/types";

const processTranscriptSegments = (
  captions: Caption[]
): TranscriptSegment[] => {
  return captions.map((caption) => ({
    text: caption.text,
    start: caption.start,
    end: caption.end, // Caption has an end getter
    duration: caption.duration
  }));
};

const cleanImageUrl = (url: string): string => url.split("?")[0];

const validateIdentifier = (identifier: string): void => {
  if (!identifier || typeof identifier !== "string") {
    throw new Error("Invalid YouTube video identifier");
  }
};

export const generateTranscript = async (
  identifier: string
): Promise<TranscriptData> => {
  try {
    const youtube = new Client();

    validateIdentifier(identifier);

    // 1) Get video info
    const video = await youtube.getVideo(identifier);

    if (!video) {
      throw new Error("No video information found");
    }

    const title = video.title || "Untitled Video";
    const videoId = video.id;
    const thumbnailUrl = video.thumbnails?.[0]?.url
      ? cleanImageUrl(video.thumbnails[0].url)
      : undefined;

    // 2) Get transcript (captions)
    const captions = await youtube.getVideoTranscript(identifier);

    if (!captions || captions.length === 0) {
      throw new Error("No transcript available for this video");
    }

    const transcriptWithTimeCodes = processTranscriptSegments(captions);
    const fullTranscript = captions.map((c) => c.text).join(" ");

    return {
      title,
      videoId,
      thumbnailUrl,
      fullTranscript,
      transcriptWithTimeCodes
    };
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch transcript"
    );
  }
};
