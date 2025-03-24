import { Movie } from "@/types/database";

interface MovieComparison {
  message: string;
  type: 'info' | 'success';
}

export function compareMovies(guess: Movie, daily: Movie): MovieComparison[] {
  const hints: MovieComparison[] = [];

  // Rok
  if (guess.release_year === daily.release_year) {
    hints.push({ 
      message: "Ten film jest z tego samego roku!", 
      type: 'success' 
    });
  } else {
    hints.push({ 
      message: parseInt(guess.release_year) < parseInt(daily.release_year) 
        ? "Szukany film jest nowszy!" 
        : "Szukany film jest starszy!", 
      type: 'info' 
    });
  }

  // Gatunki
  const guessGenres = guess.genres.split(',').map(g => g.trim());
  const dailyGenres = daily.genres.split(',').map(g => g.trim());
  const commonGenres = guessGenres.filter(g => dailyGenres.includes(g));
  if (commonGenres.length > 0) {
    hints.push({ 
      message: `Wspólne gatunki: ${commonGenres.join(', ')}`, 
      type: 'success' 
    });
  }

  // Długość filmu
  const guessDuration = parseInt(guess.duration);
  const dailyDuration = parseInt(daily.duration);
  const durationDiff = Math.abs(guessDuration - dailyDuration);
  
  if (durationDiff === 0) {
    hints.push({ 
      message: "Filmy mają tę samą długość!", 
      type: 'success' 
    });
  } else if (durationDiff <= 15) {
    hints.push({ 
      message: `Różnica w długości to tylko ${durationDiff} minut!`, 
      type: 'info' 
    });
  } else {
    hints.push({ 
      message: guessDuration < dailyDuration 
        ? "Szukany film jest dłuższy!" 
        : "Szukany film jest krótszy!", 
      type: 'info' 
    });
  }

  // Oceny
  const ratingDiff = Math.abs(guess.average_rating - daily.average_rating);
  if (ratingDiff < 0.5) {
    hints.push({ 
      message: "Filmy mają bardzo podobną ocenę!", 
      type: 'success' 
    });
  } else {
    hints.push({ 
      message: guess.average_rating < daily.average_rating 
        ? "Szukany film ma wyższą ocenę!" 
        : "Szukany film ma niższą ocenę!", 
      type: 'info' 
    });
  }

  // Popularność (liczba głosów)
  const votesDiff = Math.abs(guess.num_votes - daily.num_votes);
  const votesPercentage = (votesDiff / daily.num_votes) * 100;
  
  if (votesPercentage < 10) {
    hints.push({ 
      message: "Filmy mają podobną liczbę głosów!", 
      type: 'success' 
    });
  } else {
    hints.push({ 
      message: guess.num_votes < daily.num_votes 
        ? "Szukany film ma więcej głosów!" 
        : "Szukany film ma mniej głosów!", 
      type: 'info' 
    });
  }

  // Wspólni twórcy
  const guessDirectors = guess.directors;
  const dailyDirectors = daily.directors;
  const commonDirectors = guessDirectors.filter(d => dailyDirectors.includes(d));
  
  if (commonDirectors.length > 0) {
    hints.push({ 
      message: "Te filmy mają wspólnego reżysera!", 
      type: 'success' 
    });
  }

  const guessWriters = guess.writers;
  const dailyWriters = daily.writers;
  const commonWriters = guessWriters.filter(w => dailyWriters.includes(w));
  
  if (commonWriters.length > 0) {
    hints.push({ 
      message: "Te filmy mają wspólnego scenarzystę!", 
      type: 'success' 
    });
  }

  const guessActors = guess.actors;
  const dailyActors = daily.actors;
  const commonActors = guessActors.filter(a => dailyActors.includes(a));
  
  if (commonActors.length > 0) {
    hints.push({ 
      message: `Liczba wspólnych aktorów: ${commonActors.length}`, 
      type: 'success' 
    });
  }

  return hints;
} 