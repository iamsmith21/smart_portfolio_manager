import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      username,
      headline,
      about,
      workExperience,
      education,
      skills,
      contact,
      projects,
    } = body;

    // Verify the user is updating their own profile by fetching their GitHub username
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const githubRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${session.accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!githubRes.ok) {
      return NextResponse.json(
        { error: "Failed to verify user" },
        { status: 401 }
      );
    }

    const githubUser = await githubRes.json();
    if (githubUser.login !== username) {
      return NextResponse.json(
        { error: "Unauthorized: Can only update your own profile" },
        { status: 403 }
      );
    }

    // Update or create profile
    const profile = await prisma.profile.upsert({
      where: { name: username },
      update: {
        headline: headline || "",
        about: about || "",
        workExperience: workExperience || null,
        education: education || null,
        skills: skills || [],
        contact: contact || null,
      },
      create: {
        name: username,
        headline: headline || "",
        about: about || "",
        workExperience: workExperience || null,
        education: education || null,
        skills: skills || [],
        contact: contact || null,
      },
    });

    // Update project visibility if provided
    if (projects && Array.isArray(projects)) {
      await Promise.all(
        projects.map(async (p: { id: string; visible: boolean }) => {
          await prisma.project.update({
            where: { id: p.id },
            data: { visible: p.visible },
          });
        })
      );
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

