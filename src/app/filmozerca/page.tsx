import { MovieSearch } from "@/components/MovieSearch";
import { getMovies, getMoviePeople } from "@/lib/dynamo";
import { getDailyMovie } from "@/lib/daily-movie";

export default async function Filmozerca() {
  const movies = await getMovies();
  const dailyMovie = getDailyMovie(movies);
  
  // Pobieramy dane o osobach dla dziennego filmu
  const dailyMovieWithPeople = await getMoviePeople(dailyMovie);

  console.log("Wylosowany film na dziś:", {
    title: dailyMovieWithPeople.polish_title,
    originalTitle: dailyMovieWithPeople.original_title,
    year: dailyMovieWithPeople.release_year,
    directors: dailyMovieWithPeople.directors.map(d => d.primaryName),
    writers: dailyMovieWithPeople.writers.map(w => w.primaryName),
    actors: dailyMovieWithPeople.actors.map(a => a.primaryName),
  });

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold text-foreground text-center">
            Filmożerca
          </h1>
          <p className="text-center text-muted-foreground">
            Zgadnij film dnia! Masz nieograniczoną liczbę prób.
          </p>
          <div className="flex justify-center">
            <MovieSearch 
              movies={movies} 
              dailyMovie={dailyMovieWithPeople}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 