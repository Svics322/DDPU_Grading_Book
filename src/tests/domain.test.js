import { describe, expect, it } from "vitest";
import { labelFor } from "../lib/formatters";
import { paginateRows } from "../lib/pagination";
import { canAccessRoute, canManageResource } from "../lib/rbac";
import { resourceCreatePath, resourceEditPath, resourceListPath } from "../lib/resourcePaths";
import { validateEntity } from "../lib/validation";

describe("validation", () => {
  it("requires a full student form and validates email", () => {
    const result = validateEntity("students", {
      FullName: "І",
      Email: "bad-email",
      DepartmentID: "",
      GroupID: "",
      FormID: "",
    });

    expect(result.valid).toBe(false);
    expect(result.errors.FullName).toContain("не менше");
    expect(result.errors.Email).toContain("коректну");
    expect(result.errors.DepartmentID).toContain("Оберіть");
  });

  it("accepts a valid grade form", () => {
    const result = validateEntity("success_rate", {
      TeacherID: 1,
      StudentID: 1,
      SubjectID: 1,
      ControlTypeID: 1,
      AssessmentDate: "2026-05-29",
      Mark: 88,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
});

describe("pagination", () => {
  it("returns a bounded page with metadata", () => {
    const rows = Array.from({ length: 23 }, (_, index) => ({ id: index + 1 }));
    const page = paginateRows(rows, 3, 10);

    expect(page.rows).toHaveLength(3);
    expect(page.rows[0].id).toBe(21);
    expect(page.meta.totalPages).toBe(3);
    expect(page.meta.page).toBe(3);
  });
});

describe("role access", () => {
  it("keeps admin routes unavailable for guests and students", () => {
    expect(canAccessRoute(null, "/admin/users")).toBe(false);
    expect(canAccessRoute("student", "/admin/users")).toBe(false);
    expect(canAccessRoute("admin", "/admin/users")).toBe(true);
  });

  it("limits resource mutations by role", () => {
    expect(canManageResource("admin", "students")).toBe(true);
    expect(canManageResource("teacher", "success_rate")).toBe(true);
    expect(canManageResource("student", "success_rate")).toBe(false);
  });
});

describe("resource paths", () => {
  it("uses the teacher grades route for grade creation and editing", () => {
    expect(resourceListPath("success_rate", "teacher")).toBe("/grades");
    expect(resourceCreatePath("success_rate", "teacher")).toBe("/grades/new");
    expect(resourceEditPath("success_rate", 12, "teacher")).toBe("/grades/12/edit");
  });

  it("keeps admin grade management on the table route", () => {
    expect(resourceListPath("success_rate", "admin")).toBe("/success_rate");
    expect(resourceCreatePath("success_rate", "admin")).toBe("/success_rate/new");
  });
});

describe("labels", () => {
  it("shows a student with group and study years", () => {
    const db = {
      specializations: [{ SpecID: 1, SpecName: "Комп'ютерні науки" }],
      groups: [{ GroupID: 7, SpecID: 1, StartYear: 2024, ReleaseYear: 2027 }],
    };

    expect(labelFor("students", { FullName: "Бурик Назар Орестович", GroupID: 7 }, db))
      .toBe("Бурик Назар Орестович (Комп'ютерні науки 2024 - 2027)");
  });
});
