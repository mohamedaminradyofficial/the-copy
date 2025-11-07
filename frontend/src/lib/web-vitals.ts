/**
 * Web Vitals Integration with Sentry
 *
 * This module collects and reports Core Web Vitals to Sentry for monitoring:
 * - CLS (Cumulative Layout Shift): Visual stability
 * - INP (Interaction to Next Paint): Responsiveness (replaces FID)
 * - FCP (First Contentful Paint): Loading performance
 * - LCP (Largest Contentful Paint): Loading performance
 * - TTFB (Time to First Byte): Server response time
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from "web-vitals";
import * as Sentry from "@sentry/react";

/**
 * Send Web Vital to Sentry as both a measurement and a breadcrumb
 */
function sendToSentry(metric: Metric) {
  const { name, value, rating, delta, id } = metric;

  // Send as Sentry measurement for performance monitoring
  Sentry.setMeasurement(name, value, 'millisecond');

  // Add breadcrumb for context
  Sentry.addBreadcrumb({
    category: "web-vitals",
    message: `${name}: ${value.toFixed(2)}ms (${rating})`,
    level: rating === 'good' ? 'info' : rating === 'needs-improvement' ? 'warning' : 'error',
    data: {
      name,
      value,
      rating,
      delta,
      id,
      navigationType: metric.navigationType,
    },
  });

  // Log performance issues as Sentry events for poor ratings
  if (rating === 'poor') {
    Sentry.captureMessage(`Poor Web Vital: ${name}`, {
      level: 'warning',
      tags: {
        'web-vital': name,
        'web-vital-rating': rating,
      },
      contexts: {
        'web-vitals': {
          metric: name,
          value,
          rating,
          delta,
          id,
        },
      },
    });
  }

  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.log(`[Web Vitals] ${name}:`, {
      value: `${value.toFixed(2)}ms`,
      rating,
      delta: `${delta.toFixed(2)}ms`,
    });
  }
}

/**
 * Initialize Web Vitals reporting
 * Should be called once on page load in a client component
 */
export function reportWebVitals() {
  // Cumulative Layout Shift - measures visual stability
  // Good: ≤ 0.1, Needs Improvement: 0.1-0.25, Poor: > 0.25
  onCLS(sendToSentry);

  // Interaction to Next Paint - measures responsiveness (replaces FID)
  // Good: ≤ 200ms, Needs Improvement: 200-500ms, Poor: > 500ms
  onINP(sendToSentry);

  // First Contentful Paint - measures loading performance
  // Good: ≤ 1.8s, Needs Improvement: 1.8-3s, Poor: > 3s
  onFCP(sendToSentry);

  // Largest Contentful Paint - measures loading performance
  // Good: ≤ 2.5s, Needs Improvement: 2.5-4s, Poor: > 4s
  onLCP(sendToSentry);

  // Time to First Byte - measures server response time
  // Good: ≤ 800ms, Needs Improvement: 800-1800ms, Poor: > 1800ms
  onTTFB(sendToSentry);
}

/**
 * Get current Web Vitals snapshot
 * Note: This uses the callback-based API since web-vitals doesn't provide synchronous getters
 */
export async function getWebVitals(): Promise<Record<string, number>> {
  return new Promise((resolve) => {
    const vitals: Record<string, number> = {};
    let count = 0;
    const total = 5; // CLS, INP, FCP, LCP, TTFB

    const checkComplete = () => {
      count++;
      if (count === total) {
        resolve(vitals);
      }
    };

    onCLS((metric) => { vitals.cls = metric.value; checkComplete(); });
    onINP((metric) => { vitals.inp = metric.value; checkComplete(); });
    onFCP((metric) => { vitals.fcp = metric.value; checkComplete(); });
    onLCP((metric) => { vitals.lcp = metric.value; checkComplete(); });
    onTTFB((metric) => { vitals.ttfb = metric.value; checkComplete(); });

    // Timeout after 5 seconds if not all metrics are available
    setTimeout(() => resolve(vitals), 5000);
  });
}
