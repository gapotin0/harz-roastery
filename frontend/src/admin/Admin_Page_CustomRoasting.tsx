import { useState } from "react";

import ARoast_EmptyState from "./roast/ARoast_EmptyState";
import ARoast_List from "./roast/ARoast_List";

import {
  deleteCustomRoastingRequest,
  resendCustomRoastingNotification,
  updateCustomRoastingStatus,
} from "../services/customRoastingApi";

import type {
  CustomRoastingRequest,
  CustomRoastingStatus,
} from "../data/customRoasting";
import {
  adminTranslations,
  type AdminLanguage,
} from "./utils/Admin_translations";

type Props = {
  language: AdminLanguage;
  requests: CustomRoastingRequest[];
  setRequests: React.Dispatch<React.SetStateAction<CustomRoastingRequest[]>>;
  isLoading: boolean;
};

function AdminCustomRoasting({
  language,
  requests,
  setRequests,
  isLoading,
}: Props) {
  const t = adminTranslations[language].roasting;
  const [resendingId, setResendingId] = useState<number | null>(null);

  // ----------------------------------------------------------------------
  // STATUS
  // ----------------------------------------------------------------------

  const handleStatusChange = async (
    id: number,
    status: CustomRoastingStatus,
  ) => {
    try {
      const updatedRequest = await updateCustomRoastingStatus(id, status);
      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === updatedRequest.id
            ? { ...request, status: updatedRequest.status }
            : request,
        ),
      );
    } catch (error) {
      console.error("Failed to update custom roasting status:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to update custom roasting request.",
      );
    }
  };

  // ----------------------------------------------------------------------
  // TELEGRAM
  // ----------------------------------------------------------------------

  const handleResend = async (id: number) => {
    setResendingId(id);

    try {
      const updatedRequest = await resendCustomRoastingNotification(id);
      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === updatedRequest.id ? updatedRequest : request,
        ),
      );
    } catch (error) {
      console.error("Failed to resend roasting notification:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to send the roasting request to Telegram.",
      );
    } finally {
      setResendingId(null);
    }
  };

  // ----------------------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------------------

  const handleDelete = async (id: number) => {
    const request = requests.find((item) => item.id === id);

    if (!request) {
      return;
    }

    const confirmed = window.confirm(
      `${t.deleteConfirm}\n\n${request.customer.name}`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCustomRoastingRequest(id);
      setRequests((currentRequests) =>
        currentRequests.filter((request) => request.id !== id),
      );
    } catch (error) {
      console.error("Failed to delete custom roasting request:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete custom roasting request.",
      );
    }
  };

  if (isLoading) {
    return (
      <p>
        {language === "uk" ? "Завантаження заявок..." : "Loading requests..."}
      </p>
    );
  }

  if (requests.length === 0) {
    return <ARoast_EmptyState language={language} />;
  }

  return (
    <ARoast_List
      language={language}
      requests={requests}
      onStatusChange={handleStatusChange}
      onDelete={handleDelete}
      onResend={handleResend}
      resendingId={resendingId}
    />
  );
}

export default AdminCustomRoasting;
