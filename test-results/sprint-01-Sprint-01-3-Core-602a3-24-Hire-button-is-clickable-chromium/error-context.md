# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sprint-01.spec.ts >> Sprint-01: 3 Core Pages E2E Tests >> 24. Hire button is clickable
- Location: tests/e2e/sprint-01.spec.ts:218:7

# Error details

```
Error: browserType.launch: Executable doesn't exist at /home/ubuntu/.cache/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-linux64/chrome-headless-shell
╔════════════════════════════════════════════════════════════╗
║ Looks like Playwright was just installed or updated.       ║
║ Please run the following command to download new browsers: ║
║                                                            ║
║     npx playwright install                                 ║
║                                                            ║
║ <3 Playwright Team                                         ║
╚════════════════════════════════════════════════════════════╝
```

```
TypeError: Cannot read properties of undefined (reading 'close')
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Sprint-01: 3 Core Pages E2E Tests', () => {
  4   |   let page;
  5   | 
  6   |   test.beforeEach(async ({ browser }) => {
  7   |     page = await browser.newPage();
  8   |   });
  9   | 
  10  |   test.afterEach(async () => {
> 11  |     await page.close();
      |                ^ TypeError: Cannot read properties of undefined (reading 'close')
  12  |   });
  13  | 
  14  |   // ========================================
  15  |   // Landing Page Tests (Tests 1-10)
  16  |   // ========================================
  17  | 
  18  |   test('01. Landing page loads successfully', async () => {
  19  |     const response = await page.goto('/');
  20  |     expect(response.status()).toBe(200);
  21  |   });
  22  | 
  23  |   test('02. Hero section displays correctly', async () => {
  24  |     await page.goto('/');
  25  |     
  26  |     // Check main title
  27  |     await expect(page.locator('h1')).toContainText('Find the Right');
  28  |     await expect(page.locator('h1')).toContainText('Manufacturing Experts');
  29  |     
  30  |     // Check subtitle
  31  |     await expect(page.getByText('The First Agent-to-Agent Protocol')).toBeVisible();
  32  |   });
  33  | 
  34  |   test('03. Input field accepts text', async () => {
  35  |     await page.goto('/');
  36  |     
  37  |     const textarea = page.locator('textarea');
  38  |     await textarea.fill('Test query about chip supply chain');
  39  |     await expect(textarea).toHaveValue('Test query about chip supply chain');
  40  |   });
  41  | 
  42  |   test('04. Submit button is clickable', async () => {
  43  |     await page.goto('/');
  44  |     
  45  |     const submitButton = page.getByRole('button', { name: /submit request/i });
  46  |     await expect(submitButton).toBeEnabled();
  47  |   });
  48  | 
  49  |   test('05. Stats display correctly', async () => {
  50  |     await page.goto('/');
  51  |     
  52  |     await expect(page.getByText('30,000+')).toBeVisible();
  53  |     await expect(page.getByText('Expert Interviews')).toBeVisible();
  54  |     await expect(page.getByText('500+')).toBeVisible();
  55  |     await expect(page.getByText('Companies Served')).toBeVisible();
  56  |     await expect(page.getByText('24hr')).toBeVisible();
  57  |     await expect(page.getByText('Average Response')).toBeVisible();
  58  |   });
  59  | 
  60  |   test('06. Feature cards display', async () => {
  61  |     await page.goto('/');
  62  |     
  63  |     await expect(page.getByText('Smart Matching')).toBeVisible();
  64  |     await expect(page.getByText('Secure Delivery')).toBeVisible();
  65  |     await expect(page.getByText('Fast Settlement')).toBeVisible();
  66  |   });
  67  | 
  68  |   test('07. Navigation works', async () => {
  69  |     await page.goto('/');
  70  |     
  71  |     // Check navigation links
  72  |     await expect(page.getByRole('link', { name: /产品介绍/i })).toBeVisible();
  73  |     await expect(page.getByRole('link', { name: /专家网络/i })).toBeVisible();
  74  |     await expect(page.getByRole('link', { name: /定价/i })).toBeVisible();
  75  |   });
  76  | 
  77  |   test('08. Dark theme applied', async () => {
  78  |     await page.goto('/');
  79  |     
  80  |     // Check dark background
  81  |     const body = page.locator('body');
  82  |     const bgColor = await body.evaluate((el) => 
  83  |       window.getComputedStyle(el).backgroundColor
  84  |     );
  85  |     expect(bgColor).toBeTruthy();
  86  |   });
  87  | 
  88  |   test('09. Responsive layout - desktop', async () => {
  89  |     await page.setViewportSize({ width: 1920, height: 1080 });
  90  |     await page.goto('/');
  91  |     
  92  |     // Check grid layout for stats
  93  |     const statsGrid = page.locator('.grid').first();
  94  |     await expect(statsGrid).toBeVisible();
  95  |   });
  96  | 
  97  |   test('10. Responsive layout - mobile', async () => {
  98  |     await page.setViewportSize({ width: 375, height: 667 });
  99  |     await page.goto('/');
  100 |     
  101 |     // Check mobile layout
  102 |     await expect(page.locator('h1')).toBeVisible();
  103 |   });
  104 | 
  105 |   // ========================================
  106 |   // AI Clarification Page Tests (Tests 11-17)
  107 |   // ========================================
  108 | 
  109 |   test('11. Clarify page loads successfully', async () => {
  110 |     const response = await page.goto('/clarify');
  111 |     expect(response.status()).toBe(200);
```