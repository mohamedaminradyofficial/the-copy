/**
 * استخراج أكواد صفحة Promise - القسم الأول (Hero Section) مع الماسك للفيديو والكلمة
 * تم استخراج هذا الكود من Untitled-1.js وملفات أخرى متعلقة
 */

// ============================================
// 1. HTML Structure - Hero Section (comp-mb1elno6)
// ============================================
/*
<section id="comp-mb1elno6" tabindex="-1" data-block-level-container="Section" class="xuzjBY comp-mb1elno6 wixui-section Gzsk0j" data-testid="section-container">
  <div id="bgLayers_comp-mb1elno6" data-hook="bgLayers" data-motion-part="BG_LAYER comp-mb1elno6" class="MW5IWV">
    <div data-testid="colorUnderlay" class="LWbAav Kv1aVt"></div>
    <div id="bgMedia_comp-mb1elno6" data-motion-part="BG_MEDIA comp-mb1elno6" class="VgO9Yg"></div>
  </div>
  <div class="comp-mb1elno6-overflow-wrapper xpmKd_" data-testid="responsive-container-overflow">
    <div data-testid="responsive-container-content" tabindex="-1" class="comp-mb1elno6-container max-width-container">
      
      <!-- Video Component (comp-mb1g9h8y) -->
      <div id="comp-mb1g9h8y" class="M7AL1H comp-mb1g9h8y-container comp-mb1g9h8y wixui-video-box" data-audio="off" data-has-play="" data-no-audio="" data-playing="">
        <div class="K0b3At" tabindex="0" role="button" aria-label="Promise_Vision_Home_Page.mp4 Play video" aria-pressed="true">
          <div id="bgLayers_comp-mb1g9h8y" data-hook="bgLayers" data-motion-part="BG_LAYER comp-mb1g9h8y" class="MW5IWV bno0bO">
            <div id="bgMedia_comp-mb1g9h8y" data-motion-part="BG_MEDIA comp-mb1g9h8y" class="VgO9Yg">
              <wix-video id="videoContainer_comp-mb1g9h8y" data-video-info="..." class="bX9O_S bgVideo yK6aSC">
                <video id="comp-mb1g9h8y_video" class="K8MSra" crossorigin="anonymous" playsinline="" preload="auto" muted="" loop=""></video>
                <wow-image id="comp-mb1g9h8y_img" class="jhxvbR Z_wCwr Jxk_UL bgVideoposter yK6aSC" ...></wow-image>
              </wix-video>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</section>
*/

// ============================================
// 2. CSS Styles for Video Mask Effect
// ============================================

const maskStyles = `
/* الحاوية الرئيسية للقسم الأول (Hero Section) */
.hero-container,
#comp-mb1elno6 {
  position: relative;
  height: 100vh; /* ارتفاع الشاشة بالكامل */
  background-color: #000; /* لون احتياطي */
  overflow: hidden; /* إخفاء أي أجزاء زائدة من الفيديو */
}

/* تنسيق الفيديو لملء الشاشة */
.hero-video,
#comp-mb1g9h8y video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
  object-fit: cover; /* يضمن ملء الشاشة بدون تشويه */
  transform: translate(-50%, -50%);
  z-index: 1; /* الفيديو في الخلف */
}

/* هذه هي الطبقة التي تحتوي على القناع */
.mask-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2; /* القناع فوق الفيديو */
  
  /* --- الخدعة السحرية (Knockout Effect) --- */
  
  /* 1. هذه الطبقة لونها أبيض */
  background-color: white; 
  
  /* 2. هذا الوضع يجعل اللون الأبيض "شفافاً" واللون الأسود "مصمتاً" */
  mix-blend-mode: screen; 
}

/* 3. النص نفسه لونه أسود، لذلك هو "يخرق" الطبقة البيضاء 
     ويكشف الفيديو الذي يقع خلفها.
*/
.mask-content h1 {
  font-size: 20vw; /* حجم خط متجاوب مع عرض الشاشة */
  font-weight: 900;
  color: black; 
  text-align: center;
  line-height: 1;
  font-family: 'Noto Kufi Arabic', 'Arial Black', sans-serif;
}

/* طريقة بديلة: استخدام background-clip للنص */
.hero-text-mask {
  font-size: 15rem;
  font-weight: 900;
  color: transparent;
  background-image: linear-gradient(135deg, #ffffff 0%, #f5f5f5 25%, #ffffff 50%, #f5f5f5 75%, #ffffff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 60px rgba(255, 255, 255, 0.8), 0 0 80px rgba(255, 255, 255, 0.6);
  letter-spacing: -0.05em;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
}

/* طريقة أخرى: استخدام mask-image على الفيديو */
.masked-video {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  
  /* الماسك بالنص */
  -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="200" font-weight="900" font-family="Arial Black">PROMISE</text></svg>');
  mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="200" font-weight="900" font-family="Arial Black">النسخة</text></svg>');
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}
`;

// ============================================
// 3. HTML Structure - Simplified Version
// ============================================

const heroHTML = `
<!-- Hero Section with Video Mask - صفحة Promise -->
<div class="hero-container" id="comp-mb1elno6">
  
  <!-- Video Element (comp-mb1g9h8y) -->
  <video 
    id="comp-mb1g9h8y_video"
    class="hero-video" 
    playsinline 
    autoplay 
    muted 
    loop 
    poster="https://static.wixstatic.com/media/99801c_8bb6150edc104da6bc26ff7cf43c0e06f001.jpg">
    <source src="video/99801c_8bb6150edc104da6bc26ff7cf43c0e06/1080p/mp4/file.mp4" type="video/mp4">
  </video>
  
  <!-- Mask Layer with Text -->
  <div class="mask-content">
    <h1>النسخة</h1>
    <!-- أو استخدم "PROMISE" -->
  </div>
</div>
`;

// ============================================
// 4. React/Next.js Component (from page.tsx)
// ============================================

const ReactHeroComponent = `
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function PromiseHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Video to Canvas for text masking
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const drawVideo = () => {
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      animationId = requestAnimationFrame(drawVideo);
    };

    video.addEventListener('loadeddata', drawVideo);

    return () => {
      cancelAnimationFrame(animationId);
      video.removeEventListener('loadeddata', drawVideo);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Register ScrollTrigger
      gsap.registerPlugin(ScrollTrigger);

      // Video zoom effect on scroll
      if (videoRef.current && heroRef.current) {
        gsap.fromTo(
          videoRef.current,
          { scale: 1 },
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
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black"
      id="comp-mb1elno6"
    >
      {/* Hidden Video Element */}
      <video
        ref={videoRef}
        id="comp-mb1g9h8y_video"
        autoPlay
        loop
        muted
        playsInline
        className="hidden"
      >
        <source
          src="/promise-video.mp4"
          type="video/mp4"
        />
      </video>

      {/* Hidden Canvas for video rendering */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hero Text with Video Mask */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
        {isMounted ? (
          <h1
            ref={heroTextRef}
            className="text-[15rem] md:text-[20rem] lg:text-[28rem] xl:text-[35rem] font-black leading-none select-none px-8"
            style={{
              color: "transparent",
              backgroundImage: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 25%, #ffffff 50%, #f5f5f5 75%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              textShadow: "0 0 60px rgba(255, 255, 255, 0.8), 0 0 80px rgba(255, 255, 255, 0.6)",
              letterSpacing: "-0.05em",
              filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))",
            }}
          >
            النسخة
          </h1>
        ) : (
          <h1
            className="text-[15rem] md:text-[20rem] lg:text-[28rem] xl:text-[35rem] font-black leading-none select-none px-8"
            style={{
              color: "#000",
              letterSpacing: "-0.05em",
            }}
          >
            النسخة
          </h1>
        )}
      </div>
    </section>
  );
}
`;

// ============================================
// 5. Vanilla JavaScript Version (from Untitled-2.html)
// ============================================

const vanillaJS = `
// Video Mask Effect with GSAP ScrollTrigger
window.addEventListener('load', () => {
  
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  const heroSection = document.getElementById('comp-mb1elno6');
  const heroVideo = document.getElementById('comp-mb1g9h8y_video');
  const heroText = document.querySelector('.mask-content h1');

  if (!heroSection || !heroVideo) {
    console.error("عنصر واحد أو أكثر مفقود من الصفحة.");
    return;
  }
  
  // Video zoom effect on scroll
  gsap.fromTo(
    heroVideo,
    { scale: 1 },
    {
      scale: 1.2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom center",
        scrub: 1.5,
      },
    }
  );

  // Hero text zoom and fade out
  if (heroText) {
    gsap.to(heroText, {
      scale: 1.3,
      opacity: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom center",
        scrub: 2,
      },
    });
  }

  // Pin hero section during scroll
  const heroTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: heroSection,
      start: "top top",
      end: "+=100%",
      scrub: true,
      pin: true,
    }
  });

  heroTimeline.to(heroSection, {
    scale: 1.1,
    opacity: 0,
    ease: "power1.in"
  });
});
`;

// ============================================
// 6. Video Information from Untitled-1.js
// ============================================

const videoInfo = {
  videoId: "99801c_8bb6150edc104da6bc26ff7cf43c0e06",
  videoWidth: 1920,
  videoHeight: 1080,
  qualities: [
    { quality: "360p", size: 230400, url: "video/99801c_8bb6150edc104da6bc26ff7cf43c0e06/360p/mp4/file.mp4" },
    { quality: "480p", size: 409920, url: "video/99801c_8bb6150edc104da6bc26ff7cf43c0e06/480p/mp4/file.mp4" },
    { quality: "720p", size: 921600, url: "video/99801c_8bb6150edc104da6bc26ff7cf43c0e06/720p/mp4/file.mp4" },
    { quality: "1080p", size: 2073600, url: "video/99801c_8bb6150edc104da6bc26ff7cf43c0e06/1080p/mp4/file.mp4" }
  ],
  videoFormat: "mp4",
  playbackRate: 1,
  autoPlay: true,
  containerId: "comp-mb1g9h8y",
  poster: "99801c_8bb6150edc104da6bc26ff7cf43c0e06f001.jpg"
};

// ============================================
// 7. Export All Components
// ============================================

export {
  maskStyles,
  heroHTML,
  ReactHeroComponent,
  vanillaJS,
  videoInfo
};

// ============================================
// Usage Example:
// ============================================
/*
// في ملف HTML:
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Promise - Hero Section with Video Mask</title>
  <style>${maskStyles}</style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
</head>
<body>
  ${heroHTML}
  <script>${vanillaJS}</script>
</body>
</html>
*/




