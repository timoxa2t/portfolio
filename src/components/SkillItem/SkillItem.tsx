import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { FC } from "react";
import s from "./SkillItem.module.scss";

interface Props {
  name: string;
  icon: string;
  level: number;
}

export const SkillItem: FC<Props> = ({ name, icon, level }) => {
  return (
    <Card key={name} className={s.card}>
      <CardContent className={s.cardContent}>
        <Image
          src={icon}
          alt={name}
          width={48}
          height={48}
          className={s.skillIcon}
        />
        <Typography variant="body1">{name}</Typography>

        <Box className={s.skillLevel}>
          <Box
            className={s.skillLevelBar}
            style={{ width: `${level * 10}%` }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
