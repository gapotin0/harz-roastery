import { firestore } from "../config/firebase";
import {
  pendingTelegramNotification,
  type TelegramNotification,
} from "../types/telegramNotification";

import type { AcademyCourse } from "./course.service";

export type CourseEnrollmentStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "completed"
  | "cancelled";

export type EnrollmentLanguage = "en" | "uk";

export type CourseEnrollment = {
  id: number;
  createdAt: string;
  course: {
    id: number;
    title: string;
    duration: string;
    price: number;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  status: CourseEnrollmentStatus;
  notification?: TelegramNotification;
};

export type CreateCourseEnrollmentInput = {
  courseId: number;
  language: EnrollmentLanguage;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
};

const ENROLLMENTS_COLLECTION = "harz_course_enrollments";
const COURSES_COLLECTION = "harz_academy_courses";
const getCollection = () => firestore.collection(ENROLLMENTS_COLLECTION);

function createEnrollmentId(): number {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}

// ----------------------------------------------------------------------
// GET
// ----------------------------------------------------------------------

export async function getCourseEnrollments(): Promise<CourseEnrollment[]> {
  const snapshot = await getCollection().get();

  return snapshot.docs
    .map((document) => document.data() as CourseEnrollment)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getCourseEnrollment(
  id: number,
): Promise<CourseEnrollment> {
  const snapshot = await getCollection().doc(String(id)).get();

  if (!snapshot.exists) {
    throw new Error(`Course enrollment with id ${id} was not found.`);
  }

  return snapshot.data() as CourseEnrollment;
}

// ----------------------------------------------------------------------
// CREATE
// ----------------------------------------------------------------------

export async function createCourseEnrollment(
  input: CreateCourseEnrollmentInput,
): Promise<CourseEnrollment> {
  const courseDocument = await firestore
    .collection(COURSES_COLLECTION)
    .doc(String(input.courseId))
    .get();

  if (!courseDocument.exists) {
    throw new Error(`Course with id ${input.courseId} was not found.`);
  }

  const course = courseDocument.data() as AcademyCourse;

  if (!course.active) {
    throw new Error("This course is currently unavailable.");
  }

  const id = createEnrollmentId();

  const enrollment: CourseEnrollment = {
    id,
    createdAt: new Date().toISOString(),
    course: {
      id: course.id,
      title: course.title[input.language],
      duration: course.duration[input.language],
      price: course.price,
    },
    customer: {
      name: input.customer.name.trim(),
      email: input.customer.email.trim(),
      phone: input.customer.phone.trim(),
    },
    status: "new",
    notification: pendingTelegramNotification(),
  };

  await getCollection().doc(String(id)).set(enrollment);

  return enrollment;
}

// ----------------------------------------------------------------------
// UPDATE
// ----------------------------------------------------------------------

export async function updateCourseEnrollmentStatus(
  id: number,
  status: CourseEnrollmentStatus,
): Promise<CourseEnrollment> {
  const document = getCollection().doc(String(id));
  const snapshot = await document.get();

  if (!snapshot.exists) {
    throw new Error(`Course enrollment with id ${id} was not found.`);
  }

  const enrollment = snapshot.data() as CourseEnrollment;

  await document.update({ status });

  return { ...enrollment, status };
}

export async function saveCourseEnrollmentNotification(
  id: number,
  notification: TelegramNotification,
): Promise<CourseEnrollment> {
  const document = getCollection().doc(String(id));
  const snapshot = await document.get();

  if (!snapshot.exists) {
    throw new Error(`Course enrollment with id ${id} was not found.`);
  }

  await document.update({ notification });

  return { ...(snapshot.data() as CourseEnrollment), notification };
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function deleteCourseEnrollment(id: number): Promise<void> {
  const document = getCollection().doc(String(id));
  const snapshot = await document.get();

  if (!snapshot.exists) {
    throw new Error(`Course enrollment with id ${id} was not found.`);
  }

  await document.delete();
}
