import { useEffect, useState } from "react";

export const useActiveSection = (sectionIds: string[]) => {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -70% 0px", // Adjust these values to fine-tune when section is considered "active"
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }

      const visibleSections = entries.filter((entry) => entry.isIntersecting);

      if (visibleSections.length > 0) {
        const mostVisible = visibleSections.reduce((prev, current) => {
          return current.intersectionRatio > prev.intersectionRatio
            ? current
            : prev;
        });

        setActiveSection(mostVisible.target.id);
      } else {
        setActiveSection("");
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeSection;
};
