import { useState } from "react";
import { css, cx } from "@emotion/css";
import { motion } from "motion/react";

import C6_CustomRoastingForm from "./C6_CustomRoastingForm";

import { rise, softEase, useSoftMotion } from "./motion";
import { translations } from "./translations";

import photo from "../assets/roasting.webp";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type C6Props = {
  language: "en" | "uk";
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const c6_wrapper = css({
  boxSizing: "border-box",
  padding: "64px 80px",

  "@media (max-width: 1024px)": {
    padding: "0 40px 100px",
  },

  "@media (max-width: 768px)": {
    padding: "0 24px 80px",
  },

  "@media (max-width: 480px)": {
    padding: "0 16px 64px",
  },
});

const c6_place = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  boxSizing: "border-box",

  padding: "64px",
  gap: "48px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid #f3ede614",
  borderRadius: "24px",

  "@media (max-width: 1024px)": {
    padding: "48px",
    gap: "36px",
  },

  "@media (max-width: 768px)": {
    flexDirection: "column",
    alignItems: "center",

    padding: "36px",
    gap: "32px",
  },

  "@media (max-width: 480px)": {
    padding: "24px",
    gap: "24px",
    borderRadius: "20px",
  },
});

const c6_text = css({
  flex: 1,
  maxWidth: "640px",
  minWidth: 0,

  "@media (max-width: 768px)": {
    width: "100%",
    maxWidth: "100%",
  },
});

const c6_title = css({
  margin: 0,
  paddingBottom: "12px",

  fontSize: "32px",
  fontWeight: "700",
  lineHeight: "120%",

  "@media (max-width: 768px)": {
    fontSize: "28px",
  },

  "@media (max-width: 480px)": {
    fontSize: "24px",
  },
});

const c6_description = css({
  margin: 0,
  paddingBottom: "24px",

  color: "var(--text-muted)",
  fontSize: "16px",
  lineHeight: "150%",

  "@media (max-width: 480px)": {
    paddingBottom: "20px",
    fontSize: "14px",
  },
});

const c6_button = css({
  padding: "12px 24px",

  background: "none",
  border: "2px solid var(--text-main)",
  borderRadius: "100px",

  color: "inherit",
  fontFamily: "inherit",
  fontSize: "14px",
  fontWeight: "600",

  cursor: "pointer",
  transition: "background-color 0.15s ease, color 0.15s ease",

  "&:hover": {
    backgroundColor: "var(--text-main)",
    color: "var(--bg-page)",
  },

  "@media (max-width: 480px)": {
    width: "100%",
    textAlign: "center",
  },
});

const img_roster = css({
  flexShrink: 0,
  overflow: "hidden",

  width: "320px",
  aspectRatio: "1 / 1",

  borderRadius: "20px",

  "& img": {
    display: "block",

    width: "100%",
    height: "100%",

    objectFit: "cover",
    objectPosition: "center",
  },

  "@media (max-width: 1024px)": {
    width: "280px",
  },

  "@media (max-width: 768px)": {
    width: "100%",
    height: "350px",
    maxWidth: "100%",
  },

  "@media (max-width: 650px)": {
    width: "100%",
    height: "200px",
    maxWidth: "100%",
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function C6_custom_roasting({ language }: C6Props) {
  const t = translations[language];
  const { reduce, reveal } = useSoftMotion();

  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <div className={c6_wrapper}>
        <motion.div
          className={cx("font-onest", c6_place)}
          variants={rise}
          {...reveal}
        >
          <div className={c6_text}>
            <h2 className={c6_title}>{t.c6.title}</h2>
            <p className={c6_description}>{t.c6.text}</p>
            <motion.button
              type="button"
              className={c6_button}
              onClick={() => setFormOpen(true)}
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              {t.c6.button}
            </motion.button>
          </div>
          <motion.div className={img_roster} variants={rise}>
            <motion.img
              src={photo}
              alt="Coffee roaster"
              loading="lazy"
              decoding="async"
              initial={reduce ? false : { scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reduce ? 0 : 1.1, ease: softEase }}
            />
          </motion.div>
        </motion.div>
      </div>
      {formOpen && (
        <C6_CustomRoastingForm
          language={language}
          onClose={() => setFormOpen(false)}
        />
      )}
    </>
  );
}

export default C6_custom_roasting;
