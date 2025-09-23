import {
  onCLS,
  onFCP,
  onINP,
  onLCP,
  onTTFB,
  type CLSMetric,
  type FCPMetric,
  type INPMetric,
  type LCPMetric,
  type TTFBMetric,
} from "web-vitals";

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  timestamp: number;
}

export interface CustomMetric {
  name: string;
  value: number;
  timestamp: number;
}

// Declare gtag function for TypeScript
declare global {
  function gtag(
    command: string,
    targetId: string,
    config: Record<string, unknown>
  ): void;
}

// Web Vitals thresholds
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  INP: { good: 200, poor: 500 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

// Rate metric based on thresholds
function getRating(
  name: string,
  value: number
): "good" | "needs-improvement" | "poor" {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return "good";

  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

// Send metric to analytics service
function sendToAnalytics(metric: PerformanceMetric) {
  // Only run on client side
  if (typeof window === "undefined") return;

  // In production, send to your analytics service
  // For now, we'll log to console and localStorage
  console.log("Performance Metric:", metric);

  // Store in localStorage for debugging
  const existingMetrics = JSON.parse(
    localStorage.getItem("performanceMetrics") || "[]"
  );
  existingMetrics.push(metric);
  localStorage.setItem("performanceMetrics", JSON.stringify(existingMetrics));

  // Send to analytics service (replace with your service)
  if (typeof gtag !== "undefined") {
    gtag("event", "web_vitals", {
      event_category: "performance",
      event_label: metric.name,
      value: Math.round(metric.value),
      custom_parameter_1: metric.rating,
    });
  }
}

// Initialize Web Vitals tracking
export function initWebVitals() {
  // Only run on client side
  if (typeof window === "undefined") return;

  const getTimestamp = () => Date.now();

  onCLS((metric: CLSMetric) => {
    sendToAnalytics({
      name: "CLS",
      value: metric.value,
      rating: getRating("CLS", metric.value),
      timestamp: getTimestamp(),
    });
  });

  onFCP((metric: FCPMetric) => {
    sendToAnalytics({
      name: "FCP",
      value: metric.value,
      rating: getRating("FCP", metric.value),
      timestamp: getTimestamp(),
    });
  });

  onINP((metric: INPMetric) => {
    sendToAnalytics({
      name: "INP",
      value: metric.value,
      rating: getRating("INP", metric.value),
      timestamp: getTimestamp(),
    });
  });

  onLCP((metric: LCPMetric) => {
    sendToAnalytics({
      name: "LCP",
      value: metric.value,
      rating: getRating("LCP", metric.value),
      timestamp: getTimestamp(),
    });
  });

  onTTFB((metric: TTFBMetric) => {
    sendToAnalytics({
      name: "TTFB",
      value: metric.value,
      rating: getRating("TTFB", metric.value),
      timestamp: getTimestamp(),
    });
  });
}

// Track custom performance metrics
export function trackCustomMetric(name: string, value: number) {
  // Only run on client side
  if (typeof window === "undefined") return;

  const metric: CustomMetric = {
    name,
    value,
    timestamp: Date.now(),
  };

  console.log("Custom Metric:", metric);

  // Store in localStorage
  const existingMetrics = JSON.parse(
    localStorage.getItem("customMetrics") || "[]"
  );
  existingMetrics.push(metric);
  localStorage.setItem("customMetrics", JSON.stringify(existingMetrics));

  // Send to analytics
  if (typeof gtag !== "undefined") {
    gtag("event", "custom_metric", {
      event_category: "performance",
      event_label: name,
      value: Math.round(value),
    });
  }
}

// Performance utilities
export const performanceUtils = {
  // Measure function execution time
  measureFunction: <T extends (...args: unknown[]) => unknown>(
    fn: T,
    name: string
  ): T => {
    return ((...args: unknown[]) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();

      trackCustomMetric(`${name}_execution_time`, end - start);
      return result;
    }) as T;
  },

  // Measure async function execution time
  measureAsyncFunction: <T extends (...args: unknown[]) => Promise<unknown>>(
    fn: T,
    name: string
  ): T => {
    return (async (...args: unknown[]) => {
      const start = performance.now();
      const result = await fn(...args);
      const end = performance.now();

      trackCustomMetric(`${name}_execution_time`, end - start);
      return result;
    }) as T;
  },

  // Measure component render time
  measureRender: (componentName: string) => {
    return {
      start: () => {
        performance.mark(`${componentName}_render_start`);
      },
      end: () => {
        performance.mark(`${componentName}_render_end`);
        performance.measure(
          `${componentName}_render`,
          `${componentName}_render_start`,
          `${componentName}_render_end`
        );

        const measure = performance.getEntriesByName(
          `${componentName}_render`
        )[0];
        if (measure) {
          trackCustomMetric(`${componentName}_render_time`, measure.duration);
        }
      },
    };
  },

  // Get performance metrics summary
  getMetricsSummary: () => {
    const performanceMetrics = JSON.parse(
      localStorage.getItem("performanceMetrics") || "[]"
    );
    const customMetrics = JSON.parse(
      localStorage.getItem("customMetrics") || "[]"
    );

    return {
      webVitals: performanceMetrics,
      custom: customMetrics,
      summary: {
        totalMetrics: performanceMetrics.length + customMetrics.length,
        goodMetrics: performanceMetrics.filter(
          (m: PerformanceMetric) => m.rating === "good"
        ).length,
        poorMetrics: performanceMetrics.filter(
          (m: PerformanceMetric) => m.rating === "poor"
        ).length,
      },
    };
  },
};

// Export for dev tools
if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).performanceUtils =
    performanceUtils;
}
