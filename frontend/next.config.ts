const { NextConfig } = require("next");

// Remote image patterns configuration
const remoteImagePatterns = process.env.NEXT_IMAGE_REMOTE_PATTERNS 
  ? JSON.parse(process.env.NEXT_IMAGE_REMOTE_PATTERNS)
  : [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ];

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// CDN Configuration
const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
const enableCdn = process.env.NEXT_PUBLIC_ENABLE_CDN === "true";
const assetPrefix = enableCdn && cdnUrl ? cdnUrl : undefined;

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // CDN support for static assets
  assetPrefix,

  allowedDevOrigins: ["*.replit.dev", "replit.dev"],

  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === "production",
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Enable SWC minification for better performance
  swcMinify: true,

  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-menubar",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slider",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-tooltip",
      "lucide-react",
      "recharts",
    ],
  },

  async headers() {
    // Dynamic CSP based on CDN configuration
    const cdnDomain = cdnUrl ? new URL(cdnUrl).hostname : null;
    const cdnCsp = cdnDomain ? ` ${cdnUrl}` : '';

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com https://*.googleapis.com https://*.sentry.io${cdnCsp}`,
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com${cdnCsp}`,
              `font-src 'self' https://fonts.gstatic.com${cdnCsp}`,
              `img-src 'self' data: blob: https: https://placehold.co https://images.unsplash.com https://picsum.photos https://www.gstatic.com https://*.googleapis.com${cdnCsp}`,
              "connect-src 'self' https://apis.google.com https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://*.sentry.io wss: ws:",
              "frame-src 'self' https://apis.google.com https://*.googleapis.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "interest-cohort=()",
              "payment=()",
              "usb=()",
            ].join(", "),
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache Next.js static files (JS, CSS, etc.)
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache fonts with long TTL
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
      // Cache directors-studio images
      {
        source: "/directors-studio/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache optimized images
      {
        source: "/directors-studio/optimized/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Vary",
            value: "Accept",
          },
        ],
      },
      // Cache API responses with stale-while-revalidate
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=120",
          },
        ],
      },
    ];
  },

  webpack: (config: any, { isServer, dev }: any) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    // Bundle size optimization
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      // Add support for Web Workers
      config.module.rules.push({
        test: /\.worker\.(ts|js)$/,
        use: {
          loader: 'worker-loader',
          options: {
            filename: 'static/[hash].worker.js',
            publicPath: '/_next/',
          },
        },
      });

      // Advanced bundle splitting for better caching
      if (!dev) {
        config.optimization = {
          ...config.optimization,
          moduleIds: 'deterministic',
          runtimeChunk: {
            name: 'runtime',
          },
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              // Framework bundle (React, Next.js)
              framework: {
                test: /[\\/]node_modules[\\/](react|react-dom|next|scheduler)[\\/]/,
                name: 'framework',
                priority: 40,
                enforce: true,
                reuseExistingChunk: true,
              },
              // UI Library bundle (Radix UI)
              radixui: {
                test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
                name: 'radix-ui',
                priority: 35,
                enforce: true,
                reuseExistingChunk: true,
              },
              // AI/ML libraries bundle
              ai: {
                test: /[\\/]node_modules[\\/](@genkit-ai|@google\/genai|genkit|firebase)[\\/]/,
                name: 'ai-libs',
                priority: 30,
                enforce: true,
                reuseExistingChunk: true,
              },
              // Data visualization bundle
              charts: {
                test: /[\\/]node_modules[\\/](recharts|d3-.*)[\\/]/,
                name: 'charts',
                priority: 25,
                enforce: true,
                reuseExistingChunk: true,
              },
              // 3D/Animation libraries
              three: {
                test: /[\\/]node_modules[\\/](three|framer-motion)[\\/]/,
                name: 'graphics',
                priority: 25,
                enforce: true,
                reuseExistingChunk: true,
              },
              // Form libraries
              forms: {
                test: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/,
                name: 'forms',
                priority: 20,
                enforce: true,
                reuseExistingChunk: true,
              },
              // Database/ORM libraries
              database: {
                test: /[\\/]node_modules[\\/](drizzle-orm|drizzle-zod|ioredis)[\\/]/,
                name: 'database',
                priority: 20,
                enforce: true,
                reuseExistingChunk: true,
              },
              // Other vendor libraries
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                priority: 10,
                minChunks: 2,
                reuseExistingChunk: true,
              },
              // Common code shared across routes
              common: {
                minChunks: 2,
                priority: 5,
                reuseExistingChunk: true,
                enforce: true,
              },
            },
            maxInitialRequests: 25,
            minSize: 20000,
            maxSize: 244000,
          },
        };
      }
    }

    return config;
  },

  images: {
    remotePatterns: remoteImagePatterns,
  },
};

// Sentry configuration
const { withSentryConfig } = require("@sentry/nextjs");

const shouldUseSentry = !!(process.env.SENTRY_ORG && process.env.SENTRY_PROJECT && process.env.NEXT_PUBLIC_SENTRY_DSN);

const sentryConfig = shouldUseSentry ? {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  hideSourceMaps: process.env.NODE_ENV === 'production',
  disableLogger: true,
  automaticVercelMonitors: true,
  tunnelRoute: "/monitoring",
  sourcemaps: {
    disable: false,
  },
} : null;

// Export config with Sentry wrapper if configured
const configWithAnalyzer = withBundleAnalyzer(nextConfig);
export default sentryConfig
  ? withSentryConfig(configWithAnalyzer, sentryConfig)
  : configWithAnalyzer;
