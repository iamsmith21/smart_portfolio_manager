import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { summarizeRepo } from "@/lib/llm";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "GitHub account not linked. Please link your GitHub account first." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { repoUrls } = body; // Array of repo URLs to import

    if (!Array.isArray(repoUrls) || repoUrls.length === 0) {
      return NextResponse.json(
        { error: "No repositories selected" },
        { status: 400 }
      );
    }

    let dbUser = null;
    if (session.user.id) {
      dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { profile: true },
      });
    }
    
    if (!dbUser && session.user.email) {
      dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { profile: true },
      });
    }

    if (!dbUser || !dbUser.profile) {
      return NextResponse.json(
        { error: "Profile not found. Please set up your username first." },
        { status: 404 }
      );
    }

    const profile = dbUser.profile;

    const importedProjects = [];
    const errors = [];

    for (const repoUrl of repoUrls) {
      try {
        const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!urlMatch) {
          errors.push({ repoUrl, error: "Invalid repository URL" });
          continue;
        }

        const [, owner, repoName] = urlMatch;

        const repoRes = await fetch(
          `https://api.github.com/repos/${owner}/${repoName}`,
          {
            headers: {
              Authorization: `token ${session.accessToken}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!repoRes.ok) {
          errors.push({
            repoUrl,
            error: `Failed to fetch repo: ${repoRes.statusText}`,
          });
          continue;
        }

        const repoData = await repoRes.json();

        const repoForSummary = {
          name: repoData.name,
          description: repoData.description,
          stargazerCount: repoData.stargazers_count || 0,
          forkCount: repoData.forks_count || 0,
          url: repoData.html_url,
        };

        const summary = await summarizeRepo(repoForSummary);

        const project = await prisma.project.upsert({
          where: { repoUrl: repoData.html_url },
          update: {
            name: summary.name,
            description: summary.description,
            tech: summary.tech || [],
            highlights: summary.highlights || [],
            stars: repoData.stargazers_count || 0,
            forks: repoData.forks_count || 0,
            lastCommitAt: repoData.updated_at
              ? new Date(repoData.updated_at)
              : null,
            profileId: profile.id,
            visible: true,
          },
          create: {
            repoUrl: repoData.html_url,
            name: summary.name,
            description: summary.description,
            tech: summary.tech || [],
            highlights: summary.highlights || [],
            stars: repoData.stargazers_count || 0,
            forks: repoData.forks_count || 0,
            lastCommitAt: repoData.updated_at
              ? new Date(repoData.updated_at)
              : null,
            featured: false,
            visible: true,
            profileId: profile.id,
          },
        });

        importedProjects.push({
          id: project.id,
          name: project.name,
          description: project.description,
        });
      } catch (error) {
        console.error(`Failed to import repo ${repoUrl}:`, error);
        errors.push({
          repoUrl,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedProjects.length,
      projects: importedProjects,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Failed to import projects:", error);
    return NextResponse.json(
      { error: "Failed to import projects" },
      { status: 500 }
    );
  }
}

