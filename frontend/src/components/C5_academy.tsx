import { useState } from "react";
import { css, cx } from "@emotion/css";
import { motion } from "motion/react";

import C5_academy_card from "./C5_academy_card";

import type { Course } from "../data/courses";
import { liftCard, rise, stagger, useSoftMotion } from "./motion";
import { translations } from "./translations";

import icon from "../assets/c5_icon.svg";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type C5Props = {
  language: "en" | "uk";
  courses: Course[];
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const c5_place = css({
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

const c5_title = css({
  paddingBottom: "12px",

  color: "var(--clay)",
  fontSize: "12px",
  fontWeight: "700",
  fontFamily: "inherit",
  textTransform: "uppercase",

  "@media (max-width: 480px)": {
    fontSize: "11px",
  },
});

const c5_second_title = css({
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

const c5_card_place = css({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "24px",

  "& > button": {
    width: "100%",
    boxSizing: "border-box",

    padding: "32px",

    backgroundColor: "var(--bg-card)",
    border: "1px solid #f3ede614",
    borderRadius: "24px",

    color: "var(--text-main)",
    font: "inherit",
    textAlign: "left",

    cursor: "pointer",
    transition: "border-color 0.15s ease, background-color 0.15s ease",

    "&:hover": {
      borderColor: "var(--clay)",
    },

    "@media (max-width: 768px)": {
      padding: "28px",
    },

    "@media (max-width: 480px)": {
      padding: "24px",
      borderRadius: "20px",
    },
  },

  "@media (max-width: 1024px)": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },

  "@media (max-width: 640px)": {
    gridTemplateColumns: "1fr",
  },
});

const c5_card = css({
  display: "flex",
  flexDirection: "column",

  height: "100%",
  minWidth: 0,

  "& h4": {
    margin: 0,
    paddingBottom: "8px",

    fontSize: "20px",
    fontWeight: "700",
    lineHeight: "130%",

    "@media (max-width: 480px)": {
      fontSize: "18px",
    },
  },

  "& p": {
    margin: 0,

    color: "var(--text-muted)",
    fontSize: "14px",
    lineHeight: "150%",

    "@media (max-width: 480px)": {
      fontSize: "13px",
    },
  },

  "& h5": {
    margin: 0,

    color: "var(--clay)",
    fontSize: "18px",
    fontWeight: "700",

    "@media (max-width: 480px)": {
      fontSize: "17px",
    },
  },

  "& h6": {
    margin: 0,
    color: "var(--text-muted)",
    fontSize: "12px",

    "@media (max-width: 480px)": {
      fontSize: "11px",
    },
  },
});

const c5_card_top = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});

const c5_card_bottom = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  marginTop: "auto",
  paddingTop: "24px",
  gap: "16px",

  "& img": {
    width: "24px",
    height: "24px",
  },

  "@media (max-width: 480px)": {
    paddingTop: "20px",

    "& img": {
      width: "22px",
      height: "22px",
    },
  },
});

const empty_state = css({
  padding: "32px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "20px",

  color: "var(--text-muted)",
  textAlign: "center",

  "& p": {
    margin: 0,
    fontSize: "14px",
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function C5_academy({ language, courses }: C5Props) {
  const t = translations[language];
  const { reduce, reveal } = useSoftMotion();

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const activeCourses = courses.filter((course) => course.active);

  const selectedCourse =
    selectedCourseId !== null
      ? (courses.find((course) => course.id === selectedCourseId) ?? null)
      : null;

  return (
    <div id="courses" className={cx(c5_place, "font-onest")}>
      <motion.div variants={rise} {...reveal}>
        <h2 className={c5_title}>{t.c5.title}</h2>
        <h3 className={c5_second_title}>{t.c5.second_title}</h3>
      </motion.div>
      {activeCourses.length === 0 ? (
        <motion.div className={empty_state} variants={rise} {...reveal}>
          <p>
            {language === "uk"
              ? "Наразі доступних курсів немає."
              : "There are currently no available courses."}
          </p>
        </motion.div>
      ) : (
        <motion.div className={c5_card_place} variants={stagger} {...reveal}>
          {activeCourses.map((course) => (
            <motion.button
              key={course.id}
              type="button"
              variants={liftCard}
              whileHover={reduce ? undefined : "hover"}
              whileTap={reduce ? undefined : { scale: 0.985 }}
              onClick={() => setSelectedCourseId(course.id)}
            >
              <div className={c5_card}>
                <div className={c5_card_top}>
                  <h4>{course.title[language]}</h4>
                  <p>{course.description[language]}</p>
                </div>
                <div className={c5_card_bottom}>
                  <div>
                    <h5>₴{course.price.toLocaleString("en-US")}</h5>
                    <h6>{course.duration[language]}</h6>
                  </div>
                  <div>
                    <img className="icon" src={icon} alt="" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}
      {selectedCourse && (
        <C5_academy_card
          onClose={() => setSelectedCourseId(null)}
          courseId={selectedCourse.id}
          title={selectedCourse.title[language]}
          description={selectedCourse.description[language]}
          duration={selectedCourse.duration[language]}
          price={`₴${selectedCourse.price.toLocaleString("en-US")}`}
          language={language}
        />
      )}
    </div>
  );
}

export default C5_academy;
