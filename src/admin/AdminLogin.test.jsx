import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import { LocaleProvider } from "../context/LocaleContext";

const mockNavigate = vi.fn();
const mockSignIn = vi.fn();
const mockSignOut = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../firebase", () => ({ auth: {} }));

vi.mock("firebase/auth", () => ({
    signInWithEmailAndPassword: (...args) => mockSignIn(...args),
    signOut: (...args) => mockSignOut(...args),
}));

vi.mock("../config/admin", () => ({
    isAdminUser: (user) => user?.email === "admin@test.com",
}));

describe("AdminLogin", () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        mockSignIn.mockClear();
        mockSignOut.mockClear();
    });

    it("rejects non-admin after sign in", async () => {
        mockSignIn.mockResolvedValue({ user: { email: "user@test.com" } });

        render(
            <MemoryRouter>
                <LocaleProvider>
                    <AdminLogin />
                </LocaleProvider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText("البريد الإلكتروني"), { target: { value: "user@test.com" } });
        fireEvent.change(screen.getByLabelText("كلمة السر"), { target: { value: "pass" } });
        fireEvent.click(screen.getByRole("button", { name: "دخول" }));

        await waitFor(() => {
            expect(mockSignOut).toHaveBeenCalled();
            expect(screen.getByRole("alert")).toHaveTextContent("غير مصرح");
        });
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("navigates for admin user", async () => {
        mockSignIn.mockResolvedValue({ user: { email: "admin@test.com" } });

        render(
            <MemoryRouter>
                <LocaleProvider>
                    <AdminLogin />
                </LocaleProvider>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText("البريد الإلكتروني"), { target: { value: "admin@test.com" } });
        fireEvent.change(screen.getByLabelText("كلمة السر"), { target: { value: "pass" } });
        fireEvent.click(screen.getByRole("button", { name: "دخول" }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/admin/dashboard");
        });
    });
});
