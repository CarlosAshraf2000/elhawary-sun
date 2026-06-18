import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import PageLayout from "../components/ui/PageLayout";
import PageMeta from "../components/seo/PageMeta";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";
import { useLocale } from "../hooks/useLocale";
import { useAuth } from "../hooks/useAuth";
import { getAuthErrorKey } from "../utils/authErrors";

export default function RegisterPage() {
    const { t } = useLocale();
    const { user, loading } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (!loading && user) {
        return <Navigate to="/account" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError(t("auth.errors.weakPassword"));
            return;
        }
        if (password !== confirmPassword) {
            setError(t("auth.errors.passwordMismatch"));
            return;
        }

        setSubmitting(true);
        try {
            const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
            const trimmedName = name.trim();
            if (trimmedName) {
                await updateProfile(credential.user, { displayName: trimmedName });
            }
            await addDoc(collection(db, "users"), {
                uid: credential.user.uid,
                name: trimmedName,
                email: email.trim().toLowerCase(),
                createdAt: serverTimestamp(),
            });
        } catch (err) {
            setError(t(getAuthErrorKey(err.code)));
            setSubmitting(false);
        }
    };

    return (
        <PageLayout title={t("auth.registerTitle")}>
            <PageMeta titleKey="auth.registerTitle" />
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-white p-8 rounded-card shadow-card space-y-4"
            >
                <p className="text-gray-600 text-center text-sm mb-2">{t("auth.registerSubtitle")}</p>

                <FormField
                    label={t("auth.name")}
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <FormField
                    label={t("auth.confirmPassword")}
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? t("auth.registering") : t("nav.register")}
                </Button>

                {error && (
                    <p role="alert" className="text-red-600 text-center text-sm">
                        {error}
                    </p>
                )}

                <p className="text-center text-sm text-gray-600 pt-2">
                    {t("auth.haveAccount")}{" "}
                    <Link to="/login" className="text-gold font-semibold hover:underline">
                        {t("nav.login")}
                    </Link>
                </p>
            </form>
        </PageLayout>
    );
}
