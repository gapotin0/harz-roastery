import { css } from "@emotion/css";

import ATelegramNotice from "../ATelegramNotice";
import ARoast_StatusSelect from "./ARoast_StatusSelect";

import type {
  CustomRoastingRequest,
  CustomRoastingStatus,
} from "../../data/customRoasting";
import {
  adminTranslations,
  type AdminLanguage,
} from "../utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: AdminLanguage;
  request: CustomRoastingRequest;
  onStatusChange: (id: number, status: CustomRoastingStatus) => void;
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

    fontSize: "13px",
    fontWeight: "800",
    textTransform: "uppercase",
    color: "var(--text-muted)",
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

const message_box = css({
  padding: "14px",

  backgroundColor: "var(--chip-bg)",
  borderRadius: "12px",

  color: "var(--text-muted)",
  fontSize: "13px",
  lineHeight: "150%",
  whiteSpace: "pre-wrap",
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

function ARoast_Card({
  language,
  request,
  onStatusChange,
  onDelete,
  onResend,
  isResending,
}: Props) {
  const t = adminTranslations[language].roasting;
  const roastLevelLabels: Record<string, string> = {
    Light: t.roastLevels.light,
    Medium: t.roastLevels.medium,
    Dark: t.roastLevels.dark,
    "Not sure": t.roastLevels.notSure,
  };

  const purposeLabels: Record<string, string> = {
    Filter: t.purposes.filter,
    Espresso: t.purposes.espresso,
    Omni: t.purposes.omni,
    Other: t.purposes.other,
  };

  const createdAt = new Date(request.createdAt).toLocaleString(
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
          <h3>{request.customer.name}</h3>
          <p>
            {t.request} #{request.id}
            {" · "}
            {createdAt}
          </p>
          <ATelegramNotice
            language={language}
            notification={request.notification}
            isSending={isResending}
            onResend={() => onResend(request.id)}
          />
        </div>
        <ARoast_StatusSelect
          language={language}
          status={request.status}
          onChange={(status) => onStatusChange(request.id, status)}
        />
      </div>
      <section className={section}>
        <h4>{t.customer}</h4>
        <div className={grid}>
          <div className={info}>
            <span>{t.email}</span>
            <strong>{request.customer.email}</strong>
          </div>
          <div className={info}>
            <span>{t.phone}</span>
            <strong>{request.customer.phone}</strong>
          </div>
        </div>
      </section>
      <section className={section}>
        <h4>{t.roastingDetails}</h4>
        <div className={grid}>
          <div className={info}>
            <span>{t.coffeeOrigin}</span>
            <strong>{request.coffee.origin}</strong>
          </div>
          <div className={info}>
            <span>{t.quantity}</span>
            <strong>{request.coffee.quantity}</strong>
          </div>
          <div className={info}>
            <span>{t.roastLevel}</span>
            <strong>
              {roastLevelLabels[request.coffee.roast] ?? request.coffee.roast}
            </strong>
          </div>
          <div className={info}>
            <span>{t.purpose}</span>
            <strong>
              {purposeLabels[request.coffee.purpose] ?? request.coffee.purpose}
            </strong>
          </div>
        </div>
      </section>
      {request.message && (
        <section className={section}>
          <h4>{t.additionalInformation}</h4>
          <div className={message_box}>{request.message}</div>
        </section>
      )}
      <div className={footer}>
        <button
          type="button"
          className={delete_button}
          onClick={() => onDelete(request.id)}
        >
          {t.delete}
        </button>
      </div>
    </article>
  );
}

export default ARoast_Card;
