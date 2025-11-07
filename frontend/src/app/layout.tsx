import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import WebVitalsReporter from "@/components/WebVitalsReporter";
import "./globals.css";

// Enable Sentry monitoring in production
import "../../sentry.client.config";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* DNS prefetch for API services */}
        <link rel="dns-prefetch" href="https://apis.google.com" />
        <link rel="dns-prefetch" href="https://www.gstatic.com" />

        {/* Prevent FOUC (Flash of Unstyled Content) */}
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        {/* Web Vitals tracking with Sentry integration */}
        <WebVitalsReporter />

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
