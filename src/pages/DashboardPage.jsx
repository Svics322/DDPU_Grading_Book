import { BookOpen, GraduationCap, KeyRound, Table2, UserRound } from "lucide-react";
import { useSelector } from "react-redux";
import { GradeQuickCalculator } from "../components/GradeQuickCalculator";
import { gradeRowsForUser, labelById } from "../lib/formatters";

export function DashboardPage() {
  const db = useSelector((state) => state.data.tables);
  const user = useSelector((state) => state.auth.user);
  const grades = gradeRowsForUser(db.success_rate || [], user, db);
  const average = grades.length ? (grades.reduce((sum, row) => sum + Number(row.Mark), 0) / grades.length).toFixed(1) : "—";

  const stats = [
    { label: "Студентів", value: db.students?.length || 0, icon: GraduationCap },
    { label: "Викладачів", value: db.teachers?.length || 0, icon: UserRound },
    { label: "Предметів", value: db.subjects?.length || 0, icon: BookOpen },
    { label: "Записів успішності", value: grades.length, icon: Table2 },
  ];

  const recent = [...grades].sort((a, b) => String(b.AssessmentDate).localeCompare(String(a.AssessmentDate))).slice(0, 8);

  return (
    <div className="page">
      <section className="hero-band">
        <div>
          <h1>Журнал успішності</h1>
        </div>
        <img src="/images/campus.svg" alt="" />
      </section>

      <section className="stats-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <div className="stat-item" key={label}>
            <Icon size={22} />
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
        <div className="stat-item accent-stat">
          <KeyRound size={22} />
          <span>Середній бал</span>
          <strong>{average}</strong>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="section-heading compact-heading">
            <Table2 size={22} />
            <div>
              <h2>Останні оцінки</h2>
            </div>
          </div>
          <div className="activity-list">
            {recent.map((row) => (
              <div className="activity-row" key={row.SuccRateID}>
                <div>
                  <strong>{labelById("students", row.StudentID, db)}</strong>
                  <span>{labelById("subjects", row.SubjectID, db)} · {labelById("control_types", row.ControlTypeID, db)}</span>
                </div>
                <b>{row.Mark}</b>
              </div>
            ))}
          </div>
        </section>
        <GradeQuickCalculator />
      </div>
    </div>
  );
}
