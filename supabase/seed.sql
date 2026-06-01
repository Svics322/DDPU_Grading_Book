insert into public."departments" ("DepartmentID", "FullName", "AbbreviatedName") values
(1, 'Факультет фізики, математики та інформатики', 'ФФМІ'),
(2, 'Факультет гуманітарної та економічної освіти', 'ФГЕО')
on conflict ("DepartmentID") do update set "FullName" = excluded."FullName", "AbbreviatedName" = excluded."AbbreviatedName";

insert into public."specializations" ("SpecID", "SpecName") values
(1, 'Комп''ютерні науки'),
(2, 'Середня освіта. Інформатика')
on conflict ("SpecID") do update set "SpecName" = excluded."SpecName";

insert into public."education_forms" ("FormID", "FormName") values
(1, 'Денна'),
(2, 'Заочна')
on conflict ("FormID") do update set "FormName" = excluded."FormName";

insert into public."groups" ("GroupID", "SpecID", "StartYear", "ReleaseYear") values
(1, 1, 2024, 2027),
(2, 2, 2023, 2027)
on conflict ("GroupID") do update set "SpecID" = excluded."SpecID", "StartYear" = excluded."StartYear", "ReleaseYear" = excluded."ReleaseYear";

insert into public."subjects" ("SubjectID", "SubjectName") values
(1, 'Вебтехнології'),
(2, 'Бази даних'),
(3, 'Об''єктно-орієнтоване програмування'),
(4, 'Комп''ютерні мережі'),
(5, 'Алгоритми та структури даних'),
(6, 'Операційні системи'),
(7, 'Проєктування інформаційних систем'),
(8, 'Англійська мова професійного спрямування')
on conflict ("SubjectID") do update set "SubjectName" = excluded."SubjectName";

insert into public."control_types" ("ControlTypeID", "ControlTypeName") values
(1, 'Поточний контроль'),
(2, 'Модульний контроль')
on conflict ("ControlTypeID") do update set "ControlTypeName" = excluded."ControlTypeName";

insert into public."students" ("StudentID", "DepartmentID", "GroupID", "FormID", "FullName", "Birth_Date", "Email", "Phone") values
(1, 1, 1, 1, 'Бурик Назар Орестович', '2006-04-12', 'student.buryk@ddpu.edu.ua', '+380931112277'),
(2, 1, 1, 1, 'Юрків Віталій Романович', '2006-08-17', 'student.yurkiv@ddpu.edu.ua', '+380931112288'),
(4, 1, 1, 1, 'Кучера Ростислав Миколайович', '2006-02-03', 'student.kuchera@ddpu.edu.ua', '+380931112299')
on conflict ("StudentID") do update set
"DepartmentID" = excluded."DepartmentID", "GroupID" = excluded."GroupID", "FormID" = excluded."FormID",
"FullName" = excluded."FullName", "Birth_Date" = excluded."Birth_Date", "Email" = excluded."Email", "Phone" = excluded."Phone";

insert into public."teachers" ("TeacherID", "DepartmentID", "FullName", "Degree", "Birth_Date", "HireDate", "Email", "Phone") values
(1, 1, 'Шевченко Олена Петрівна', 'кандидат педагогічних наук', '1982-03-15', '2011-09-01', 'teacher.shevchenko@ddpu.edu.ua', '+380671112244'),
(2, 1, 'Коваленко Андрій Ігорович', 'кандидат технічних наук', '1979-11-21', '2009-09-01', 'teacher.kovalenko@ddpu.edu.ua', '+380671112255'),
(3, 1, 'Мельник Ірина Василівна', 'старший викладач', '1988-06-06', '2016-09-01', 'teacher.melnyk@ddpu.edu.ua', '+380671112266')
on conflict ("TeacherID") do update set
"DepartmentID" = excluded."DepartmentID", "FullName" = excluded."FullName", "Degree" = excluded."Degree",
"Birth_Date" = excluded."Birth_Date", "HireDate" = excluded."HireDate", "Email" = excluded."Email", "Phone" = excluded."Phone";

insert into public."teacher_subjects" ("TeacherSubjectID", "TeacherID", "SubjectID", "CanEditGrades") values
(1, 1, 1, true),
(2, 2, 2, true),
(3, 3, 3, true),
(4, 1, 4, true),
(5, 2, 5, true),
(6, 3, 6, true),
(7, 1, 7, true),
(8, 2, 8, true)
on conflict ("TeacherID", "SubjectID") do update set "CanEditGrades" = excluded."CanEditGrades";

insert into public."success_rate" ("TeacherID", "StudentID", "SubjectID", "ControlTypeID", "AssessmentDate", "Mark")
select ts."TeacherID", st."StudentID", sb."SubjectID", ct."ControlTypeID",
       date '2026-01-10' + ((sb."SubjectID" + ct."ControlTypeID" + st."StudentID")::int * interval '3 days'),
       72 + ((st."StudentID" * 7 + sb."SubjectID" * 3 + ct."ControlTypeID" * 5) % 24)
from public."students" st
cross join public."subjects" sb
cross join public."control_types" ct
join public."teacher_subjects" ts on ts."SubjectID" = sb."SubjectID"
on conflict ("StudentID", "SubjectID", "ControlTypeID") do update set
"TeacherID" = excluded."TeacherID",
"AssessmentDate" = excluded."AssessmentDate",
"Mark" = excluded."Mark";

select setval(pg_get_serial_sequence('public."departments"', 'DepartmentID'), (select max("DepartmentID") from public."departments"));
select setval(pg_get_serial_sequence('public."specializations"', 'SpecID'), (select max("SpecID") from public."specializations"));
select setval(pg_get_serial_sequence('public."education_forms"', 'FormID'), (select max("FormID") from public."education_forms"));
select setval(pg_get_serial_sequence('public."groups"', 'GroupID'), (select max("GroupID") from public."groups"));
select setval(pg_get_serial_sequence('public."students"', 'StudentID'), (select max("StudentID") from public."students"));
select setval(pg_get_serial_sequence('public."teachers"', 'TeacherID'), (select max("TeacherID") from public."teachers"));
select setval(pg_get_serial_sequence('public."subjects"', 'SubjectID'), (select max("SubjectID") from public."subjects"));
select setval(pg_get_serial_sequence('public."control_types"', 'ControlTypeID'), (select max("ControlTypeID") from public."control_types"));
select setval(pg_get_serial_sequence('public."teacher_subjects"', 'TeacherSubjectID'), (select max("TeacherSubjectID") from public."teacher_subjects"));
