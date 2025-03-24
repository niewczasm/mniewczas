"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

const biography = [
  "Urodziłem się w 1996 roku w Radomiu, mieście, które nieustannie balansuje między industrialnym dziedzictwem a nowoczesnością 🏙️⚙️. Moja ścieżka życiowa od początku wydawała się być wyznaczona przez precyzję i dbałość o detale 🎯📐 – cechy charakterystyczne dla mojego znaku zodiaku, Panny ♍. Czy to przypadek, że od zawsze fascynowała mnie struktura, porządek i skrupulatność? Trudno powiedzieć, ale jedno jest pewne – technologia stała się dla mnie nie tylko pasją, ale i sposobem na życie 🌍🔧.",
"Już jako dziecko zafascynowany byłem mechanizmami, które napędzają świat – od prostych układanek 🧩 po bardziej skomplikowane systemy informatyczne 🤖. To zamiłowanie do logiki i precyzji doprowadziło mnie do Zespołu Szkół Elektronicznych w Radomiu 🎓📡, gdzie rozpocząłem swoją oficjalną podróż w świat IT. Tam nauczyłem się nie tylko programowania i zasad działania systemów komputerowych, ale także tego, jak nieustannie podążać za dynamicznie zmieniającą się technologią 🌐📈. Edukacja stała się moją trampoliną do dalszego rozwoju, a głód wiedzy 📚🤓 pchał mnie do zdobywania kolejnych umiejętności i certyfikatów, w tym prestiżowego Professional Scrum Developer I, który potwierdził moje kompetencje w zakresie nowoczesnych metodologii pracy 🏆💪.",
"Miałem przyjemność pracować dla firm z różnych branż 🌍 – od automotive 🚗⚙️, przez sektor streamingowy 📺🎥, finansowy 💰🏦, aż po projekty rządowe, zwłaszcza w obszarze sądownictwa ⚖️📜. Każda z tych dziedzin stawiała przede mną inne wyzwania 🎯, a ja z pasją podejmowałem się ich rozwiązywania 🛠️. W świecie motoryzacji liczy się precyzja i niezawodność – systemy, nad którymi pracowałem, miały wpływ na bezpieczeństwo 🚦🛑 i komfort użytkowników. W branży streamingowej tempo pracy było dynamiczne 🌊⚡, a optymalizacja aplikacji dla milionów użytkowników wymagała nie tylko umiejętności technicznych, ale i kreatywnego podejścia do problemów 🧐🎨. Projekty finansowe nauczyły mnie rygorystycznego podejścia do bezpieczeństwa danych 🔒🧾, bo w tej branży każda linijka kodu ma wpływ na miliony transakcji dziennie 💳💹. Natomiast w sektorze rządowym kluczowe było zapewnienie stabilności i odporności systemów 🏛️🛡️ – wiedziałem, że infrastruktura, którą tworzę, będzie miała realny wpływ na funkcjonowanie instytucji i codzienne życie ludzi 👨‍⚖️👩‍⚖️.",
"Dziś śmiało mogę powiedzieć, że DevOps to mój żywioł 🌪️🔄. Uwielbiam usprawniać procesy, automatyzować wdrożenia i dbać o to, by wszystko działało jak w precyzyjnym mechanizmie zegarkowym ⏱️⚙️. Codziennie pracuję z narzędziami takimi jak Jenkins, GitHub Actions i Terraform 🏗️📡, które pozwalają mi budować i utrzymywać skomplikowane środowiska IT. Optymalizacja infrastruktury to dla mnie nie tylko wyzwanie 🚀, ale i sposób na wprowadzanie realnych oszczędności 💸 oraz zwiększanie efektywności systemów 📊. Gdy widzę, jak dobrze skonfigurowana infrastruktura działa płynnie i bezbłędnie 🎶✅, odczuwam ogromną satysfakcję – niczym kompozytor słyszący idealnie odegrany utwór 🎼🎻.",
"Testowanie oprogramowania to inna dziedzina, w której czuję się jak ryba w wodzie 🐟💦. Zawsze uważałem, że diabeł tkwi w szczegółach 😈🔍, a precyzyjna analiza i eliminowanie błędów to klucz do tworzenia wysokiej jakości oprogramowania 🏆🖥️. Narzędzia takie jak Selenium, Postman czy SoapUI 🛠️🔬 to moje codzienne wyposażenie, dzięki któremu mogę bezlitośnie wyłapywać nawet najdrobniejsze usterki 👀🚨. Każdy test to dla mnie swego rodzaju detektywistyczna zagadka 🔎🧩 – z każdym błędem, który wykryję, oprogramowanie staje się coraz lepsze 📈, a ja mam poczucie, że dostarczam coś, co spełni oczekiwania użytkowników 👏🤩."

  // Dodaj więcej linijek tekstu według potrzeb
];

export default function AboutPage() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentIndex >= biography.length) return;

    const text = biography[currentIndex];
    const timer = setInterval(() => {
      if (currentChar < text.length) {
        setCurrentLine(prev => prev + text[currentChar]);
        setCurrentChar(prev => prev + 1);
      } else {
        clearInterval(timer);
        setDisplayedLines(prev => [...prev, currentLine]);
        setCurrentLine("");
        setCurrentChar(0);
        setCurrentIndex(prev => prev + 1);
      }
    }, 450);

    return () => clearInterval(timer);
  }, [currentIndex, currentChar]);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a 
              href="/" 
              className="text-foreground hover:text-muted-foreground transition-colors"
            >
              ← Strona główna
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              O mnie
            </h1>
          </header>

          <div className="space-y-4">
            {displayedLines.map((line, index) => (
              <p key={index} className="text-lg text-muted-foreground mb-4">
                {line}
              </p>
            ))}
            {currentLine && (
              <p className="text-lg text-muted-foreground mb-4">
                {currentLine}
                <span className="animate-pulse ml-0.5 -translate-y-[2px] inline-block">|</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 