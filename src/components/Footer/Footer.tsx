import s from "./Footer.module.scss";
import cn from "classnames";

export const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={cn("container", s.container)}>
        <div className={cn(s.copyright, "small")}>
          © 2025 Portfolio. All rights reserved.
        </div>
        {/* <div className="d-flex gap-3">
          <a href="#" className={`${s.link} small`}>
            Privacy
          </a>
          <a href="#" className={`${s.link} small`}>
            Terms
          </a>
          <a href="#" className={`${s.link} small`}>
            Contact
          </a>
        </div> */}
      </div>
    </footer>
  );
};
