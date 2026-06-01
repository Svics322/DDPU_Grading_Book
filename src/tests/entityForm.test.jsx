/* @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EntityForm } from "../components/EntityForm";

const db = {
  departments: [{ DepartmentID: 1, FullName: "Факультет фізики, математики та інформатики", AbbreviatedName: "ФФМІ" }],
  education_forms: [{ FormID: 1, FormName: "Денна" }],
  groups: [{ GroupID: 1, SpecID: 1, StartYear: 2024, ReleaseYear: 2027 }],
  profiles: [],
  specializations: [{ SpecID: 1, SpecName: "Комп'ютерні науки" }],
};

describe("EntityForm", () => {
  it("shows account password and hides manual profile selection for new students", () => {
    render(
      <EntityForm
        resource="students"
        initialValues={{}}
        db={db}
        onSubmit={vi.fn()}
        submitLabel="Створити запис"
        requireAccountPassword
      />,
    );

    expect(screen.getByLabelText("Пароль облікового запису")).toBeTruthy();
    expect(screen.queryByText("Профіль користувача")).toBeNull();
  });
});
