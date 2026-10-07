import { useEffect, useState, type FormEvent } from "react";
import { css, cx } from "@emotion/css";

import { createCourseEnrollment } from "../services/courseEnrollmentApi";

import { MotionDialog } from "./motion";
import { translations } from "./translations";

import close_icon from "../assets/close_icon.svg";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  onClose: () => void;
  courseId: number;
  title: string;
  description: string;
  duration: string;
  price: string;
  language: "en" | "uk";
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const overlay = css({
  position: "fixed",
  inset: 0,
  zIndex: 2000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  padding: "24px",

  backgroundColor: "rgba(0, 0, 0, 0.45)",

  "@media (max-width: 600px)": {
    alignItems: "flex-start",
    overflowY: "auto",
    padding: "16px",
  },

  "@media (max-width: 400px)": {
    padding: "10px",
  },
});

const card_place = css({
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",

  width: "100%",
  maxWidth: "560px",
  maxHeight: "90vh",
  boxSizing: "border-box",

  padding: "48px",
  gap: "32px",

  backgroundColor: "var(--bg-card)",
  borderRadius: "24px",

  color: "var(--text-main)",

  "@media (max-width: 768px)": {
    maxWidth: "520px",
    padding: "36px",
    gap: "28px",
  },

  "@media (max-width: 600px)": {
    maxWidth: "100%",
    maxHeight: "none",

    margin: "16px 0",
    padding: "28px 24px",
    gap: "24px",

    borderRadius: "20px",
  },

  "@media (max-width: 400px)": {
    padding: "24px 18px",
    gap: "20px",
    borderRadius: "18px",
  },
});

const cp_top = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",

  gap: "16px",
});

const close_button = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,

  height: "32px",
  width: "32px",

  margin: 0,
  padding: 0,

  backgroundColor: "var(--chip-bg)",
  borderRadius: "50%",
  border: "none",

  cursor: "pointer",

  "& img": {
    width: "16px",
    height: "16px",
  },

  "@media (max-width: 480px)": {
    height: "30px",
    width: "30px",

    "& img": {
      width: "14px",
      height: "14px",
    },
  },
});

const cp_top_p1 = css({
  display: "flex",

  padding: "6px 12px",

  border: "1px solid var(--clay)",
  borderRadius: "100px",

  color: "var(--clay)",
  fontSize: "11px",
  fontWeight: "700",
  textTransform: "uppercase",

  "& h3": {
    margin: 0,
  },

  "@media (max-width: 480px)": {
    padding: "5px 10px",
    fontSize: "10px",
  },
});

const cp_top_p2 = css({
  display: "flex",
  flexDirection: "column",
  gap: "16px",

  "& h2": {
    margin: 0,
    fontSize: "32px",
    lineHeight: "120%",
  },

  "& p": {
    margin: 0,

    fontSize: "15px",
    lineHeight: "150%",
    color: "var(--text-muted)",
  },

  "@media (max-width: 600px)": {
    gap: "12px",

    "& h2": {
      fontSize: "28px",
    },

    "& p": {
      fontSize: "14px",
    },
  },

  "@media (max-width: 400px)": {
    "& h2": {
      fontSize: "24px",
    },

    "& p": {
      fontSize: "13px",
      lineHeight: "155%",
    },
  },
});

const cp_top_p3 = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",

  padding: "20px",
  gap: "24px",

  backgroundColor: "#f3ede614",
  borderRadius: "16px",

  "& p": {
    margin: 0,

    fontSize: "12px",
    textTransform: "uppercase",
    color: "var(--text-muted)",
  },

  "& h4": {
    margin: 0,
    marginTop: "4px",

    fontWeight: "700",
    fontSize: "16px",
  },

  "& h5": {
    margin: 0,
    marginTop: "4px",

    fontWeight: "800",
    fontSize: "18px",
    color: "var(--clay)",
  },

  "@media (max-width: 480px)": {
    padding: "16px",
    gap: "16px",

    "& p": {
      fontSize: "10px",
    },

    "& h4": {
      fontSize: "14px",
    },

    "& h5": {
      fontSize: "16px",
    },
  },

  "@media (max-width: 360px)": {
    flexDirection: "column",
  },
});

const price_block = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",

  "@media (max-width: 360px)": {
    alignItems: "flex-start",
  },
});

const form_place = css({
  display: "flex",
  flexDirection: "column",
  gap: "32px",

  "@media (max-width: 600px)": {
    gap: "24px",
  },

  "@media (max-width: 400px)": {
    gap: "20px",
  },
});

const cp_top_p4 = css({
  display: "flex",
  flexDirection: "column",

  gap: "24px",

  color: "var(--text-muted)",

  "& > div": {
    display: "flex",
    flexDirection: "column",
  },

  "& p": {
    margin: 0,

    textTransform: "uppercase",
    fontWeight: "700",
    fontSize: "12px",
  },

  "& input": {
    width: "100%",
    height: "43px",
    boxSizing: "border-box",

    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid var(--sand-line)",

    color: "var(--text-main)",
    fontFamily: "inherit",
    fontSize: "15px",

    outline: "none",
  },

  "& input:focus": {
    borderBottom: "1px solid var(--clay)",
  },

  "@media (max-width: 480px)": {
    gap: "20px",

    "& p": {
      fontSize: "10px",
    },

    "& input": {
      height: "40px",
      fontSize: "14px",
    },
  },
});

const cp_top_p5 = css({
  display: "flex",
  flexDirection: "column",

  gap: "16px",

  textAlign: "center",

  "& button:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  "& button": {
    width: "100%",

    padding: "16px 20px",

    backgroundColor: "var(--clay)",
    border: "none",
    borderRadius: "100px",

    color: "#f3ede6",
    fontFamily: "inherit",
    fontWeight: "700",
    fontSize: "15px",

    cursor: "pointer",
    transition: "opacity 0.15s ease",

    "&:hover": {
      opacity: 0.9,
    },
  },

  "& p": {
    margin: 0,

    fontWeight: "400",
    fontSize: "12px",
    lineHeight: "150%",
    color: "var(--text-muted)",
  },

  "@media (max-width: 480px)": {
    gap: "12px",

    "& button": {
      padding: "14px 18px",
      fontSize: "14px",
    },

    "& p": {
      fontSize: "11px",
    },
  },
});

const success_content = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  padding: "28px 10px 8px",

  textAlign: "center",
});

const success_icon = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "64px",
  height: "64px",

  marginBottom: "22px",

  backgroundColor: "var(--clay)",
  borderRadius: "50%",

  color: "#f3ede6",
  fontSize: "30px",
  fontWeight: "700",
});

const success_title = css({
  margin: "0 0 10px",

  color: "var(--text-main)",

  fontSize: "26px",
  fontWeight: "800",
});

const success_text = css({
  maxWidth: "420px",

  margin: "0 0 28px",

  color: "var(--text-muted)",

  fontSize: "14px",
  lineHeight: "160%",
});

const success_button = css({
  minWidth: "150px",

  padding: "13px 24px",

  backgroundColor: "var(--clay)",
  border: "none",
  borderRadius: "100px",

  color: "#f3ede6",

  font: "inherit",
  fontSize: "14px",
  fontWeight: "700",

  cursor: "pointer",

  "&:hover": {
    opacity: 0.9,
  },
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function C5_academy_card({
  onClose,
  courseId,
  title,
  description,
  duration,
  price,
  language,
}: Props) {
  const t = translations[language];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Lock page scrolling while the modal is open.
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    if (!name || !email || !phone) {
      return;
    }

    try {
      setIsSubmitting(true);

      await createCourseEnrollment({
        courseId,
        language,
        customer: { name, email, phone },
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Course enrollment failed:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : language === "uk"
            ? "Не вдалося записатися на курс."
            : "Failed to enroll in the course.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <MotionDialog
        overlayClass={overlay}
        panelClass={cx(card_place, "font-onest")}
        onClose={onClose}
        closeOn="click"
      >
          <div className={success_content}>
            <div className={success_icon}>✓</div>

            <h2 className={success_title}>
              {language === "uk"
                ? "Дякуємо за реєстрацію!"
                : "Thank you for registering!"}
            </h2>

            <p className={success_text}>
              {language === "uk"
                ? "Ми отримали вашу заявку на курс. Ми зв’яжемося з вами найближчим часом, щоб підтвердити участь та уточнити деталі."
                : "We have received your course registration. We will contact you shortly to confirm your participation and provide further details."}
            </p>

            <button type="button" className={success_button} onClick={onClose}>
              {language === "uk" ? "Готово" : "Done"}
            </button>
          </div>
      </MotionDialog>
    );
  }

  return (
    <MotionDialog
      overlayClass={overlay}
      panelClass={cx(card_place, "font-onest")}
      onClose={onClose}
      closeOn="click"
    >
        <div className={cp_top}>
          <div className={cp_top_p1}>
            <h3>Specialty Coffee Academy</h3>
          </div>
          <button
            type="button"
            className={cx(close_button, "icon")}
            onClick={onClose}
            aria-label="Close"
          >
            <img src={close_icon} alt="" />
          </button>
        </div>
        <div className={cp_top_p2}>
          <h2 className="font-playfair">{title}</h2>
          <p>{description}</p>
        </div>
        <div className={cp_top_p3}>
          <div>
            <p>{t.c7_card.duration}</p>
            <h4>{duration}</h4>
          </div>
          <div className={price_block}>
            <p>{t.c7_card.price}</p>
            <h5>{price}</h5>
          </div>
        </div>
        <form className={form_place} onSubmit={handleSubmit}>
          <div className={cp_top_p4}>
            <div>
              <p>{t.form.name}</p>
              <input type="text" name="name" autoComplete="name" required />
            </div>
            <div>
              <p>{t.form.email}</p>
              <input type="email" name="email" autoComplete="email" required />
            </div>
            <div>
              <p>{t.form.phone}</p>
              <input type="tel" name="phone" autoComplete="tel" required />
            </div>
          </div>
          <div className={cp_top_p5}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? language === "uk"
                  ? "Надсилаємо..."
                  : "Submitting..."
                : t.c7_card.enroll}
            </button>
            <p>{t.c7_card.enrl_rules}</p>
          </div>
        </form>
    </MotionDialog>
  );
}

export default C5_academy_card;
