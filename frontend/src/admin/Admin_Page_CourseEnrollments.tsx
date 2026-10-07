import { useState } from "react";

import AEnroll_EmptyState from "./enroll/AEnroll_EmptyState";
import AEnroll_List from "./enroll/AEnroll_List";

import {
  deleteCourseEnrollment,
  resendCourseEnrollmentNotification,
  updateCourseEnrollmentStatus,
} from "../services/courseEnrollmentApi";

import type {
  CourseEnrollment,
  CourseEnrollmentStatus,
} from "../data/courseEnrollments";
import {
  adminTranslations,
  type AdminLanguage,
} from "./utils/Admin_translations";

type Props = {
  language: AdminLanguage;
  enrollments: CourseEnrollment[];
  setEnrollments: React.Dispatch<React.SetStateAction<CourseEnrollment[]>>;
  isLoading: boolean;
};

function AdminCourseEnrollments({
  language,
  enrollments,
  setEnrollments,
  isLoading,
}: Props) {
  const t = adminTranslations[language].enrollments;
  const [resendingId, setResendingId] = useState<number | null>(null);

  // ----------------------------------------------------------------------
  // STATUS
  // ----------------------------------------------------------------------

  const handleStatusChange = async (
    id: number,
    status: CourseEnrollmentStatus,
  ) => {
    try {
      const updatedEnrollment = await updateCourseEnrollmentStatus(id, status);
      setEnrollments((currentEnrollments) =>
        currentEnrollments.map((enrollment) =>
          enrollment.id === updatedEnrollment.id
            ? { ...enrollment, status: updatedEnrollment.status }
            : enrollment,
        ),
      );
    } catch (error) {
      console.error("Failed to update enrollment status:", error);

      window.alert(
        error instanceof Error ? error.message : "Failed to update enrollment.",
      );
    }
  };

  // ----------------------------------------------------------------------
  // TELEGRAM
  // ----------------------------------------------------------------------

  const handleResend = async (id: number) => {
    setResendingId(id);

    try {
      const updatedEnrollment = await resendCourseEnrollmentNotification(id);
      setEnrollments((currentEnrollments) =>
        currentEnrollments.map((enrollment) =>
          enrollment.id === updatedEnrollment.id
            ? updatedEnrollment
            : enrollment,
        ),
      );
    } catch (error) {
      console.error("Failed to resend enrollment notification:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to send the enrollment to Telegram.",
      );
    } finally {
      setResendingId(null);
    }
  };

  // ----------------------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------------------

  const handleDelete = async (id: number) => {
    const enrollment = enrollments.find((item) => item.id === id);

    if (!enrollment) {
      return;
    }

    const confirmed = window.confirm(
      `${t.deleteConfirm}\n\n${enrollment.customer.name}\n${enrollment.course.title}`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCourseEnrollment(id);
      setEnrollments((currentEnrollments) =>
        currentEnrollments.filter((enrollment) => enrollment.id !== id),
      );
    } catch (error) {
      console.error("Failed to delete enrollment:", error);

      window.alert(
        error instanceof Error ? error.message : "Failed to delete enrollment.",
      );
    }
  };

  if (isLoading) {
    return (
      <p>
        {language === "uk"
          ? "Завантаження заявок..."
          : "Loading enrollments..."}
      </p>
    );
  }

  if (enrollments.length === 0) {
    return <AEnroll_EmptyState language={language} />;
  }

  return (
    <AEnroll_List
      language={language}
      enrollments={enrollments}
      onStatusChange={handleStatusChange}
      onDelete={handleDelete}
      onResend={handleResend}
      resendingId={resendingId}
    />
  );
}

export default AdminCourseEnrollments;
