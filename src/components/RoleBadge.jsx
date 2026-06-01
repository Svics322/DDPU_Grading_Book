import { ROLE_LABELS } from "../lib/schema";

export function RoleBadge({ role }) {
  return <span className={`role-badge role-${role || "guest"}`}>{ROLE_LABELS[role || "guest"]}</span>;
}
