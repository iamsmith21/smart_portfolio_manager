"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Github, LogOut, User } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AuthButton() {
  // checks if we are logged in 
  const { data: session } = useSession();
  // const sessionData = useSession();
  // console.log("session: ", sessionData); 
  if (!session) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => signIn("github")}
        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-800 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Github className="w-5 h-5" />
        <span>Sign in with GitHub</span>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3"
    >
      <Link
        href="/settings"
        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-medium">{session.user?.name}</span>
      </Link>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => signOut()}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">Sign out</span>
      </motion.button>
    </motion.div>
  );
}