"use client";

import { FC, RefObject, useEffect, useRef, useState } from "react";
import s from "./P5Wrapper.module.scss";
import type p5 from "p5";

interface Props extends Partial<Omit<p5, "setup" | "draw">> {
  setup: (p: p5) => void;
  draw: (p: p5) => void;
  disableOutsideClick?: boolean;
  passThroughElements?: RefObject<HTMLElement | null>[];
}

function clickWrapper(
  p: p5,
  container: RefObject<HTMLDivElement | null>,
  handler: (p: p5) => void,
  passThroughElements: RefObject<HTMLElement | null>[]
) {
  return () => {
    if (!container.current) return;
    const canvas = container.current.querySelector("canvas");
    if (!canvas) return;

    // Check if the event target is the canvas or if we're within canvas bounds
    const rect = canvas.getBoundingClientRect();

    // Also check if there are no overlaid elements at the mouse position
    const elementAtPoint = document.elementFromPoint(
      rect.left + p.mouseX,
      rect.top + p.mouseY
    );
    const isCanvasTarget =
      elementAtPoint === canvas ||
      canvas.contains(elementAtPoint) ||
      passThroughElements.some((element) =>
        element.current?.contains(elementAtPoint)
      );

    // Only call original handler if clicking on canvas
    if (isCanvasTarget) {
      handler(p);
    }
  };
}

export const P5Wrapper: FC<Props> = ({
  setup,
  draw,
  disableOutsideClick = true,
  passThroughElements = [],
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!setup || !draw || isLoaded || !isMounted) return;

    console.log("isLoaded", isLoaded);
    let instance: p5 | null = null;

    const loadP5AndCreateSketch = async () => {
      const P5 = (await import("p5")).default;

      const sketch = (p: p5) => {
        p.setup = () => setup(p);
        p.draw = () => draw(p);

        if (disableOutsideClick) {
          if (props.mousePressed) {
            p.mousePressed = clickWrapper(
              p,
              containerRef,
              props.mousePressed,
              passThroughElements
            );
          }

          if (props.mouseReleased) {
            p.mouseReleased = clickWrapper(
              p,
              containerRef,
              props.mouseReleased,
              passThroughElements
            );
          }
        }

        Object.entries(props).forEach(([key, value]) => {
          if (
            !disableOutsideClick ||
            !["mousePressed", "mouseReleased"].includes(key)
          ) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            p[key as keyof p5] = () => value(p);
          }
        });
      };

      if (containerRef.current && !p5InstanceRef.current) {
        instance = new P5(sketch, containerRef.current);
        p5InstanceRef.current = instance;
      }

      setIsLoaded(true);
    };

    loadP5AndCreateSketch();
  }, [
    setup,
    draw,
    isLoaded,
    isMounted,
    props,
    disableOutsideClick,
    passThroughElements,
  ]);

  useEffect(() => {
    if (!isLoaded || !p5InstanceRef.current) return;

    const p = p5InstanceRef.current;
    if (p.draw !== draw) {
      p.draw = () => draw(p);
    }
  }, [draw, isLoaded]);

  return (
    <div
      ref={containerRef}
      className={s.p5Canvas}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
