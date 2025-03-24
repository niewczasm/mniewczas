import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import { projects } from "@/data/projects";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a 
              href="/about" 
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              O mnie
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <header className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Pomysły małe i duże
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed flex flex-col items-center gap-1">
            To na co wpadłem i zrealizowałem
            <span className="text-sm sm:text-base text-muted-foreground/80">(jeżeli jest ładnie to dzięki AI, jeżeli coś nie działa to też dzięki AI)</span>
          </p>
        </header>
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                image={project.image}
                tags={project.tags}
                demoUrl={project.demoUrl}
                githubUrl={project.githubUrl}
              />
            ))}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
