import { css, cx } from "@emotion/css";
import { motion } from "motion/react";

import { rise, stagger, useSoftMotion } from "./motion";
import { translations } from "./translations";

import photo from "../assets/who-we-are.webp";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type C2Props = {
  language: "en" | "uk";
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const c2_place = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",

  boxSizing: "border-box",

  padding: "120px 80px",
  gap: "120px",

  "@media (max-width: 1200px)": {
    padding: "100px 48px",
    gap: "64px",
  },

  "@media (max-width: 900px)": {
    flexDirection: "column",
    alignItems: "flex-start",

    padding: "80px 32px",
    gap: "48px",
  },

  "@media (max-width: 600px)": {
    padding: "64px 20px",
    gap: "36px",
  },
});

const c2_left = css({
  display: "flex",
  flexShrink: 0,

  width: "360px",
  height: "360px",

  "& img": {
    width: "100%",
    height: "100%",

    borderRadius: "50%",
    objectFit: "cover",
  },

  "@media (max-width: 1200px)": {
    width: "300px",
    height: "300px",
  },

  "@media (max-width: 900px)": {
    display: "none",
  },
});

const c2_right = css({
  maxWidth: "720px",

  "@media (max-width: 900px)": {
    maxWidth: "100%",
    width: "100%",
  },
});

const c2_title = css({
  paddingBottom: "12px",

  textTransform: "uppercase",
  color: "var(--clay)",
  fontSize: "12px",
  fontWeight: "700",

  "@media (max-width: 600px)": {
    fontSize: "11px",
  },
});

const c2_second_title = css({
  paddingBottom: "24px",

  fontSize: "36px",
  fontWeight: "700",
  lineHeight: "120%",

  "@media (max-width: 900px)": {
    fontSize: "32px",
  },

  "@media (max-width: 600px)": {
    paddingBottom: "20px",
    fontSize: "28px",
  },
});

const c2_text = css({
  paddingBottom: "16px",
  fontSize: "16px",
  lineHeight: "170%",

  "@media (max-width: 600px)": {
    fontSize: "15px",
    lineHeight: "165%",
  },
});

const c2_text_muted = css({
  fontSize: "16px",
  lineHeight: "170%",
  color: "var(--text-muted)",

  "@media (max-width: 600px)": {
    fontSize: "15px",
    lineHeight: "165%",
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function C2_who_we_are({ language }: C2Props) {
  const t = translations[language];
  const { reveal } = useSoftMotion();

  return (
    <motion.div
      className={cx("font-onest", c2_place)}
      variants={stagger}
      {...reveal}
    >
      <motion.div className={c2_left} variants={rise}>
        <img src={photo} alt="Photo" loading="lazy" decoding="async" />
      </motion.div>
      <motion.div className={c2_right} variants={rise}>
        <h2 className={c2_title}>{t.c2.title}</h2>
        <h3 className={c2_second_title}>{t.c2.second_title}</h3>
        <p className={c2_text}>{t.c2.text}</p>
        <p className={c2_text_muted}>{t.c2.text_muted}</p>
      </motion.div>
    </motion.div>
  );
}

export default C2_who_we_are;
