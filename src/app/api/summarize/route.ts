import { summarizeRepo } from "lib/llm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const summary = await summarizeRepo(body);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Gemini summarization failed:", error);
    return NextResponse.json({ error: "Failed to summarize repo" }, { status: 500 });
  }
}