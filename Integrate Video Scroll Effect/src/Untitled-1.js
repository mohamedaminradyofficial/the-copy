<!DOCTYPE html>
<!-- 
  صفحة Promise - القسم الأول (Hero Section) مع تأثير الماسك للفيديو والكلمة
  تم استخراج هذا الكود من Untitled-1.js وملفات أخرى متعلقة
-->
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Promise - Hero Section with Video Mask</title>
  
  <!-- جلب مكتبة GSAP للتحريكات -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
  
  <!-- جلب الخطوط -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@700;900&family=Inter:wght@400;700&display=swap" rel="stylesheet">
  
  <style>
    /* تطبيق الخطوط الأساسية على الصفحة */
    body {
      font-family: 'Noto Kufi Arabic', 'Inter', sans-serif;
      background-color: #000;
      color: white;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }
    
    /* --- تأثير قناع الفيديو (Video Mask Effect) --- */
    
    /* الحاوية الرئيسية للقسم الأول (Hero Section) - comp-mb1elno6 */
    .hero-container,
    #comp-mb1elno6 {
      position: relative;
      height: 100vh; /* ارتفاع الشاشة بالكامل */
      background-color: #000; /* لون احتياطي */
      overflow: hidden; /* إخفاء أي أجزاء زائدة من الفيديو */
    }
    
    /* تنسيق الفيديو لملء الشاشة - comp-mb1g9h8y */
    .hero-video,
    #comp-mb1g9h8y_video {
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
      margin: 0;
      padding: 0;
    }

    /* طريقة بديلة: استخدام background-clip للنص (للتأثير المختلف) */
    .hero-text-gradient {
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

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .mask-content h1 {
        font-size: 15vw;
      }
      
      .hero-text-gradient {
        font-size: 10rem;
      }
    }

    @media (max-width: 480px) {
      .mask-content h1 {
        font-size: 12vw;
      }
      
      .hero-text-gradient {
        font-size: 8rem;
      }
    }
  </style>
</head>
<body>

  <!-- Hero Section with Video Mask - صفحة Promise -->
  <!-- القسم الأول: comp-mb1elno6 -->
  <div class="hero-container" id="comp-mb1elno6">
    
    <!-- Video Element - comp-mb1g9h8y -->
    <!-- معلومات الفيديو من Untitled-1.js:
         videoId: 99801c_8bb6150edc104da6bc26ff7cf43c0e06
         videoWidth: 1920, videoHeight: 1080
         Qualities: 360p, 480p, 720p, 1080p
    -->
    <video 
      id="comp-mb1g9h8y_video"
      class="hero-video" 
      playsinline 
      autoplay 
      muted 
      loop 
      poster="https://static.wixstatic.com/media/99801c_8bb6150edc104da6bc26ff7cf43c0e06f001.jpg">
      <!-- يمكنك استخدام أي من هذه الجودات حسب الحاجة -->
      <source src="video/99801c_8bb6150edc104da6bc26ff7cf43c0e06/1080p/mp4/file.mp4" type="video/mp4">
      <source src="video/99801c_8bb6150edc104da6bc26ff7cf43c0e06/720p/mp4/file.mp4" type="video/mp4">
      <source src="video/99801c_8bb6150edc104da6bc26ff7cf43c0e06/480p/mp4/file.mp4" type="video/mp4">
      <!-- فيديو احتياطي للاختبار -->
      <source src="https://static.videezy.com/system/resources/previews/000/044/226/original/51.mp4" type="video/mp4">
    </video>
    
    <!-- Mask Layer with Text -->
    <!-- الطبقة التي تحتوي على القناع والكلمة -->
    <div class="mask-content">
      <h1>النسخة</h1>
      <!-- يمكنك تغيير النص إلى "PROMISE" أو أي نص آخر -->
    </div>
  </div>

  <!-- قسم إضافي للاختبار (يمكن حذفه) -->
  <div style="height: 100vh; background: #fff; color: #000; display: flex; align-items: center; justify-content: center;">
    <h2 style="font-size: 3rem;">القسم التالي</h2>
  </div>

  <script>
    // Video Mask Effect with GSAP ScrollTrigger
    // تم استخراج هذا الكود من frontend/src/app/page.tsx و Untitled-2.html
    
    window.addEventListener('load', () => {
      
      // Register ScrollTrigger plugin
      if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
      }

      const heroSection = document.getElementById('comp-mb1elno6');
      const heroVideo = document.getElementById('comp-mb1g9h8y_video');
      const heroText = document.querySelector('.mask-content h1');

      if (!heroSection || !heroVideo) {
        console.error("عنصر واحد أو أكثر مفقود من الصفحة.");
        return;
      }
      
      // Video zoom effect on scroll
      if (typeof gsap !== 'undefined') {
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

        // Optional: Pin hero section during scroll
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
      }
    });
  </script>

</body>
</html>

dC1yZXZhbGlkYXRlJTIyJTJjJTIyY29ubmVjdGlvbiUyMiUzYSUyMmtlZXAtYWxpdmUlMjIlMmMlMjJjb250ZW50LWVuY29kaW5nJTIyJTNhJTIyZ3ppcCUyMiUyYyUyMmNvbnRlbnQtdHlwZSUyMiUzYSUyMmFwcGxpY2F0aW9uL2pzb24lM2IlMjBjaGFyc2V0JTNkdXRmLTglMjIlMmMlMjJkYXRlJTIyJTNhJTIyV2VkJTJjJTIwMDUlMjBOb3YlMjAyMDI1JTIwMTglM2EyMyUzYTIyJTIwR01UJTIyJTJjJTIyZXRhZyUyMiUzYSUyMlcvJTVjJTIyMjljMC1Pd015M2hYcGJhZ2NjNkl0cUdjcmlBSXc2aWslNWMlMjIlMjIlMmMlMjJwcmFnbWElMjIlM2ElMjJuby1jYWNoZSUyMiUyYyUyMnNlcnZlciUyMiUzYSUyMm5naW54LzEuMjQuMCUyMiUyYyUyMnNlcnZlci10aW1pbmclMjIlM2ElMjJjYWNoZSUzYmRlc2MlM2RtaXNzJTJjJTIwdmFybmlzaCUzYmRlc2MlM2RtaXNzJTJjJTIwZGMlM2JkZXNjJTNkaXJlbGFuZC1wdWIlMjIlMmMlMjJ0cmFuc2Zlci1lbmNvZGluZyUyMiUzYSUyMmNodW5rZWQlMjIlMmMlMjJ2YXJ5JTIyJTNhJTIyQWNjZXB0LUVuY29kaW5nJTIyJTJjJTIyeC1jb250ZW50LXR5cGUtb3B0aW9ucyUyMiUzYSUyMm5vc25pZmYlMjIlMmMlMjJ4LXNlZW4tYnklMjIlM2ElMjJtMGoyRUVrbkdJVlVXL2xpWThCTExzVU5iMHRaOEpkU0Jsd3BlVGhkeWtOYmVTUlZBb01GSGROQ0Y0WDBZdlFHJTJjMmQ1OGlmZWJHYm9zeTV4YytGUmFscnliVjNPeVI4RlpaQTBtd05TMHhicEt1bHNpanBDdmVqaDczWkN6QVJucGhLR3FKMkJGV2dFTGMxRDJ5ZTVVRHclM2QlM2QlMmMyVU5WN0tPcTRvR2pBNStQS3NYNDdJWkRvSVduMEt2Z0ZjVTBwck5PbFF3eUl2WER3QWdRbk1hUy9nRVpJT0doJTJjVGVFalY5bHY3L0hBQ1FyMlZNT2VHNEFJd3dncDB4NE5rRnhxOXZydVkwTSUzZCUyYzRLNjE1N0l0OTZ1YWdETnFZbTlEQ01wcHlrS3Z1WWpuZFpTbHpOcmZyWVRnYjE5MnBTR2hIUXluVmN4NVYvZlI3OEZscllJSVBBTy9CalJJT0ZNNHpOU3dHNWZrNWgrd0M2M3pWZEVIZzBrJTNkJTIyJTJjJTIyeC13aXgtY2FjaGUtY29udHJvbCUyMiUzYSUyMnB1YmxpYyUyYyUyMG1heC1hZ2UlM2Q2MDQ4MDAlMjIlMmMlMjJ4LXdpeC1yZXF1ZXN0LWlkJTIyJTNhJTIyMTc2MjM2NzAwMC45NzY0NTc1MzkwNDIzNjI1MjY2JTIyJTdkJTJjJTIyc3RhdHVzJTIyJTNhMjAwJTJjJTIyc3RhdHVzVGV4dCUyMiUzYSUyMk9LJTIyJTJjJTIycmVzcG9uc2VVcmwlMjIlM2ElMjJodHRwJTNhLy8xNzIuMjAuMjAuMTU5JTNhODA4MC9leHRlcm5hbGRpc3BhdGNoZXIvX2FwaS9ibG9nLWZyb250ZW5kLWFkYXB0ZXItcHVibGljL3YyL3Bvc3QtZmVlZC1wYWdlJTNmbGFuZ3VhZ2VDb2RlJTNkZW4lMjZwYWdlJTNkMSUyNnBhZ2VTaXplJTNkMyUyNmluY2x1ZGVJbml0aWFsUGFnZURhdGElM2R0cnVlJTI2dHlwZSUzZFBPU1RfTElTVF9XSURHRVQlMjZwb3N0TGlzdFdpZGdldE9wdGlvbnMuZmVhdHVyZWRPbmx5JTNkZmFsc2UlMjZ0cmFuc2xhdGlvbnNOYW1lJTNkcG9zdC1saXN0LXdpZGdldCUyMiUyYyUyMnRpbWVvdXQlMjIlM2EwJTdkJTJjJTIycmVxdWVzdElkJTIyJTNhJTIyMTc2MjM2NzAwMC45NzY0NTc1MzkwNDIzNjI1MjY2JTIyJTdkJTJjJTIybWV0YWRhdGFSZXNwb25zZSUyMiUzYSU3YiUyMmRhdGElMjIlM2ElN2IlMjJwb3N0RmVlZE1ldGFkYXRhUGFnZSUyMiUzYSU3YiUyMnBvc3RNZXRyaWNzJTIyJTNhJTdiJTdkJTJjJTIycG9zdExpa2VzJTIyJTNhJTdiJTdkJTdkJTdkJTdkJTdk"}},"ooi":{"failedInSsr":{}}}</script>
<!-- warmup data end -->

<!-- presets polyfill -->








</body>
</html>
