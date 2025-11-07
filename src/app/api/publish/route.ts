// this route will take summarized repo data from gemini and upsert it into our DB

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // create a prisma client in /lib/prisma.ts
import { summarizeRepo } from "../../../../lib/llm";
import { fetchRepos } from "../../../../lib/github";

export async function GET() {
  try {
    const repos = await fetchRepos(process.env.GITHUB_USERNAME!);

    for (const repo of repos) {
      const summary = await summarizeRepo(repo);

      await prisma.project.upsert({
        where: { repoUrl: repo.url },
        update: {
          name: summary.name,
          description: summary.description,
          stars: repo.stargazerCount,
          forks: repo.forkCount,
          lastCommitAt: new Date(repo.updatedAt),
          featured: false,
          updatedAt: new Date(),
        },
        create: {
          repoUrl: repo.url,
          name: summary.name,
          description: summary.description,
          stars: repo.stargazerCount,
          forks: repo.forkCount,
          lastCommitAt: new Date(repo.updatedAt),
          featured: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ status: "success" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to publish repos" }, { status: 500 });
  }
}