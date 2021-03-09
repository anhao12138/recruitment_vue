import Cookies from "js-cookie";

export function getToken(tokenKey) {
  return Cookies.get(tokenKey);
}

export function setToken(tokenKey, token) {
  return Cookies.set(tokenKey, token, { expires: 7, path: "/" });
}

export function removeToken(tokenKey) {
  return Cookies.remove(tokenKey);
}
