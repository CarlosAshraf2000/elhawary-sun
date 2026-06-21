export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL?.trim() || "";

export async function checkIsAdmin(user) {
    if (!user) return false;

    try {
        const tokenResult = await user.getIdTokenResult();
        if (tokenResult.claims.admin === true) return true;
    } catch {
        /* fall through to email fallback */
    }

    if (ADMIN_EMAIL && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        return true;
    }

    return false;
}

/** @deprecated Use checkIsAdmin for async claim checks */
export function isAdminUser(user) {
    if (!user || !ADMIN_EMAIL) return false;
    return user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
