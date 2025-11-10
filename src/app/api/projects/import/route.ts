import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { summarizeRepo } from "@/lib/llm";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
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

    // Get the user's GitHub username
    const githubRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${session.accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!githubRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user info" },
        { status: 401 }
      );
    }

    const githubUser = await githubRes.json();
    const username = githubUser.login;

    // Get or create profile
    const profile = await prisma.profile.upsert({
      where: { name: username },
      update: {},
      create: {
        name: username,
        headline: "",
        about: "",
        skills: [],
      },
    });

    // Fetch and summarize each selected repo
    const importedProjects = [];
    const errors = [];

    for (const repoUrl of repoUrls) {
      try {
        // Extract owner and repo name from URL
        const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!urlMatch) {
          errors.push({ repoUrl, error: "Invalid repository URL" });
          continue;
        }

        const [, owner, repoName] = urlMatch;

        // Fetch repo details from GitHub API
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

        // Prepare repo data for summarization
        const repoForSummary = {
          name: repoData.name,
          description: repoData.description,
          stargazerCount: repoData.stargazers_count || 0,
          forkCount: repoData.forks_count || 0,
          url: repoData.html_url,
        };

        // Summarize using AI
        const summary = await summarizeRepo(repoForSummary);

        // Save project to database
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

