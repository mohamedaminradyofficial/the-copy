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
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import images from "./images";
import pagesManifest from "@/config/pages.manifest.json";
import { LandingCardScanner } from "@/components/card-scanner/landing-card-scanner";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

// Generate features from manifest (excluding metrics-dashboard)
const pagesArray = Array.isArray(pagesManifest.pages)
  ? pagesManifest.pages.filter(page => page.slug !== "metrics-dashboard")
  : [];

const features = pagesArray.map((page) => ({
  icon: iconMap[page.slug] || FileText,
  title: page.title,
  description: (pagesManifest.metadata as Record<string, {title: string, description: string}>)[page.slug]?.description || "",
  link: page.path,
}));

export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Video zoom effect on scroll
      if (videoRef.current && heroRef.current) {
        gsap.fromTo(
          videoRef.current,
          {
            scale: 1,
          },
          {
            scale: 1.2,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom center",
              scrub: 1.5,
            },
          }
        );
      }

      // Hero text zoom and fade out
      if (heroTextRef.current && heroRef.current) {
        gsap.to(heroTextRef.current, {
          scale: 1.3,
          opacity: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom center",
            scrub: 2,
          },
        });
      }

      // Header animation - slide down when scrolling
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          {
            opacity: 0,
            y: -100,
          },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "top -100",
              scrub: 1,
            },
          }
        );
      }

      // Cards container animation - fade in from bottom to top
      if (cardsContainerRef.current) {
        gsap.fromTo(
          cardsContainerRef.current,
          {
            opacity: 0,
            y: 150,
          },
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top bottom",
              end: "top 60%",
              scrub: 1.5,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleCardClick = (index: number) => {
    if (features[index]) {
      router.push(features[index].link);
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Sticky Header - Initially Hidden */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10 opacity-0"
      >
        <div className="container mx-auto flex items-center justify-center px-6 py-4">
          <Link href="/" aria-label="العودة للصفحة الرئيسية">
            <span className="font-headline text-3xl font-bold text-white">
              النسخة
            </span>
          </Link>
        </div>
      </header>

      {/* Hero Section with Video Mask */}
      <section
        ref={heroRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black"
      >
        {/* Video Layer - Will show through text */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="/النسخة.mp4.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Black Layer - Everything is black except where text reveals video */}
        <div className="absolute inset-0 bg-black" style={{ zIndex: 2 }} />

        {/* Hero Text - White text with screen blend mode reveals video */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
          <h1
            ref={heroTextRef}
            className="text-[15rem] md:text-[20rem] lg:text-[28rem] xl:text-[35rem] font-black leading-none select-none px-8 text-white"
            style={{
              mixBlendMode: 'screen',
              letterSpacing: "-0.05em",
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            النسخة
          </h1>
        </div>
      </section>

      {/* Cards Section with Scanner Effect */}
      <section
        ref={cardsContainerRef}
        className="relative h-screen bg-black overflow-hidden opacity-0"
      >
        <LandingCardScanner />
      </section>

      {/* Footer */}
      <footer className="relative bg-black border-t border-white/10 px-4 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <span className="font-headline text-2xl font-bold text-white">
            النسخة
          </span>
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} النسخة. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
