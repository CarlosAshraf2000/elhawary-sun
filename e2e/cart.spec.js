import { test, expect } from "@playwright/test";

test.describe("Cart flow", () => {
    test("cart page loads", async ({ page }) => {
        await page.goto("/cart", { waitUntil: "domcontentloaded" });
        await expect(page.locator("h1")).toHaveText("سلة التسوق");
    });

    test("checkout redirects when cart empty", async ({ page }) => {
        await page.goto("/checkout", { waitUntil: "domcontentloaded" });
        await expect(page).toHaveURL(/\/cart$/);
    });

    test("products page has store hero", async ({ page }) => {
        await page.goto("/products", { waitUntil: "domcontentloaded" });
        await expect(page.getByRole("heading", { name: "متجر الهواري صن" })).toBeVisible();
    });

    test("home page loads without promo section breaking layout", async ({ page }) => {
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await expect(page.getByRole("heading", { name: "الهواري صن للطاقة الشمسية" })).toBeVisible();
    });
});
