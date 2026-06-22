# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site.spec.js >> Elhawary Sun public site >> quote page shows form fields
- Location: e2e\site.spec.js:17:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: 'إرسال الطلب' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: 'إرسال الطلب' })

```

```yaml
- banner:
  - link "الهواري صن الهواري صن":
    - /url: /
    - text: الهواري صن
    - img "الهواري صن"
  - navigation "التنقل الرئيسي":
    - list:
      - listitem:
        - link "الرئيسية":
          - /url: /
      - listitem:
        - button "منتجاتنا":
          - text: منتجاتنا
          - img
      - listitem:
        - link "من نحن":
          - /url: /about
      - listitem:
        - link "خدماتنا":
          - /url: /services
      - listitem:
        - link "مشاريعنا":
          - /url: /projects
      - listitem:
        - link "تواصل معنا":
          - /url: /contact
      - listitem:
        - link "عرض سعر":
          - /url: /quote
      - listitem:
        - link "كورسات تعليمية":
          - /url: /courses
    - button "الملف الشخصي":
      - img
      - text: الملف الشخصي
      - img
    - button "الإعدادات":
      - img
    - button "السلة (0 قطعة)":
      - img
- dialog "سلة التسوق":
  - heading "سلة التسوق" [level=2]
  - button "إغلاق": ✕
  - paragraph: السلة فارغة — أضف منتجات للمتابعة
  - link "تصفح المنتجات":
    - /url: /products
- main:
  - heading "اطلب عرض سعر" [level=1]
  - text: الاسم
  - textbox "الاسم"
  - text: رقم الهاتف
  - textbox "رقم الهاتف"
  - text: المحافظة / المدينة
  - textbox "المحافظة / المدينة"
  - text: نوع النظام المطلوب
  - textbox "نوع النظام المطلوب":
    - /placeholder: "مثال: محطة 5 كيلو وات للمنزل"
  - button "إرسال عبر واتساب":
    - img
    - text: إرسال عبر واتساب
- contentinfo:
  - heading "الهواري صن" [level=3]
  - paragraph: توريد – تركيب – صيانة محطات وسخانات الطاقة الشمسية
  - heading "روابط سريعة" [level=3]
  - navigation:
    - link "من نحن":
      - /url: /about
    - link "خدماتنا":
      - /url: /services
    - link "مشاريعنا":
      - /url: /projects
    - link "منتجاتنا":
      - /url: /products
    - link "السلة":
      - /url: /cart
    - link "عرض سعر":
      - /url: /quote
  - heading "تواصل معنا" [level=3]
  - list:
    - listitem:
      - link "01271361380":
        - /url: tel:01271361380
    - listitem:
      - 'link "واتساب: 01001993667"':
        - /url: https://wa.me/201001993667
    - listitem:
      - link "elhawarysun@gmail.com":
        - /url: mailto:elhawarysun@gmail.com
    - listitem: مصر - المنيا
  - paragraph: © جميع الحقوق محفوظة – الهواري صن للطاقة الشمسية 2026
- link "تواصل عبر واتساب":
  - /url: https://wa.me/201001993667
  - img
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Elhawary Sun public site", () => {
  4  |     test("home page loads with single navbar", async ({ page }) => {
  5  |         await page.goto("/", { waitUntil: "domcontentloaded" });
  6  |         await expect(page.getByRole("banner")).toHaveCount(1);
  7  |         await expect(page.getByRole("heading", { name: "الهواري صن للطاقة الشمسية" })).toBeVisible();
  8  |     });
  9  | 
  10 |     test("navigation between pages works", async ({ page }) => {
  11 |         await page.goto("/", { waitUntil: "domcontentloaded" });
  12 |         await page.getByLabel("التنقل الرئيسي").getByRole("link", { name: "من نحن" }).click();
  13 |         await expect(page).toHaveURL(/\/about$/);
  14 |         await expect(page.getByRole("heading", { name: "من نحن" })).toBeVisible();
  15 |     });
  16 | 
  17 |     test("quote page shows form fields", async ({ page }) => {
  18 |         await page.goto("/quote", { waitUntil: "domcontentloaded" });
  19 |         await expect(page.getByLabel("الاسم")).toBeVisible();
  20 |         await expect(page.getByLabel("رقم الهاتف")).toBeVisible();
> 21 |         await expect(page.getByRole("button", { name: "إرسال الطلب" })).toBeVisible();
     |                                                                         ^ Error: expect(locator).toBeVisible() failed
  22 |     });
  23 | 
  24 |     test("404 page appears for unknown routes", async ({ page }) => {
  25 |         await page.goto("/this-page-does-not-exist", { waitUntil: "domcontentloaded" });
  26 |         await expect(page.getByText("الصفحة غير موجودة")).toBeVisible();
  27 |     });
  28 | });
  29 | 
```