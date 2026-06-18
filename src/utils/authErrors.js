export function getAuthErrorKey(code) {
    const map = {
        "auth/email-already-in-use": "auth.errors.emailInUse",
        "auth/invalid-email": "auth.errors.invalidEmail",
        "auth/weak-password": "auth.errors.weakPassword",
        "auth/user-not-found": "auth.errors.invalidCredentials",
        "auth/wrong-password": "auth.errors.invalidCredentials",
        "auth/invalid-credential": "auth.errors.invalidCredentials",
        "auth/too-many-requests": "auth.errors.tooManyRequests",
    };
    return map[code] || "auth.errors.generic";
}
