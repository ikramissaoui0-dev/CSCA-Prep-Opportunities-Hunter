import { describe, it, expect } from "vitest";
import { roleCanAccess, ROLE_HOME_ROUTE } from "./roles";

describe("roleCanAccess", () => {
  it("allows admin and content_manager into /admin, but not a student", () => {
    expect(roleCanAccess("admin", "/admin")).toBe(true);
    expect(roleCanAccess("content_manager", "/admin/content")).toBe(true);
    expect(roleCanAccess("student", "/admin")).toBe(false);
  });

  it("allows student and admin into /student, but not content_manager", () => {
    expect(roleCanAccess("student", "/student")).toBe(true);
    expect(roleCanAccess("admin", "/student")).toBe(true);
    expect(roleCanAccess("content_manager", "/student")).toBe(false);
  });

  it("allows every role onto a route with no matching prefix rule", () => {
    expect(roleCanAccess("student", "/pricing")).toBe(true);
    expect(roleCanAccess("content_manager", "/exam")).toBe(true);
  });

  it("matches sub-paths, not just the exact prefix", () => {
    expect(roleCanAccess("student", "/admin/users")).toBe(false);
    expect(roleCanAccess("admin", "/student/billing")).toBe(true);
  });
});

describe("ROLE_HOME_ROUTE", () => {
  it("sends content_manager to /admin/content, not the general /admin dashboard", () => {
    // Deliberately distinct from admin's home route — content_manager
    // can't see the admin-only dashboard/metrics page (see admin/page.tsx).
    expect(ROLE_HOME_ROUTE.content_manager).toBe("/admin/content");
    expect(ROLE_HOME_ROUTE.admin).toBe("/admin");
  });
});
