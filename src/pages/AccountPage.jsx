import { useState } from "react";
import { Navigate } from "react-router-dom";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import PageLayout from "../components/ui/PageLayout";
import PageMeta from "../components/seo/PageMeta";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useLocale } from "../hooks/useLocale";
import { useAuth } from "../hooks/useAuth";
import { getAuthErrorKey } from "../utils/authErrors";

export default function AccountPage() {
    const { t } = useLocale();
    const { user, loading } = useAuth();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: "/account" }} replace />;
    }

    const handleLogout = async () => {
        await signOut(auth);
    };

    const handleResetPassword = async () => {
        setMessage("");
        setError("");
        try {
            await sendPasswordResetEmail(auth, user.email);
            setMessage(t("auth.resetPasswordSent"));
        } catch (err) {
            setError(t(getAuthErrorKey(err.code)));
        }
    };

    const displayName = user.displayName || user.email;

    return (
        <PageLayout title={t("auth.accountTitle")}>
            <PageMeta titleKey="auth.accountTitle" />
            <div className="max-w-md mx-auto bg-white p-8 rounded-card shadow-card space-y-6 text-center">
                <p className="text-gray-600">{t("auth.welcome")}</p>
                <p className="text-xl font-bold text-dark break-all">{displayName}</p>
                {user.displayName && (
                    <p className="text-gray-500 text-sm break-all" dir="ltr">
                        {user.email}
                    </p>
                )}
                <Button type="button" variant="outline" className="w-full" onClick={handleResetPassword}>
                    {t("auth.resetPassword")}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleLogout}>
                    {t("auth.logout")}
                </Button>
                {message && <p role="status" className="text-green-600 text-sm">{message}</p>}
                {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
            </div>
        </PageLayout>
    );
}
