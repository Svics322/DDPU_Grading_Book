import { FORM_ERROR } from "final-form";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EntityForm } from "../components/EntityForm";
import { saveEntity } from "../features/data/dataSlice";
import { canManageResource } from "../lib/rbac";
import { resourceListPath } from "../lib/resourcePaths";
import { getPk, resources } from "../lib/schema";

export function ResourceFormPage({ fixedResource, returnPath }) {
  const { resource: routeResource, id } = useParams();
  const resource = fixedResource || routeResource;
  const config = resources[resource];
  const db = useSelector((state) => state.data.tables);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!config || !canManageResource(user?.role, resource)) {
    return <Navigate to="/dashboard" replace />;
  }

  const pk = getPk(resource);
  const existing = id ? db[resource]?.find((item) => String(item[pk]) === String(id)) : null;
  const title = id ? `Редагування: ${config.title}` : `Створення: ${config.title}`;
  const currentTeacher = resource === "success_rate" && user?.role === "teacher"
    ? db.teachers?.find((teacher) => teacher.profile_id === user.id)
    : null;
  const assignedSubjectIds = currentTeacher
    ? db.teacher_subjects
      .filter((item) => String(item.TeacherID) === String(currentTeacher.TeacherID) && item.CanEditGrades)
      .map((item) => String(item.SubjectID))
    : [];
  const formDb = currentTeacher
    ? {
        ...db,
        teachers: [currentTeacher],
        subjects: db.subjects.filter((subject) => assignedSubjectIds.includes(String(subject.SubjectID))),
      }
    : db;
  const initialValues = existing || (currentTeacher ? { TeacherID: currentTeacher.TeacherID } : {});

  async function handleSubmit(values) {
    try {
      const valuesToSave = currentTeacher ? { ...values, TeacherID: currentTeacher.TeacherID } : values;
      await dispatch(saveEntity({ resource, id, pk, values: valuesToSave })).unwrap();
      navigate(returnPath || resourceListPath(resource, user?.role));
    } catch (error) {
      return { [FORM_ERROR]: error.message };
    }
    return undefined;
  }

  return (
    <div className="page full-form-page">
      <section className="page-header">
        <div>
          <h1>{title}</h1>
        </div>
        <Link className="button secondary" to={returnPath || resourceListPath(resource, user?.role)}>
          <ArrowLeft size={16} />
          До списку
        </Link>
      </section>
      <EntityForm
        resource={resource}
        initialValues={initialValues}
        db={formDb}
        onSubmit={handleSubmit}
        submitLabel={id ? "Зберегти зміни" : "Створити запис"}
      />
    </div>
  );
}
