"use client";

import { motion } from "framer-motion";

interface Experience {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
    current: boolean;
}

interface Education {
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description: string;
}

export function Experience({
    work,
    education
}: {
    work: Experience[],
    education: Education[]
}) {
    if (work.length === 0 && education.length === 0) return null;

    return (
        <section className="max-w-5xl mx-auto px-6 py-12 border-t border-zinc-200 dark:border-zinc-800/50">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-16">

                {/* Work History */}
                {work.length > 0 && (
                    <>
                        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest pt-2">Experience</h2>
                        <div className="space-y-12">
                            {work.map((job, i) => (
                                <div key={i} className="group relative pl-6 border-l border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{job.company}</h3>
                                        <span className="text-xs text-zinc-500 font-mono mt-1 sm:mt-0">
                                            {job.startDate} — {job.current ? "Present" : job.endDate}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">{job.role}</p>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                                        {job.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Education (If Work exists, use a spacer/separator logic, otherwise just rendered in the grid flow) */}

            </div>

            {work.length > 0 && education.length > 0 && <div className="h-12" />}

            {education.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-16 mt-12 pt-12 border-t border-zinc-100 dark:border-zinc-900/50">
                    <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest pt-2">Education</h2>
                    <div className="space-y-12">
                        {education.map((edu, i) => (
                            <div key={i} className="group relative pl-6 border-l border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{edu.school}</h3>
                                    <span className="text-xs text-zinc-500 font-mono mt-1 sm:mt-0">
                                        {edu.startDate} — {edu.endDate}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">{edu.degree} in {edu.field}</p>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                                    {edu.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
