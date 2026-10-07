import { css } from "@emotion/css";

import AOrder_Card from "./AOrder_Card";

import type { Order, OrderStatus } from "../../data/orders";
import type { AdminLanguage } from "../utils/Admin_translations";

type Props = {
  language: AdminLanguage;
  orders: Order[];
  onStatusChange: (orderId: number, status: OrderStatus) => void;
  onDelete: (orderId: number) => void;
  onResend: (orderId: number) => void;
  resendingId: number | null;
};

const list = css({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

function AOrder_List({
  language,
  orders,
  onStatusChange,
  onDelete,
  onResend,
  resendingId,
}: Props) {
  return (
    <div className={list}>
      {orders.map((order) => (
        <AOrder_Card
          key={order.id}
          language={language}
          order={order}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onResend={onResend}
          isResending={resendingId === order.id}
        />
      ))}
    </div>
  );
}

export default AOrder_List;
