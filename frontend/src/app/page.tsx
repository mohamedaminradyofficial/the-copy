"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BrainCircuit,
  Camera,
  Clapperboard,
  FileText,
  Layers,
  Lightbulb,
  PenSquare,
  Sparkles,
  Theater,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import images from "./images";
import "./slider.css";
import pagesManifest from "@/config/pages.manifest.json";

const ParticleBackground = dynamic(
  () => import("@/components/particle-background-optimized"),
  { ssr: false }
);

// Icon mapping for each page slug
const iconMap: Record<string, typeof PenSquare> = {
  "actorai-arabic": Theater,
  "analysis": Layers,
  "arabic-creative-writing-studio": PenSquare,
  "arabic-prompt-engineering-studio": Zap,
  "brainstorm": BrainCircuit,
  "breakdown": FileText,
  "cinematography-studio": Camera,
  "development": Sparkles,
  "directors-studio": Clapperboard,
  "editor": PenSquare,
  "new": Lightbulb,
};

// Generate features from manifest
// Ensure pages is an array before mapping
const pagesArray = Array.isArray(pagesManifest.pages) ? pagesManifest.pages : [];
const features = pagesArray.map((page) => ({
  icon: iconMap[page.slug] || FileText,
  title: page.title,
  description: (pagesManifest.metadata as Record<string, {title: string, description: string}>)[page.slug]?.description || "",
  link: page.path,
}));

export default function Home() {
  const router = useRouter();
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const initialTransform =
        "translate3d(-50%, -50%, 0) rotateX(0deg) rotateY(-25deg) rotateZ(-120deg)";
      const zOffset = scrollPos * 0.5;
      slider.style.transform = `${initialTransform} translateY(${zOffset}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseOver = (index: number) => {
    setHoveredCard(index);
  };

  const handleMouseOut = () => {
    setHoveredCard(null);
  };

  const handleCardClick = (index: number) => {
    if (features[index]) {
      router.push(features[index].link);
    }
  };

  const heroOpacity = Math.max(0, 1 - scrollY / 400);
  const cardsOpacity = Math.min(1, Math.max(0, (scrollY - 200) / 400));
  const showCards = scrollY > 300;

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="container mx-auto flex items-center justify-between px-4 py-6">
          <Link href="/" aria-label="العودة للصفحة الرئيسية">
            <span className="font-headline text-2xl font-bold text-white">
              النسخة
            </span>
          </Link>
          <Link href="/" aria-label="The Copy Home">
            <span className="font-body text-lg font-bold text-white">
              The Copy
            </span>
          </Link>
        </header>
        <main className="flex-1">
          <section className="relative w-full h-screen flex items-center justify-center">
            <div
              className="container relative mx-auto flex h-full flex-col items-center justify-center px-4 text-center transition-opacity duration-500"
              style={{ opacity: heroOpacity }}
            >
              <div className="flex flex-col items-center justify-center gap-4"></div>
            </div>
          </section>

          <section
            className="relative h-screen w-full overflow-hidden transition-opacity duration-500"
            style={{
              opacity: cardsOpacity,
              display: showCards ? "block" : "none",
            }}
          >
            <div ref={sliderRef} className="slider">
              {images.map((image, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) cardsRef.current[index] = el;
                  }}
                  className={`card cursor-pointer transition-all duration-500 ease-out ${
                    hoveredCard === index ? "hover-active" : ""
                  }`}
                  onClick={() => handleCardClick(index)}
                  onMouseEnter={() => handleMouseOver(index)}
                  onMouseLeave={handleMouseOut}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCardClick(index);
                    }
                  }}
                  aria-label={`انتقل إلى ${features[index]?.title || "الصفحة"}`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Slide ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                    <div className="text-center text-white p-6 max-w-sm">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        {features[index] &&
                          (() => {
                            const IconComponent = features[index].icon;
                            return <IconComponent className="h-8 w-8" />;
                          })()}
                        <h3 className="text-3xl font-black">
                          {features[index]?.title}
                        </h3>
                      </div>
                      <p className="text-lg font-semibold opacity-95 leading-relaxed">
                        {features[index]?.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
        <footer className="container mx-auto border-t px-4 py-6 bg-background hidden">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <span className="font-headline text-2xl font-bold text-primary">
              النسخة
            </span>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} النسخة. جميع الحقوق محفوظة.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
