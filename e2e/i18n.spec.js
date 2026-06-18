import { test, expect } from "@playwright/test";

test.describe("i18n", () => {
    test("switching to English updates hero text", async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await page.getByRole("banner").getByLabel(/الإعدادات|Settings/i).first().click();
        await page.getByRole("button", { name: "English" }).first().click();
        await expect(page.getByRole("heading", { name: "Elhawary Sun Solar Energy", level: 1 })).toBeVisible();
        await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    });
});
