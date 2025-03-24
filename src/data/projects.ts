export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
}

export const projects: Project[] = [
  {
    id: "filmozerca",
    title: "Filmożerca",
    description: "Aplikacja do przeglądania i oceniania filmów, stworzona przy użyciu Next.js i Tailwind CSS.",
    image: "/projects/filmozerca-preview.jpg",
    tags: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    demoUrl: "/filmozerca",
    githubUrl: "https://github.com/yourusername/portfolio/tree/main/src/app/filmozerca"
  },
  {
    id: 1,
    title: "Weather App",
    description: "A simple weather application that shows current weather and forecasts for any location.",
    image: "https://placehold.co/400x200",
    tags: ["React", "API", "Tailwind"],
    demoUrl: "https://example.com/weather-app",
    githubUrl: "https://github.com/yourusername/weather-app",
  },
  {
    id: 2,
    title: "Task Manager",
    description: "A productivity tool to help you organize tasks and manage your time effectively.",
    image: "https://placehold.co/400x200",
    tags: ["Next.js", "TypeScript", "Prisma"],
    demoUrl: "https://example.com/task-manager",
    githubUrl: "https://github.com/yourusername/task-manager",
  },
  {
    id: 3,
    title: "Recipe Finder",
    description: "Search for recipes based on ingredients you have at home.",
    image: "https://placehold.co/400x200",
    tags: ["JavaScript", "API", "CSS"],
    demoUrl: "https://example.com/recipe-finder",
    githubUrl: "https://github.com/yourusername/recipe-finder",
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "My personal portfolio website showcasing my skills and projects.",
    image: "https://placehold.co/400x200",
    tags: ["Next.js", "Tailwind", "Framer Motion"],
    demoUrl: "https://example.com/portfolio",
    githubUrl: "https://github.com/yourusername/portfolio",
  },
  {
    id: 5,
    title: "E-commerce Store",
    description: "A fully functional online store with product listings and checkout.",
    image: "https://placehold.co/400x200",
    tags: ["React", "Node.js", "MongoDB"],
    demoUrl: "https://example.com/store",
    githubUrl: "https://github.com/yourusername/store",
  },
  {
    id: 6,
    title: "Chat Application",
    description: "Real-time chat application with private and group messaging.",
    image: "https://placehold.co/400x200",
    tags: ["Socket.io", "Express", "React"],
    demoUrl: "https://example.com/chat-app",
    githubUrl: "https://github.com/yourusername/chat-app",
  },
]; 