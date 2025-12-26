"use client";
import React from "react";
import { Github, Mail, Globe, ArrowUpRight, BadgeCheck } from "lucide-react";

export function NeoBrutalistTheme({ profile, projects }: { profile: any; projects: any[] }) {
    const bgColors = ["bg-yellow-300", "bg-pink-300", "bg-cyan-300", "bg-green-300", "bg-purple-300"];

    return (
        <div className="min-h-screen bg-[#fffdf5] font-mono text-black p-4 md:p-8 selection:bg-black selection:text-white">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Header / Profile */}
                <div className="border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white relative">
                    <div className="absolute -top-6 -right-6 bg-blue-600 text-white px-4 py-2 border-4 border-black font-bold transform rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        OPEN TO WORK
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black uppercase leading-none mb-4 tracking-tighter mix-blend-multiply">
                        {profile.name}
                    </h1>
                    <p className="text-xl md:text-2xl font-bold bg-yellow-300 inline-block px-2 border-2 border-black mb-8">
                        {profile.headline}
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <BrutalButton href={`https://github.com/${profile.customDomain || profile.name}`} icon={<Github className="w-5 h-5" />} label="GITHUB" color="bg-pink-300" />
                        <BrutalButton href={`mailto:${profile.user?.email}`} icon={<Mail className="w-5 h-5" />} label="EMAIL" color="bg-cyan-300" />
                        {profile.customDomain && <BrutalButton href={`https://${profile.customDomain}`} icon={<Globe className="w-5 h-5" />} label="WEBSITE" color="bg-green-300" />}
                    </div>
                </div>

                {/* About Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-8 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                        <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-2">
                            <BadgeCheck className="w-8 h-8" />
                            Who am I?
                        </h2>
                        <p className="text-lg font-medium leading-relaxed whitespace-pre-wrap">
                            {profile.about}
                        </p>
                    </div>

                    {/* Skills ticker or grid */}
                    <div className="md:col-span-4 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-orange-400">
                        <h2 className="text-3xl font-black uppercase mb-6 text-white text-stroke-black">Skills</h2>
                        <div className="flex flex-wrap gap-3">
                            {profile.skills?.map((skill: string) => (
                                <div key={skill} className="bg-white border-2 border-black px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-default">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Work Experience */}
                {profile.workExperience?.length > 0 && (
                    <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#dfdfff]">
                        <h2 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-2 inline-block">Experience</h2>
                        <div className="space-y-8">
                            {profile.workExperience.map((job: any, i: number) => (
                                <div key={i} className="bg-white border-4 border-black p-6 relative">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b-2 border-black/10 pb-4">
                                        <h3 className="text-2xl font-bold uppercase">{job.role}</h3>
                                        <div className="font-bold bg-black text-white px-3 py-1 text-sm">
                                            {job.startDate} — {job.endDate || 'NOW'}
                                        </div>
                                    </div>
                                    <div className="text-xl font-black mb-2">{job.company}</div>
                                    <p className="font-medium opacity-80">{job.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects Grid */}
                <div>
                    <h2 className="text-4xl font-black uppercase mb-8 inline-block bg-black text-white px-4 py-2 transform -rotate-1">Selected Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {projects.map((p, i) => (
                            <a href={p.repoUrl} target="_blank" key={p.id} className="group block">
                                <div className={`h-full border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white group-hover:bg-yellow-200 transition-colors relative`}>
                                    <div className="absolute top-4 right-4 bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase mb-3 underline decoration-4 decoration-black/20 group-hover:decoration-black">{p.name}</h3>
                                    <p className="font-medium mb-6 line-clamp-3">{p.description}</p>
                                    <div className="mt-auto flex flex-wrap gap-2">
                                        {p.tech?.slice(0, 3).map((t: string) => (
                                            <span key={t} className="text-xs font-bold border-2 border-black px-2 py-0.5 uppercase bg-white">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t-4 border-black pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <div className="font-bold text-xl">
                        © {new Date().getFullYear()} {profile.name.toUpperCase()}
                    </div>
                    <div className="font-bold">
                        BUILT WITH <span className="text-red-600">♥</span> AND NOT ENOUGH SLEEP
                    </div>
                </div>

            </div>
        </div>
    );
}

function BrutalButton({ href, icon, label, color }: any) {
    return (
        <a
            href={href}
            target="_blank"
            className={`flex items-center gap-3 border-4 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all bg-white hover:${color}`}
        >
            {icon}
            <span>{label}</span>
        </a>
    )
}
