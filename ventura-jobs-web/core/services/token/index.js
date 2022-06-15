const tokenKey = "@ventura/token"

export function saveToken(token) {
  if (process.server)
    return;

  localStorage.setItem(tokenKey, token)
}

export function getToken() {
  if (process.server)
    return;

  return localStorage.getItem(tokenKey)
}

export function deleteToken() {
  if (process.server)
    return;

  localStorage.removeItem(tokenKey)
}
