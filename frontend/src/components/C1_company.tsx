import { css, cx } from "@emotion/css";
import { motion, useReducedMotion } from "motion/react";

import { rise, softEase, stagger } from "./motion";
import { translations } from "./translations";

import logo from "../assets/logo.webp";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Component1Props = {
  language: "en" | "uk";
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const component1_place = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  width: "100%",
  boxSizing: "border-box",

  padding: "200px 80px 80px",
  gap: "64px",

  color: "var(--text-main)",

  "@media (max-width: 1024px)": {
    padding: "160px 40px 64px",
    gap: "40px",
  },

  "@media (max-width: 768px)": {
    flexDirection: "column",
    alignItems: "flex-start",

    padding: "140px 24px 56px",
    gap: "48px",
  },

  "@media (max-width: 480px)": {
    padding: "120px 16px 48px",
    gap: "40px",
  },
});

const image_circle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,

  width: "420px",
  height: "420px",

  background:
    "radial-gradient(circle at 50% 45%, var(--hero-circle-start) 0%, var(--hero-circle-end) 100%)",
  borderRadius: "50%",

  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  "@media (max-width: 1200px)": {
    width: "340px",
    height: "340px",
  },

  "@media (max-width: 1024px)": {
    width: "300px",
    height: "300px",
  },

  "@media (max-width: 768px)": {
    alignSelf: "center",

    width: "100%",
    maxWidth: "360px",
    height: "auto",
    aspectRatio: "1 / 1",
  },

  "@media (max-width: 480px)": {
    maxWidth: "280px",
  },
});

const left_content = css({
  display: "flex",
  flexDirection: "column",
  flex: 1,

  minWidth: 0,

  gap: "40px",

  "@media (max-width: 768px)": {
    width: "100%",
    gap: "32px",
  },
});

const lc_text = css({
  display: "flex",
  flexDirection: "column",

  maxWidth: "640px",

  gap: "20px",

  "@media (max-width: 768px)": {
    maxWidth: "100%",
  },
});

const main_title = css({
  margin: 0,

  fontWeight: "800",
  fontSize: "64px",
  lineHeight: "110%",

  "@media (max-width: 1200px)": {
    fontSize: "52px",
  },

  "@media (max-width: 1024px)": {
    fontSize: "44px",
  },

  "@media (max-width: 768px)": {
    fontSize: "42px",
  },

  "@media (max-width: 480px)": {
    fontSize: "34px",
    lineHeight: "115%",
  },

  "@media (max-width: 360px)": {
    fontSize: "30px",
  },
});

const description = css({
  margin: 0,

  fontWeight: "400",
  fontSize: "18px",
  lineHeight: "160%",
  color: "var(--text-muted)",

  "@media (max-width: 768px)": {
    fontSize: "16px",
  },

  "@media (max-width: 480px)": {
    fontSize: "15px",
  },
});

const lc_buttons = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",

  "& a": {
    color: "inherit",
  },

  "@media (max-width: 480px)": {
    flexDirection: "column",
    width: "100%",
    gap: "12px",
  },
});

const primary_button = css({
  padding: "12px 24px",

  background: "var(--clay)",
  border: "none",
  borderRadius: "100px",

  color: "#f3ede6",
  font: "inherit",
  fontSize: "14px",
  fontWeight: "600",

  cursor: "pointer",

  "@media (max-width: 480px)": {
    width: "100%",
  },
});

const secondary_button = css({
  padding: "12px 24px",

  background: "none",
  borderRadius: "100px",
  border: "2px solid var(--text-main)",

  color: "inherit",
  font: "inherit",
  fontSize: "14px",
  fontWeight: "600",

  cursor: "pointer",

  "@media (max-width: 480px)": {
    width: "100%",
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function Component1({ language }: Component1Props) {
  const t = translations[language];
  const reduce = Boolean(useReducedMotion());

  return (
    <div id="about" className={cx("font-onest", component1_place)}>
      <motion.div
        className={left_content}
        variants={stagger}
        initial={reduce ? false : "hidden"}
        animate="show"
      >
        <motion.div className={lc_text} variants={rise}>
          <h2 className={main_title}>
            {t.c1.text_before_accent}
            <span
              className="font-playfair"
              style={{ color: "var(--clay)", fontWeight: "600" }}
            >
              {t.c1.accent}
            </span>{" "}
            {t.c1.text_after_accent}
          </h2>
          <h3 className={description}>{t.c1.additional_text}</h3>
        </motion.div>
        <motion.div className={lc_buttons} variants={rise}>
          <a href="#shop">
            <motion.button
              className={primary_button}
              whileHover={reduce ? undefined : { scale: 1.04 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              {t.c1.btm1_shop}
            </motion.button>
          </a>
          <a href="#courses">
            <motion.button
              className={secondary_button}
              whileHover={reduce ? undefined : { scale: 1.04 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              {t.c1.btm2_courses}
            </motion.button>
          </a>
        </motion.div>
      </motion.div>
      <motion.div
        className={image_circle}
        initial={reduce ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: reduce ? 0 : 0.8,
          ease: softEase,
          delay: reduce ? 0 : 0.12,
        }}
      >
        <motion.img
          src={logo}
          alt="Logo"
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={
            reduce
              ? undefined
              : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </motion.div>
    </div>
  );
}

export default Component1;
