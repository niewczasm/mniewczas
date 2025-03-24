"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleGithubClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(githubUrl, '_blank');
  };

  return (
    <div onClick={() => router.push(demoUrl)} className="cursor-pointer">
      <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full">
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
        <CardContent className="p-4 sm:p-6 pt-0 flex-1">
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
          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleGithubClick}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 