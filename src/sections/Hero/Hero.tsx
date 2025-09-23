"use client";

import { FC, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useTranslations } from "next-intl";
import s from "./Hero.module.scss";
import { Planets } from "@/modules/Planets/Planets";
import cn from "classnames";

export const Hero: FC = () => {
  const t = useTranslations("hero");
  const planetsContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section className={s.hero} id="hero" ref={planetsContainerRef}>
      <Box className={cn(s.container, "container")}>
        <Box className={s.content}>
          <Box>
            <Typography variant="h4" className={s.title}>
              Tymoshov Oleksandr
            </Typography>
            <Typography variant="h3" className={s.subtitle}>
              Fullstack Developer
            </Typography>
          </Box>

          <Box className={s.actions}>
            <Link href="#projects" className={s.primaryButton}>
              {t("cta.primary", { default: "View My Work" })}
            </Link>
            <Link href="#contact" className={s.secondaryButton}>
              {t("cta.secondary", { default: "Contact Me" })}
            </Link>
          </Box>
        </Box>
      </Box>

      <Box className={s.planetsContainer}>
        <Planets passThroughElements={[planetsContainerRef]} />
      </Box>
    </section>
  );
};
