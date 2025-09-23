import Link from "next/link";
import { FC } from "react";
import cn from "classnames";
import s from "./CustomLink.module.scss";

interface Props {
  href: string;
  className?: string;
  children: React.ReactNode;
  isActive?: boolean;
}

export const CustomLink: FC<Props> = ({
  href,
  className,
  children,
  isActive,
}) => {
  return (
    <Link href={href} className={cn(s.link, className, isActive && s.active)}>
      <span className={s.text}>{children}</span>
    </Link>
  );
};
