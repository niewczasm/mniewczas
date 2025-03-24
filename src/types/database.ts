export interface Movie {
  tconst: string;
  polish_title: string;
  original_title: string;
  popular_title: string;
  release_year: string;
  duration: string;
  genres: string;
  num_votes: number;
  average_rating: number;
  directors: string[];
  writers: string[];
  actors: string[];
  posterPath?: string;
}

export interface Person {
  nconst: string;
  primaryName: string;
} 