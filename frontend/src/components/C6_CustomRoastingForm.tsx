import { useEffect, useRef, useState, type FormEvent } from "react";
import { css, cx } from "@emotion/css";

import { createCustomRoastingRequest } from "../services/customRoastingApi";

import { MotionDialog } from "./motion";

import close_icon from "../assets/close_icon.svg";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: "en" | "uk";
  onClose: () => void;
};

type FormState = {
  name: string;
  email: string;
  phone: string;

  origin: string;
  quantity: string;
  roast: string;
  purpose: string;

  message: string;
};

type SelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  id: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

// ----------------------------------------------------------------------
// INITIAL FORM
// ----------------------------------------------------------------------

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",

  origin: "",
  quantity: "",
  roast: "Light",
  purpose: "Filter",

  message: "",
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const overlay = css({
  position: "fixed",
  inset: 0,
  zIndex: 5000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  boxSizing: "border-box",

  padding: "20px",

  backgroundColor: "rgba(0, 0, 0, 0.6)",

  "@media (max-width: 700px)": {
    alignItems: "flex-start",
    overflowY: "auto",
    padding: "12px",
  },
});

const modal = css({
  overflowY: "auto",

  width: "100%",
  maxWidth: "720px",
  maxHeight: "calc(100vh - 40px)",
  boxSizing: "border-box",

  padding: "28px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "24px",

  color: "var(--text-main)",

  "@media (max-width: 700px)": {
    maxHeight: "none",
    padding: "20px",
    borderRadius: "18px",
  },
});

const header = css({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",

  marginBottom: "24px",
  gap: "20px",

  "& h2": {
    margin: 0,

    fontSize: "26px",
    fontWeight: "800",
    lineHeight: "125%",
  },

  "& p": {
    margin: "8px 0 0",

    color: "var(--text-muted)",
    fontSize: "14px",
    lineHeight: "150%",
  },

  "@media (max-width: 480px)": {
    "& h2": {
      fontSize: "22px",
    },
  },
});

const close_button = css({
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "34px",
  height: "34px",

  padding: 0,

  backgroundColor: "var(--chip-bg)",
  border: "none",
  borderRadius: "50%",

  cursor: "pointer",

  "& img": {
    width: "15px",
    height: "15px",
  },
});

const form = css({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

const section = css({
  display: "flex",
  flexDirection: "column",
  gap: "14px",

  "& h3": {
    margin: 0,
    fontSize: "15px",
    fontWeight: "800",
  },
});

const fields_grid = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "14px",

  "@media (max-width: 600px)": {
    gridTemplateColumns: "1fr",
  },
});

const field = css({
  display: "flex",
  flexDirection: "column",
  gap: "7px",

  "& label": {
    color: "var(--text-muted)",
    fontSize: "12px",
    fontWeight: "700",
  },

  "& input, & textarea": {
    width: "100%",
    boxSizing: "border-box",

    padding: "12px 14px",

    backgroundColor: "var(--chip-bg)",
    border: "1px solid var(--sand-line)",
    borderRadius: "12px",

    color: "var(--text-main)",
    font: "inherit",
    fontSize: "14px",

    outline: "none",
    transition: "border-color 0.15s ease, background-color 0.15s ease",

    "&:hover": {
      borderColor: "var(--text-muted)",
    },

    "&:focus": {
      borderColor: "var(--clay)",
    },
  },
});

const full_width = css({
  gridColumn: "1 / -1",

  "@media (max-width: 600px)": {
    gridColumn: "auto",
  },
});

const footer = css({
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",

  "@media (max-width: 480px)": {
    display: "grid",
    gridTemplateColumns: "1fr",

    "& button": {
      width: "100%",
    },
  },
});

const base_button = css({
  padding: "12px 18px",

  borderRadius: "100px",

  font: "inherit",
  fontSize: "14px",
  fontWeight: "700",

  cursor: "pointer",
});

const cancel_button = css({
  backgroundColor: "transparent",
  border: "1px solid var(--sand-line)",
  color: "var(--text-main)",

  "&:hover": {
    backgroundColor: "var(--chip-bg)",
  },
});

const submit_button = css({
  backgroundColor: "var(--clay)",
  border: "none",
  color: "#f3ede6",

  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
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
  maxWidth: "460px",

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
// CUSTOM SELECT STYLES
// ----------------------------------------------------------------------

const custom_select = css({
  position: "relative",
  width: "100%",
});

const custom_select_button = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  width: "100%",
  boxSizing: "border-box",

  padding: "12px 14px",

  backgroundColor: "var(--chip-bg)",
  border: "1px solid var(--sand-line)",
  borderRadius: "12px",

  color: "var(--text-main)",
  font: "inherit",
  fontSize: "14px",
  textAlign: "left",

  cursor: "pointer",
  transition: "border-color 0.15s ease",

  "&:hover": {
    borderColor: "var(--text-muted)",
  },
});

const custom_select_button_open = css({
  borderColor: "var(--clay)",
});

const custom_select_arrow = css({
  width: 0,
  height: 0,

  marginLeft: "12px",

  borderLeft: "5px solid transparent",
  borderRight: "5px solid transparent",
  borderTop: "5px solid var(--text-muted)",

  transition: "transform 0.15s ease, border-color 0.15s ease",
});

const custom_select_arrow_open = css({
  borderTopColor: "var(--clay)",
  transform: "rotate(180deg)",
});

const custom_select_menu = css({
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  zIndex: 50,

  width: "100%",
  boxSizing: "border-box",

  padding: "6px",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "12px",
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
});

const custom_select_option = css({
  width: "100%",

  padding: "10px 12px",

  backgroundColor: "transparent",
  border: "none",
  borderRadius: "8px",

  color: "var(--text-main)",
  font: "inherit",
  fontSize: "14px",
  textAlign: "left",

  cursor: "pointer",

  "&:hover": {
    backgroundColor: "var(--chip-bg)",
  },
});

const custom_select_option_active = css({
  backgroundColor: "var(--chip-bg)",
  color: "var(--clay)",
});

// ----------------------------------------------------------------------
// CUSTOM SELECT
// ----------------------------------------------------------------------

function CustomSelect({ id, value, options, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  return (
    <div ref={selectRef} className={custom_select}>
      <button
        id={id}
        type="button"
        className={cx(
          custom_select_button,
          isOpen && custom_select_button_open,
        )}
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption.label}</span>
        <span
          className={cx(
            custom_select_arrow,
            isOpen && custom_select_arrow_open,
          )}
        />
      </button>
      {isOpen && (
        <div className={custom_select_menu} role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={cx(
                custom_select_option,
                option.value === value && custom_select_option_active,
              )}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function C6_CustomRoastingForm({ language, onClose }: Props) {
  const isUk = language === "uk";

  const [formData, setFormData] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.origin.trim() ||
      !formData.quantity.trim()
    ) {
      return;
    }

    try {
      setIsSubmitting(true);

      await createCustomRoastingRequest({
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
        coffee: {
          origin: formData.origin.trim(),
          quantity: formData.quantity.trim(),
          roast: formData.roast,
          purpose: formData.purpose,
        },
        message: formData.message.trim(),
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Custom roasting request failed:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : language === "uk"
            ? "Не вдалося надіслати заявку."
            : "Failed to send request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <MotionDialog
        overlayClass={overlay}
        panelClass={cx(modal, "font-onest")}
        onClose={onClose}
      >
          <div className={success_content}>
            <div className={success_icon}>✓</div>

            <h2 className={success_title}>
              {isUk ? "Дякуємо за заявку!" : "Thank you for your request!"}
            </h2>

            <p className={success_text}>
              {isUk
                ? "Ми отримали вашу заявку на індивідуальне обсмажування. Ми зв’яжемося з вами найближчим часом, щоб уточнити деталі."
                : "We have received your custom roasting request. We will contact you shortly to confirm the details."}
            </p>

            <button type="button" className={success_button} onClick={onClose}>
              {isUk ? "Готово" : "Done"}
            </button>
          </div>
      </MotionDialog>
    );
  }

  return (
    <MotionDialog
      overlayClass={overlay}
      panelClass={cx(modal, "font-onest")}
      onClose={onClose}
    >
        <div className={header}>
          <div>
            <h2>
              {isUk ? "Індивідуальне обсмажування" : "Custom Roasting Request"}
            </h2>
            <p>
              {isUk
                ? "Розкажіть нам, яку каву ви хочете обсмажити, і ми зв’яжемося з вами."
                : "Tell us what kind of coffee you need roasted, and we will contact you."}
            </p>
          </div>
          <button
            type="button"
            className={close_button}
            onClick={onClose}
            aria-label="Close"
          >
            <img src={close_icon} alt="" />
          </button>
        </div>
        <form className={form} onSubmit={handleSubmit}>
          <section className={section}>
            <h3>{isUk ? "Контактні дані" : "Contact details"}</h3>
            <div className={fields_grid}>
              <div className={field}>
                <label htmlFor="custom-roast-name">
                  {isUk ? "Ім’я" : "Name"}
                </label>
                <input
                  id="custom-roast-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className={field}>
                <label htmlFor="custom-roast-email">Email</label>
                <input
                  id="custom-roast-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className={field}>
                <label htmlFor="custom-roast-phone">
                  {isUk ? "Телефон" : "Phone"}
                </label>
                <input
                  id="custom-roast-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          </section>
          <section className={section}>
            <h3>{isUk ? "Параметри обсмажування" : "Roasting details"}</h3>
            <div className={fields_grid}>
              <div className={field}>
                <label htmlFor="custom-roast-origin">
                  {isUk ? "Походження кави" : "Coffee origin"}
                </label>
                <input
                  id="custom-roast-origin"
                  type="text"
                  placeholder={
                    isUk
                      ? "Наприклад: Ефіопія, Кенія..."
                      : "Example: Ethiopia, Kenya..."
                  }
                  value={formData.origin}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      origin: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className={field}>
                <label htmlFor="custom-roast-quantity">
                  {isUk ? "Кількість" : "Quantity"}
                </label>
                <input
                  id="custom-roast-quantity"
                  type="text"
                  placeholder={isUk ? "Наприклад: 10 кг" : "Example: 10 kg"}
                  value={formData.quantity}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      quantity: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className={field}>
                <label htmlFor="custom-roast-level">
                  {isUk ? "Обсмажування" : "Roast level"}
                </label>

                <CustomSelect
                  id="custom-roast-level"
                  value={formData.roast}
                  options={[
                    {
                      value: "Light",
                      label: isUk ? "Світле" : "Light",
                    },
                    {
                      value: "Medium",
                      label: isUk ? "Середнє" : "Medium",
                    },
                    {
                      value: "Dark",
                      label: isUk ? "Темне" : "Dark",
                    },
                    {
                      value: "Not sure",
                      label: isUk ? "Не впевнений" : "Not sure",
                    },
                  ]}
                  onChange={(value) =>
                    setFormData((current) => ({
                      ...current,
                      roast: value,
                    }))
                  }
                />
              </div>
              <div className={field}>
                <label htmlFor="custom-roast-purpose">
                  {isUk ? "Для чого" : "Purpose"}
                </label>

                <CustomSelect
                  id="custom-roast-purpose"
                  value={formData.purpose}
                  options={[
                    {
                      value: "Filter",
                      label: isUk ? "Фільтр" : "Filter",
                    },
                    {
                      value: "Espresso",
                      label: "Espresso",
                    },
                    {
                      value: "Omni",
                      label: "Omni",
                    },
                    {
                      value: "Other",
                      label: isUk ? "Інше" : "Other",
                    },
                  ]}
                  onChange={(value) =>
                    setFormData((current) => ({
                      ...current,
                      purpose: value,
                    }))
                  }
                />
              </div>
              <div className={cx(field, full_width)}>
                <label htmlFor="custom-roast-message">
                  {isUk ? "Додаткова інформація" : "Additional information"}
                </label>
                <textarea
                  id="custom-roast-message"
                  placeholder={
                    isUk
                      ? "Побажання щодо профілю, смаку, пакування..."
                      : "Preferences for profile, flavour, packaging..."
                  }
                  value={formData.message}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </section>
          <div className={footer}>
            <button
              type="button"
              className={cx(base_button, cancel_button)}
              onClick={onClose}
            >
              {isUk ? "Скасувати" : "Cancel"}
            </button>
            <button
              type="submit"
              className={cx(base_button, submit_button)}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isUk
                  ? "Надсилаємо..."
                  : "Sending..."
                : isUk
                  ? "Надіслати заявку"
                  : "Send request"}
            </button>
          </div>
        </form>
    </MotionDialog>
  );
}

export default C6_CustomRoastingForm;
