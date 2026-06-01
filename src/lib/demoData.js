export const demoAccounts = [
  { email: "admin@ddpu.edu.ua", password: "Admin2026!", role: "admin", profileId: "11111111-1111-4111-8111-111111111111" },
  { email: "teacher.shevchenko@ddpu.edu.ua", password: "Teacher2026!", role: "teacher", profileId: "22222222-2222-4222-8222-222222222222" },
  { email: "teacher.kovalenko@ddpu.edu.ua", password: "Teacher2026!", role: "teacher", profileId: "33333333-3333-4333-8333-333333333333" },
  { email: "teacher.melnyk@ddpu.edu.ua", password: "Teacher2026!", role: "teacher", profileId: "44444444-4444-4444-8444-444444444444" },
  { email: "student.buryk@ddpu.edu.ua", password: "Student2026!", role: "student", profileId: "55555555-5555-4555-8555-555555555555" },
  { email: "student.yurkiv@ddpu.edu.ua", password: "Student2026!", role: "student", profileId: "66666666-6666-4666-8666-666666666666" },
  { email: "student.kuchera@ddpu.edu.ua", password: "Student2026!", role: "student", profileId: "77777777-7777-4777-8777-777777777777" },
];

export function buildDemoData() {
  const departments = [
    { DepartmentID: 1, FullName: "Факультет фізики, математики та інформатики", AbbreviatedName: "ФФМІ" },
    { DepartmentID: 2, FullName: "Факультет гуманітарної та економічної освіти", AbbreviatedName: "ФГЕО" },
  ];

  const specializations = [
    { SpecID: 1, SpecName: "Комп'ютерні науки" },
    { SpecID: 2, SpecName: "Середня освіта. Інформатика" },
  ];

  const education_forms = [
    { FormID: 1, FormName: "Денна" },
    { FormID: 2, FormName: "Заочна" },
  ];

  const groups = [
    { GroupID: 1, SpecID: 1, StartYear: 2024, ReleaseYear: 2027 },
    { GroupID: 2, SpecID: 2, StartYear: 2023, ReleaseYear: 2027 },
  ];

  const profiles = [
    { id: "11111111-1111-4111-8111-111111111111", full_name: "Адміністратор системи", email: "admin@ddpu.edu.ua", role: "admin", phone: "+380501112233", avatar_url: "/images/avatar-admin.svg" },
    { id: "22222222-2222-4222-8222-222222222222", full_name: "Шевченко Олена Петрівна", email: "teacher.shevchenko@ddpu.edu.ua", role: "teacher", phone: "+380671112244", avatar_url: "/images/avatar-teacher.svg" },
    { id: "33333333-3333-4333-8333-333333333333", full_name: "Коваленко Андрій Ігорович", email: "teacher.kovalenko@ddpu.edu.ua", role: "teacher", phone: "+380671112255", avatar_url: "/images/avatar-teacher.svg" },
    { id: "44444444-4444-4444-8444-444444444444", full_name: "Мельник Ірина Василівна", email: "teacher.melnyk@ddpu.edu.ua", role: "teacher", phone: "+380671112266", avatar_url: "/images/avatar-teacher.svg" },
    { id: "55555555-5555-4555-8555-555555555555", full_name: "Бурик Назар Орестович", email: "student.buryk@ddpu.edu.ua", role: "student", phone: "+380931112277", avatar_url: "/images/avatar-student.svg" },
    { id: "66666666-6666-4666-8666-666666666666", full_name: "Юрків Віталій Романович", email: "student.yurkiv@ddpu.edu.ua", role: "student", phone: "+380931112288", avatar_url: "/images/avatar-student.svg" },
    { id: "77777777-7777-4777-8777-777777777777", full_name: "Кучера Ростислав Миколайович", email: "student.kuchera@ddpu.edu.ua", role: "student", phone: "+380931112299", avatar_url: "/images/avatar-student.svg" },
  ];

  const students = [
    { StudentID: 1, DepartmentID: 1, GroupID: 1, FormID: 1, profile_id: profiles[4].id, FullName: "Бурик Назар Орестович", Birth_Date: "2006-04-12", Email: profiles[4].email, Phone: profiles[4].phone },
    { StudentID: 2, DepartmentID: 1, GroupID: 1, FormID: 1, profile_id: profiles[5].id, FullName: "Юрків Віталій Романович", Birth_Date: "2006-08-17", Email: profiles[5].email, Phone: profiles[5].phone },
    { StudentID: 4, DepartmentID: 1, GroupID: 1, FormID: 1, profile_id: profiles[6].id, FullName: "Кучера Ростислав Миколайович", Birth_Date: "2006-02-03", Email: profiles[6].email, Phone: profiles[6].phone },
  ];

  const teachers = [
    { TeacherID: 1, DepartmentID: 1, profile_id: profiles[1].id, FullName: "Шевченко Олена Петрівна", Degree: "кандидат педагогічних наук", Birth_Date: "1982-03-15", HireDate: "2011-09-01", Email: profiles[1].email, Phone: profiles[1].phone },
    { TeacherID: 2, DepartmentID: 1, profile_id: profiles[2].id, FullName: "Коваленко Андрій Ігорович", Degree: "кандидат технічних наук", Birth_Date: "1979-11-21", HireDate: "2009-09-01", Email: profiles[2].email, Phone: profiles[2].phone },
    { TeacherID: 3, DepartmentID: 1, profile_id: profiles[3].id, FullName: "Мельник Ірина Василівна", Degree: "старший викладач", Birth_Date: "1988-06-06", HireDate: "2016-09-01", Email: profiles[3].email, Phone: profiles[3].phone },
  ];

  const subjects = [
    { SubjectID: 1, SubjectName: "Вебтехнології" },
    { SubjectID: 2, SubjectName: "Бази даних" },
    { SubjectID: 3, SubjectName: "Об'єктно-орієнтоване програмування" },
    { SubjectID: 4, SubjectName: "Комп'ютерні мережі" },
    { SubjectID: 5, SubjectName: "Алгоритми та структури даних" },
    { SubjectID: 6, SubjectName: "Операційні системи" },
    { SubjectID: 7, SubjectName: "Проєктування інформаційних систем" },
    { SubjectID: 8, SubjectName: "Англійська мова професійного спрямування" },
  ];

  const control_types = [
    { ControlTypeID: 1, ControlTypeName: "Поточний контроль" },
    { ControlTypeID: 2, ControlTypeName: "Модульний контроль" },
  ];

  const teacher_subjects = subjects.map((subject, index) => ({
    TeacherSubjectID: index + 1,
    TeacherID: (index % teachers.length) + 1,
    SubjectID: subject.SubjectID,
    CanEditGrades: true,
  }));

  const success_rate = [];
  let gradeId = 1;
  students.forEach((student, studentIndex) => {
    subjects.forEach((subject, subjectIndex) => {
      control_types.forEach((control, controlIndex) => {
        const access = teacher_subjects.find((item) => item.SubjectID === subject.SubjectID);
        success_rate.push({
          SuccRateID: gradeId,
          TeacherID: access.TeacherID,
          StudentID: student.StudentID,
          SubjectID: subject.SubjectID,
          ControlTypeID: control.ControlTypeID,
          AssessmentDate: `2026-0${((subjectIndex % 5) + 1)}-${String(10 + controlIndex + studentIndex).padStart(2, "0")}`,
          Mark: 72 + ((studentIndex * 7 + subjectIndex * 3 + controlIndex * 5) % 24),
        });
        gradeId += 1;
      });
    });
  });

  return {
    departments,
    specializations,
    education_forms,
    groups,
    profiles,
    students,
    teachers,
    subjects,
    control_types,
    teacher_subjects,
    success_rate,
  };
}
