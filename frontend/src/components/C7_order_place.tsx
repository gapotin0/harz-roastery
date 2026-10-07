import { useCallback, useEffect, useState } from "react";
import { css, cx } from "@emotion/css";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Checkout from "./Checkout";

import type { OrderItem } from "../data/orders";
import { softEase } from "./motion";
import { roastLabel, translations } from "./translations";

import close_icon from "../assets/close_icon.svg";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: "en" | "uk";
  onClose: () => void;
  cartItems: OrderItem[];
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  refreshProducts: () => Promise<void>;
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const overlay = css({
  position: "fixed",
  inset: 0,
  zIndex: 3000,
  display: "flex",
  justifyContent: "flex-end",

  boxSizing: "border-box",

  backgroundColor: "rgba(0, 0, 0, 0.55)",

  "@media (max-width: 700px)": {
    alignItems: "stretch",
    padding: "0",
  },
});

const order_place = css({
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",

  width: "100%",
  maxWidth: "505px",
  height: "100vh",
  boxSizing: "border-box",

  backgroundColor: "var(--bg-card, #1c1512)",
  borderLeft: "1px solid var(--sand-line)",
  opacity: 1,
  boxShadow: "-20px 0 50px rgba(0, 0, 0, 0.25)",

  color: "var(--text-main)",

  "@media (max-width: 600px)": {
    maxWidth: "100%",
  },
});

const order_header = css({
  flexShrink: 0,

  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  padding: "40px 48px 26px",
  gap: "16px",

  backgroundColor: "var(--bg-card, #1c1512)",

  "& h2": {
    display: "flex",
    alignItems: "center",

    margin: 0,

    fontSize: "30px",
    lineHeight: 1.1,
    fontWeight: "800",
    letterSpacing: "-0.6px",
  },

  "@media (max-width: 600px)": {
    padding: "28px 20px 22px",

    "& h2": {
      fontSize: "27px",
    },
  },
});

const count_badge = css({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,

  minWidth: "28px",
  height: "28px",
  boxSizing: "border-box",

  marginLeft: "10px",
  padding: "0 8px",

  backgroundColor: "var(--clay)",
  borderRadius: "100px",

  color: "#f3ede6",
  fontSize: "12px",
  fontWeight: "700",
});

const close_button = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,

  width: "40px",
  height: "40px",

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

const order_items = css({
  flex: 1,
  minHeight: 0,

  display: "flex",
  flexDirection: "column",
  overflowY: "auto",

  padding: "0 48px 24px",

  scrollbarWidth: "thin",
  scrollbarColor: "var(--sand-line) transparent",

  "&::-webkit-scrollbar": {
    width: "6px",
  },

  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "var(--sand-line)",
    borderRadius: "100px",
  },

  "@media (max-width: 600px)": {
    padding: "0 20px 20px",
  },
});

const order_item = css({
  display: "flex",
  flexDirection: "column",

  padding: "20px 0",
  gap: "16px",

  borderBottom: "1px solid var(--sand-line)",

  "&:first-child": {
    paddingTop: 8,
  },
});

const item_top = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",

  gap: "20px",

  "& h3": {
    margin: 0,

    fontSize: "18px",
    lineHeight: 1.25,
    fontWeight: "700",
  },

  "& h4": {
    margin: 0,

    fontSize: "17px",
    lineHeight: 1.2,
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  "& p": {
    margin: "0 0 7px",

    color: "var(--text-muted)",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
});

const item_bottom = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  gap: "16px",
});

const quantity = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  minWidth: "114px",
  boxSizing: "border-box",

  padding: "8px 14px",
  gap: "16px",

  border: "1px solid var(--sand-line)",
  borderRadius: "100px",

  "& button": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    width: "18px",
    height: "18px",

    padding: 0,

    background: "none",
    border: "none",

    color: "var(--text-muted)",
    fontSize: "18px",

    cursor: "pointer",

    "&:disabled": {
      opacity: 0.3,
      cursor: "not-allowed",
    },
  },

  "& span": {
    minWidth: "16px",

    textAlign: "center",
    fontSize: "14px",
    fontWeight: "700",
  },
});

const remove_button = css({
  padding: 0,

  background: "none",
  border: "none",

  color: "var(--text-muted)",
  fontFamily: "inherit",
  fontSize: "14px",

  cursor: "pointer",
  transition: "color 0.15s ease",

  "&:hover": {
    color: "var(--text-main)",
  },
});

const empty_cart = css({
  padding: "40px 0",
  textAlign: "center",
  color: "var(--text-muted)",

  "& p": {
    margin: 0,
    fontSize: "14px",
  },
});

const order_bottom = css({
  flexShrink: 0,

  padding: "26px 48px 28px",

  backgroundColor: "var(--bg-card, #1c1512)",
  borderTop: "1px solid var(--sand-line)",

  "@media (max-width: 600px)": {
    padding: "22px 20px 24px",
  },
});

const subtotal = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  marginBottom: "24px",

  "& p": {
    margin: 0,
    color: "var(--text-muted)",
    fontSize: "17px",
  },

  "& h3": {
    margin: 0,

    fontSize: "26px",
    lineHeight: 1,
    fontWeight: "800",
    letterSpacing: "-0.4px",
  },
});

const order_note = css({
  maxWidth: "390px",

  margin: "0 0 26px",

  color: "var(--text-muted)",
  fontSize: "13px",
  lineHeight: "1.55",
});

const checkout_button = css({
  width: "100%",

  padding: "15px 20px",

  backgroundColor: "var(--clay)",
  border: "none",
  borderRadius: "100px",

  color: "#f3ede6",
  fontFamily: "inherit",
  fontSize: "15px",
  fontWeight: "700",

  cursor: "pointer",
  transition: "opacity 0.15s ease",

  "&:hover": {
    opacity: 0.9,
  },

  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

const continue_button = css({
  width: "100%",

  marginTop: "20px",

  background: "none",
  border: "none",

  color: "var(--text-muted)",
  fontFamily: "inherit",
  fontSize: "14px",
  fontWeight: "500",
  textDecoration: "underline",

  cursor: "pointer",
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function C7_order_place({
  language,
  onClose,
  cartItems,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  refreshProducts,
}: Props) {
  const t = translations[language];

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [present, setPresent] = useState(true);
  const reduceMotion = Boolean(useReducedMotion());

  const requestClose = useCallback(() => {
    if (reduceMotion) {
      onClose();
      return;
    }

    setPresent(false);
  }, [onClose, reduceMotion]);

  // Lock page scrolling while the cart is open.
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [requestClose]);

  const handleDecrease = (item: OrderItem) => {
    if (item.quantity === 1) {
      removeFromCart(item.id);
      return;
    }

    decreaseQuantity(item.id);
  };

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <AnimatePresence onExitComplete={onClose}>
      {present && (
        <motion.div
          key="cart"
          className={overlay}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              requestClose();
            }
          }}
        >
          <motion.div
            className={order_place}
            initial={reduceMotion ? false : { x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%" }}
            transition={{ duration: reduceMotion ? 0 : 0.34, ease: softEase }}
            onMouseDown={(event) => event.stopPropagation()}
          >
        <div className={order_header}>
          <h2>
            {t.cart.title}
            <span className={count_badge}>{totalQuantity}</span>
          </h2>
          <button
            className={cx(close_button, "icon")}
            onClick={requestClose}
            type="button"
            aria-label={t.cart.close}
          >
            <img src={close_icon} alt="" />
          </button>
        </div>
        <div className={order_items}>
          {cartItems.length === 0 ? (
            <div className={empty_cart}>
              <p>{t.cart.empty}</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className={order_item} key={item.id}>
                <div className={item_top}>
                  <div>
                    <p>
                      {roastLabel(item.roast, language)} • {item.weight}
                    </p>
                    <h3>{item.name}</h3>
                  </div>
                  <h4>
                    ₴{(item.price * item.quantity).toLocaleString("en-US")}
                  </h4>
                </div>
                <div className={item_bottom}>
                  <div className={quantity}>
                    <button
                      type="button"
                      onClick={() => handleDecrease(item)}
                      aria-label={`${t.cart.decrease} ${item.name}`}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      disabled={item.quantity >= item.stock}
                      aria-label={`${t.cart.increase} ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className={remove_button}
                    onClick={() => removeFromCart(item.id)}
                  >
                    {t.cart.remove}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={order_bottom}>
          <div className={subtotal}>
            <p>{t.cart.subtotal}</p>
            <h3>₴{subtotalPrice.toLocaleString("en-US")}</h3>
          </div>
          <p className={order_note}>{t.cart.note}</p>
          <button
            className={checkout_button}
            type="button"
            disabled={cartItems.length === 0}
            onClick={() => setCheckoutOpen(true)}
          >
            {t.cart.checkout}
          </button>
          <button className={continue_button} onClick={requestClose} type="button">
            {t.cart.continue_shopping}
          </button>
        </div>
          </motion.div>
      {checkoutOpen && (
        <Checkout
          language={language}
          cartItems={cartItems}
          clearCart={clearCart}
          onClose={() => setCheckoutOpen(false)}
          onOrderComplete={async () => {
            await refreshProducts();
          }}
          onSuccessClose={() => {
            setCheckoutOpen(false);
            requestClose();
          }}
        />
      )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default C7_order_place;
