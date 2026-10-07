import { css, cx } from "@emotion/css";
import { motion } from "motion/react";

import { liftCard, rise, stagger, useSoftMotion } from "./motion";
import { translations } from "./translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type C3Props = {
  language: "en" | "uk";
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const c3_place = css({
  display: "flex",
  flexDirection: "column",

  boxSizing: "border-box",

  padding: "120px 80px",
  gap: "48px",

  "@media (max-width: 1024px)": {
    padding: "100px 40px",
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

const c3_title = css({
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

const c3_second_title = css({
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

const c3_card_place = css({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "24px",

  "@media (max-width: 1150px)": {
    gridTemplateColumns: "1fr",
  },
});

const c3_card = css({
  display: "flex",
  flexDirection: "column",

  height: "100%",
  boxSizing: "border-box",
  minWidth: 0,

  padding: "32px",
  gap: "24px",

  backgroundColor: "var(--bg-card)",
  borderRadius: "24px",
  border: "1px solid #f3ede614",

  "& p": {
    margin: 0,
    lineHeight: "160%",
    color: "var(--text-muted)",

    "@media (max-width: 480px)": {
      fontSize: "14px",
    },
  },

  "@media (max-width: 768px)": {
    padding: "28px",
  },

  "@media (max-width: 480px)": {
    padding: "24px",
    gap: "20px",
    borderRadius: "20px",
  },
});

const c3_card_top = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",

  gap: "8px",

  "& h4": {
    margin: 0,
    textTransform: "uppercase",
    fontWeight: "700",

    "@media (max-width: 480px)": {
      fontSize: "15px",
    },
  },
});

const c3_card_top_dot = css({
  flexShrink: 0,

  width: "16px",
  height: "16px",

  borderRadius: "50%",
});

const c3_card_bottom = css({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",

  marginTop: "auto",
  gap: "8px",

  color: "var(--text-muted)",

  "& div": {
    padding: "6px 12px",

    border: "1px solid var(--sand-line)",
    borderRadius: "100px",

    fontSize: "12px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },

  "@media (max-width: 480px)": {
    gap: "6px",

    "& div": {
      padding: "5px 10px",
      fontSize: "11px",
    },
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function C3_roast_profiles({ language }: C3Props) {
  const t = translations[language];
  const { reduce, reveal } = useSoftMotion();

  return (
    <div id="coffee" className={cx("font-onest", c3_place)}>
      <motion.div variants={rise} {...reveal}>
        <h2 className={c3_title}>{t.c3.title}</h2>
        <h3 className={c3_second_title}>{t.c3.second_title}</h3>
      </motion.div>
      <motion.div className={c3_card_place} variants={stagger} {...reveal}>
        <motion.div
          className={c3_card}
          variants={liftCard}
          whileHover={reduce ? undefined : "hover"}
        >
          <div className={c3_card_top}>
            <div
              style={{ backgroundColor: "#D9A96E" }}
              className={c3_card_top_dot}
            />
            <h4>{t.c3.c1_title}</h4>
          </div>
          <p>{t.c3.c1_text}</p>
          <div className={c3_card_bottom}>
            <div>{t.c3.d1_1}</div>
            <div>{t.c3.d1_2}</div>
            <div>{t.c3.d1_3}</div>
            <div>{t.c3.d1_4}</div>
          </div>
        </motion.div>
        <motion.div
          className={c3_card}
          variants={liftCard}
          whileHover={reduce ? undefined : "hover"}
        >
          <div className={c3_card_top}>
            <div
              style={{ backgroundColor: "#B5563C" }}
              className={c3_card_top_dot}
            />
            <h4>{t.c3.c2_title}</h4>
          </div>
          <p>{t.c3.c2_text}</p>
          <div className={c3_card_bottom}>
            <div>{t.c3.d2_1}</div>
            <div>{t.c3.d2_2}</div>
            <div>{t.c3.d2_3}</div>
            <div>{t.c3.d2_4}</div>
          </div>
        </motion.div>
        <motion.div
          className={c3_card}
          variants={liftCard}
          whileHover={reduce ? undefined : "hover"}
        >
          <div className={c3_card_top}>
            <div
              style={{ backgroundColor: "#5C3624" }}
              className={c3_card_top_dot}
            />
            <h4>{t.c3.c3_title}</h4>
          </div>
          <p>{t.c3.c3_text}</p>
          <div className={c3_card_bottom}>
            <div>{t.c3.d3_1}</div>
            <div>{t.c3.d3_2}</div>
            <div>{t.c3.d3_3}</div>
            <div>{t.c3.d3_4}</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default C3_roast_profiles;
