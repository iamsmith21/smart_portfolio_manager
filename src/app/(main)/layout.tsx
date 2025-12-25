import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { UsernameGuard } from "../../components/UsernameGuard";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UsernameGuard>
            {/* 
          Floating Navbar
          Instead of a full-width bar, we use a fixed, centered container with
          backdrop-blur to create a "glass" effect.
      */}
            <Navbar />

            {/* 
          Background Texture 
          A subtle grid ensures the large dark areas don't look flat.
      */}
            <div className="fixed inset-0 z-[-1] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <main className="pt-24 pb-16 px-4 md:px-6 lg:px-8 max-w-[1400px] mx-auto">
                {children}
            </main>

            <Footer />
        </UsernameGuard>
    );
}
