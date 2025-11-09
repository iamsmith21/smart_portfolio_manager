import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const res = await fetch("https://api.github.com/user/repos?per_page=6", {
    headers: {
      Authorization: `token ${session.accessToken}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}