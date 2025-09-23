"use client";

import { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import s from "./Skills.module.scss";
import { SkillItem } from "@/components/SkillItem/SkillItem";

export const Skills: FC = () => {
  const t = useTranslations("skills");

  const frontendSkills = [
    {
      name: "React",
      icon: "assets/icons/react.svg",
      skill: 9,
    },
    {
      name: "Next.js",
      icon: "assets/icons/nextjs.svg",
      skill: 8,
    },
    {
      name: "TypeScript",
      icon: "assets/icons/ts.svg",
      skill: 8,
    },
    {
      name: "JavaScript",
      icon: "assets/icons/js.svg",
      skill: 9,
    },
    // {
    //   name: "HTML5",
    //   icon: "assets/icons/html.svg",
    //   skill: 8,
    // },
    // {
    //   name: "CSS3",
    //   icon: "assets/icons/css.svg",
    //   skill: 7,
    // },
    {
      name: "SCSS",
      icon: "assets/icons/scss.svg",
      skill: 8,
    },
    {
      name: "Bootstrap",
      icon: "assets/icons/bootstrap.svg",
      skill: 6,
    },
    {
      name: "MUI",
      icon: "assets/icons/mui.svg",
      skill: 8,
    },
    {
      name: "MV3 extensions",
      icon: "assets/icons/extensions.svg",
      skill: 7,
    },
  ];
  const backendSkills = [
    {
      name: "Node.js",
      icon: "assets/icons/node.svg",
      skill: 8,
    },
    {
      name: "NestJS",
      icon: "assets/icons/nestjs.svg",
      skill: 4,
    },
    {
      name: "Express",
      icon: "assets/icons/express.svg",
      skill: 7,
    },
    {
      name: "Python",
      icon: "assets/icons/python.svg",
      skill: 4,
    },
    {
      name: "PostgreSQL",
      icon: "assets/icons/postgresql.svg",
      skill: 6,
    },
    {
      name: "Prisma",
      icon: "assets/icons/prisma.svg",
      skill: 5,
    },
    {
      name: "socket.io",
      icon: "assets/icons/socketio.svg",
      skill: 5,
    },
  ];
  const tools = [
    {
      name: "Git",
      icon: "assets/icons/git.svg",
      skill: 8,
    },
    {
      name: "Docker",
      icon: "assets/icons/docker.svg",
      skill: 5,
    },
    {
      name: "WebStorm",
      icon: "assets/icons/webstorm.svg",
      skill: 6,
    },
    {
      name: "VS Code",
      icon: "assets/icons/vscode.svg",
      skill: 8,
    },
    {
      name: "Figma",
      icon: "assets/icons/figma.svg",
      skill: 6,
    },
    {
      name: "Postman",
      icon: "assets/icons/postman.svg",
      skill: 7,
    },
  ];

  return (
    <section className={s.skills} id="skills">
      <Box className={"container"}>
        <Box className={s.content}>
          <Typography variant="h2" className={s.title}>
            {t("title", { default: "Skills & Technologies" })}
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box className={s.skillCategory}>
                <Typography variant="h4" className={s.categoryTitle}>
                  {t("frontend.title", { default: "Frontend" })}
                </Typography>
                <Box className={s.skillTags}>
                  {frontendSkills.map((skill) => (
                    <SkillItem
                      key={skill.name}
                      name={skill.name}
                      icon={skill.icon}
                      level={skill.skill}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box className={s.skillCategory}>
                <Typography variant="h4" className={s.categoryTitle}>
                  {t("backend.title", { default: "Backend" })}
                </Typography>
                <Box className={s.skillTags}>
                  {backendSkills.map((skill) => (
                    <SkillItem
                      key={skill.name}
                      name={skill.name}
                      icon={skill.icon}
                      level={skill.skill}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box className={s.skillCategory}>
                <Typography variant="h4" className={s.categoryTitle}>
                  {t("tools.title", { default: "Tools" })}
                </Typography>
                <Box className={s.skillTags}>
                  {tools.map((skill) => (
                    <SkillItem
                      key={skill.name}
                      name={skill.name}
                      icon={skill.icon}
                      level={skill.skill}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </section>
  );
};
