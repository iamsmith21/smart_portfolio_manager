"use client";
import React from "react";
import { motion } from "framer-motion";
import { Github, Mail, Globe, ArrowUpRight, MapPin, Calendar, ExternalLink, Code2 } from "lucide-react";

export function BentoTheme({ profile, projects }: { profile: any; projects: any[] }) {
    // Helper to get initials
    const initials = profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 md:p-8 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
            <div className="max-w-6xl mx-auto">

                {/* Bento Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

                    {/* 1. Profile / Hero Card (Large, spans 2x2) */}
                    <BentoCard className="md:col-span-2 md:row-span-2 flex flex-col justify-between p-8 bg-white dark:bg-zinc-900">
                        <div>
                            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl font-bold mb-6 border border-zinc-200 dark:border-zinc-700">
                                {initials}
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight mb-3">{profile.name}</h1>
                            <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">{profile.headline}</p>
                        </div>
                        <div className="mt-8 flex gap-4">
                            <SocialLink href={`https://github.com/${profile.customDomain || profile.name}`} icon={<Github className="w-5 h-5" />} />
                            <SocialLink href={`mailto:${profile.user?.email}`} icon={<Mail className="w-5 h-5" />} />
                            {profile.customDomain && <SocialLink href={`https://${profile.customDomain}`} icon={<Globe className="w-5 h-5" />} />}
                        </div>
                    </BentoCard>

                    {/* 2. About Card (Wide, spans 2x1) */}
                    <BentoCard className="md:col-span-2 p-6 flex flex-col justify-center bg-zinc-100 dark:bg-zinc-800/50">
                        <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">About</div>
                        <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-4">
                            {profile.about}
                        </p>
                    </BentoCard>

                    {/* 3. Location / Status (Small, spans 1x1) */}
                    <BentoCard className="p-6 flex flex-col justify-between bg-white dark:bg-zinc-900">
                        <MapPin className="w-6 h-6 text-zinc-400" />
                        <div>
                            <div className="text-2xl font-bold">{profile.contact?.location || "Remote"}</div>
                            <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Open to work
                            </div>
                        </div>
                    </BentoCard>

                    {/* 4. Skills (Small, spans 1x1) */}
                    <BentoCard className="p-6 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 overflow-hidden relative group">
                        <Code2 className="w-6 h-6 opacity-50 mb-4" />
                        <div className="flex flex-wrap gap-2 relative z-10">
                            {profile.skills?.slice(0, 4).map((s: string) => (
                                <span key={s} className="text-sm font-medium opacity-80">{s}</span>
                            ))}
                            {profile.skills?.length > 4 && <span className="text-sm opacity-50">+{profile.skills.length - 4} more</span>}
                        </div>
                        {/* Decorative gradient blob */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    </BentoCard>

                    {/* 5. Projects Header (Wide, spans 2x1 usually, but let's make it a section header) */}
                    <div className="md:col-span-4 mt-8 mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">Selected Work</h2>
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800 ml-6"></div>
                    </div>

                    {/* 6. Projects (Dynamic) */}
                    {projects.map((p, i) => (
                        <BentoCard
                            key={p.id}
                            className={`flex flex-col justify-between p-6 group hover:ring-2 hover:ring-zinc-900 dark:hover:ring-white transition-all duration-300 ${i === 0 || i === 3 ? 'md:col-span-2' : ''} bg-white dark:bg-zinc-900`}
                            href={p.repoUrl}
                        >
                            <div className="flex justify-between items-start">
                                <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 transition-colors">
                                    <Github className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-bold mb-2 group-hover:underline decoration-1 underline-offset-4">{p.name}</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2">{p.description}</p>

                                <div className="mt-4 flex gap-2 overflow-hidden">
                                    {p.tech?.slice(0, 3).map((t: string) => (
                                        <span key={t} className="px-2 py-1 rounded-md bg-zinc-50 dark:bg-zinc-800 text-[10px] font-medium text-zinc-600 dark:text-zinc-300 uppercase tracking-wide">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </BentoCard>
                    ))}

                    {/* 7. Experience (Tall, spans 1x2) */}
                    <BentoCard className="md:col-span-2 md:row-span-2 p-6 bg-zinc-100 dark:bg-zinc-800/50">
                        <h3 className="text-zinc-400 font-semibold uppercase tracking-wider text-sm mb-6">Experience</h3>
                        <div className="space-y-6">
                            {profile.workExperience?.map((job: any, i: number) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="font-bold text-zinc-900 dark:text-zinc-100">{job.role}</div>
                                        <div className="text-xs text-zinc-500">{job.startDate} — {job.endDate || 'Present'}</div>
                                    </div>
                                    <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">{job.company}</div>
                                    <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">{job.description}</p>
                                </div>
                            ))}
                        </div>
                    </BentoCard>

                    {/* 8. Contact CTA (Wide, spans 2x1) */}
                    <BentoCard className="md:col-span-2 p-8 flex items-center justify-between bg-zinc-900 text-white dark:bg-white dark:text-black">
                        <div>
                            <div className="text-2xl font-bold mb-1">Let's work together.</div>
                            <div className="text-white/60 dark:text-black/60">Available for freelance and full-time.</div>
                        </div>
                        <a href={`mailto:${profile.user?.email}`} className="px-6 py-3 rounded-full bg-white text-black dark:bg-black dark:text-white font-medium hover:scale-105 transition-transform">
                            Get in touch
                        </a>
                    </BentoCard>

                </div>
            </div>
        </div>
    );
}

// --- Sub Components ---

function BentoCard({ children, className = "", href }: any) {
    const Component = href ? motion.a : motion.div;
    const props = href ? { href, target: "_blank" } : {};

    return (
        <Component
            {...props}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative ${className}`}
        >
            {children}
        </Component>
    )
}

function SocialLink({ href, icon }: any) {
    return (
        <a
            href={href}
            target="_blank"
            className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors"
        >
            {icon}
        </a>
    )
}
