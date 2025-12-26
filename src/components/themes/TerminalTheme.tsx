import React from 'react';
import { Github, Linkedin, Mail, ExternalLink, Globe, MapPin, Terminal } from 'lucide-react';
export function TerminalTheme({ profile, projects }: { profile: any, projects: any[] }) {
    return (
        <div className="min-h-screen bg-black text-green-500 font-mono text-sm sm:text-base selection:bg-green-900 selection:text-white p-4 sm:p-8">
            <div className="max-w-3xl mx-auto space-y-12">

                {/* Header */}
                <header className="space-y-4">
                    <div className="flex items-center gap-2 text-green-700">
                        <Terminal className="w-4 h-4" />
                        <span>usr/bin/portfolio</span>
                    </div>
                    <h1 className="text-4xl font-bold glitch-effect">{`> ${profile.name}`}</h1>
                    <p className="text-green-400/80 border-l-2 border-green-800 pl-4 py-1">
             // {profile.headline}
                    </p>

                    <div className="flex gap-4 pt-2">
                        {profile.user?.accounts?.[0] && ( // Assuming GitHub is linked
                            <a href={`https://github.com/${profile.customDomain || profile.name}`} className="hover:text-white hover:underline">[ github ]</a>
                        )}
                        {/* Add other socials dynamically if needed */}
                    </div>
                </header>
                {/* About */}
                <section>
                    <h2 className="text-lg font-bold mb-4 border-b border-green-900 pb-2">{`> cat about.md`}</h2>
                    <p className="text-green-400/90 whitespace-pre-wrap leading-relaxed">
                        {profile.about}
                    </p>
                </section>
                {/* Experience */}
                <section>
                    <h2 className="text-lg font-bold mb-4 border-b border-green-900 pb-2">{`> ls ./experience --sort=date`}</h2>
                    <div className="space-y-6">
                        {profile.workExperience?.map((job: any, i: number) => (
                            <div key={i} className="group">
                                <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                                    <span className="font-bold text-green-400 group-hover:text-green-300">./{job.company}</span>
                                    <span className="text-green-700">{job.start} - {job.end || 'PRESENT'}</span>
                                </div>
                                <div className="text-green-600 mb-1">{job.role}</div>
                                <p className="text-green-400/70 text-sm pl-4 border-l border-green-900">
                                    {job.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
                {/* Projects */}
                <section>
                    <h2 className="text-lg font-bold mb-4 border-b border-green-900 pb-2">{`> git log --oneline --graph`}</h2>
                    <div className="grid gap-6">
                        {projects.map((project: any) => (
                            <div key={project.id} className="border border-green-900 p-4 hover:border-green-500 transition-colors bg-green-950/10">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-green-400">{project.name}</h3>
                                    <div className="flex gap-2 text-xs">
                                        <span>★ {project.stars}</span>
                                        <span>⑂ {project.forks}</span>
                                    </div>
                                </div>
                                <p className="text-green-400/70 text-sm mb-4">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech?.map((t: string) => (
                                        <span key={t} className="px-1 bg-green-900/30 text-green-300 text-xs rounded">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                {project.repoUrl && (
                                    <a href={project.repoUrl} target="_blank" className="inline-block px-3 py-1 border border-green-700 text-xs hover:bg-green-900 hover:text-white transition-colors">
                                        Execute {`->`}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center text-green-800 text-sm pt-12 pb-8">
                    <span className="animate-pulse">_</span>
                    <br />
                    EOF
                </footer>
            </div>
        </div>
    );
}