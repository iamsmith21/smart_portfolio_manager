import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const profile = await prisma.profile.findUnique({
      where: { name: username },
      include: {
        projects: {
          orderBy: { stars: "desc" },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({
        headline: "",
        about: "",
        workExperience: [],
        education: [],
        skills: [],
        contact: null,
        projects: [],
      });
    }

    return NextResponse.json({
      headline: profile.headline,
      about: profile.about,
      workExperience: profile.workExperience,
      education: profile.education,
      skills: profile.skills,
      contact: profile.contact,
      projects: profile.projects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        visible: p.visible ?? true, // Use visible field from database
      })),
    });
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

