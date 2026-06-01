import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="page centered-page">
      <h1>Сторінку не знайдено</h1>
      <Link className="button primary" to="/dashboard">До панелі</Link>
    </div>
  );
}
