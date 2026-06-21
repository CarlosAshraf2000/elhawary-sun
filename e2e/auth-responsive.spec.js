import { test, expect } from "@playwright/test";

test.describe("Auth pages", () => {
    test("login page renders form", async ({ page }) => {
        await page.goto("/login");
        await expect(page.getByRole("heading", { name: /تسجيل الدخول|Log in/i })).toBeVisible();
    });

    test("register page renders form", async ({ page }) => {
        await page.goto("/register");
        await expect(page.getByRole("heading", { name: /إنشاء حساب|Create account/i })).toBeVisible();
    });
});

test.describe("Responsive layout", () => {
    test("mobile viewport shows hamburger menu", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto("/");
        await expect(page.getByLabel(/فتح القائمة|Open menu/i)).toBeVisible();
    });

    test("tablet viewport keeps compact nav", async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto("/");
        await expect(page.getByLabel(/فتح القائمة|Open menu/i)).toBeVisible();
    });
});

test.describe("Services and stats", () => {
    test("services page loads", async ({ page }) => {
        await page.goto("/services");
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });

    test("home stats show updated numbers", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByText("5000+")).toBeVisible();
        await expect(page.getByText("7000+")).toBeVisible();
    });
});
