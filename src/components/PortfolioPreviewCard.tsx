"use client";

import { motion } from "framer-motion";
import { MapPin, Globe, Linkedin, Dribbble, ArrowUpRight, Github, Code2, Mail } from "lucide-react";
import { useState } from "react";
import Link from "next/link";



export function PortfolioPreviewCard() {
    const [activeTab, setActiveTab] = useState("Profile");

    const renderContent = () => {
        switch (activeTab) {
            case "Projects":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                            <Code2 className="w-4 h-4 text-primary" />
                            <span>Featured Projects</span>
                        </div>

                        {[
                            { name: "Neon Dashboard", type: "Web App" },
                            { name: "Cosmic UI", type: "Design System" },
                            { name: "Zenith", type: "Mobile App" },
                        ].map((project) => (
                            <div key={project.name} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/item">
                                <div>
                                    <h4 className="text-white font-medium group-hover/item:text-primary transition-colors">{project.name}</h4>
                                    <p className="text-xs text-gray-500">{project.type}</p>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-gray-500 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </motion.div>
                );
            case "Contact":
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {/* Email */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/item">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div className="text-sm">
                                    <p className="text-gray-400 text-xs">Email</p>
                                    <p className="text-white font-medium">hello@rachel.design</p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-gray-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        </div>

                        {/* Website */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/item">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <div className="text-sm">
                                    <p className="text-gray-400 text-xs">Website</p>
                                    <p className="text-white font-medium">rachel.design</p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-gray-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        </div>

                        {/* Status Bar */}
                        <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 mt-2">
                            <div className="flex-1 text-center border-r border-white/10">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Timezone</div>
                                <div className="text-white font-mono text-sm">GMT+9</div>
                            </div>
                            <div className="flex-1 text-center">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</div>
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                                    </span>
                                    Open
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            default: // Profile
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Profile Header */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                                RK
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Rachel Kim</h3>
                                <p className="text-gray-400">Motion Designer</p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>Seoul, South Korea</span>
                        </div>

                        {/* Bio */}
                        <p className="text-gray-300 leading-relaxed">
                            Motion designer specializing in UI animations and brand identity. Creating
                            engaging digital experiences through fluid motion and storytelling.
                        </p>

                        {/* Social Links */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            {[
                                { icon: Dribbble, label: "Dribbble" },
                                { icon: Github, label: "GitHub" },
                                { icon: Linkedin, label: "LinkedIn" }
                            ].map((social) => (
                                <button
                                    key={social.label}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-300 transition-all text-sm group/btn"
                                >
                                    <social.icon className="w-4 h-4 text-gray-400 group-hover/btn:text-white transition-colors" />
                                    {social.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative group w-full max-w-md mx-auto"
        >
            {/* 
        Decorative background glow 
        We use `absolute` positioning to place it behind the card.
        `blur-3xl` creates that "nebula" look.
      */}
            <div className="absolute -inset-1 bg-indigo-500 rounded-2xl blur-3xl opacity-20 group-hover:opacity-30 transition duration-1000 pointer-events-none"></div>

            {/* Main Card Container */}
            <div className="relative bg-[#0B0E14] border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl min-h-[400px]">

                {/* Header: Tabs + Badge */}
                <div className="flex items-center justify-between mb-8">
                    {/* Tabs */}
                    <div className="flex p-1 bg-white/5 rounded-full border border-white/5">
                        {["Profile", "Projects", "Contact"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                  px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                  ${activeTab === tab
                                        ? "bg-white/10 text-white shadow-sm"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }
                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Live Badge */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-green-400">Live</span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="relative">
                    {renderContent()}
                </div>
            </div>

            {/* Caption below the card */}
            <div className="mt-6 text-center space-y-2">
                <p className="text-gray-500 text-sm">
                    This is an embedded preview of a SPM portfolio
                </p>
                <Link href="/settings" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm">
                    View full portfolio
                    <ArrowUpRight className="w-4 h-4" />
                </Link>
            </div>
        </motion.div>
    );
}
