import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, url, tech, highlights } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
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

    const repoUrl = url && url.trim() 
      ? url.trim() 
      : `manual-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const project = await prisma.project.create({
      data: {
        repoUrl: repoUrl,
        name: name.trim(),
        description: description.trim(),
        tech: tech || [],
        highlights: highlights || [],
        stars: 0,
        forks: 0,
        featured: false,
        visible: true,
        profileId: profile.id,
      },
    });

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
      },
    });
  } catch (error) {
    console.error("Failed to create manual project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

