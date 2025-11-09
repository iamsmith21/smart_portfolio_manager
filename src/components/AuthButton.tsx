"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (!session) {
    return <button onClick={() => signIn("github")}>Sign in with GitHub</button>;
  }

  return (
    <div>
      <p>Signed in as {session.user?.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}