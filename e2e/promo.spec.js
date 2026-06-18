import { test, expect } from "@playwright/test";

test.describe("Checkout UI", () => {
    test("checkout page shows coupon field when cart has items", async ({ page }) => {
        await page.goto("/products", { waitUntil: "domcontentloaded" });

        const addButtons = page.getByRole("button", { name: /أضف للسلة/i });
        const count = await addButtons.count();
        if (count > 0) {
            await addButtons.first().click();
            await page.goto("/checkout", { waitUntil: "domcontentloaded" });
            await expect(page.getByPlaceholder("أدخل الكود")).toBeVisible();
            await expect(page.getByRole("button", { name: "تطبيق" })).toBeVisible();
        } else {
            test.skip();
        }
    });
});
