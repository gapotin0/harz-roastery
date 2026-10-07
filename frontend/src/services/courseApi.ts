import { API_URL } from "./apiBase";
import { auth } from "./firebase";

import type { Course } from "../data/courses";

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

export async function getCourses(): Promise<Course[]> {
  const response = await fetch(`${API_URL}/api/courses`);

  if (!response.ok) {
    throw new Error("Failed to load courses.");
  }

  return (await response.json()) as Course[];
}

// ----------------------------------------------------------------------
// ADMIN
// ----------------------------------------------------------------------

export async function createCourse(course: Course): Promise<Course> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Failed to create course.");
  }

  return (await response.json()) as Course;
}

export async function updateCourse(course: Course): Promise<Course> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/courses/${course.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(course),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Failed to update course.");
  }

  return (await response.json()) as Course;
}

export async function deleteCourse(id: number): Promise<void> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/courses/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Failed to delete course.");
  }
}
