"use client";

import { Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
    profile: {
        name: string;
        headline: string;
        image?: string | null;
    };
    socials: {
        github?: string | null;
        linkedin?: string | null;
    };
}

export function Hero({ profile, socials }: HeroProps) {
    return (
        <section className="relative min-h-[60vh] flex flex-col justify-center max-w-5xl mx-auto px-6 pt-32 pb-12">

            {/* Minimal Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-6"
            >
                {/* Avatar - Sharp, No Glow */}
                {profile.image ? (
                    <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-20 h-20 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-xl font-medium text-zinc-500 dark:text-zinc-400">
                        {profile.name.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="space-y-2">
                    <h1 className="text-5xl md:text-8xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                        {profile.name}
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 max-w-2xl font-light tracking-wide">
                        {profile.headline}
                    </p>
                </div>

                {/* Links - Minimal Text */}
                <div className="flex gap-6 pt-4">
                    {socials.github && (
                        <a
                            href={socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            <span className="text-sm font-medium">GitHub</span>
                        </a>
                    )}
                    {socials.linkedin && (
                        <a
                            href={socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
                        >
                            <Linkedin className="w-4 h-4" />
                            <span className="text-sm font-medium">LinkedIn</span>
                        </a>
                    )}
                </div>
            </motion.div>
        </section>
    );
}
