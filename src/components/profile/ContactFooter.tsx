"use client";

interface Contact {
    email?: string | null;
    website?: string | null;
    location?: string | null;
}

export function ContactFooter({ contact }: { contact: Contact | null }) {
    if (!contact) return null;

    return (
        <footer className="max-w-5xl mx-auto px-6 py-20 border-t border-zinc-200 dark:border-zinc-800/50 flex flex-col items-center gap-8 text-sm">
            <h2 className="text-zinc-500 font-medium uppercase tracking-widest text-xs">Get in Touch</h2>

            <div className="flex flex-wrap justify-center gap-8 text-zinc-600 dark:text-zinc-400">
                {contact.email && (
                    <a href={`mailto:${contact.email}`} className="hover:text-black dark:hover:text-white transition-colors border-b border-transparent hover:border-black dark:hover:border-white pb-0.5">
                        {contact.email}
                    </a>
                )}
                {contact.website && (
                    <a
                        href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-black dark:hover:text-white transition-colors border-b border-transparent hover:border-black dark:hover:border-white pb-0.5"
                    >
                        Website
                    </a>
                )}
            </div>

            <div className="text-zinc-600 text-xs mt-4">
                © {new Date().getFullYear()} {contact.location ? `• ${contact.location}` : ''}
            </div>
        </footer>
    );
}
