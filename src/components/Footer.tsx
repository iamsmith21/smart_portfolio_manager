import Link from "next/link";
import { Github, Twitter, Linkedin, Sparkles } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t border-white/5 bg-background/60 backdrop-blur-2xl backdrop-saturate-150 relative overflow-hidden mt-12">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

                    {/* Brand Column */}
                    <div className="md:col-span-2 space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2 text-primary">
                            <Sparkles className="w-5 h-5" />
                            <span className="font-bold text-lg tracking-tight text-foreground">Smart Portfolio Manager</span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                            The comprehensive portfolio solution for everyone. Instantly sync your GitHub repositories, showcase your professional journey, and launch your personal brand with custom domain support.
                        </p>
                    </div>

                    {/* Links Column 1 */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground text-sm">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
                            <li><Link href="/changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground text-sm">Legal</h4 >
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Smart Portfolio Manager. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        <Link href="https://github.com" target="_blank" className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all">
                            <Github className="w-4 h-4" />
                        </Link>
                        <Link href="https://twitter.com" target="_blank" className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all">
                            <Twitter className="w-4 h-4" />
                        </Link>
                        <Link href="https://linkedin.com" target="_blank" className="p-2 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all">
                            <Linkedin className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
