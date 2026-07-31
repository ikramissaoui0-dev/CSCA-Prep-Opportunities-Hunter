import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getCourseDetail } from "@/server/queries/courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const metadata: Metadata = { title: "Course — CSCA Prep" };

const CONTENT_TYPE_LABEL: Record<string, string> = { video: "Video", pdf: "PDF", notes: "Notes", exercise: "Exercise" };

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await requireUser();
  const course = await getCourseDetail(user.id, user.role, courseId);

  if (!course) {
    notFound();
  }

  const completedCount = course.lessons.filter((l) => l.completedAt).length;
  const pct = course.lessons.length > 0 ? Math.round((completedCount / course.lessons.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{course.title}</h1>
        {course.description && <p className="text-muted-foreground">{course.description}</p>}
      </div>

      {course.lessons.length > 0 && (
        <div className="space-y-1">
          <Progress value={pct} />
          <p className="text-xs text-muted-foreground">
            {completedCount} of {course.lessons.length} lessons complete
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lessons</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {course.lessons.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No lessons published yet.</p>
          ) : (
            <ul className="divide-y">
              {course.lessons.map((lesson, index) => (
                <li key={lesson.id}>
                  <Link
                    href={`/student/courses/${courseId}/lessons/${lesson.id}`}
                    className="flex items-center justify-between gap-3 p-4 text-sm hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">
                        {index + 1}. {lesson.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {CONTENT_TYPE_LABEL[lesson.contentType]}
                        {lesson.durationSeconds ? ` · ${Math.round(lesson.durationSeconds / 60)} min` : ""}
                      </p>
                    </div>
                    {lesson.completedAt ? <Badge>Completed</Badge> : <Badge variant="secondary">Not started</Badge>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
