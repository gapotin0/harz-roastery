import { API_URL } from "./apiBase";
import { auth } from "./firebase";

import type {
  CourseEnrollment,
  CourseEnrollmentStatus,
} from "../data/courseEnrollments";

export type CreateCourseEnrollmentInput = {
  courseId: number;
  language: "en" | "uk";
  customer: {
    name: string;
    email: string;
    phone: string;
  };
};

async function getAdminToken(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Authentication required.");
  }

  return user.getIdToken();
}

// ----------------------------------------------------------------------
// PUBLIC
// ----------------------------------------------------------------------

export async function createCourseEnrollment(
  input: CreateCourseEnrollmentInput,
): Promise<CourseEnrollment> {
  const response = await fetch(`${API_URL}/api/course-enrollments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Failed to create enrollment.");
  }

  return (await response.json()) as CourseEnrollment;
}

// ----------------------------------------------------------------------
// ADMIN
// ----------------------------------------------------------------------

export async function getCourseEnrollments(): Promise<CourseEnrollment[]> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/course-enrollments`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to load enrollments.");
  }

  return (await response.json()) as CourseEnrollment[];
}

export async function updateCourseEnrollmentStatus(
  id: number,
  status: CourseEnrollmentStatus,
): Promise<CourseEnrollment> {
  const token = await getAdminToken();

  const response = await fetch(
    `${API_URL}/api/course-enrollments/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Failed to update enrollment.");
  }

  return (await response.json()) as CourseEnrollment;
}

export async function resendCourseEnrollmentNotification(
  id: number,
): Promise<CourseEnrollment> {
  const token = await getAdminToken();

  const response = await fetch(
    `${API_URL}/api/course-enrollments/${id}/notify`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ?? "Failed to send the enrollment to Telegram.",
    );
  }

  return (await response.json()) as CourseEnrollment;
}

export async function deleteCourseEnrollment(id: number): Promise<void> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/course-enrollments/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Failed to delete enrollment.");
  }
}
