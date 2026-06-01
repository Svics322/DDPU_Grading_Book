import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({ title, text, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <AlertTriangle size={28} />
        <h2 id="confirm-title">{title}</h2>
        <p>{text}</p>
        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={onCancel}>Скасувати</button>
          <button type="button" className="button danger" onClick={onConfirm}>Видалити</button>
        </div>
      </div>
    </div>
  );
}
