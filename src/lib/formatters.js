import { ROLE_LABELS, resources } from "./schema";

export function labelFor(resource, row, db = {}) {
  if (!row) return "—";
  switch (resource) {
    case "departments":
      return row.AbbreviatedName ? `${row.AbbreviatedName} - ${row.FullName}` : row.FullName;
    case "specializations":
      return row.SpecName;
    case "education_forms":
      return row.FormName;
    case "groups": {
      const spec = db.specializations?.find((item) => String(item.SpecID) === String(row.SpecID));
      return `${spec?.SpecName || "Спеціальність"} ${row.StartYear} - ${row.ReleaseYear}`;
    }
    case "students": {
      const group = db.groups?.find((item) => String(item.GroupID) === String(row.GroupID));
      return group ? `${row.FullName} (${labelFor("groups", group, db)})` : row.FullName;
    }
    case "teachers":
      return row.FullName;
    case "subjects":
      return row.SubjectName;
    case "control_types":
      return row.ControlTypeName;
    case "profiles":
      return `${row.full_name} (${ROLE_LABELS[row.role] || row.role})`;
    case "teacher_subjects":
      return `${labelById("teachers", row.TeacherID, db)} - ${labelById("subjects", row.SubjectID, db)}`;
    case "success_rate":
      return `${labelById("students", row.StudentID, db)} - ${labelById("subjects", row.SubjectID, db)}: ${row.Mark}`;
    default:
      return String(row[resources[resource]?.pk] || "—");
  }
}

export function labelById(resource, id, db = {}) {
  const pk = resources[resource]?.pk || "id";
  const row = db[resource]?.find((item) => String(item[pk]) === String(id));
  return labelFor(resource, row, db);
}

export function fieldValue(resource, field, value, db = {}) {
  const rule = resources[resource]?.fields?.[field];
  if (value === null || value === undefined || value === "") return "—";
  if (rule?.ref) return labelById(rule.ref, value, db);
  if (rule?.type === "boolean") return value ? "Так" : "Ні";
  if (rule?.type === "role") return ROLE_LABELS[value] || value;
  return String(value);
}

export function searchRows(resource, rows, query, db = {}) {
  const text = query.trim().toLowerCase();
  if (!text) return rows;
  const config = resources[resource];
  const fields = [config.pk, ...config.columns, ...Object.keys(config.fields)];
  return rows.filter((row) => fields.some((field) => fieldValue(resource, field, row[field], db).toLowerCase().includes(text)));
}

export function sortRows(resource, rows, sortField, direction, db = {}) {
  const multiplier = direction === "DESC" ? -1 : 1;
  return [...rows].sort((a, b) => {
    const first = fieldValue(resource, sortField, a[sortField], db).toLowerCase();
    const second = fieldValue(resource, sortField, b[sortField], db).toLowerCase();
    if (first < second) return -1 * multiplier;
    if (first > second) return 1 * multiplier;
    return 0;
  });
}

export function gradeRowsForUser(rows, user, db = {}) {
  if (!user || user.role === "admin") return rows;
  if (user.role === "student") {
    const student = db.students?.find((item) => item.profile_id === user.id);
    return rows.filter((row) => String(row.StudentID) === String(student?.StudentID));
  }
  if (user.role === "teacher") {
    const teacher = db.teachers?.find((item) => item.profile_id === user.id);
    return rows.filter((row) => String(row.TeacherID) === String(teacher?.TeacherID));
  }
  return [];
}
