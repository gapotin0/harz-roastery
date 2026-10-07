import { css } from "@emotion/css";

import ATelegramNotice from "../ATelegramNotice";
import AOrder_StatusSelect from "./AOrder_StatusSelect";

import type { Order, OrderStatus } from "../../data/orders";
import {
  adminTranslations,
  type AdminLanguage,
} from "../utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: AdminLanguage;
  order: Order;
  onStatusChange: (orderId: number, status: OrderStatus) => void;
  onDelete: (orderId: number) => void;
  onResend: (orderId: number) => void;
  isResending: boolean;
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const card = css({
  overflow: "visible",

  boxSizing: "border-box",

  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--sand-line)",
  borderRadius: "20px",
});

const header = css({
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",

  padding: "20px 22px",
  gap: "20px",

  borderBottom: "1px solid var(--sand-line)",

  "@media (max-width: 700px)": {
    flexDirection: "column",
  },
});

const title = css({
  display: "flex",
  flexDirection: "column",
  gap: "6px",

  "& h3": {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
  },

  "& p": {
    margin: 0,
    color: "var(--text-muted)",
    fontSize: "13px",
  },
});

const header_right = css({
  position: "relative",
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",

  gap: "12px",

  "@media (max-width: 700px)": {
    width: "100%",
  },
});

const delete_button = css({
  minHeight: "42px",

  padding: "10px 14px",

  backgroundColor: "transparent",
  border: "1px solid var(--sand-line)",
  borderRadius: "12px",

  color: "var(--text-muted)",
  font: "inherit",
  fontSize: "13px",
  fontWeight: "600",

  cursor: "pointer",
  transition:
    "border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease",

  "&:hover": {
    backgroundColor: "var(--chip-bg)",
    borderColor: "var(--clay)",
    color: "var(--text-main)",
  },
});

const body = css({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",

  padding: "22px",
  gap: "28px",

  "@media (max-width: 850px)": {
    gridTemplateColumns: "1fr",
  },
});

const section = css({
  display: "flex",
  flexDirection: "column",
  gap: "14px",

  "& h4": {
    margin: 0,
    fontSize: "14px",
    fontWeight: "800",
  },
});

const customer_info = css({
  display: "grid",
  margin: 0,
  gap: "9px",

  "& div": {
    display: "grid",
    gridTemplateColumns: "90px 1fr",
    alignItems: "start",

    gap: "12px",
  },

  "& dt": {
    margin: 0,

    color: "var(--text-muted)",
    fontSize: "12px",
    fontWeight: "600",
  },

  "& dd": {
    margin: 0,

    color: "var(--text-main)",
    fontSize: "13px",
    wordBreak: "break-word",
  },

  "@media (max-width: 480px)": {
    "& div": {
      gridTemplateColumns: "1fr",
      gap: "4px",
    },
  },
});

const items_list = css({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

const item_row = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",

  paddingBottom: "10px",
  gap: "16px",

  borderBottom: "1px solid var(--sand-line)",

  "&:last-child": {
    paddingBottom: 0,
    borderBottom: "none",
  },
});

const item_info = css({
  display: "flex",
  flexDirection: "column",
  gap: "4px",

  "& strong": {
    fontSize: "13px",
  },

  "& span": {
    color: "var(--text-muted)",
    fontSize: "12px",
  },
});

const item_price = css({
  whiteSpace: "nowrap",
  fontSize: "13px",
  fontWeight: "700",
});

const footer = css({
  display: "flex",
  justifyContent: "flex-end",

  padding: "18px 22px",

  borderTop: "1px solid var(--sand-line)",
});

const total = css({
  display: "flex",
  alignItems: "center",
  gap: "16px",

  "& span": {
    color: "var(--text-muted)",
    fontSize: "14px",
  },

  "& strong": {
    fontSize: "20px",
    fontWeight: "800",
  },
});

// ----------------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------------

const formatDate = (date: string, language: AdminLanguage) => {
  const parsedDate = new Date(date);

  return parsedDate.toLocaleString(language === "uk" ? "uk-UA" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function AOrder_Card({
  language,
  order,
  onStatusChange,
  onDelete,
  onResend,
  isResending,
}: Props) {
  const t = adminTranslations[language].orders;

  return (
    <article className={card}>
      <div className={header}>
        <div className={title}>
          <h3>
            {t.order} #{order.id}
          </h3>
          <p>{formatDate(order.createdAt, language)}</p>
          <ATelegramNotice
            language={language}
            notification={order.notification}
            isSending={isResending}
            onResend={() => onResend(order.id)}
          />
        </div>
        <div className={header_right}>
          <AOrder_StatusSelect
            language={language}
            status={order.status}
            onChange={(status) => onStatusChange(order.id, status)}
          />
          <button
            type="button"
            className={delete_button}
            onClick={() => onDelete(order.id)}
          >
            {t.delete}
          </button>
        </div>
      </div>
      <div className={body}>
        <section className={section}>
          <h4>{t.customer}</h4>
          <dl className={customer_info}>
            <div>
              <dt>{t.name}</dt>
              <dd>{order.customer.name}</dd>
            </div>
            <div>
              <dt>{t.phone}</dt>
              <dd>{order.customer.phone}</dd>
            </div>
            <div>
              <dt>{t.email}</dt>
              <dd>{order.customer.email}</dd>
            </div>
            <div>
              <dt>{t.city}</dt>
              <dd>{order.customer.city}</dd>
            </div>
            <div>
              <dt>{t.address}</dt>
              <dd>{order.customer.address}</dd>
            </div>
            {order.customer.comment && (
              <div>
                <dt>{t.comment}</dt>
                <dd>{order.customer.comment}</dd>
              </div>
            )}
          </dl>
        </section>
        <section className={section}>
          <h4>{t.items}</h4>
          <div className={items_list}>
            {order.items.map((item) => (
              <div key={item.id} className={item_row}>
                <div className={item_info}>
                  <strong>{item.name}</strong>
                  <span>
                    {item.roast} • {item.weight} • ×{item.quantity}
                  </span>
                </div>
                <div className={item_price}>
                  ₴{(item.price * item.quantity).toLocaleString("en-US")}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className={footer}>
        <div className={total}>
          <span>{t.total}</span>
          <strong>₴{order.total.toLocaleString("en-US")}</strong>
        </div>
      </div>
    </article>
  );
}

export default AOrder_Card;
