const key = "@ventura/role";

export function saveRole(role) {
  if (process.server)
    return;

  localStorage.setItem(key, role)
}

export function getRole() {
  if (process.server)
    return;

  return localStorage.getItem(key)
}

export function deleteRole() {
  if (process.server)
    return;

  return localStorage.removeItem(key)
}
