import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define schema for validation
const SummarySchema = z.object({
  name: z.string(),
  description: z.string(),
  tech: z.array(z.string()),
  highlights: z.array(z.string()),
});

export type RepoSummary = z.infer<typeof SummarySchema>;

/**
 * Summarize a GitHub repo using Gemini
 */
export async function summarizeRepo(repo: {
  name: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  url: string;
}): Promise<RepoSummary> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  Summarize this GitHub repository in JSON format with the following fields:
  - name: string
  - description: short plain-English summary
  - tech: array of technologies used
  - highlights: array of 2–3 key features or achievements

  Repository details:
  Name: ${repo.name}
  Description: ${repo.description ?? "No description"}
  Stars: ${repo.stargazerCount}
  Forks: ${repo.forkCount}
  URL: ${repo.url}

  Respond ONLY with valid JSON.
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Parse and validate with Zod
  const parsed = SummarySchema.parse(JSON.parse(text));
  return parsed;
}