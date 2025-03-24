"use client";

import { useEffect, useState } from "react";

interface AnimatedTextProps {
  text: string;
  speed?: number;
  isReady: boolean;
  onComplete?: () => void;
}

export function AnimatedText({ 
  text, 
  speed = 3,
  isReady,
  onComplete
}: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isReady || isFinished) return;

    setIsStarted(true);
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsFinished(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isReady, onComplete, isFinished]);

  // Nie pokazujemy niczego, dopóki nie jest nasza kolej
  if (!isStarted) return null;

  return (
    <p className="text-lg text-muted-foreground mb-4 min-h-[2rem]">
      {displayedText}
      {!isFinished && (
        <span className="animate-pulse ml-0.5 -translate-y-[2px] inline-block">|</span>
      )}
    </p>
  );
} 