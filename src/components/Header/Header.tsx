"use client";
import { useState } from "react";
import { Box, Drawer, IconButton, MenuItem, Select } from "@mui/material";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import s from "./Header.module.scss";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { CustomLink } from "../CustomLink/CustomLink";
import cn from "classnames";
import { useActiveSection } from "@/hooks/useActiveSection";

const sections = ["about", "skills", "projects", "contact"];

export const Header = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations("sections");

  const activeSection = useActiveSection(sections);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleChangeLanguage = (language: string) => {
    router.replace(pathname, { locale: language });
  };

  return (
    <header className={s.header}>
      <div className={cn(s.container, "container")}>
        <Link href="/" className={s.logo}>
          <Image src="/logo.svg" alt="logo" width={42} height={42} />
        </Link>

        <div className="d-flex align-items-center gap-4 h-100">
          <div className={s.linksContainer}>
            {sections.map((section) => (
              <CustomLink
                href={`/#${section}`}
                key={section}
                isActive={activeSection === section}
                className={s.headerLink}
              >
                {t(section)}
              </CustomLink>
            ))}
          </div>

          <IconButton onClick={toggleDrawer(true)} aria-label="Open menu">
            <MenuIcon className={s.menuButton} />
          </IconButton>
        </div>
      </div>

      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        <Box className={s.sideBar}>
          <div className={`${s.closeButton} p-3 mb-3`}>
            <IconButton onClick={toggleDrawer(false)} aria-label="Close menu">
              <CloseIcon />
            </IconButton>
          </div>

          <div className="px-3">
            <Select
              value={locale}
              onChange={(e) => handleChangeLanguage(e.target.value)}
              fullWidth
              variant="outlined"
              aria-label="Select language"
            >
              {routing.locales.map((locale) => (
                <MenuItem key={locale} value={locale}>
                  {locale.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </div>
        </Box>
      </Drawer>
    </header>
  );
};
