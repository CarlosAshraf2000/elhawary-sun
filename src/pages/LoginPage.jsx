import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import PageLayout from "../components/ui/PageLayout";
import PageMeta from "../components/seo/PageMeta";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";
import { useLocale } from "../hooks/useLocale";
import { useAuth } from "../hooks/useAuth";
import { getAuthErrorKey } from "../utils/authErrors";

export default function LoginPage() {
    const { t } = useLocale();
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/account";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (!loading && user) {
        return <Navigate to="/account" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(t(getAuthErrorKey(err.code)));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageLayout title={t("auth.loginTitle")}>
            <PageMeta titleKey="auth.loginTitle" />
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-white p-8 rounded-card shadow-card space-y-4"
            >
                <p className="text-gray-600 text-center text-sm mb-2">{t("auth.loginSubtitle")}</p>

                <FormField
                    label={t("auth.email")}
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <FormField
                    label={t("auth.password")}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? t("auth.loggingIn") : t("nav.login")}
                </Button>

                {error && (
                    <p role="alert" className="text-red-600 text-center text-sm">
                        {error}
                    </p>
                )}

                <p className="text-center text-sm text-gray-600 pt-2">
                    {t("auth.noAccount")}{" "}
                    <Link to="/register" className="text-gold font-semibold hover:underline">
                        {t("nav.register")}
                    </Link>
                </p>
            </form>
        </PageLayout>
    );
}
