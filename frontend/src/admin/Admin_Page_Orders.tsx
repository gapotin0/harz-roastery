import { useState } from "react";
import { css, cx } from "@emotion/css";

import AOrder_EmptyState from "./order/AOrder_EmptyState";
import AOrder_List from "./order/AOrder_List";

import {
  deleteOrder,
  resendOrderNotification,
  updateOrderStatus,
} from "../services/orderApi";

import type { Order, OrderStatus } from "../data/orders";
import {
  adminTranslations,
  type AdminLanguage,
} from "./utils/Admin_translations";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type Props = {
  language: AdminLanguage;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  isLoading: boolean;
};

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------

const page = css({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

const top_bar = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",

  gap: "16px",
});

const order_count = css({
  margin: 0,

  color: "var(--text-muted)",
  fontSize: "14px",
  fontWeight: "600",
});

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------

function AdminOrders({ language, orders, setOrders, isLoading }: Props) {
  const t = adminTranslations[language].orders;
  const [resendingId, setResendingId] = useState<number | null>(null);

  // ----------------------------------------------------------------------
  // STATUS
  // ----------------------------------------------------------------------

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === updatedOrder.id
            ? { ...order, status: updatedOrder.status }
            : order,
        ),
      );
    } catch (error) {
      console.error("Failed to update order status:", error);

      window.alert(
        error instanceof Error ? error.message : "Failed to update order.",
      );
    }
  };

  // ----------------------------------------------------------------------
  // TELEGRAM
  // ----------------------------------------------------------------------

  const handleResend = async (orderId: number) => {
    setResendingId(orderId);

    try {
      const updatedOrder = await resendOrderNotification(orderId);
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order,
        ),
      );
    } catch (error) {
      console.error("Failed to resend order notification:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to send the order to Telegram.",
      );
    } finally {
      setResendingId(null);
    }
  };

  // ----------------------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------------------

  const handleDelete = async (orderId: number) => {
    const order = orders.find((order) => order.id === orderId);

    if (!order) {
      return;
    }

    const shouldDelete = window.confirm(`${t.deleteConfirm}\n\n#${order.id}`);

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteOrder(orderId);
      setOrders((currentOrders) =>
        currentOrders.filter((order) => order.id !== orderId),
      );
    } catch (error) {
      console.error("Failed to delete order:", error);

      window.alert(
        error instanceof Error ? error.message : "Failed to delete order.",
      );
    }
  };

  // ----------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------

  const pluralCategory = new Intl.PluralRules(language).select(orders.length);
  const orderCountLabel =
    pluralCategory === "one"
      ? t.countOne
      : pluralCategory === "few"
        ? t.countFew
        : t.countMany;
  const orderCountText = `${orders.length} ${orderCountLabel}`;

  return (
    <section className={cx(page, "font-onest")}>
      <div className={top_bar}>
        <p className={order_count}>{orderCountText}</p>
      </div>
      {isLoading ? (
        <p>
          {language === "uk"
            ? "Завантаження замовлень..."
            : "Loading orders..."}
        </p>
      ) : orders.length === 0 ? (
        <AOrder_EmptyState language={language} />
      ) : (
        <AOrder_List
          language={language}
          orders={orders}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onResend={handleResend}
          resendingId={resendingId}
        />
      )}
    </section>
  );
}

export default AdminOrders;
