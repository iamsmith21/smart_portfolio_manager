// import Link from "next/link";

// export default function HomePage() {
//   return (
//     <main className="p-8">
//       {/* Navbar */}
//       <nav className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold">Smith’s Portfolio</h1>
//         <div className="flex gap-4">
//           <Link href="/" className="hover:underline">Home</Link>
//           <Link href="/projects" className="hover:underline">Projects</Link>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="text-center mt-12">
//         <h2 className="text-4xl font-bold mb-4">Welcome to my portfolio</h2>
//         <p className="text-gray-600 max-w-xl mx-auto">
//           I’m a software developer passionate about building full‑stack apps with Next.js, TypeScript, and Prisma. Explore my projects to see what I’ve been working on.
//         </p>
//         <Link
//           href="/projects"
//           className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           View My Projects →
//         </Link>
//       </section>
//     </main>
//   );
// }

"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-8">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Smith’s Portfolio</h1>
        <div className="flex gap-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/projects" className="hover:underline">Projects</Link>
        </div>
      </nav>

      {/* Hero Section with animation */}
      <motion.section
        className="text-center mt-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-4xl font-bold mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to my portfolio
        </motion.h2>

        <motion.p
          className="text-gray-600 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          I’m a software developer passionate about building full‑stack apps with Next.js, TypeScript, and Prisma.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Link
            href="/projects"
            className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            View My Projects →
          </Link>
        </motion.div>
      </motion.section>
    </main>
  );
}