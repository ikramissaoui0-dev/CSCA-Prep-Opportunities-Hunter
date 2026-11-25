import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { listAccessibleCourses, type AccessibleCourseRow } from "@/server/queries/courses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const metadata: Metadata = { title: "Courses — CSCAprepa" };

const NO_SUBJECT = "Other courses";

/**
 * One section per subject, in the order the courses come back (they are
 * sorted by display_order, and the seeded modules number 11–14 / 21–25 /
 * 31–35, so Mathematics, Physics, Chemistry stay in that order).
 */
function groupBySubject(courses: AccessibleCourseRow[]): { subject: string; modules: AccessibleCourseRow[] }[] {
  const sections = new Map<string, AccessibleCourseRow[]>();
  for (const course of courses) {
    const key = course.subjectName ?? NO_SUBJECT;
    sections.set(key, [...(sections.get(key) ?? []), course]);
  }
  return [...sections].map(([subject, modules]) => ({ subject, modules }));
}

export default async function CoursesCatalogPage() {
  const user = await requireUser();
  const courses = await listAccessibleCourses(user.id, user.role);
  const sections = groupBySubject(courses);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
        <p className="text-muted-foreground">Pick a subject, open a module, then follow its lessons one by one.</p>
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
        sections.map(({ subject, modules }) => {
          const lessonCount = modules.reduce((sum, m) => sum + m.totalLessons, 0);
          return (
            <section key={subject} aria-labelledby={`subject-${subject}`} className="space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b pb-2">
                <h2 id={`subject-${subject}`} className="text-xl font-semibold tracking-tight">
                  {subject}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {modules.length} {modules.length === 1 ? "module" : "modules"}
                  {lessonCount > 0 ? ` · ${lessonCount} lessons` : ""}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((course) => {
                  const pct = course.totalLessons > 0 ? Math.round((course.completedLessons / course.totalLessons) * 100) : 0;
                  const started = course.completedLessons > 0;
                  return (
                    <Card key={course.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{course.title}</CardTitle>
                        <CardDescription>Module · {course.totalLessons} lessons</CardDescription>
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
                          render={<Link href={`/student/courses/${course.id}`}>{started ? "Continue" : "Start module"}</Link>}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
