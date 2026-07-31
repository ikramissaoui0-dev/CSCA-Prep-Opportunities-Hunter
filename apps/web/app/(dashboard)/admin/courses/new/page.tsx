import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";
import { listTaxonomy } from "@/server/queries/admin-content";
import { CourseForm } from "../course-form";

export const metadata: Metadata = { title: "New course — CSCA Prep Admin" };

export default async function NewCoursePage() {
  const user = await requireRole("admin", "content_manager");
  const subjects = await listTaxonomy(user.id, user.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New course</h1>
        <p className="text-muted-foreground">Lessons can be added once the course is created.</p>
      </div>
      <CourseForm subjects={subjects} />
    </div>
  );
}
