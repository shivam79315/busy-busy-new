const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export function isAdminEmail(email) {
  return Boolean(ADMIN_EMAIL) && email === ADMIN_EMAIL;
}
