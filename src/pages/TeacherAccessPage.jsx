import { FORM_ERROR } from "final-form";
import { Field, Form } from "react-final-form";
import { KeyRound, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { CustomSelect } from "../components/CustomSelect";
import { deleteEntity, saveEntity } from "../features/data/dataSlice";
import { labelById } from "../lib/formatters";

function validate(values) {
  const errors = {};
  if (!values.TeacherID) errors.TeacherID = "Оберіть викладача.";
  if (!values.SubjectID) errors.SubjectID = "Оберіть предмет.";
  return errors;
}

export function TeacherAccessPage() {
  const db = useSelector((state) => state.data.tables);
  const dispatch = useDispatch();
  const teacherOptions = db.teachers.map((teacher) => ({ value: teacher.TeacherID, label: teacher.FullName }));
  const subjectOptions = db.subjects.map((subject) => ({ value: subject.SubjectID, label: subject.SubjectName }));

  async function handleSubmit(values, form) {
    const exists = db.teacher_subjects.some((row) => String(row.TeacherID) === String(values.TeacherID) && String(row.SubjectID) === String(values.SubjectID));
    if (exists) return { [FORM_ERROR]: "Такий доступ уже призначено." };

    await dispatch(saveEntity({
      resource: "teacher_subjects",
      pk: "TeacherSubjectID",
      values: { ...values, CanEditGrades: Boolean(values.CanEditGrades) },
    })).unwrap();
    form.reset();
    return undefined;
  }

  return (
    <div className="page">
      <section className="page-header">
        <div className="section-heading">
          <KeyRound size={24} />
          <div>
            <h1>Призначення доступів</h1>
          </div>
        </div>
      </section>

      <Form
        onSubmit={handleSubmit}
        validate={validate}
        initialValues={{ CanEditGrades: true }}
        render={({ handleSubmit, submitError }) => (
          <form className="access-form" onSubmit={handleSubmit} noValidate>
            <Field name="TeacherID">
              {({ input, meta }) => (
                <CustomSelect label="Викладач" value={input.value} options={teacherOptions} placeholder="Оберіть викладача" onChange={input.onChange} error={meta.touched ? meta.error : ""} />
              )}
            </Field>
            <Field name="SubjectID">
              {({ input, meta }) => (
                <CustomSelect label="Предмет" value={input.value} options={subjectOptions} placeholder="Оберіть предмет" onChange={input.onChange} error={meta.touched ? meta.error : ""} />
              )}
            </Field>
            <Field name="CanEditGrades" type="checkbox">
              {({ input }) => (
                <label className="check-field">
                  <input {...input} type="checkbox" checked={Boolean(input.value)} />
                  <span>Дозволити редагування оцінок</span>
                </label>
              )}
            </Field>
            {submitError && <p className="form-error">{submitError}</p>}
            <button type="submit" className="button primary">Призначити</button>
          </form>
        )}
      />

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Викладач</th>
              <th>Предмет</th>
              <th>Редагування</th>
              <th className="actions-cell">Дії</th>
            </tr>
          </thead>
          <tbody>
            {db.teacher_subjects.map((row) => (
              <tr key={row.TeacherSubjectID}>
                <td>{labelById("teachers", row.TeacherID, db)}</td>
                <td>{labelById("subjects", row.SubjectID, db)}</td>
                <td>{row.CanEditGrades ? "Дозволено" : "Тільки перегляд"}</td>
                <td className="actions-cell">
                  <button type="button" className="icon-button danger-icon" onClick={() => dispatch(deleteEntity({ resource: "teacher_subjects", id: row.TeacherSubjectID, pk: "TeacherSubjectID" }))}>
                    <Trash2 size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
