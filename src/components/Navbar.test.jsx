import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import { LocaleProvider } from "../context/LocaleContext";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "./Navbar";

function renderNavbar(path = "/") {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <LocaleProvider>
                <AuthProvider>
                    <CartProvider>
                        <Navbar />
                    </CartProvider>
                </AuthProvider>
            </LocaleProvider>
        </MemoryRouter>
    );
}

describe("Navbar", () => {
    it("renders on public pages", () => {
        renderNavbar("/");
        expect(screen.getByText("الهواري صن")).toBeInTheDocument();
        expect(screen.getByLabelText("التنقل الرئيسي")).toBeInTheDocument();
    });

    it("hides on admin pages", () => {
        renderNavbar("/admin/dashboard");
        expect(screen.queryByText("الهواري صن")).not.toBeInTheDocument();
    });
});
