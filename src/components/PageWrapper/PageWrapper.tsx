"use client";
import s from "./PageWrapper.module.scss";
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { FC, PropsWithChildren } from "react";

interface Props {
  hasHeader?: boolean;
  hasFooter?: boolean;
}

export const PageWrapper: FC<PropsWithChildren<Props>> = ({
  children,
  hasHeader = true,
  hasFooter = true,
}) => {
  return (
    <div className={s.page}>
      {hasHeader && <Header />}
      <main className={s.main}>{children}</main>
      {hasFooter && <Footer />}
    </div>
  );
};
