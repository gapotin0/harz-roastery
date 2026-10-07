import { API_URL } from "./apiBase";
import { auth } from "./firebase";

export type CourseTranslationInput = {
  title: string;
  description: string;
  duration: string;
};

export type CourseTranslationResult = {
  title: string;
  description: string;
  duration: string;
};

export async function translateCourse(
  content: CourseTranslationInput,
): Promise<CourseTranslationResult> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Authentication required.");
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/api/translate/course`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(content),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Translation failed.");
  }

  return (await response.json()) as CourseTranslationResult;
}
