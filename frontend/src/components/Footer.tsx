import { Link } from "react-router-dom";
import { css, cx } from "@emotion/css";
import { motion } from "motion/react";

import { rise, useSoftMotion } from "./motion";
import { translations } from "./translations";

import logo_minimal from "../assets/logo_minimal.svg";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type FooterProps = {
  language: "en" | "uk";
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const footer_place = css({
  display: "flex",
  flexDirection: "column",

  boxSizing: "border-box",

  padding: "80px",
  gap: "64px",

  backgroundColor: "var(--bg-card)",
  borderTop: "1px solid var(--sand-line)",
  borderRadius: "24px 24px 0 0",

  color: "var(--text-main)",

  "@media (max-width: 1024px)": {
    padding: "64px 40px",
    gap: "48px",
  },

  "@media (max-width: 768px)": {
    padding: "48px 24px",
    gap: "40px",
    borderRadius: "20px 20px 0 0",
  },

  "@media (max-width: 480px)": {
    padding: "40px 16px",
    gap: "32px",
    borderRadius: "16px 16px 0 0",
  },
});

const footer_top = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",

  gap: "64px",

  "@media (max-width: 900px)": {
    flexDirection: "column",
    gap: "40px",
  },
});

const footer_t_l = css({
  display: "flex",
  flexDirection: "column",

  maxWidth: "320px",

  gap: "16px",

  "& p": {
    margin: 0,

    lineHeight: "150%",
    fontSize: "14px",
    fontWeight: "400",
    color: "var(--text-muted)",
  },

  "& h3": {
    margin: 0,
    fontSize: "24px",
    fontWeight: "800",
  },

  "& div": {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",

    gap: "10px",
  },

  "& img": {
    width: "28px",
    height: "28px",
  },

  "@media (max-width: 900px)": {
    maxWidth: "100%",
  },

  "@media (max-width: 480px)": {
    gap: "12px",

    "& h3": {
      fontSize: "22px",
    },

    "& p": {
      fontSize: "13px",
    },
  },
});

const footer_t_r = css({
  display: "flex",
  flexDirection: "row",
  gap: "80px",

  "& h4": {
    margin: 0,
    paddingBottom: "16px",

    fontSize: "14px",
    fontWeight: "700",
  },

  "& p": {
    margin: 0,
    paddingTop: "8px",

    fontSize: "14px",
    fontWeight: "400",
    color: "var(--text-muted)",
  },

  "& h5": {
    margin: 0,
    fontSize: "14px",
    fontWeight: "600",
  },

  "@media (max-width: 1024px)": {
    gap: "48px",
  },

  "@media (max-width: 700px)": {
    flexDirection: "column",
    width: "100%",
    gap: "32px",
  },

  "@media (max-width: 480px)": {
    "& h4": {
      paddingBottom: "12px",
      fontSize: "13px",
    },

    "& h5": {
      fontSize: "13px",
    },

    "& p": {
      fontSize: "13px",
    },
  },
});

const footer_bot = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  paddingTop: "32px",
  gap: "24px",

  borderTop: "1px solid var(--sand-line)",

  "& p": {
    margin: 0,

    fontSize: "13px",
    fontWeight: "400",
    color: "var(--text-muted)",
  },

  "& div": {
    display: "flex",
    flexDirection: "row",
    gap: "16px",
  },

  "& a": {
    color: "var(--text-muted)",
    fontSize: "13px",
    textDecoration: "none",

    "&:hover": {
      color: "var(--text-main)",
    },
  },

  "@media (max-width: 700px)": {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "16px",

    "& div": {
      flexWrap: "wrap",
    },
  },

  "@media (max-width: 480px)": {
    paddingTop: "24px",

    "& p, & a": {
      fontSize: "12px",
    },

    "& div": {
      flexDirection: "column",
      gap: "8px",
    },
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function Footer({ language }: FooterProps) {
  const t = translations[language];
  const { reveal } = useSoftMotion();

  return (
    <motion.div
      className={cx("font-onest", footer_place)}
      variants={rise}
      {...reveal}
    >
      <div className={footer_top}>
        <div className={footer_t_l}>
          <div>
            <img src={logo_minimal} alt="logo_minimal" />
            <h3>HARZ</h3>
          </div>
          <p>{t.footer.description}</p>
        </div>
        <div className={footer_t_r}>
          <div>
            <h4>{t.footer.roastery_title}</h4>
            <p>{t.footer.address}</p>
            <p>{t.footer.working_hours}</p>
          </div>
          <div>
            <h4>{t.footer.contact_title}</h4>
            <h5>{t.footer.email}</h5>
            <p>{t.footer.working_hours}</p>
          </div>
        </div>
      </div>
      <div className={footer_bot}>
        <p>{t.footer.copyright}</p>
        <div>
          <Link to="/privacy">{t.footer.privacy}</Link>
          <Link to="/terms">{t.footer.terms}</Link>
        </div>
      </div>
    </motion.div>
  );
}

export default Footer;
