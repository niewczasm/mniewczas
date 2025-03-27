'use client';

import * as React from "react";
import { Film, Timer, Star, Users, Video, Pen, User, HelpCircle, ArrowUp, ArrowDown, ArrowRightLeft, Share2, Check, Facebook } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Movie, Person } from "@/types/database";
import MoviePoster from "@/components/MoviePoster";


interface HintCardProps {
  dailyMovie: Omit<Movie, 'directors' | 'writers' | 'actors'> & {
    directors: Person[];
    writers: Person[];
    actors: Person[];
  };
  lastGuess: Movie | null;
  hints: {
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
  };
  attempts: number;
  guessHistory: Movie[];
}

// Komponent XIcon
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" 
      fill="currentColor"/>
  </svg>
);

export function HintCard({ dailyMovie, lastGuess, hints, attempts, guessHistory }: HintCardProps) {
  const [copied, setCopied] = React.useState(false);

  const getBackgroundClass = (isExactMatch: boolean) => {
    return isExactMatch 
      ? 'bg-green-100 dark:bg-green-900 scale-pop' 
      : 'bg-muted';
  };

  // Funkcja pomocnicza do formatowania liczby głosów
  const formatVotes = (votes: number) => {
    if (votes >= 1000000) {
      return `${(votes / 1000000).toFixed(1)}M`;
    }
    if (votes >= 1000) {
      return `${(votes / 1000).toFixed(0)}K`;
    }
    return votes.toString();
  };

  const getRange = (value1: number, value2: number | null, target: number, exactMatch: boolean, formatValue?: (v: number) => string) => {
    const format = (v: number) => formatValue ? formatValue(v) : v.toString();

    // Jeśli dokładne trafienie
    if (exactMatch) {
      return <span>{format(value1)}</span>;
    }

    // Jeśli mamy dwie wartości
    if (value2 !== null) {
      const min = Math.min(value1, value2);
      const max = Math.max(value1, value2);
      
      // Sprawdzamy czy przedział zawiera tylko jedną możliwą wartość
      if (target >= min && target <= max) {
        if (Number.isInteger(min) && Number.isInteger(max) && Number.isInteger(target)) {
          if (max - min === 2 && target === min + 1) {
            return <span>{format(target)}</span>;
          }
        }
        return (
          <div className="flex items-center justify-center gap-1 whitespace-nowrap">
            <span>{format(min)}</span>
            <ArrowRightLeft className="w-3 h-3" />
            <span>{format(max)}</span>
          </div>
        );
      }
      
      // Jeśli cel jest poza przedziałem
      if (target < min) {
        return (
          <div className="flex items-center justify-center gap-1 whitespace-nowrap">
            <ArrowDown className="w-3 h-3" />
            <span>{format(min)}</span>
            <ArrowRightLeft className="w-3 h-3" />
            <span>{format(max)}</span>
          </div>
        );
      }
      return (
        <div className="flex items-center justify-center gap-1 whitespace-nowrap">
          <span>{format(min)}</span>
          <ArrowRightLeft className="w-3 h-3" />
          <span>{format(max)}</span>
          <ArrowUp className="w-3 h-3" />
        </div>
      );
    }

    // Dla pojedynczej wartości
    return (
      <div className="flex items-center justify-center gap-1">
        <span>{format(value1)}</span>
        {target > value1 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      </div>
    );
  };

  const isGuessed = hints.year?.tconst === dailyMovie.tconst;
  const movieTitle = isGuessed 
    ? (dailyMovie.polish_title || dailyMovie.original_title)
    : "Dzisiejszy film";

  // Funkcja pomocnicza do formatowania czasu
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
      return `${mins}min`;
    }
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}min`;
  };

  const handleShare = async () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    const shareText = `Filmożerca (${dateStr}) - odgadnięto w ${attempts} próbach!\n\nhttps://mniewczas.pl/filmozerca`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText
        });
      } catch (err) {
        console.error('Błąd podczas udostępniania:', err);
      }
    } else {
      // Kopiowanie do schowka jako fallback
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success("Skopiowano do schowka!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 space-y-4">
      {isGuessed && (
        <Card className="border-green-500">
          <CardContent className="p-4">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-500">
                <Check className="w-6 h-6" />
                <span className="text-lg font-medium">Gratulacje! Odgadłeś film!</span>
              </div>
              
              <p className="text-muted-foreground">
                Film odgadnięty w {attempts} {attempts === 1 ? 'próbie' : 'próbach'}
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleShare}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  Udostępnij
                </Button>
                
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `Filmożerca - odgadnięto w ${attempts} próbach!\nhttps://twoja-domena.pl/filmozerca`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <XIcon />
                    X
                  </Button>
                </a>

                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    'https://twoja-domena.pl/filmozerca'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="overflow-hidden">
        <CardHeader className="p-4">
          <CardTitle className="text-base flex items-center justify-between">
            <span>{movieTitle}</span>
            <span>Próba {attempts}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {/* Plakat */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <MoviePoster
              tconst={isGuessed ? dailyMovie.tconst : "placeholder"}
              title={movieTitle}
              isRevealed={isGuessed}
              className="w-32 h-48 mx-auto sm:mx-0"
            />
            
            {/* Statystyki */}
            <div className="flex-1">
              <div className="grid grid-cols-4 gap-2">
                {/* Rok */}
                <div className={`flex flex-col p-2 rounded-lg ${getBackgroundClass(hints.year?.release_year === dailyMovie.release_year)}`}>
                  <div className="flex items-center gap-1 mb-1">
                    <Film className="w-3 h-3" />
                    <span className="text-xs">Rok</span>
                  </div>
                  <div className="text-center font-medium text-xs">
                    {hints.year ? (
                      getRange(
                        parseInt(hints.year.release_year),
                        hints.previousYear ? parseInt(hints.previousYear.release_year) : null,
                        parseInt(dailyMovie.release_year),
                        hints.year.release_year === dailyMovie.release_year
                      )
                    ) : lastGuess ? (
                      getRange(
                        parseInt(lastGuess.release_year),
                        null,
                        parseInt(dailyMovie.release_year),
                        false
                      )
                    ) : (
                      <HelpCircle className="w-3 h-3 mx-auto text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Długość */}
                <div className={`flex flex-col p-2 rounded-lg ${getBackgroundClass(hints.duration?.duration === dailyMovie.duration)}`}>
                  <div className="flex items-center gap-1 mb-1">
                    <Timer className="w-3 h-3" />
                    <span className="text-xs">Długość</span>
                  </div>
                  <div className="text-center font-medium text-xs">
                    {hints.duration ? (
                      getRange(
                        parseInt(hints.duration.duration),
                        null,
                        parseInt(dailyMovie.duration),
                        hints.duration.duration === dailyMovie.duration,
                        formatDuration
                      )
                    ) : lastGuess ? (
                      getRange(
                        parseInt(lastGuess.duration),
                        null,
                        parseInt(dailyMovie.duration),
                        false,
                        formatDuration
                      )
                    ) : (
                      <HelpCircle className="w-3 h-3 mx-auto text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Ocena */}
                <div className={`flex flex-col p-2 rounded-lg ${getBackgroundClass(hints.rating ? Math.round(hints.rating.average_rating * 10) === Math.round(dailyMovie.average_rating * 10) : false)}`}>
                  <div className="flex items-center gap-1 mb-1 whitespace-nowrap">
                    <Star className="w-3 h-3" />
                    <span className="text-xs">Ocena</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">(1-10)</span>
                  </div>
                  <div className="text-center font-medium text-xs">
                    {hints.rating ? (
                      getRange(
                        hints.rating.average_rating,
                        hints.previousRating ? hints.previousRating.average_rating : null,
                        dailyMovie.average_rating,
                        Math.round(hints.rating.average_rating * 10) === Math.round(dailyMovie.average_rating * 10),
                        (v) => v.toFixed(1)
                      )
                    ) : lastGuess ? (
                      getRange(
                        lastGuess.average_rating,
                        null,
                        dailyMovie.average_rating,
                        false,
                        (v) => v.toFixed(1)
                      )
                    ) : (
                      <HelpCircle className="w-3 h-3 mx-auto text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Głosy */}
                <div className={`flex flex-col p-2 rounded-lg ${getBackgroundClass(hints.votes?.num_votes === dailyMovie.num_votes)}`}>
                  <div className="flex items-center gap-1 mb-1">
                    <Users className="w-3 h-3" />
                    <span className="text-xs">Głosy</span>
                  </div>
                  <div className="text-center font-medium text-xs">
                    {hints.votes ? (
                      getRange(
                        hints.votes.num_votes,
                        hints.previousVotes ? hints.previousVotes.num_votes : null,
                        dailyMovie.num_votes,
                        hints.votes.num_votes === dailyMovie.num_votes,
                        formatVotes
                      )
                    ) : lastGuess ? (
                      getRange(
                        lastGuess.num_votes,
                        null,
                        dailyMovie.num_votes,
                        false,
                        formatVotes
                      )
                    ) : (
                      <HelpCircle className="w-3 h-3 mx-auto text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {/* Gatunki */}
              <div className="mt-4">
                <div className="flex items-center gap-1 mb-2">
                  <Video className="w-3 h-3" />
                  <span className="text-sm">Gatunki</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {dailyMovie.genres.split(',').map((genre, index) => {
                    const isDiscovered = isGuessed || hints.genres?.has(genre.trim());
                    return (
                      <div
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs ${
                          isDiscovered 
                            ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isDiscovered ? genre.trim() : '?'}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Twórcy */}
              <div className="mt-4 space-y-3">
                {/* Reżyserzy */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Film className="w-3 h-3" />
                    <span className="text-sm">Reżyseria</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {dailyMovie.directors.map((director, index) => {
                      const isDiscovered = isGuessed || hints.directors.has(director.nconst);
                      return (
                        <div
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs ${
                            isDiscovered 
                              ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {isDiscovered ? director.primaryName : '?'}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scenarzyści */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Pen className="w-3 h-3" />
                    <span className="text-sm">Scenariusz</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {dailyMovie.writers.map((writer, index) => {
                      const isDiscovered = isGuessed || hints.writers.has(writer.nconst);
                      return (
                        <div
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs ${
                            isDiscovered 
                              ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {isDiscovered ? writer.primaryName : '?'}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Aktorzy */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <User className="w-3 h-3" />
                    <span className="text-sm">Obsada</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {dailyMovie.actors.map((actor, index) => {
                      const isDiscovered = isGuessed || hints.actors.has(actor.nconst);
                      return (
                        <div
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs ${
                            isDiscovered 
                              ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {isDiscovered ? actor.primaryName : '?'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historia prób */}
      {guessHistory.length > 0 && (
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-base">Historia prób</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex overflow-x-auto gap-3 pb-2 -mx-1 px-1 smooth-scroll hide-scrollbar min-h-[160px]">
              {guessHistory.map((movie, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-24 group"
                >
                  <div className="relative aspect-[2/3] mb-2">
                    <MoviePoster
                      tconst={movie.tconst}
                      title={movie.polish_title || movie.original_title}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium truncate group-hover:whitespace-normal">
                      {movie.polish_title || movie.original_title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {movie.release_year}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}