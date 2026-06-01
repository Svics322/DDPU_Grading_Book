export function resourceListPath(resource, role) {
  if (resource === "success_rate" && role === "teacher") {
    return "/grades";
  }

  return `/${resource}`;
}

export function resourceCreatePath(resource, role) {
  return `${resourceListPath(resource, role)}/new`;
}

export function resourceEditPath(resource, id, role) {
  return `${resourceListPath(resource, role)}/${id}/edit`;
}
