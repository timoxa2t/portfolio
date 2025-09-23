import {
  Box,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  Slider,
  Typography,
} from "@mui/material";
import { FC, RefObject, useEffect, useState, useRef } from "react";
import { Planet } from "../Planet";
import { useTranslations } from "next-intl";
import s from "./Controls.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import DirectionIcon from "@mui/icons-material/ArrowUpward";
import cn from "classnames";
import p5 from "p5";

function getRotation(movementVector: p5.Vector) {
  return movementVector.heading() * (180 / Math.PI);
}

const PlanetCard: FC<{ planet: Planet }> = ({ planet }) => {
  const t = useTranslations("planets");
  const [rotation, setRotation] = useState(() =>
    getRotation(planet.movementVector)
  );
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const updateRotation = () => {
      const newRotation = getRotation(planet.movementVector);
      // Only update if rotation changed significantly (reduces unnecessary renders)
      if (Math.abs(newRotation - rotation) > 1) {
        setRotation(newRotation);
      }
      animationFrameRef.current = requestAnimationFrame(updateRotation);
    };

    animationFrameRef.current = requestAnimationFrame(updateRotation);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [planet.movementVector, rotation]);

  return (
    <Card>
      <CardContent>
        <DirectionIcon
          sx={{
            rotate: `${rotation + 90}deg`,
            color: planet.color,
            transition: "rotate 0.1s ease-out",
          }}
        />
        <Typography variant="body1">
          {t("mass")}: {planet.mass}
        </Typography>
        <Typography variant="body1">
          {t("density")}: {planet.density}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

interface Props {
  timeSpeed: number;
  setTimeSpeed: (value: number) => void;
  tailLength: number;
  setTailLength: (value: number) => void;
  isSolidBorders: boolean;
  setIsSolidBorders: (value: boolean) => void;
  planetsRef: RefObject<Planet[]>;
}
export const Controls: FC<Props> = ({
  timeSpeed,
  setTimeSpeed,
  tailLength,
  setTailLength,
  isSolidBorders,
  setIsSolidBorders,
  planetsRef,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("planets");

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleHover = (planet: Planet) => {
    if (!planet.highlighted) {
      planet.highlighted = true;
    }
  };

  return (
    <>
      {!isOpen && (
        <Box className={s.openButton}>
          <IconButton onClick={toggleOpen}>
            <SettingsIcon />
          </IconButton>
        </Box>
      )}

      <form className={cn(s.info, { [s.isOpen]: isOpen })}>
        <Box className={s.closeButton}>
          <IconButton onClick={toggleOpen}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography id="speed-slider" gutterBottom>
          {t("speed")}
        </Typography>
        <Slider
          aria-label={t("speed")}
          value={timeSpeed}
          onChange={(_, value) => {
            Planet.timeSpeed = value as number;
            setTimeSpeed(Planet.timeSpeed);
          }}
          min={10 ** 2 * 5}
          max={10 ** 4 * 5}
          step={10 ** 3}
        />

        <Typography id="tail-slider" gutterBottom>
          {t("tail")}
        </Typography>

        <Slider
          aria-label={t("tail")}
          value={tailLength}
          onChange={(_, value) => {
            Planet.tailLength = value as number;
            setTailLength(Planet.tailLength);
          }}
          min={1}
          max={600}
          step={1}
        />

        <FormControlLabel
          checked={isSolidBorders}
          onChange={() => {
            Planet.isSolidBorders = !Planet.isSolidBorders;
            setIsSolidBorders(Planet.isSolidBorders);
          }}
          control={<Checkbox />}
          label={t("solidBorders")}
        />

        {isOpen && (
          <ul className={s.planetsList}>
            {planetsRef.current.map((planet) => (
              <li
                key={planet.position.toString()}
                onMouseEnter={() => handleHover(planet)}
              >
                <PlanetCard planet={planet} />
              </li>
            ))}
          </ul>
        )}
      </form>
    </>
  );
};
