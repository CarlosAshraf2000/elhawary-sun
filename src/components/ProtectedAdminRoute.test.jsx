import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import { LocaleProvider } from "../context/LocaleContext";

const mockUnsubscribe = vi.fn();
let authCallback = null;

vi.mock("../firebase", () => ({
    auth: {},
}));

vi.mock("firebase/auth", () => ({
    onAuthStateChanged: (_auth, callback) => {
        authCallback = callback;
        return mockUnsubscribe;
    },
}));

vi.mock("../config/admin", () => ({
    checkIsAdmin: vi.fn(async (user) => user?.email === "admin@test.com"),
}));

describe("ProtectedAdminRoute", () => {
    beforeEach(() => {
        authCallback = null;
    });

    it("redirects unauthenticated users to login", async () => {
        render(
            <MemoryRouter initialEntries={["/admin/dashboard"]}>
                <LocaleProvider>
                    <ProtectedAdminRoute>
                        <div>محتوى محمي</div>
                    </ProtectedAdminRoute>
                </LocaleProvider>
            </MemoryRouter>
        );

        authCallback(null);

        await waitFor(() => {
            expect(screen.queryByText("محتوى محمي")).not.toBeInTheDocument();
        });
    });

    it("renders children for admin user", async () => {
        render(
            <MemoryRouter initialEntries={["/admin/dashboard"]}>
                <LocaleProvider>
                    <ProtectedAdminRoute>
                        <div>محتوى محمي</div>
                    </ProtectedAdminRoute>
                </LocaleProvider>
            </MemoryRouter>
        );

        authCallback({ email: "admin@test.com" });

        await waitFor(() => {
            expect(screen.getByText("محتوى محمي")).toBeInTheDocument();
        });
    });

    it("redirects authenticated non-admin to login", async () => {
        render(
            <MemoryRouter initialEntries={["/admin/dashboard"]}>
                <LocaleProvider>
                    <ProtectedAdminRoute>
                        <div>محتوى محمي</div>
                    </ProtectedAdminRoute>
                </LocaleProvider>
            </MemoryRouter>
        );

        authCallback({ email: "user@test.com" });

        await waitFor(() => {
            expect(screen.queryByText("محتوى محمي")).not.toBeInTheDocument();
        });
    });
});
