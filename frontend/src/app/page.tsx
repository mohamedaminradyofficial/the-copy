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

      // Cards container animation - fade in from bottom
      if (cardsContainerRef.current) {
        gsap.fromTo(
          cardsContainerRef.current,
          {
            opacity: 0,
            y: 100,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top 80%",
              end: "top 50%",
              scrub: 1,
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

      {/* Cards Section */}
      <section className="relative min-h-screen py-20 px-4 bg-gradient-to-b from-black via-zinc-900 to-black">
        <div
          ref={cardsContainerRef}
          className="container mx-auto max-w-7xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Link
                  key={index}
                  href={feature.link}
                  className="group relative block"
                  aria-label={`انتقل إلى ${feature.title}`}
                >
                  <div
                    className={`relative h-96 rounded-2xl overflow-hidden transition-all duration-500 ease-out ${
                      hoveredCard === index
                        ? "scale-105 shadow-2xl shadow-white/20"
                        : "scale-100 shadow-lg shadow-white/5"
                    }`}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Card Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={images[index] || "/placeholder.svg"}
                        alt={feature.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-4">
                        <div className="flex items-center gap-3 mb-3">
                          <IconComponent className="h-8 w-8 text-white" />
                          <h3 className="text-3xl font-black text-white">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-base text-white/90 font-semibold leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-2xl transition-all duration-500" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
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
