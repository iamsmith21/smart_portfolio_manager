import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Fetch the authenticated user's GitHub profile to get their username
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${session.accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch user info" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json({ username: data.login, name: data.name });
}

