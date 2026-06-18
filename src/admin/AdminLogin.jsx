import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { isAdminUser } from "../config/admin";
import FormField from "../components/ui/FormField";
import Button from "../components/ui/Button";
import { useLocale } from "../hooks/useLocale";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { t, dir } = useLocale();

    const login = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const credential = await signInWithEmailAndPassword(auth, email, pass);
            if (!isAdminUser(credential.user)) {
                await signOut(auth);
                setError(t("admin.unauthorized"));
                return;
            }
            navigate("/admin/dashboard");
        } catch (err) {
            setError(`${t("admin.loginError")}: ${err.code}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4" dir={dir}>
            <form
                onSubmit={login}
                className="bg-white p-8 rounded-card shadow-card w-full max-w-md space-y-4"
            >
                <h1 className="text-2xl font-bold text-center mb-4">
                    {t("admin.loginTitle")}
                </h1>

                <FormField
                    label={t("admin.email")}
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <FormField
                    label={t("admin.password")}
                    name="password"
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                />

                <Button type="submit" className="w-full">
                    {t("admin.login")}
                </Button>

                {error && (
                    <p role="alert" className="text-red-600 text-center text-sm">
                        {error}
                    </p>
                )}
            </form>
        </div>
    );
}
