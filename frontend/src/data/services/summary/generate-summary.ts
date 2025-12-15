import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function generateSummary(content: string, template?: string) {
  const systemPrompt =
    template ||
    `
    You are a helpful assistant that creates concise and informative summaries of YouTube video transcripts.
    Please summarize the following transcript, highlighting the key points and main ideas.
    Keep the summary clear, well-structured, and easy to understand.
  `;

  try {
    const { text } = await generateText({
      model: google(process.env.GOOGLE_MODEL ?? "models/gemini-flash-latest"), // Free tier model
      system: systemPrompt,
      prompt: `Please summarize this transcript:\n\n${content}`,
      temperature: process.env.AI_TEMPERATURE
        ? parseFloat(process.env.AI_TEMPERATURE)
        : 0.7
    });

    return text;
  } catch (error) {
    console.error("Error generating summary:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to generate summary: ${error.message}`);
    }

    throw new Error("Failed to generate summary");
  }
}
