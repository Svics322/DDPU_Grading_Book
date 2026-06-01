import { BookOpen } from "lucide-react";
import { useSelector } from "react-redux";
import { labelFor } from "../lib/formatters";

export function PublicCatalogPage() {
  const db = useSelector((state) => state.data.tables);

  return (
    <div className="page">
      <section className="catalog-head">
        <div className="section-heading">
          <BookOpen size={24} />
          <div>
            <h1>Каталог навчання</h1>
          </div>
        </div>
        <img src="/images/catalog.svg" alt="" />
      </section>
      <section className="catalog-grid">
        <div>
          <h2>Предмети</h2>
          <ul className="plain-list">
            {db.subjects.map((subject) => <li key={subject.SubjectID}>{subject.SubjectName}</li>)}
          </ul>
        </div>
        <div>
          <h2>Групи</h2>
          <ul className="plain-list">
            {db.groups.map((group) => <li key={group.GroupID}>{labelFor("groups", group, db)}</li>)}
          </ul>
        </div>
        <div>
          <h2>Факультети</h2>
          <ul className="plain-list">
            {db.departments.map((department) => <li key={department.DepartmentID}>{department.FullName}</li>)}
          </ul>
        </div>
      </section>
    </div>
  );
}
