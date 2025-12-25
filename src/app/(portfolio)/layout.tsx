export default function PortfolioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* 
          Public Portfolio Layout
          No global Navbar or Footer here. Each profile is standalone.
      */}
            {children}
        </div>
    );
}
