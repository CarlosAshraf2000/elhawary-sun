import { test, expect } from "@playwright/test";

test.describe("Shop layout", () => {
    test("products page has sidebar search", async ({ page }) => {
        await page.goto("/products", { waitUntil: "domcontentloaded" });
        await expect(page.getByPlaceholder(/الماركة|Brand/i)).toBeVisible();
    });

    test("category filter via URL", async ({ page }) => {
        await page.goto("/products?category=inverters", { waitUntil: "domcontentloaded" });
        await expect(page).toHaveURL(/category=inverters/);
    });

    test("currency switch shows USD prices", async ({ page }) => {
        await page.goto("/products", { waitUntil: "domcontentloaded" });
        await page.getByRole("banner").getByLabel(/الإعدادات|Settings/i).first().click();
        await page.getByRole("button", { name: /دولار|US Dollar/i }).first().click();
        await expect(page.locator("main")).toContainText(/\$/);
    });
});
