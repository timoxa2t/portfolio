"use client";

import { FC, RefObject, useCallback, useEffect, useRef, useState } from "react";
import s from "./Planets.module.scss";
import type p5 from "p5";
import { P5Wrapper } from "@/components/p5Wrapper/p5Wrapper";
import solarSystem from "./solarSystem.json";
import { Planet, ZOOM } from "./Planet";
import { useTranslations } from "next-intl";
import { Box, Typography } from "@mui/material";
import { Controls } from "./components/Controls";

interface PlanetsProps {
  controls?: boolean;
  passThroughElements?: RefObject<HTMLElement | null>[];
}

export const Planets: FC<PlanetsProps> = ({
  controls = false,
  passThroughElements,
}) => {
  const t = useTranslations("planets");
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasSetupRun = useRef(false);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const vectorBasisRef = useRef<p5.Vector | null>(null);
  const selectedPlanetRef = useRef<Planet | null>(null);
  const [timeSpeed, setTimeSpeed] = useState(Planet.timeSpeed);
  const [tailLength, setTailLength] = useState(Planet.tailLength);
  const [isSolidBorders, setIsSolidBorders] = useState(Planet.isSolidBorders);
  const [isInteracted, setIsInteracted] = useState(false);
  const planets = useRef<Planet[]>([]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isMousePressed && selectedPlanetRef.current) {
      intervalId = setInterval(() => {
        if (selectedPlanetRef.current) {
          selectedPlanetRef.current.increase();
        }
      }, 50);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isMousePressed]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setScreenSize({
      width: container.clientWidth,
      height: container.clientHeight,
    });

    const resizeObserver = new ResizeObserver(() => {
      setScreenSize({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const setup = useCallback(
    (p: p5) => {
      if (!screenSize || !containerRef.current || hasSetupRun.current) return;
      const originalPlanets = solarSystem.map((planet) => {
        const center = {
          x: screenSize.width / ZOOM / 2,
          y: screenSize.height / ZOOM / 2,
        };

        const position = p.createVector(
          planet.position[0] + center.x,
          planet.position[1] + center.y
        );

        return new Planet({
          ...planet,
          position,
          movementVector: p.createVector(...planet.movementVector),
        });
      });
      planets.current = originalPlanets;

      p.createCanvas(screenSize.width, screenSize.height);
      p.scale(ZOOM);
      hasSetupRun.current = true;
    },

    [screenSize]
  );

  const draw = useCallback(
    (p: p5) => {
      p.background(0);
      p.scale(ZOOM);

      for (const planet of planets.current) {
        const gravitationDisplacement = planet.getGravityVector(
          planets.current,
          p
        );

        planet.accelerate(gravitationDisplacement);

        planet.draw(p);
        Planet.checkColision(planets.current);

        if (vectorBasisRef.current) {
          p.stroke(255);
          p.strokeWeight(3);
          p.line(
            p.mouseX / ZOOM,
            p.mouseY / ZOOM,
            vectorBasisRef.current.x,
            vectorBasisRef.current.y
          );
        }
      }

      Planet.resetTailInterval = false;
      planets.current = planets.current.filter((planet) => !planet.isDeleted);
    },
    [planets]
  );

  const onMousePressed = useCallback(
    (p: p5) => {
      if (!isInteracted) {
        setIsInteracted(true);
      }

      const planet = planets.current.find((planet) => {
        return planet.isIntersect(
          p.createVector(p.mouseX, p.mouseY).div(ZOOM),
          200
        );
      });

      setIsMousePressed(true);
      if (planet) {
        selectedPlanetRef.current = planet; // Store reference to selected planet
      } else {
        vectorBasisRef.current = p.createVector(p.mouseX, p.mouseY).div(ZOOM);
      }
    },
    [isInteracted, planets]
  );

  const onMouseReleased = (p: p5) => {
    if (vectorBasisRef.current) {
      const mouseVector = p.createVector(p.mouseX, p.mouseY).div(ZOOM);
      const movementVector = mouseVector
        .sub(vectorBasisRef.current || mouseVector)
        .div(ZOOM * 10 ** 7 * 5);

      const newPlanet = new Planet({
        mass: 1000,
        density: 0.01,
        color: p.color(p.random(255), p.random(255), p.random(255)).toString(),
        position: vectorBasisRef.current || mouseVector,
        movementVector,
      });
      planets.current = [...planets.current, newPlanet];
      vectorBasisRef.current = null;
    }

    setIsMousePressed(false);
    selectedPlanetRef.current = null;
  };

  return (
    <div
      className={s.container}
      ref={containerRef}
      style={{ cursor: isMousePressed ? "grabbing" : "pointer" }}
    >
      {screenSize && (
        <P5Wrapper
          setup={setup}
          draw={draw}
          mousePressed={onMousePressed}
          mouseReleased={onMouseReleased}
          passThroughElements={passThroughElements}
        />
      )}

      {controls && (
        <Controls
          timeSpeed={timeSpeed}
          setTimeSpeed={setTimeSpeed}
          tailLength={tailLength}
          setTailLength={setTailLength}
          isSolidBorders={isSolidBorders}
          setIsSolidBorders={setIsSolidBorders}
          planetsRef={planets}
        />
      )}
      {controls && !isInteracted && (
        <Box className={s.instructions}>
          <Typography>{t("instruction1")}</Typography>
          <Typography>{t("instruction2")}</Typography>
        </Box>
      )}
    </div>
  );
};
