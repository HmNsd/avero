import { streamText, UIMessage, convertToModelMessages, tool } from "ai";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { tavilySearch } from "../../../helpers/travily";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, model, webSearch }: { messages: UIMessage[]; model: string; webSearch: boolean } =
    await req.json();

  const webSearchTool = tool<{ query: string }, unknown>({
    description: "Search the web for up-to-date information",
    inputSchema: z.object({ query: z.string().describe("The search query") }),
    execute: async ({ query }: { query: string }) => tavilySearch(query),
  });

  const tools = webSearch ? { web_search: webSearchTool } : undefined;

  const result = streamText({
    model: google(model || "gemini-2.5-flash"),
    messages: convertToModelMessages(messages),
    system: webSearch
      ? "You are a helpful assistant. Use web_search for real-time info."
      : "You are a helpful assistant. Note: For real-time or updated information, suggest enabling web search.",
    tools,
  } as Parameters<typeof streamText>[0]);

  return result.toUIMessageStreamResponse({ sendSources: true, sendReasoning: true });
}
