"use client";

import { FC } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Link,
} from "@mui/material";
import { useTranslations } from "next-intl";
import s from "./Projects.module.scss";

export const Projects: FC = () => {
  const t = useTranslations("projects");

  const projects = [
    {
      id: 1,
      title: "todo.title",
      description: "todo.description",
      technologies: ["React", "Node.js"],
      image: "/assets/images/projects/todo.png",
      demoUrl: "https://timoxa2t.github.io/todo-app/",
      codeUrl: "https://github.com/timoxa2t/todo-app",
    },
    {
      id: 2,
      title: "landing.title",
      description: "landing.description",
      technologies: ["React", "Node", "Sequelize"],
      image: "/assets/images/projects/landing.png",
      demoUrl: "https://fe-jan-23-breaking-bad-code.github.io/product_catalog/",
      codeUrl: "https://github.com/fe-jan-23-Breaking-Bad-Code/product_catalog",
    },
    {
      id: 3,
      title: "planets.title",
      description: "planets.description",
      technologies: ["p5.js"],
      image: "/assets/images/projects/planets.png",
      demoUrl: "/projects/planets",
    },
  ];

  return (
    <section className={s.projects} id="projects">
      <Box className={"container"}>
        <Box className={s.content}>
          <Typography variant="h2" className={s.title}>
            {t("title", { default: "My Projects" })}
          </Typography>
          <Grid container spacing={4}>
            {projects.map((project) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.id}>
                <Card className={s.projectCard}>
                  <CardMedia
                    component="div"
                    className={s.projectImage}
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  <CardContent
                    className={s.projectContent}
                    sx={{ padding: "1.5rem !important" }}
                  >
                    <Typography variant="h5" className={s.projectTitle}>
                      {t(project.title)}
                    </Typography>
                    <Typography
                      variant="body2"
                      className={s.projectDescription}
                    >
                      {t(project.description)}
                    </Typography>
                    <Box className={s.technologies}>
                      {project.technologies.map((tech) => (
                        <Chip
                          key={tech}
                          label={tech}
                          size="small"
                          className={s.techChip}
                        />
                      ))}
                    </Box>
                    <Box className={s.projectActions}>
                      <Link
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={s.demoButton}
                      >
                        {t("demo", { default: "Demo" })}
                      </Link>
                      {project.codeUrl && (
                        <Link
                          href={project.codeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={s.codeButton}
                        >
                          {t("code", { default: "Code" })}
                        </Link>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </section>
  );
};
