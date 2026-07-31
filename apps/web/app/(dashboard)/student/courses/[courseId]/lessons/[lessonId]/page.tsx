import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getCourseDetail } from "@/server/queries/courses";
import { LessonViewer } from "./lesson-viewer";

export const metadata: Metadata = { title: "Lesson — CSCA Prep" };

export default async function LessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  const user = await requireUser();
  const course = await getCourseDetail(user.id, user.role, courseId);

  if (!course) {
    notFound();
  }

  const index = course.lessons.findIndex((l) => l.id === lessonId);
  const lesson = course.lessons[index];
  if (!lesson) {
    notFound();
  }

  const previous = index > 0 ? course.lessons[index - 1] : undefined;
  const next = index < course.lessons.length - 1 ? course.lessons[index + 1] : undefined;

  return (
    <LessonViewer
      courseId={courseId}
      courseTitle={course.title}
      lesson={lesson}
      previous={previous ? { id: previous.id, title: previous.title } : null}
      next={next ? { id: next.id, title: next.title } : null}
    />
  );
}
