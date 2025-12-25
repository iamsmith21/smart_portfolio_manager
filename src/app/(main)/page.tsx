"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import {
  Sparkles,
  Github,
  Palette,
  Brain,
  Rocket,
  Terminal
} from "lucide-react";
import { PortfolioPreviewCard } from "@/components/PortfolioPreviewCard";



const bentoItems = [
  {
    title: "Zero-Config Sync",
    description: "Don't lift a finger. We watch your GitHub profile and automatically pull your best repositories the moment you push code.",
    icon: Github,
    className: "md:col-span-2",
    bg: "linear-gradient(to bottom right, var(--primary), transparent)",
    benefits: ["Real-time repository listeners", "Automatic Readme parsing", "Language detection"]
  },
  {
    title: "Intellectual Intelligence",
    description: "Our Gemini 1.5 Pro engine reads your code, understands your architecture, and writes professional case studies for you.",
    icon: Brain,
    className: "md:col-span-1",
    bg: "var(--card)",
    benefits: ["Codebase architecture analysis", "Tech stack highlighting", "Soft skill extraction"]
  },
  {
    title: "Global Edge Network",
    description: "Your portfolio deserves to be fast. We deploy your site to the edge in seconds, ensuring sub-100ms latency worldwide.",
    icon: Rocket,
    className: "md:col-span-1",
    bg: "var(--card)",
    benefits: ["One-click Vercel integration", "Auto-provisioned SSL", "Custom domain support"]
  },
  {
    title: "Atmospheric Immersion",
    description: "Ditch the generic white grids. Use our 'Deep Space' dark mode to give your visitors a cinematic experience.",
    icon: Palette,
    className: "md:col-span-2",
    bg: "linear-gradient(to top left, var(--secondary), transparent)",
    benefits: ["Cinematic glassmorphism", "Fluid motion primitives", "Variable font typography"]
  },
];

export default function HomePage() {
  const { data: session } = useSession();

  // Animation variants for staggered entrance
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-6xl mx-auto space-y-24">


      <section className="w-full pt-20 md:pt-32 pb-20 relative">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-0 -translate-x-1/7 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Column: Text & CTA */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 lg:-mt-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>The Portfolio OS for Developers</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Portfolios. <br />
              <span className="text-primary relative inline-block">
                Reimagined.
                <svg className="absolute w-full h-3 -bottom-2 left-0 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Stop coding valid markup. Start shipping valid careers.
              Connect GitHub, pick a Deep Theme, and let AI tell your story with cinematic precision.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {session ? (
                <Link href="/settings" className="w-full sm:w-auto group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-primary px-8 font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:scale-105">
                  <span className="flex items-center gap-2">
                    Launch Console <Terminal className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              ) : (
                <button
                  onClick={() => signIn("github")}
                  className="w-full sm:w-auto group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-foreground px-8 font-medium text-background shadow-lg transition-all hover:bg-foreground/90 hover:scale-105"
                >
                  <Github className="mr-2 h-5 w-5" />
                  Sign in with GitHub
                </button>
              )}

              <Link href="#features" className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full border border-input bg-background/50 backdrop-blur-sm px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                Explore Features
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Interactive Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="w-full max-w-md mx-auto lg:mr-0"
          >
            <PortfolioPreviewCard />
          </motion.div>

        </div>
      </section>

      {/* 
        FEATURE: IMPORT PROJECTS
        Matches the reference image: Text Left, Video Right.
      */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full py-24 border-t border-white/5"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 items-center">

          {/* Left: Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Github className="w-4 h-4" />
              <span>Import Projects</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Import your best work <span className="text-primary text-5xl md:text-6xl whitespace-nowrap">in seconds</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Your repositories are your résumé. We just make them look expensive.
                Sync instantly, filter by stars, and deploy a showcase that recruiters can't ignore.
              </p>
            </div>

            {/* Feature List (Optional, adds detail) */}
            <ul className="space-y-4 pt-4">
              {[
                "Metadata Extraction on Auto-Pilot",
                "Smart Filtering by Engagement",
                "Real-time Sync Architecture"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-muted-foreground">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Video Placeholder */}
          <div className="relative group rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-2xl lg:ml-30">

            <div className="aspect-video w-full bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center relative">

              {/* Mock UI to make it look good empty */}
              <div className="absolute inset-x-12 top-12 bottom-0 bg-[#0F1115] rounded-t-xl border-t border-x border-white/10 shadow-2xl p-6 opacity-80 group-hover:scale-[1.02] group-hover:-translate-y-2 transition-all duration-500">
                <div className="flex gap-4 mb-6">
                  <div className="w-1/3 h-8 bg-white/10 rounded-lg animate-pulse" />
                  <div className="w-2/3 h-8 bg-white/5 rounded-lg" />
                </div>
                <div className="space-y-3">
                  <div className="h-24 w-full bg-white/5 rounded-lg border border-white/5" />
                  <div className="h-24 w-full bg-white/5 rounded-lg border border-white/5" />
                </div>
              </div>

              {/* Play Button / Placeholder Text */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] group-hover:bg-black/20 transition-all">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                  </div>
                  <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Watch Demo</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </motion.section>

      <motion.section
        id="features"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full py-24"
      >


        <div className="w-full">
          <div className="space-y-32">
            {bentoItems.map((item, index) => (
              <div
                key={item.title}
                className={`flex flex-col lg:flex-row items-center gap-16 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
              >
                {/* Text Side */}
                <div className="flex-1 space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                    <item.icon className="w-4 h-4" />
                    <span>Feature</span>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>

                    <ul className="space-y-3 pt-4">
                      {item.benefits?.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Visual Side */}
                <div className="flex-1 w-full">
                  <div className="relative group rounded-2xl border border-white/10 bg-white/5 overflow-hidden shadow-2xl aspect-video hover:border-primary/20 transition-colors duration-500">
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.8))]" />

                    {/* Decorative Background */}
                    <div
                      className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-30"
                      style={{ background: item.bg || 'var(--primary)' }}
                    />

                    {/* Mock UI Elements */}
                    <div className="absolute inset-12 border border-white/10 rounded-lg bg-black/40 backdrop-blur-sm p-4 flex flex-col gap-3 group-hover:scale-105 transition-transform duration-700">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                      </div>
                      <div className="space-y-2 pt-2">
                        <div className="h-2 w-2/3 bg-white/10 rounded animate-pulse" />
                        <div className="h-2 w-full bg-white/5 rounded" />
                        <div className="h-2 w-5/6 bg-white/5 rounded" />
                      </div>
                      {/* Icon Center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <item.icon className="w-16 h-16 text-white/10 group-hover:text-primary/50 transition-colors duration-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 
        STATS / SOCIAL PROOF
         Simple, clean numbers.
      */}


    </div>
  );
}
