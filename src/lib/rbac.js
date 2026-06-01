const adminRoutes = ["/admin", "/access"];
const teacherRoutes = ["/teacher", "/grades", "/subjects"];
const studentRoutes = ["/my-grades", "/catalog"];

const adminResources = [
  "departments",
  "specializations",
  "education_forms",
  "groups",
  "students",
  "teachers",
  "subjects",
  "control_types",
  "teacher_subjects",
  "success_rate",
  "profiles",
];

export function canAccessRoute(role, pathname) {
  if (pathname === "/" || pathname === "/login" || pathname === "/catalog") return true;
  if (!role) return false;
  if (role === "admin") return true;
  if (adminRoutes.some((route) => pathname.startsWith(route))) return false;
  if (role === "teacher") return teacherRoutes.some((route) => pathname.startsWith(route)) || pathname === "/dashboard";
  if (role === "student") return studentRoutes.some((route) => pathname.startsWith(route)) || pathname === "/dashboard";
  return false;
}

export function canManageResource(role, resource) {
  if (role === "admin") return adminResources.includes(resource);
  if (role === "teacher") return resource === "success_rate";
  return false;
}

export function canReadResource(role, resource) {
  if (["subjects", "departments", "groups", "specializations", "education_forms"].includes(resource)) return true;
  if (!role) return false;
  if (role === "admin") return true;
  if (role === "teacher") return ["students", "teachers", "teacher_subjects", "success_rate", "control_types"].includes(resource);
  if (role === "student") return ["students", "teachers", "success_rate", "control_types"].includes(resource);
  return false;
}
