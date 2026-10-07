import { css } from "@emotion/css";

import ARoast_Card from "./ARoast_Card";

import type {
  CustomRoastingRequest,
  CustomRoastingStatus,
} from "../../data/customRoasting";
import type { AdminLanguage } from "../utils/Admin_translations";

type Props = {
  language: AdminLanguage;
  requests: CustomRoastingRequest[];
  onStatusChange: (id: number, status: CustomRoastingStatus) => void;
  onDelete: (id: number) => void;
  onResend: (id: number) => void;
  resendingId: number | null;
};

const list = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "20px",

  "@media (max-width: 1100px)": {
    gridTemplateColumns: "1fr",
  },
});

function ARoast_List({
  language,
  requests,
  onStatusChange,
  onDelete,
  onResend,
  resendingId,
}: Props) {
  return (
    <div className={list}>
      {requests.map((request) => (
        <ARoast_Card
          key={request.id}
          language={language}
          request={request}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onResend={onResend}
          isResending={resendingId === request.id}
        />
      ))}
    </div>
  );
}

export default ARoast_List;
