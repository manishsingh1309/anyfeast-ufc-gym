/**
 * Thin wrapper around localStorage with type safety.
 * Swap this for sessionStorage or a secure cookie library in production.
 */

const AUTH_TOKEN_KEY = "anyfeast_token";
const AUTH_USER_KEY = "anyfeast_user";

export const storage = {
  setToken: (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token),
  getToken: (): string | null => localStorage.getItem(AUTH_TOKEN_KEY),
  removeToken: () => localStorage.removeItem(AUTH_TOKEN_KEY),

  setUser: (user: object) =>
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user)),
  getUser: <T>(): T | null => {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  removeUser: () => localStorage.removeItem(AUTH_USER_KEY),

  clear: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },
};
