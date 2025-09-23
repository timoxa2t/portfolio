/* eslint-disable @typescript-eslint/no-require-imports */
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const fs = require("fs");
const path = require("path");

// Performance monitoring configuration
const CONFIG = {
  url: "http://localhost:3000",
  outputDir: "./performance-reports",
  metrics: [
    "first-contentful-paint",
    "largest-contentful-paint",
    "cumulative-layout-shift",
    "total-blocking-time",
    "speed-index",
  ],
};

// Create output directory if it doesn't exist
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

// Format metrics for reporting
function formatMetrics(lhr) {
  const metrics = {};

  CONFIG.metrics.forEach((metric) => {
    const audit = lhr.audits[metric];
    if (audit) {
      metrics[metric] = {
        score: audit.score,
        numericValue: audit.numericValue,
        displayValue: audit.displayValue,
        description: audit.description,
      };
    }
  });

  return metrics;
}

// Generate performance report
function generateReport(metrics, timestamp) {
  const report = {
    timestamp,
    url: CONFIG.url,
    metrics,
    summary: {
      performanceScore: metrics["speed-index"]?.score || 0,
      recommendations: [],
    },
  };

  // Add recommendations based on metrics
  if (metrics["first-contentful-paint"]?.score < 0.5) {
    report.summary.recommendations.push(
      "Improve First Contentful Paint by optimizing critical resources"
    );
  }

  if (metrics["largest-contentful-paint"]?.score < 0.5) {
    report.summary.recommendations.push(
      "Optimize Largest Contentful Paint by reducing server response times"
    );
  }

  if (metrics["cumulative-layout-shift"]?.score < 0.5) {
    report.summary.recommendations.push(
      "Reduce Cumulative Layout Shift by adding size attributes to images"
    );
  }

  return report;
}

// Save report to file
function saveReport(report) {
  const filename = `performance-report-${report.timestamp}.json`;
  const filepath = path.join(CONFIG.outputDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
  console.log(`📊 Performance report saved to: ${filepath}`);

  // Also save a latest report
  const latestPath = path.join(CONFIG.outputDir, "latest-report.json");
  fs.writeFileSync(latestPath, JSON.stringify(report, null, 2));
}

// Main performance monitoring function
async function runPerformanceMonitor() {
  console.log("🚀 Starting performance monitoring...");
  console.log(`📍 Testing URL: ${CONFIG.url}`);

  try {
    // Launch Chrome
    const chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
    });

    // Run Lighthouse
    const options = {
      logLevel: "info",
      output: "json",
      port: chrome.port,
      onlyCategories: ["performance"],
    };

    const runnerResult = await lighthouse(CONFIG.url, options);

    // Close Chrome
    await chrome.kill();

    // Process results
    const lhr = runnerResult.lhr;
    const metrics = formatMetrics(lhr);
    const timestamp = new Date().toISOString();

    // Generate and save report
    const report = generateReport(metrics, timestamp);
    saveReport(report);

    // Display summary
    console.log("\n📈 Performance Summary:");
    console.log("=======================");
    console.log(
      `Performance Score: ${Math.round(
        lhr.categories.performance.score * 100
      )}/100`
    );
    console.log(
      `First Contentful Paint: ${
        metrics["first-contentful-paint"]?.displayValue || "N/A"
      }`
    );
    console.log(
      `Largest Contentful Paint: ${
        metrics["largest-contentful-paint"]?.displayValue || "N/A"
      }`
    );
    console.log(
      `Cumulative Layout Shift: ${
        metrics["cumulative-layout-shift"]?.displayValue || "N/A"
      }`
    );
    console.log(
      `Total Blocking Time: ${
        metrics["total-blocking-time"]?.displayValue || "N/A"
      }`
    );
    console.log(
      `Speed Index: ${metrics["speed-index"]?.displayValue || "N/A"}`
    );

    if (report.summary.recommendations.length > 0) {
      console.log("\n💡 Recommendations:");
      report.summary.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }

    console.log("\n✅ Performance monitoring complete!");
  } catch (error) {
    console.error("❌ Error running performance monitor:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runPerformanceMonitor();
}

module.exports = { runPerformanceMonitor };
