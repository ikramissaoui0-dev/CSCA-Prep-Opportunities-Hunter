import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getCourseForEdit, getCourseLessons } from "@/server/queries/admin-courses";
import { listTaxonomy } from "@/server/queries/admin-content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseForm } from "../course-form";
import { LessonsManager } from "./lessons-manager";

export const metadata: Metadata = { title: "Edit course — CSCA Prep Admin" };

export default async function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await requireRole("admin", "content_manager");

  const [course, lessons, taxonomy] = await Promise.all([
    getCourseForEdit(user.id, user.role, courseId),
    getCourseLessons(user.id, user.role, courseId),
    listTaxonomy(user.id, user.role),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit course</h1>
        <p className="text-muted-foreground">{course.title}</p>
      </div>

      <CourseForm subjects={taxonomy} initialData={course} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lessons</CardTitle>
          <CardDescription>Students see published lessons in this order.</CardDescription>
        </CardHeader>
        <CardContent>
          <LessonsManager courseId={courseId} lessons={lessons} taxonomy={taxonomy} />
        </CardContent>
      </Card>
    </div>
  );
}
