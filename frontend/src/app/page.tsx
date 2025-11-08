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
      // Hero text animation on scroll
      if (heroTextRef.current) {
        gsap.to(heroTextRef.current, {
          scale: 1.1,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom center",
            scrub: 1,
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
            duration: 0.3,
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
            duration: 1,
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
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" aria-label="العودة للصفحة الرئيسية">
            <span className="font-headline text-xl font-bold text-white">
              النسخة
            </span>
          </Link>
          <Link href="/" aria-label="The Copy Home">
            <span className="font-body text-sm font-bold text-white">
              The Copy
            </span>
          </Link>
        </div>
      </header>

      {/* Hero Section with Video Mask */}
      <section
        ref={heroRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black"
      >
        {/* Video Background - Full Screen */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="https://cdn.pixabay.com/video/2022/11/09/138397-768408689_large.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />

        {/* Hero Text with Video Masking Effect */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <h1
            ref={heroTextRef}
            className="text-[10rem] md:text-[14rem] lg:text-[18rem] xl:text-[24rem] font-black leading-none select-none px-8"
            style={{
              color: "transparent",
              background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              textShadow: "0 0 40px rgba(255, 255, 255, 0.3)",
              letterSpacing: "-0.05em",
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
