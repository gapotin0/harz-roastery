import { css, cx } from "@emotion/css";

import type { TelegramNotification } from "../data/telegramNotification";
import {
  adminTranslations,
  type AdminLanguage,
} from "./utils/Admin_translations";

type Props = {
  language: AdminLanguage;
  notification?: TelegramNotification;
  isSending: boolean;
  onResend: () => void;
};

const row = css({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",

  marginTop: "8px",
  gap: "8px",
});

const label = css({
  margin: 0,

  color: "var(--text-muted)",
  fontSize: "12px",
  fontWeight: "600",
});

const failed = css({
  color: "var(--clay)",
});

const button = css({
  minHeight: "28px",

  padding: "4px 10px",

  backgroundColor: "transparent",
  border: "1px solid var(--sand-line)",
  borderRadius: "999px",

  color: "var(--text-main)",
  font: "inherit",
  fontSize: "12px",
  fontWeight: "600",

  cursor: "pointer",

  "&:disabled": {
    cursor: "default",
    opacity: 0.6,
  },
});

function ATelegramNotice({
  language,
  notification,
  isSending,
  onResend,
}: Props) {
  const t = adminTranslations[language].telegram;
  const status = notification?.status;
  const canResend = !isSending && status !== "sent" && status !== "pending";

  const text = isSending
    ? t.sending
    : status === "sent"
      ? t.sent
      : status === "pending"
        ? t.pending
        : status === "failed"
          ? t.failed
          : t.missing;

  return (
    <div className={row}>
      <p
        className={cx(label, status === "failed" && !isSending && failed)}
        title={status === "failed" ? notification?.error : undefined}
      >
        {text}
      </p>
      {canResend && (
        <button type="button" className={button} onClick={onResend}>
          {t.resend}
        </button>
      )}
    </div>
  );
}

export default ATelegramNotice;
