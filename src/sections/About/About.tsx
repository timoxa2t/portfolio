"use client";

import { FC } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { useTranslations } from "next-intl";
import s from "./About.module.scss";
import Image from "next/image";

export const About: FC = () => {
  const t = useTranslations("about");

  return (
    <section className={s.about} id="about">
      <Box className={"container"}>
        <Box className={s.content}>
          <Typography variant="h3" className={s.title}>
            {t("title", { default: "About Me" })}
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Box className={s.imageContainer}>
                <Image
                  src="/assets/images/profile_picture.jpg"
                  alt={t("imageAlt", { default: "Profile Picture" })}
                  width={200}
                  height={200}
                  className={s.image}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <Box className={s.textContent}>
                <Typography variant="body1" className={s.description}>
                  {t("description")}
                </Typography>
              </Box>

              <Box className={s.highlights}>
                <Card className={s.card}>
                  <CardContent>
                    <Typography variant="h6" className={s.cardTitle}>
                      {t("experience.title")}
                    </Typography>
                    <Typography variant="body2" className={s.cardDescription}>
                      {t("experience.description")}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </section>
  );
};
