import { css, cx } from "@emotion/css";
import { motion } from "motion/react";

import { hoverImage, liftCard, rise, stagger, useSoftMotion } from "./motion";
import { translations } from "./translations";

import icon1 from "../assets/c4_icons/c4_icon1.svg";
import icon2 from "../assets/c4_icons/c4_icon2.svg";
import icon3 from "../assets/c4_icons/c4_icon3.svg";
import icon4 from "../assets/c4_icons/c4_icon4.svg";
import icon5 from "../assets/c4_icons/c4_icon5.svg";
import icon6 from "../assets/c4_icons/c4_icon6.svg";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type C4Props = {
  language: "en" | "uk";
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const c4_place = css({
  display: "flex",
  flexDirection: "column",

  boxSizing: "border-box",

  padding: "120px 80px",
  gap: "64px",

  "@media (max-width: 1024px)": {
    padding: "100px 40px",
    gap: "48px",
  },

  "@media (max-width: 768px)": {
    padding: "80px 24px",
    gap: "40px",
  },

  "@media (max-width: 480px)": {
    padding: "64px 16px",
    gap: "32px",
  },
});

const c4_title = css({
  paddingBottom: "12px",

  textTransform: "uppercase",
  color: "var(--clay)",
  fontSize: "12px",
  fontWeight: "700",
  fontFamily: "inherit",

  "@media (max-width: 480px)": {
    fontSize: "11px",
  },
});

const c4_second_title = css({
  fontSize: "36px",
  fontFamily: "inherit",
  fontWeight: "700",
  lineHeight: "120%",

  "@media (max-width: 768px)": {
    fontSize: "32px",
  },

  "@media (max-width: 480px)": {
    fontSize: "28px",
  },
});

const c4_card_place = css({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "24px",

  "& > div": {
    boxSizing: "border-box",
    minWidth: 0,
    padding: "24px",

    "& h3": {
      margin: 0,
      paddingBottom: "8px",

      fontSize: "20px",
      fontWeight: "700",

      "@media (max-width: 480px)": {
        fontSize: "18px",
      },
    },

    "& p": {
      margin: 0,

      fontSize: "14px",
      lineHeight: "160%",
      color: "var(--text-muted)",

      "@media (max-width: 480px)": {
        fontSize: "13px",
      },
    },

    "& img": {
      maxWidth: "100%",
      height: "auto",
      paddingBottom: "16px",

      "@media (max-width: 480px)": {
        paddingBottom: "12px",
      },
    },

    "@media (max-width: 480px)": {
      padding: "20px",
    },
  },

  "@media (max-width: 1024px)": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },

  "@media (max-width: 640px)": {
    gridTemplateColumns: "1fr",
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function C4_who_this_is_for({ language }: C4Props) {
  const t = translations[language];
  const { reduce, reveal } = useSoftMotion();

  return (
    <div className={cx(c4_place, "font-onest")}>
      <motion.div variants={rise} {...reveal}>
        <h2 className={c4_title}>{t.c4.title}</h2>
        <h3 className={c4_second_title}>{t.c4.second_title}</h3>
      </motion.div>
      <motion.div className={c4_card_place} variants={stagger} {...reveal}>
        <motion.div variants={liftCard} whileHover={reduce ? undefined : "hover"}>
          <motion.img variants={hoverImage} src={icon1} alt={t.c4.c1_title} />
          <h3>{t.c4.c1_title}</h3>
          <p>{t.c4.c1_text}</p>
        </motion.div>
        <motion.div variants={liftCard} whileHover={reduce ? undefined : "hover"}>
          <motion.img variants={hoverImage} src={icon2} alt={t.c4.c2_title} />
          <h3>{t.c4.c2_title}</h3>
          <p>{t.c4.c2_text}</p>
        </motion.div>
        <motion.div variants={liftCard} whileHover={reduce ? undefined : "hover"}>
          <motion.img variants={hoverImage} src={icon3} alt={t.c4.c3_title} />
          <h3>{t.c4.c3_title}</h3>
          <p>{t.c4.c3_text}</p>
        </motion.div>
        <motion.div variants={liftCard} whileHover={reduce ? undefined : "hover"}>
          <motion.img variants={hoverImage} src={icon4} alt={t.c4.c4_title} />
          <h3>{t.c4.c4_title}</h3>
          <p>{t.c4.c4_text}</p>
        </motion.div>
        <motion.div variants={liftCard} whileHover={reduce ? undefined : "hover"}>
          <motion.img variants={hoverImage} src={icon5} alt={t.c4.c5_title} />
          <h3>{t.c4.c5_title}</h3>
          <p>{t.c4.c5_text}</p>
        </motion.div>
        <motion.div variants={liftCard} whileHover={reduce ? undefined : "hover"}>
          <motion.img variants={hoverImage} src={icon6} alt={t.c4.c6_title} />
          <h3>{t.c4.c6_title}</h3>
          <p>{t.c4.c6_text}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default C4_who_this_is_for;
