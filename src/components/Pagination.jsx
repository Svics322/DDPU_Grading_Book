import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ meta, onPageChange }) {
  return (
    <div className="pagination">
      <button type="button" className="icon-button" onClick={() => onPageChange(meta.page - 1)} disabled={meta.page <= 1} title="Попередня сторінка">
        <ChevronLeft size={18} />
      </button>
      <span>
        Сторінка {meta.page} з {meta.totalPages}. Записів: {meta.total}
      </span>
      <button type="button" className="icon-button" onClick={() => onPageChange(meta.page + 1)} disabled={meta.page >= meta.totalPages} title="Наступна сторінка">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
