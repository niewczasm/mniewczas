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
    description: "Codzienna zagadka filmowa inspirowana Wordle - sprawdź swoją wiedzę o filmach, odgadując tytuł na podstawie porównań do innych filmów!",
    image: "/projects/filmozerca-preview.jpg",
    tags: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    demoUrl: "/filmozerca",
    githubUrl: "https://github.com/niewczasm/mniewczas/tree/master/src/app/filmozerca"
  },
  
]; 