import { Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { fieldValue } from "../lib/formatters";
import { resourceEditPath } from "../lib/resourcePaths";
import { getPk, resources } from "../lib/schema";

export function DataTable({ resource, rows, db, canEdit, onDelete, role }) {
  const config = resources[resource];
  const pk = getPk(resource);
  const columns = config.columns;

  return (
    <div className="table-shell">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{config.fields[column]?.label || column}</th>
            ))}
            {canEdit && <th className="actions-cell">Дії</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (canEdit ? 1 : 0)} className="empty-cell">Записи не знайдено.</td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={String(row[pk])}>
              {columns.map((column) => (
                <td key={column}>{fieldValue(resource, column, row[column], db)}</td>
              ))}
              {canEdit && (
                <td className="actions-cell">
                  <Link className="icon-button" to={resourceEditPath(resource, row[pk], role)} title="Редагувати">
                    <Edit size={17} />
                  </Link>
                  <button type="button" className="icon-button danger-icon" onClick={() => onDelete(row)} title="Видалити">
                    <Trash2 size={17} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
