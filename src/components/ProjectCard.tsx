import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
}

export default function ProjectCard({
  title,
  description,
  image,
  tags,
  demoUrl,
  githubUrl,
}: ProjectCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col">
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img 
          src={image} 
          alt={`${title} preview`} 
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" 
        />
      </div>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl transition-colors duration-100">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <p className="text-sm sm:text-base text-muted-foreground line-clamp-3">
          {description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-secondary px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs text-secondary-foreground transition-colors duration-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0 mt-auto flex justify-between gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <a 
            href={demoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-colors duration-100"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Demo</span>
            <span className="sm:hidden">View</span>
          </a>
        </Button>
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <a 
            href={githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-colors duration-100"
          >
            <Github className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Code</span>
            <span className="sm:hidden">Git</span>
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
} 