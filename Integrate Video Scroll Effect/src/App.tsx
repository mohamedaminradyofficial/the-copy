"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  PenSquare,
  BrainCircuit,
  Sparkles,
} from "lucide-react";
import { LandingCardScanner } from "./components/card-scanner/landing-card-scanner";
import { VideoTextMask } from "./components/video-text-mask";
import pagesManifest from "./config/pages.manifest";

// تسجيل إضافة ScrollTrigger من GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Icon mapping for each page slug
const iconMap: Record<string, typeof PenSquare> = {
  "arabic-creative-writing-studio": PenSquare,
  "brainstorm": BrainCircuit,
  "development": Sparkles,
};

// Generate features from manifest
const pagesArray = Array.isArray(pagesManifest.pages)
  ? pagesManifest.pages
  : [];

const features = pagesArray.map((page) => ({
  icon: iconMap[page.slug] || PenSquare,
  title: page.title,
  description: (pagesManifest.metadata as Record<string, {title: string, description: string}>)[page.slug]?.description || "",
  link: page.path,
}));

export default function App() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const maskContentRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // التأثير الرئيسي: تثبيت قسم Hero مع الزوم والاختفاء
  useEffect(() => {
    if (!isMounted) return;

    const ctx = gsap.context(() => {
      const heroSection = heroRef.current;
      const header = headerRef.current;
      const textSection = cardsContainerRef.current;
      const maskContent = maskContentRef.current;

      if (!heroSection || !header || !textSection || !maskContent) {
        console.error("عنصر واحد أو أكثر مفقود من الصفحة.");
        return;
      }

      // --- التحريك الرئيسي: تثبيت القسم الأول وتحريكه ---
      // إنشاء خط زمني (Timeline) واحد ليتحكم في كل ما يحدث
      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "+=100%", // يثبت القسم الأول لمدة تمرير 100% من ارتفاع الشاشة
          scrub: true,
          pin: true, // تثبيت القسم في مكانه
        }
      });

      // حركة التكبير والصعود للأعلى مع الاختفاء للقسم الأول
      heroTimeline.to(maskContent, {
        scale: 1.5,
        y: -200,
        opacity: 0,
        ease: "power2.in"
      });

      // حركة ظهور الهيدر في نفس الوقت
      heroTimeline.to(header, {
        opacity: 1,
        ease: "power1.in"
      }, "<"); // "<" تجعلها تحدث في نفس وقت الحركة السابقة

      // --- التحريك المنفصل: ظهور قسم البطاقات ---
      gsap.from(textSection, {
        y: 150,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textSection,
          start: "top bottom",
          end: "top 60%",
          scrub: 1.5,
        }
      });
    });

    return () => ctx.revert();
  }, [isMounted]);

  return (
    <div className="relative min-h-screen bg-black" dir="rtl">
      {/* الهيدر الثابت - مخفي في البداية */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-black text-white border-b border-white/10"
        style={{ opacity: 0 }}
      >
        <div className="container mx-auto flex items-center justify-center px-6 py-4">
          <h2 className="text-2xl">النسخة</h2>
        </div>
      </header>

      {/* قسم Hero مع تأثير قناع الفيديو */}
      <section
        ref={heroRef}
        className="relative w-full h-screen overflow-hidden bg-white"
      >
        <VideoTextMask
          ref={maskContentRef}
          videoSrc="https://cdn.pixabay.com/video/2025/11/09/314880.mp4"
          text="النسخة"
          className="w-full h-full"
        />
      </section>

      {/* قسم البطاقات مع تأثير الماسح */}
      <section
        ref={cardsContainerRef}
        className="relative h-screen bg-black overflow-hidden"
      >
        <LandingCardScanner />
      </section>

      {/* الفوتر */}
      <footer className="relative bg-black border-t border-white/10 px-4 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <span className="text-2xl text-white">
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
