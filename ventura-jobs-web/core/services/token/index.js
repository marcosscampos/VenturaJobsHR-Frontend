const tokenKey = "@ventura/token"

export function saveToken(token) {
  process.client ? localStorage.setItem(tokenKey, token) : window.localStorage.setItem(tokenKey, token);
}

export function getToken() {
  return process.client ? localStorage.getItem(tokenKey) : window.localStorage.getItem(tokenKey);
}

export function deleteToken() {
  return process.client ? localStorage.removeItem(tokenKey) : window.localStorage.removeItem(tokenKey);
}
