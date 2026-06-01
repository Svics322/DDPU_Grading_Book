import { ArrowDownAZ, ArrowUpAZ, ListFilter, Plus, RotateCw, Rows3, Search } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { CustomSelect } from "../components/CustomSelect";
import { DataTable } from "../components/DataTable";
import { Pagination } from "../components/Pagination";
import { deleteEntity, loadResource } from "../features/data/dataSlice";
import { fieldValue, gradeRowsForUser, labelFor, searchRows, sortRows } from "../lib/formatters";
import { paginateRows } from "../lib/pagination";
import { canManageResource } from "../lib/rbac";
import { resourceCreatePath } from "../lib/resourcePaths";
import { getPk, resources } from "../lib/schema";

function resolveResource(param, pathnameResource) {
  if (param === "admin-users") return "profiles";
  if (pathnameResource === "grades") return "success_rate";
  return param || pathnameResource || "success_rate";
}

export function ResourceListPage({ fixedResource }) {
  const params = useParams();
  const resource = resolveResource(params.resource, fixedResource);
  const config = resources[resource];
  const db = useSelector((state) => state.data.tables);
  const user = useSelector((state) => state.auth.user);
  const status = useSelector((state) => state.data.status);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState(config.columns[0] || config.pk);
  const [direction, setDirection] = useState("ASC");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [deleteRow, setDeleteRow] = useState(null);
  const pk = getPk(resource);
  const canEdit = canManageResource(user?.role, resource);
  const sortOptions = config.columns.map((field) => ({
    value: field,
    label: config.fields[field]?.label || field,
    icon: ListFilter,
  }));
  const directionOptions = [
    { value: "ASC", label: "За зростанням", icon: ArrowUpAZ },
    { value: "DESC", label: "За спаданням", icon: ArrowDownAZ },
  ];
  const pageSizeOptions = [5, 10, 20, 50].map((size) => ({ value: size, label: `${size} записів`, icon: Rows3 }));

  const baseRows = resource === "success_rate" ? gradeRowsForUser(db[resource] || [], user, db) : db[resource] || [];
  const rows = sortRows(resource, searchRows(resource, baseRows, query, db), sortField, direction, db);

  const pageData = paginateRows(rows, page, perPage);

  async function confirmDelete() {
    await dispatch(deleteEntity({ resource, id: deleteRow[pk], pk })).unwrap();
    setDeleteRow(null);
  }

  return (
    <div className="page">
      <section className="page-header">
        <div>
          <h1>{config.title}</h1>
        </div>
        <div className="header-actions">
          <button type="button" className="button secondary" onClick={() => dispatch(loadResource(resource))}>
            <RotateCw size={16} />
            Оновити
          </button>
          {canEdit && (
            <Link className="button primary" to={resourceCreatePath(resource, user?.role)}>
              <Plus size={16} />
              Створити
            </Link>
          )}
        </div>
      </section>

      <section className="toolbar">
        <label className="search-box">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value) || setPage(1)} placeholder="Пошук по таблиці" />
        </label>
        <CustomSelect label="Сортувати" value={sortField} options={sortOptions} icon={ListFilter} searchable={false} onChange={setSortField} />
        <CustomSelect label="Напрям" value={direction} options={directionOptions} icon={ArrowUpAZ} searchable={false} onChange={setDirection} />
        <CustomSelect
          label="На сторінці"
          value={perPage}
          options={pageSizeOptions}
          icon={Rows3}
          searchable={false}
          onChange={(value) => {
            setPerPage(Number(value));
            setPage(1);
          }}
        />
      </section>

      {status === "loading" && <p className="notice">Завантаження даних...</p>}
      <DataTable resource={resource} rows={pageData.rows} db={db} canEdit={canEdit} onDelete={setDeleteRow} role={user?.role} />
      <Pagination meta={pageData.meta} onPageChange={setPage} />

      {deleteRow && (
        <ConfirmDialog
          title="Підтвердити видалення"
          text={`Буде видалено запис: ${fieldValue(resource, pk, deleteRow[pk], db)} ${labelFor(resource, deleteRow, db)}`}
          onCancel={() => setDeleteRow(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
