export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL?.trim() || "";

export function isAdminUser(user) {
    if (!user || !ADMIN_EMAIL) return false;
    return user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
