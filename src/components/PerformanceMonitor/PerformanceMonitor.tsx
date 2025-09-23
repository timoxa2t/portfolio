"use client";

import { useEffect, useState } from "react";
import { initWebVitals } from "@/utils/performance";

export const PerformanceMonitor = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Initialize Web Vitals tracking only on client
    initWebVitals();

    // Add any additional performance monitoring setup here
    console.log("Performance monitoring initialized");
  }, [isMounted]);

  // This component doesn't render anything visible
  return null;
};
