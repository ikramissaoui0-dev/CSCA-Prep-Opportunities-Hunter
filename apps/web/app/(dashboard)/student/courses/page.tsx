import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { listAccessibleCourses } from "@/server/queries/courses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const metadata: Metadata = { title: "Courses — CSCA Prep" };

export default async function CoursesCatalogPage() {
  const user = await requireUser();
  const courses = await listAccessibleCourses(user.id, user.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
        <p className="text-muted-foreground">Video lessons, PDFs, notes, and exercises to build up your fundamentals.</p>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No courses are available on your plan yet. Check{" "}
            <Link href="/student/billing" className="font-medium text-foreground hover:underline">
              billing
            </Link>{" "}
            to see what unlocks with an upgrade.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const pct = course.totalLessons > 0 ? Math.round((course.completedLessons / course.totalLessons) * 100) : 0;
            const started = course.completedLessons > 0;
            return (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle className="text-base">{course.title}</CardTitle>
                  {course.subjectName && <CardDescription>{course.subjectName}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-3">
                  {course.description && <p className="line-clamp-3 text-sm text-muted-foreground">{course.description}</p>}
                  {course.totalLessons > 0 && (
                    <div className="space-y-1">
                      <Progress value={pct} />
                      <p className="text-xs text-muted-foreground">
                        {course.completedLessons} of {course.totalLessons} lessons complete
                      </p>
                    </div>
                  )}
                  <Button
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`/student/courses/${course.id}`}>{started ? "Continue" : "Start course"}</Link>}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
