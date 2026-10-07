import { css } from "@emotion/css";

import AEnroll_Card from "./AEnroll_Card";

import type {
  CourseEnrollment,
  CourseEnrollmentStatus,
} from "../../data/courseEnrollments";
import type { AdminLanguage } from "../utils/Admin_translations";

type Props = {
  language: AdminLanguage;
  enrollments: CourseEnrollment[];
  onStatusChange: (id: number, status: CourseEnrollmentStatus) => void;
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

function AEnroll_List({
  language,
  enrollments,
  onStatusChange,
  onDelete,
  onResend,
  resendingId,
}: Props) {
  return (
    <div className={list}>
      {enrollments.map((enrollment) => (
        <AEnroll_Card
          key={enrollment.id}
          language={language}
          enrollment={enrollment}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onResend={onResend}
          isResending={resendingId === enrollment.id}
        />
      ))}
    </div>
  );
}

export default AEnroll_List;
