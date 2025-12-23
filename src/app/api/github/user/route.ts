import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { 
        profile: true,
        accounts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hasGitHubAccount = !!(session?.accessToken || user.accounts.some((acc: any) => acc.provider === "github"));
    
    const username = user.profile?.name || user.email.split("@")[0];
    
    if (session?.accessToken && hasGitHubAccount) {
      try {
        const res = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `token ${session.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({ 
            username, 
            name: data.name || user.name || user.email.split("@")[0],
            hasGitHubAccount: true
          });
        }
      } catch (error) {
        console.error("GitHub API error:", error);
      }
    }
    
    return NextResponse.json({ 
      username, 
      name: user.name || user.email.split("@")[0],
      hasGitHubAccount
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user info" },
      { status: 500 }
    );
  }
}

