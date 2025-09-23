# 🚀 Performance Monitoring Setup

This portfolio website includes a comprehensive performance monitoring system to track and optimize performance metrics. Here's how to use it:

## 📊 Features

- **Web Vitals Tracking**: Automatic tracking of Core Web Vitals (CLS, FCP, LCP, INP, TTFB)
- **Bundle Analysis**: Analyze bundle size and dependencies
- **Lighthouse Integration**: Automated performance testing
- **Custom Metrics**: Track custom performance metrics
- **Real-time Monitoring**: Track performance in development and production
- **Performance Reports**: Generate detailed performance reports

## 🛠️ Available Scripts

### Basic Commands

```bash
# Analyze bundle size
npm run analyze

# Run Lighthouse test
npm run lighthouse

# Run Lighthouse CI
npm run lighthouse:ci

# Run performance monitoring
npm run perf:monitor

# Full performance test (build + start + lighthouse)
npm run perf:test

# Analyze bundle with bundle analyzer
npm run bundle:analyze
```

## 📈 Web Vitals Integration

The performance monitoring system automatically tracks:

- **CLS (Cumulative Layout Shift)**: Measures visual stability
- **FCP (First Contentful Paint)**: Time to first content
- **LCP (Largest Contentful Paint)**: Time to main content
- **INP (Interaction to Next Paint)**: Responsiveness measure
- **TTFB (Time to First Byte)**: Server response time

### Usage in Components

```tsx
import { performanceUtils } from "@/utils/performance";

// Measure component render time
const MyComponent = () => {
  const renderMeasure = performanceUtils.measureRender("MyComponent");

  useEffect(() => {
    renderMeasure.start();
    // Component logic
    renderMeasure.end();
  }, []);

  return <div>Content</div>;
};

// Measure function execution time
const optimizedFunction = performanceUtils.measureFunction(
  myFunction,
  "myFunction"
);

// Measure async function execution time
const optimizedAsyncFunction = performanceUtils.measureAsyncFunction(
  myAsyncFunction,
  "myAsyncFunction"
);
```

## 🔧 Configuration

### Lighthouse CI Configuration (`lighthouserc.json`)

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop",
        "chromeFlags": "--no-sandbox --disable-dev-shm-usage"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.8 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["warn", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["warn", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

### Performance Thresholds

The system uses these thresholds for rating metrics:

| Metric | Good    | Needs Improvement | Poor    |
| ------ | ------- | ----------------- | ------- |
| CLS    | ≤ 0.1   | ≤ 0.25            | > 0.25  |
| FCP    | ≤ 1.8s  | ≤ 3.0s            | > 3.0s  |
| LCP    | ≤ 2.5s  | ≤ 4.0s            | > 4.0s  |
| INP    | ≤ 200ms | ≤ 500ms           | > 500ms |
| TTFB   | ≤ 800ms | ≤ 1.8s            | > 1.8s  |

## 📱 Monitoring in Development

### Real-time Monitoring

Performance metrics are automatically tracked when the app runs. Check the browser console for performance logs.

### Local Storage Data

Performance data is stored locally for debugging:

```javascript
// View performance metrics
console.log(performanceUtils.getMetricsSummary());

// View stored metrics
localStorage.getItem("performanceMetrics");
localStorage.getItem("customMetrics");
```

## 🚀 Production Monitoring

### Google Analytics Integration

The system includes Google Analytics integration for production monitoring:

```javascript
// Metrics are automatically sent to Google Analytics
// when gtag is available
gtag("event", "web_vitals", {
  event_category: "performance",
  event_label: metric.name,
  value: Math.round(metric.value),
});
```

### Custom Analytics Service

Replace the `sendToAnalytics` function in `src/utils/performance.ts` with your preferred analytics service:

```javascript
function sendToAnalytics(metric) {
  // Replace with your analytics service
  // Examples: Vercel Analytics, Plausible, etc.
  yourAnalyticsService.track("performance_metric", metric);
}
```

## 📊 Performance Reports

### Generated Reports

Reports are saved to `/performance-reports/` and include:

- Timestamp and URL
- All Core Web Vitals metrics
- Performance scores
- Automated recommendations
- Detailed metric breakdowns

### Report Structure

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "url": "http://localhost:3000",
  "metrics": {
    "first-contentful-paint": {
      "score": 0.95,
      "numericValue": 1200,
      "displayValue": "1.2 s"
    }
  },
  "summary": {
    "performanceScore": 0.92,
    "recommendations": ["..."]
  }
}
```

## 🎯 Performance Optimization Tips

### Image Optimization

```tsx
import Image from "next/image";

// Optimized image loading
<Image
  src="/my-image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={true} // For above-the-fold images
  loading="lazy" // For below-the-fold images
/>;
```

### Bundle Optimization

```javascript
// Dynamic imports for code splitting
const MyComponent = lazy(() => import("./MyComponent"));

// Lazy load heavy libraries
const heavyLibrary = await import("heavy-library");
```

### Performance Best Practices

1. **Optimize Images**: Use WebP/AVIF formats, proper sizing
2. **Code Splitting**: Implement dynamic imports
3. **Minimize Bundle Size**: Remove unused dependencies
4. **Optimize CSS**: Use critical CSS, minimize unused styles
5. **Service Worker**: Implement caching strategies
6. **CDN**: Use CDN for static assets

## 🔧 Troubleshooting

### Common Issues

1. **Chrome not found**: Install Chrome or set `CHROME_PATH` environment variable
2. **Port conflicts**: Ensure port 3000 is available for testing
3. **Lighthouse errors**: Check that the development server is running

### Debug Mode

Enable debug logging by setting environment variables:

```bash
DEBUG=lighthouse:* npm run lighthouse
```

## 📝 Continuous Integration

### GitHub Actions Example

```yaml
name: Performance Tests
on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Start server
        run: npm start &
      - name: Run Lighthouse CI
        run: npm run lighthouse:ci
```

## 🎉 Success Metrics

Target performance scores:

- **Performance Score**: 90+
- **Accessibility Score**: 95+
- **Best Practices Score**: 90+
- **SEO Score**: 95+
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

---
