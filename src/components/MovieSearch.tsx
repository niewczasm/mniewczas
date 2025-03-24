'use client';

import * as React from "react";
import { Movie } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { compareMovies } from "@/lib/movie-hints";
import { HintCard } from "@/components/HintCard";
import { useState } from "react";
import MoviePoster from "@/components/MoviePoster";

interface MovieSearchProps {
  movies: Movie[];
  dailyMovie: Movie & {
    directors: Person[];
    writers: Person[];
    actors: Person[];
  };
}

interface Hints {
  year?: Movie;
  previousYear?: Movie;
  duration?: Movie;
  previousDuration?: Movie;
  rating?: Movie;
  previousRating?: Movie;
  votes?: Movie;
  previousVotes?: Movie;
  genres: Set<string>;
  directors: Set<string>;
  writers: Set<string>;
  actors: Set<string>;
}

interface GameState {
  date: string;
  streak: number;
  hasWon: boolean;
  guessHistory: Movie[];
  hints: Hints;
}

export function MovieSearch({ movies, dailyMovie }: MovieSearchProps) {
  const searchRef = React.useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = React.useState<GameState | null>(null);
  const [initialized, setInitialized] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasWon, setHasWon] = React.useState(false);
  const [lastGuess, setLastGuess] = React.useState<Movie | null>(null);
  const [guessHistory, setGuessHistory] = React.useState<Movie[]>([]);
  const [streak, setStreak] = React.useState(0);
  const [hints, setHints] = React.useState<Hints>({
    genres: new Set(),
    directors: new Set(),
    writers: new Set(),
    actors: new Set()
  });

  // Przenosimy useMemo przed warunek initialized
  const filteredMovies = React.useMemo(() => {
    if (search.length < 2) return [];
    
    const searchLower = search.toLowerCase();
    const usedMovieIds = new Set(guessHistory.map(m => m.tconst));
    
    return movies
      .filter(movie => {
        if (usedMovieIds.has(movie.tconst)) return false;
        
        const polishTitle = movie.polish_title?.toLowerCase() || '';
        const originalTitle = movie.original_title?.toLowerCase() || '';
        const popularTitle = movie.popular_title?.toLowerCase() || '';
        
        return (
          polishTitle.includes(searchLower) ||
          originalTitle.includes(searchLower) ||
          popularTitle.includes(searchLower)
        );
      })
      .slice(0, 5);
  }, [search, movies, guessHistory]);

  // Inicjalizacja stanu gry
  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('filmozerca_game');
    
    if (!saved) {
      setGameState({
        date: today,
        streak: 0,
        hasWon: false,
        guessHistory: [],
        hints: {
          genres: new Set(),
          directors: new Set(),
          writers: new Set(),
          actors: new Set()
        }
      });
      setInitialized(true);
      return;
    }

    const state = JSON.parse(saved);
    if (state.date !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (state.date === yesterdayStr && state.hasWon) {
        setGameState({
          date: today,
          streak: state.streak,
          hasWon: false,
          guessHistory: [],
          hints: {
            genres: new Set(),
            directors: new Set(),
            writers: new Set(),
            actors: new Set()
          }
        });
      } else {
        setGameState({
          date: today,
          streak: 0,
          hasWon: false,
          guessHistory: [],
          hints: {
            genres: new Set(),
            directors: new Set(),
            writers: new Set(),
            actors: new Set()
          }
        });
      }
    } else {
      setGameState({
        ...state,
        hints: {
          ...state.hints,
          genres: new Set(state.hints.genres),
          directors: new Set(state.hints.directors),
          writers: new Set(state.hints.writers),
          actors: new Set(state.hints.actors)
        }
      });
    }
    setInitialized(true);
  }, []);

  // Aktualizacja stanów po załadowaniu gameState
  React.useEffect(() => {
    if (gameState && initialized) {
      setHasWon(gameState.hasWon);
      setGuessHistory(gameState.guessHistory);
      setStreak(gameState.streak);
      setHints(gameState.hints);
    }
  }, [gameState, initialized]);

  // Zapisywanie stanu
  React.useEffect(() => {
    if (!initialized) return;

    const today = new Date().toISOString().split('T')[0];
    const gameState = {
      date: today,
      hasWon,
      guessHistory,
      hints: {
        ...hints,
        genres: Array.from(hints.genres),
        directors: Array.from(hints.directors),
        writers: Array.from(hints.writers),
        actors: Array.from(hints.actors)
      },
      streak
    };
    
    localStorage.setItem('filmozerca_game', JSON.stringify(gameState));
  }, [hasWon, guessHistory, hints, streak, initialized]);

  // Obsługa kliknięć poza komponentem
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!initialized) {
    return null;
  }

  const handleGuess = (movie: Movie) => {
    setGuessHistory(prev => [movie, ...prev]);
    setSearch("");
    setIsOpen(false);
    setLastGuess(movie);

    setHints(prev => {
      const newHints = { ...prev };

      if (movie.tconst === dailyMovie.tconst) {
        newHints.directors = new Set(dailyMovie.directors.map(d => d.nconst));
        newHints.writers = new Set(dailyMovie.writers.map(w => w.nconst));
        newHints.actors = new Set(dailyMovie.actors.map(a => a.nconst));
        
        newHints.year = movie;
        newHints.previousYear = null;
        
        newHints.duration = movie;
        newHints.previousDuration = null;
        
        newHints.rating = movie;
        newHints.previousRating = null;
        
        newHints.votes = movie;
        newHints.previousVotes = null;
        
        return newHints;
      }

      // Rok - zachowujemy obie wartości jeśli są bliżej celu
      if (!prev.year) {
        newHints.year = movie;
      } else {
        const prevYearDiff = Math.abs(parseInt(prev.year.release_year) - parseInt(dailyMovie.release_year));
        const newYearDiff = Math.abs(parseInt(movie.release_year) - parseInt(dailyMovie.release_year));
        if (movie.release_year === dailyMovie.release_year) {
          newHints.year = movie;
        } else if (
          (parseInt(movie.release_year) < parseInt(dailyMovie.release_year) && 
           parseInt(prev.year.release_year) > parseInt(dailyMovie.release_year)) ||
          (parseInt(movie.release_year) > parseInt(dailyMovie.release_year) && 
           parseInt(prev.year.release_year) < parseInt(dailyMovie.release_year))
        ) {
          // Jeśli wartości są po przeciwnych stronach celu, zachowujemy obie
          newHints.year = prev.year;
          newHints.previousYear = movie;
        } else if (newYearDiff < prevYearDiff) {
          newHints.year = movie;
        }
      }

      // Długość - analogicznie jak dla roku
      if (!prev.duration) {
        newHints.duration = movie;
      } else {
        const prevDurationDiff = Math.abs(parseInt(prev.duration.duration) - parseInt(dailyMovie.duration));
        const newDurationDiff = Math.abs(parseInt(movie.duration) - parseInt(dailyMovie.duration));
        if (movie.duration === dailyMovie.duration) {
          newHints.duration = movie;
        } else if (
          (parseInt(movie.duration) < parseInt(dailyMovie.duration) && 
           parseInt(prev.duration.duration) > parseInt(dailyMovie.duration)) ||
          (parseInt(movie.duration) > parseInt(dailyMovie.duration) && 
           parseInt(prev.duration.duration) < parseInt(dailyMovie.duration))
        ) {
          // Jeśli wartości są po przeciwnych stronach celu, zachowujemy obie
          newHints.duration = prev.duration;
          newHints.previousDuration = movie;
        } else if (newDurationDiff < prevDurationDiff) {
          newHints.duration = movie;
        }
      }

      // Ocena - zachowujemy obie wartości jeśli są po przeciwnych stronach celu
      if (!prev.rating) {
        newHints.rating = movie;
      } else {
        const prevRating = Math.round(prev.rating.average_rating * 10) / 10;
        const newRating = Math.round(movie.average_rating * 10) / 10;
        const targetRating = Math.round(dailyMovie.average_rating * 10) / 10;

        if (Math.abs(movie.average_rating - dailyMovie.average_rating) < 0.1) {
          newHints.rating = movie;
        } else if (
          (newRating < targetRating && prevRating > targetRating) ||
          (newRating > targetRating && prevRating < targetRating)
        ) {
          // Jeśli wartości są po przeciwnych stronach celu, zachowujemy obie
          newHints.rating = prev.rating;
          newHints.previousRating = movie;
        } else if (Math.abs(newRating - targetRating) < Math.abs(prevRating - targetRating)) {
          newHints.rating = movie;
        }
      }

      // Liczba głosów - analogicznie jak dla roku
      if (!prev.votes) {
        newHints.votes = movie;
      } else {
        const prevVotesDiff = Math.abs(prev.votes.num_votes - dailyMovie.num_votes);
        const newVotesDiff = Math.abs(movie.num_votes - dailyMovie.num_votes);
        if (movie.num_votes === dailyMovie.num_votes) {
          newHints.votes = movie;
        } else if (
          (movie.num_votes < dailyMovie.num_votes && prev.votes.num_votes > dailyMovie.num_votes) ||
          (movie.num_votes > dailyMovie.num_votes && prev.votes.num_votes < dailyMovie.num_votes)
        ) {
          // Jeśli wartości są po przeciwnych stronach celu, zachowujemy obie
          newHints.votes = prev.votes;
          newHints.previousVotes = movie;
        } else if (newVotesDiff < prevVotesDiff) {
          newHints.votes = movie;
        }
      }

      // Aktualizacja gatunków
      // Zachowujemy poprzednie odkryte gatunki i dodajemy nowe
      newHints.genres = new Set([...prev.genres, ...movie.genres.split(',')
        .map(g => g.trim())
        .filter(genre => dailyMovie.genres.includes(genre))
      ]);

      // Aktualizacja wspólnych twórców
      newHints.directors = new Set([
        ...prev.directors,
        ...movie.directors.filter(d => dailyMovie.directors.map(dp => dp.nconst).includes(d))
      ]);

      newHints.writers = new Set([
        ...prev.writers,
        ...movie.writers.filter(w => dailyMovie.writers.map(wp => wp.nconst).includes(w))
      ]);

      newHints.actors = new Set([
        ...prev.actors,
        ...movie.actors.filter(a => dailyMovie.actors.map(ap => ap.nconst).includes(a))
      ]);

      return newHints;
    });

    if (movie.tconst === dailyMovie.tconst) {
      setHasWon(true);
      const newStreak = streak + 1;
      setStreak(newStreak);
      toast.success("Gratulacje! Zgadłeś film dnia!", {
        description: `To był "${dailyMovie.polish_title}" (${dailyMovie.release_year}). Twoja seria: ${newStreak} dni!`
      });
    }
  };

  const getDisplayTitle = (movie: Movie) => {
    return movie.polish_title || movie.original_title;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative" ref={searchRef}>
        <Input
          type="text"
          placeholder="Wpisz tytuł filmu..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          className="w-full"
          disabled={hasWon}
        />
        
        {isOpen && filteredMovies.length > 0 && (
          <div className="absolute w-full z-10 mt-1 bg-popover text-popover-foreground shadow-md rounded-md overflow-hidden">
            {filteredMovies.map((movie) => (
              <button
                key={movie.tconst}
                className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
                onClick={() => handleGuess(movie)}
              >
                <MoviePoster
                  tconst={movie.tconst}
                  title={getDisplayTitle(movie)}
                  className="w-8 h-12"
                />
                <div>
                  <div className="font-medium">
                    {getDisplayTitle(movie)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {movie.release_year}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <HintCard
        dailyMovie={dailyMovie}
        lastGuess={lastGuess}
        hints={hints}
        attempts={guessHistory.length}
        guessHistory={guessHistory}
      />
    </div>
  );
} 