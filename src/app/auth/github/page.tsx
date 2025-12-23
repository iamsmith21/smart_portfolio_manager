"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function GitHubLoginPage() {
  useEffect(() => {
    signIn("github", { callbackUrl: "/settings" });
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600 dark:text-gray-400">Redirecting to GitHub...</p>
      </div>
    </main>
  );
}

