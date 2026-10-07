import { css } from "@emotion/css";

import ATelegramNotice from "../ATelegramNotice";
import AEnroll_StatusSelect from "./AEnroll_StatusSelect";

import type {
  CourseEnrollment,
  CourseEnrollmentStatus,
} from "../../data/courseEnrollments";
import {
  adminTranslations,
  type AdminLanguage,
} from "../utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: AdminLanguage;
  enrollment: CourseEnrollment;
  onStatusChange: (id: number, status: CourseEnrollmentStatus) => void;
  onDelete: (id: number) => void;
  onResend: (id: number) => void;
  isResending: boolean;
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const card = css({
  display: "flex",
  flexDirection: "column",

  boxSizing: "border-box",

  padding: "24px",
  gap: "22px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "20px",
});

const header = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",

  gap: "20px",

  "& h3": {
    margin: 0,
    fontSize: "20px",
    fontWeight: "800",
  },

  "& p": {
    margin: "6px 0 0",
    color: "var(--text-muted)",
    fontSize: "12px",
  },

  "@media (max-width: 600px)": {
    flexDirection: "column",
  },
});

const section = css({
  display: "flex",
  flexDirection: "column",
  gap: "10px",

  "& h4": {
    margin: 0,

    color: "var(--text-muted)",
    fontSize: "13px",
    fontWeight: "800",
    textTransform: "uppercase",
  },
});

const grid = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",

  "@media (max-width: 560px)": {
    gridTemplateColumns: "1fr",
  },
});

const info = css({
  minWidth: 0,

  "& span": {
    display: "block",

    marginBottom: "4px",

    color: "var(--text-muted)",
    fontSize: "11px",
    fontWeight: "700",
  },

  "& strong": {
    display: "block",

    fontSize: "14px",
    fontWeight: "600",
    overflowWrap: "anywhere",
  },
});

const price = css({
  color: "var(--clay)",
});

const footer = css({
  display: "flex",
  justifyContent: "flex-end",
  paddingTop: "4px",
});

const delete_button = css({
  padding: "10px 16px",

  backgroundColor: "transparent",
  border: "1px solid var(--clay)",
  borderRadius: "100px",

  color: "var(--clay)",
  font: "inherit",
  fontSize: "13px",
  fontWeight: "700",

  cursor: "pointer",
  transition: "background-color 0.15s ease, color 0.15s ease",

  "&:hover": {
    backgroundColor: "var(--clay)",
    color: "#f3ede6",
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function AEnroll_Card({
  language,
  enrollment,
  onStatusChange,
  onDelete,
  onResend,
  isResending,
}: Props) {
  const t = adminTranslations[language].enrollments;
  const createdAt = new Date(enrollment.createdAt).toLocaleString(
    language === "uk" ? "uk-UA" : "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );

  return (
    <article className={card}>
      <div className={header}>
        <div>
          <h3>{enrollment.course.title}</h3>
          <p>
            {t.enrollment} #{enrollment.id}
            {" · "}
            {createdAt}
          </p>
          <ATelegramNotice
            language={language}
            notification={enrollment.notification}
            isSending={isResending}
            onResend={() => onResend(enrollment.id)}
          />
        </div>
        <AEnroll_StatusSelect
          language={language}
          status={enrollment.status}
          onChange={(status) => onStatusChange(enrollment.id, status)}
        />
      </div>
      <section className={section}>
        <h4>{t.customer}</h4>
        <div className={grid}>
          <div className={info}>
            <span>{t.name}</span>
            <strong>{enrollment.customer.name}</strong>
          </div>
          <div className={info}>
            <span>{t.email}</span>
            <strong>{enrollment.customer.email}</strong>
          </div>
          <div className={info}>
            <span>{t.phone}</span>
            <strong>{enrollment.customer.phone}</strong>
          </div>
        </div>
      </section>
      <section className={section}>
        <h4>{t.courseDetails}</h4>
        <div className={grid}>
          <div className={info}>
            <span>{t.courseId}</span>
            <strong>#{enrollment.course.id}</strong>
          </div>
          <div className={info}>
            <span>{t.duration}</span>
            <strong>{enrollment.course.duration}</strong>
          </div>
          <div className={info}>
            <span>{t.price}</span>
            <strong className={price}>
              ₴{enrollment.course.price.toLocaleString("en-US")}
            </strong>
          </div>
        </div>
      </section>
      <div className={footer}>
        <button
          type="button"
          className={delete_button}
          onClick={() => onDelete(enrollment.id)}
        >
          {t.delete}
        </button>
      </div>
    </article>
  );
}

export default AEnroll_Card;
