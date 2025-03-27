import { MovieSearch } from "@/components/MovieSearch";
import { getMovies, getMoviePeople } from "@/lib/dynamo";
import { getDailyMovie } from "@/lib/daily-movie";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export default async function Filmozerca() {
  const movies = await getMovies();
  const dailyMovie = getDailyMovie(movies);
  
  // Pobieramy dane o osobach dla dziennego filmu
  const { movie: dailyMovieWithPeople, directors, writers, actors } = await getMoviePeople(dailyMovie);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl font-bold text-foreground text-center">
              Filmożerca
            </h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-sm">
                  Baza zawiera około top 1000 najczęściej ocenianych filmów z IMDB (stan na 23.03.2024 - might update it later idk lol)
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-center text-muted-foreground">
            Zgadnij film dnia! Masz nieograniczoną liczbę prób.
          </p>
          <div className="flex justify-center">
            <MovieSearch 
              movies={movies} 
              dailyMovie={{ ...dailyMovieWithPeople, directors, writers, actors }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 