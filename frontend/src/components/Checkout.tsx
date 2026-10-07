import { useState, type FormEvent } from "react";
import { css, cx } from "@emotion/css";

import { createOrder } from "../services/orderApi";
import { roastLabel } from "./translations";

import close_icon from "../assets/close_icon.svg";

import type { OrderCustomer, OrderItem } from "../data/orders";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: "en" | "uk";
  cartItems: OrderItem[];
  clearCart: () => void;
  onClose: () => void;
  onOrderComplete: () => void | Promise<void>;
  onSuccessClose: () => void;
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

const checkout_card = css({
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

  "& textarea": {
    minHeight: "90px",
    resize: "vertical",
  },
});

const full_width = css({
  gridColumn: "1 / -1",

  "@media (max-width: 600px)": {
    gridColumn: "auto",
  },
});

const summary = css({
  padding: "18px",

  backgroundColor: "var(--chip-bg)",
  border: "1px solid var(--sand-line)",
  borderRadius: "16px",
});

const summary_row = css({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",

  padding: "10px 0",
  gap: "16px",

  color: "var(--text-main)",
  fontSize: "14px",

  "&:first-child": {
    paddingTop: 0,
  },

  "&:last-of-type": {
    paddingBottom: 0,
  },
});

const item_name = css({
  display: "flex",
  flexDirection: "column",
  gap: "3px",
});

const item_details = css({
  color: "var(--text-muted)",
  fontSize: "12px",
});

const total_row = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  marginTop: "14px",
  paddingTop: "16px",
  gap: "16px",

  borderTop: "1px solid var(--sand-line)",

  fontSize: "18px",
  fontWeight: "800",
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

  "&:hover": {
    opacity: 0.9,
  },

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
// COMPONENT
// ----------------------------------------------------------------------

function Checkout({
  language,
  cartItems,
  clearCart,
  onClose,
  onOrderComplete,
  onSuccessClose,
}: Props) {
  const isUk = language === "uk";

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  const [customer, setCustomer] = useState<OrderCustomer>({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    comment: "",
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const changeField = (field: keyof OrderCustomer, value: string) => {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cartItems.length === 0 || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      await createOrder({
        customer: {
          name: customer.name.trim(),
          phone: customer.phone.trim(),
          email: customer.email.trim(),
          city: customer.city.trim(),
          address: customer.address.trim(),
          comment: customer.comment.trim(),
        },

        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      await onOrderComplete();
      setIsSuccess(true);
    } catch (error) {
      console.error("Order creation failed:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : isUk
            ? "Не вдалося оформити замовлення."
            : "Failed to place order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        className={overlay}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onSuccessClose();
          }
        }}
      >
        <div
          className={checkout_card}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className={success_content}>
            <div className={success_icon}>✓</div>

            <h2 className={success_title}>
              {language === "uk"
                ? "Дякуємо за замовлення!"
                : "Thank you for your order!"}
            </h2>

            <p className={success_text}>
              {language === "uk"
                ? "Ваше замовлення прийнято. Ми зв’яжемося з вами найближчим часом, щоб уточнити деталі."
                : "Your order has been received. We will contact you shortly to confirm the details."}
            </p>

            <button
              type="button"
              className={success_button}
              onClick={onSuccessClose}
            >
              {language === "uk" ? "Готово" : "Done"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={checkout_card}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={header}>
          <div>
            <h2>{isUk ? "Оформлення замовлення" : "Checkout"}</h2>

            <p>
              {isUk
                ? "Заповніть контактні дані та адресу доставки."
                : "Enter your contact details and delivery address."}
            </p>
          </div>

          <button
            type="button"
            className={close_button}
            onClick={onClose}
            aria-label={isUk ? "Закрити" : "Close"}
          >
            <img src={close_icon} alt="" />
          </button>
        </div>

        <form className={form} onSubmit={handleSubmit}>
          <section className={section}>
            <h3>{isUk ? "Контактні дані" : "Contact details"}</h3>

            <div className={fields_grid}>
              <div className={field}>
                <label htmlFor="checkout-name">{isUk ? "Ім'я" : "Name"}</label>

                <input
                  id="checkout-name"
                  type="text"
                  value={customer.name}
                  onChange={(event) => changeField("name", event.target.value)}
                  required
                />
              </div>

              <div className={field}>
                <label htmlFor="checkout-email">Email</label>

                <input
                  id="checkout-email"
                  type="email"
                  value={customer.email}
                  onChange={(event) => changeField("email", event.target.value)}
                  required
                />
              </div>

              <div className={field}>
                <label htmlFor="checkout-phone">
                  {isUk ? "Телефон" : "Phone"}
                </label>

                <input
                  id="checkout-phone"
                  type="tel"
                  value={customer.phone}
                  onChange={(event) => changeField("phone", event.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          <section className={section}>
            <h3>{isUk ? "Доставка" : "Delivery"}</h3>

            <div className={fields_grid}>
              <div className={field}>
                <label htmlFor="checkout-city">{isUk ? "Місто" : "City"}</label>

                <input
                  id="checkout-city"
                  type="text"
                  value={customer.city}
                  onChange={(event) => changeField("city", event.target.value)}
                  required
                />
              </div>

              <div className={field}>
                <label htmlFor="checkout-address">
                  {isUk ? "Адреса" : "Address"}
                </label>

                <input
                  id="checkout-address"
                  type="text"
                  value={customer.address}
                  onChange={(event) =>
                    changeField("address", event.target.value)
                  }
                  required
                />
              </div>

              <div className={cx(field, full_width)}>
                <label htmlFor="checkout-comment">
                  {isUk ? "Коментар" : "Comment"}
                </label>

                <textarea
                  id="checkout-comment"
                  placeholder={
                    isUk
                      ? "Побажання щодо доставки або замовлення..."
                      : "Delivery or order preferences..."
                  }
                  value={customer.comment}
                  onChange={(event) =>
                    changeField("comment", event.target.value)
                  }
                />
              </div>
            </div>
          </section>

          <section className={section}>
            <h3>{isUk ? "Ваше замовлення" : "Order summary"}</h3>

            <div className={summary}>
              {cartItems.map((item) => (
                <div key={item.id} className={summary_row}>
                  <div className={item_name}>
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span className={item_details}>
                      {roastLabel(item.roast, language)} · {item.weight}
                    </span>
                  </div>

                  <span>
                    ₴{(item.price * item.quantity).toLocaleString("en-US")}
                  </span>
                </div>
              ))}

              <div className={total_row}>
                <span>{isUk ? "Разом" : "Total"}</span>

                <span>₴{totalPrice.toLocaleString("en-US")}</span>
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
              disabled={cartItems.length === 0 || isSubmitting}
            >
              {isSubmitting
                ? isUk
                  ? "Оформлюємо..."
                  : "Placing order..."
                : isUk
                  ? "Підтвердити замовлення"
                  : "Place order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
