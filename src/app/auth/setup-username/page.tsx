"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, User, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SetupUsernamePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated" && session) {
      const hasProfile = (session as any).hasProfile;
      if (hasProfile) {
        router.push("/settings");
      }
    }
  }, [status, session, router]);

  useEffect(() => {
    const checkUsername = async () => {
      if (!username || username.length < 3) {
        setIsAvailable(null);
        return;
      }

      if (!/^[a-zA-Z0-9-_]+$/.test(username)) {
        setIsAvailable(false);
        return;
      }

      setChecking(true);
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        setIsAvailable(data.available);
      } catch (err) {
        setIsAvailable(null);
      } finally {
        setChecking(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, hyphens, and underscores");
      return;
    }

    if (isAvailable === false) {
      setError("This username is already taken");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/setup-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to set username");
      }

      window.location.href = "/settings";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set username");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Choose Your Username
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Pick a unique username for your portfolio
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
                    setUsername(value);
                    setError("");
                  }}
                  placeholder="your-username"
                  minLength={3}
                  maxLength={30}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {checking ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  ) : username.length >= 3 ? (
                    isAvailable === true ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : isAvailable === false ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : null
                  ) : null}
                </div>
              </div>

              {username.length > 0 && username.length < 3 && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Username must be at least 3 characters
                </p>
              )}

              {username.length >= 3 && isAvailable === true && (
                <p className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  This username is available!
                </p>
              )}

              {username.length >= 3 && isAvailable === false && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  This username is already taken
                </p>
              )}

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Your portfolio will be available at:{" "}
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  /{username || "your-username"}
                </span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || checking || isAvailable === false || username.length < 3}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Setting up...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Username requirements:
            </p>
            <ul className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <li>• 3-30 characters</li>
              <li>• Letters, numbers, hyphens, and underscores only</li>
              <li>• Must be unique</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

