import { useEffect } from "react";
import { Link } from "react-router-dom";
import { css, cx } from "@emotion/css";
import { motion } from "motion/react";

import { rise, useSoftMotion } from "./motion";
import { readLanguage } from "../preferences";
import { translations } from "./translations";

import logo_minimal from "../assets/logo_minimal.svg";

type LegalPageProps = {
  page: "privacy" | "terms";
};

const page_style = css({
  minHeight: "100vh",
  boxSizing: "border-box",
  padding: "32px 80px 80px",
  background: "var(--bg-page)",
  color: "var(--text-main)",

  "@media (max-width: 768px)": {
    padding: "24px 24px 64px",
  },
});

const top_bar = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "48px",

  "& a": {
    color: "var(--text-muted)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 600,
  },
});

const brand = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "var(--text-main)",
  textDecoration: "none",
  fontWeight: 800,

  "& img": {
    height: "24px",
    width: "24px",
  },
});

const article = css({
  maxWidth: "720px",

  "& h1": {
    margin: "0 0 24px",
    fontFamily: '"Playfair Display", serif',
    fontSize: "40px",
    fontWeight: 500,
    lineHeight: 1.15,
  },

  "& p": {
    margin: "0 0 16px",
    color: "var(--text-muted)",
    fontSize: "16px",
    lineHeight: 1.6,
  },

  "@media (max-width: 768px)": {
    "& h1": {
      fontSize: "32px",
    },
  },
});

function LegalPage({ page }: LegalPageProps) {
  const language = readLanguage();
  const t = translations[language];
  const copy = page === "privacy" ? t.legal.privacy : t.legal.terms;
  const { reveal } = useSoftMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <main className={cx("font-onest", page_style)}>
      <div className={top_bar}>
        <Link className={brand} to="/">
          <img src={logo_minimal} alt="" />
          <span>HARZ ROASTERY</span>
        </Link>
        <Link to="/">{t.legal.back}</Link>
      </div>
      <motion.article className={article} variants={rise} {...reveal}>
        <h1>{copy.title}</h1>
        {copy.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </motion.article>
    </main>
  );
}

export default LegalPage;
