import { ThemeToggle } from "@/components/ui/theme-toggle";
import Footer from "@/components/Footer";

export default function FilmozercaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a 
              href="/" 
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              ← Sprawdź inne rzeczy
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
} 