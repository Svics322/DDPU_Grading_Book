export const ROLE_LABELS = {
  admin: "Адміністратор",
  teacher: "Викладач",
  student: "Студент",
  guest: "Гість",
};

export const RESOURCE_ORDER = [
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

export const resources = {
  departments: {
    title: "Факультети",
    navTitle: "Факультети",
    pk: "DepartmentID",
    columns: ["FullName", "AbbreviatedName"],
    searchFields: ["FullName", "AbbreviatedName"],
    fields: {
      FullName: { label: "Повна назва", type: "string", required: true, min: 3, max: 255 },
      AbbreviatedName: { label: "Скорочена назва", type: "string", required: true, min: 2, max: 50 },
    },
  },
  specializations: {
    title: "Спеціальності",
    navTitle: "Спеціальності",
    pk: "SpecID",
    columns: ["SpecName"],
    searchFields: ["SpecName"],
    fields: {
      SpecName: { label: "Назва спеціальності", type: "string", required: true, min: 3, max: 255 },
    },
  },
  education_forms: {
    title: "Форми навчання",
    navTitle: "Форми",
    pk: "FormID",
    columns: ["FormName"],
    searchFields: ["FormName"],
    fields: {
      FormName: { label: "Форма навчання", type: "string", required: true, min: 2, max: 100 },
    },
  },
  groups: {
    title: "Групи",
    navTitle: "Групи",
    pk: "GroupID",
    columns: ["SpecID", "StartYear", "ReleaseYear"],
    searchFields: ["StartYear", "ReleaseYear"],
    fields: {
      SpecID: { label: "Спеціальність", type: "int", required: true, ref: "specializations" },
      StartYear: { label: "Рік вступу", type: "year", required: true, min: 2000, max: 2100 },
      ReleaseYear: { label: "Рік завершення", type: "year", required: true, min: 2000, max: 2100 },
    },
  },
  students: {
    title: "Студенти",
    navTitle: "Студенти",
    pk: "StudentID",
    columns: ["FullName", "GroupID", "DepartmentID", "FormID", "Email", "Phone"],
    searchFields: ["FullName", "Email", "Phone"],
    fields: {
      DepartmentID: { label: "Факультет", type: "int", required: true, ref: "departments" },
      GroupID: { label: "Група", type: "int", required: true, ref: "groups" },
      FormID: { label: "Форма навчання", type: "int", required: true, ref: "education_forms" },
      profile_id: { label: "Профіль користувача", type: "uuid", required: false, ref: "profiles" },
      FullName: { label: "ПІБ", type: "string", required: true, min: 5, max: 255 },
      Birth_Date: { label: "Дата народження", type: "date", required: false },
      Email: { label: "Електронна пошта", type: "email", required: false, max: 100 },
      Phone: { label: "Телефон", type: "phone", required: false, max: 20 },
    },
  },
  teachers: {
    title: "Викладачі",
    navTitle: "Викладачі",
    pk: "TeacherID",
    columns: ["FullName", "DepartmentID", "Degree", "Email", "Phone"],
    searchFields: ["FullName", "Degree", "Email", "Phone"],
    fields: {
      DepartmentID: { label: "Факультет", type: "int", required: true, ref: "departments" },
      profile_id: { label: "Профіль користувача", type: "uuid", required: false, ref: "profiles" },
      FullName: { label: "ПІБ", type: "string", required: true, min: 5, max: 255 },
      Degree: { label: "Науковий ступінь", type: "string", required: false, max: 100 },
      Birth_Date: { label: "Дата народження", type: "date", required: false },
      HireDate: { label: "Дата прийняття", type: "date", required: false },
      Email: { label: "Електронна пошта", type: "email", required: false, max: 100 },
      Phone: { label: "Телефон", type: "phone", required: false, max: 20 },
    },
  },
  subjects: {
    title: "Предмети",
    navTitle: "Предмети",
    pk: "SubjectID",
    columns: ["SubjectName"],
    searchFields: ["SubjectName"],
    fields: {
      SubjectName: { label: "Назва предмета", type: "string", required: true, min: 2, max: 255 },
    },
  },
  control_types: {
    title: "Типи контролю",
    navTitle: "Контроль",
    pk: "ControlTypeID",
    columns: ["ControlTypeName"],
    searchFields: ["ControlTypeName"],
    fields: {
      ControlTypeName: { label: "Назва типу контролю", type: "string", required: true, min: 2, max: 100 },
    },
  },
  teacher_subjects: {
    title: "Доступи викладачів до предметів",
    navTitle: "Доступи",
    pk: "TeacherSubjectID",
    columns: ["TeacherID", "SubjectID", "CanEditGrades"],
    searchFields: [],
    fields: {
      TeacherID: { label: "Викладач", type: "int", required: true, ref: "teachers" },
      SubjectID: { label: "Предмет", type: "int", required: true, ref: "subjects" },
      CanEditGrades: { label: "Може редагувати оцінки", type: "boolean", required: false },
    },
  },
  success_rate: {
    title: "Успішність",
    navTitle: "Оцінки",
    pk: "SuccRateID",
    columns: ["StudentID", "SubjectID", "TeacherID", "ControlTypeID", "AssessmentDate", "Mark"],
    searchFields: ["AssessmentDate"],
    fields: {
      TeacherID: { label: "Викладач", type: "int", required: true, ref: "teachers" },
      StudentID: { label: "Студент", type: "int", required: true, ref: "students" },
      SubjectID: { label: "Предмет", type: "int", required: true, ref: "subjects" },
      ControlTypeID: { label: "Тип контролю", type: "int", required: true, ref: "control_types" },
      AssessmentDate: { label: "Дата оцінювання", type: "date", required: true },
      Mark: { label: "Оцінка", type: "int", required: true, min: 0, max: 100 },
    },
  },
  profiles: {
    title: "Користувачі",
    navTitle: "Користувачі",
    pk: "id",
    columns: ["full_name", "email", "role", "phone"],
    searchFields: ["full_name", "email", "phone"],
    fields: {
      full_name: { label: "ПІБ", type: "string", required: true, min: 5, max: 255 },
      email: { label: "Електронна пошта", type: "email", required: true, max: 100 },
      role: { label: "Роль", type: "role", required: true },
      phone: { label: "Телефон", type: "phone", required: false, max: 20 },
      avatar_url: { label: "Фото", type: "string", required: false, max: 255 },
    },
  },
};

export const editableResources = Object.keys(resources);

export function getResourceConfig(resource) {
  return resources[resource];
}

export function getPk(resource) {
  return resources[resource]?.pk || "id";
}
