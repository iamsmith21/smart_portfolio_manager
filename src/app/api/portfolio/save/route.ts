import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { github, linkedin, template, repos } = body;

  try {
    // Create profile
    const profile = await prisma.profile.create({
      data: {
        name: github,
        headline: template,
        about: linkedin,
        skills: {
          set: Array.from(
            new Set(repos.flatMap((r: any) => r.summary?.tech || []))
          ),
        },
      },
    });

    // Upsert projects
    await Promise.all(
      repos.map(async (repo: any) => {
        const summary = repo.summary;

        if (!summary?.description || !repo.html_url || !repo.name) return;

        try {
          await prisma.project.upsert({
            where: { repoUrl: repo.html_url },
            update: {
              name: repo.name,
              description: summary.description,
              tech: summary.tech?.length ? { set: summary.tech } : undefined,
              highlights: summary.highlights?.length ? { set: summary.highlights } : undefined,
              stars: repo.stargazers_count ?? 0,
              forks: repo.forks_count ?? 0,
            },
            create: {
              repoUrl: repo.html_url,
              name: repo.name,
              description: summary.description,
              tech: summary.tech?.length ? { set: summary.tech } : [],
              highlights: summary.highlights?.length ? { set: summary.highlights } : [],
              stars: repo.stargazers_count ?? 0,
              forks: repo.forks_count ?? 0,
              featured: false,
            },
          });
        } catch (err) {
          console.error(`Failed to save repo ${repo.name}:`, err);
        }
      })
    );

    return NextResponse.json({ profileId: profile.id });
  } catch (error) {
    console.error("Portfolio save failed:", error);
    return NextResponse.json({ error: "Failed to save portfolio" }, { status: 500 });
  }
}