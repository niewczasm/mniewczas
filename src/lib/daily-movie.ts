import { Movie } from "@/types/database";

export function getDailyMovie(movies: Movie[]): Movie {
  // Używamy daty jako seed dla losowania
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  
  // Prosty sposób na uzyskanie deterministycznej liczby z daty
  let seed = 0;
  for (let i = 0; i < dateString.length; i++) {
    seed = ((seed << 5) - seed) + dateString.charCodeAt(i);
    seed = seed & seed; // Konwersja na 32-bitową liczbę
  }

  // Używamy seeda do wylosowania filmu
  const index = Math.abs(seed) % movies.length;
  return movies[index];
} 