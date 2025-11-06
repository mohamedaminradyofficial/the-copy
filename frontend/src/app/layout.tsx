import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import { reportWebVitals } from "@/lib/web-vitals";
import "./globals.css";

export const metadata: Metadata = {
  title: "النسخة - The Copy",
  description: "منصة للكتابة الإبداعية والتحليل الدرامي باللغة العربية",
  keywords: ["كتابة إبداعية", "تحليل درامي", "عربي", "سيناريو", "محطات سبع"],
  authors: [{ name: "The Copy Team" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#ffffff",
  robots: "index, follow",
  openGraph: {
    title: "النسخة - The Copy",
    description: "منصة للكتابة الإبداعية والتحليل الدرامي باللغة العربية",
    type: "website",
    locale: "ar_SA",
  },
};

if (typeof window !== "undefined") {
  reportWebVitals();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Optimized font loading with display=swap for better performance */}
        <link
          href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,700;1,7..72,400&display=swap"
          rel="stylesheet"
          media="print"
          onLoad="this.media='all'"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap"
          rel="stylesheet"
          media="print"
          onLoad="this.media='all'"
        />

        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="https://apis.google.com" />
        <link rel="dns-prefetch" href="https://www.gstatic.com" />

        {/* Prevent FOUC (Flash of Unstyled Content) */}
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground"
          aria-label="انتقل إلى المحتوى الرئيسي"
        >
          انتقل إلى المحتوى الرئيسي
        </a>

        <ErrorBoundary>
          <main id="main-content" role="main">
            {children}
          </main>
        </ErrorBoundary>

        <Toaster aria-live="polite" aria-atomic="true" />
      </body>
    </html>
  );
}
