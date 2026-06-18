import { test, expect } from "@playwright/test";

test.describe("Elhawary Sun public site", () => {
    test("home page loads with single navbar", async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await expect(page.getByRole("banner")).toHaveCount(1);
        await expect(page.getByRole("heading", { name: "الهواري صن للطاقة الشمسية" })).toBeVisible();
    });

    test("navigation between pages works", async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await page.getByLabel("التنقل الرئيسي").getByRole("link", { name: "من نحن" }).click();
        await expect(page).toHaveURL(/\/about$/);
        await expect(page.getByRole("heading", { name: "من نحن" })).toBeVisible();
    });

    test("quote page shows form fields", async ({ page }) => {
        await page.goto("/quote", { waitUntil: "domcontentloaded" });
        await expect(page.getByLabel("الاسم")).toBeVisible();
        await expect(page.getByLabel("رقم الهاتف")).toBeVisible();
        await expect(page.getByRole("button", { name: "إرسال الطلب" })).toBeVisible();
    });

    test("404 page appears for unknown routes", async ({ page }) => {
        await page.goto("/this-page-does-not-exist", { waitUntil: "domcontentloaded" });
        await expect(page.getByText("الصفحة غير موجودة")).toBeVisible();
    });
});
