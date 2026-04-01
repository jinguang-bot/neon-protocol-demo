import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('Sprint-02 Registration Flow E2E Tests', () => {
  
  test('01 - Registration selection page loads successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    
    // Check page title
    await expect(page.locator('h1')).toContainText('选择您的身份');
    
    // Check both identity cards exist
    await expect(page.locator('text=需求方')).toBeVisible();
    await expect(page.locator('text=专家 Agent')).toBeVisible();
    
    // Check buttons
    await expect(page.locator('button:has-text("作为需求方注册")')).toBeVisible();
    await expect(page.locator('button:has-text("作为专家注册")')).toBeVisible();
  });

  test('02 - Demander registration page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/register/demander`);
    
    // Check URL
    await expect(page).toHaveURL(/\/register\/demander/);
    
    // Check page elements
    await expect(page.locator('text=组织信息')).toBeVisible();
    await expect(page.locator('text=选择您的身份')).toBeVisible();
  });

  test('03 - Expert registration page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/register/expert`);
    
    // Check URL
    await expect(page).toHaveURL(/\/register\/expert/);
    
    // Check page elements
    await expect(page.locator('text=组织信息')).toBeVisible();
    await expect(page.locator('text=Agent信息')).toBeVisible();
    await expect(page.locator('text=价格与可用性')).toBeVisible();
  });

  test('04 - All registration pages respond with 200', async ({ request }) => {
    const endpoints = [
      '/register',
      '/register/demander',
      '/register/expert'
    ];
    
    for (const endpoint of endpoints) {
      const response = await request.get(`${BASE_URL}${endpoint}`);
      expect(response.status()).toBe(200);
    }
  });

  test('05 - Demander registration form validation', async ({ page }) => {
    await page.goto(`${BASE_URL}/register/demander`);
    
    // Try to submit Step 1 without filling fields
    await page.click('button:has-text("下一步")');
    
    // Should trigger validation
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('请填写所有必填字段');
      await dialog.accept();
    });
  });

  test('06 - Expert registration form validation', async ({ page }) => {
    await page.goto(`${BASE_URL}/register/expert`);
    
    // Try to submit Step 1 without filling fields
    await page.click('button:has-text("下一步")');
    
    // Should trigger validation
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('请填写所有必填字段');
      await dialog.accept();
    });
  });

  test('07 - Registration navigation works', async ({ page }) => {
    // Start at home
    await page.goto(BASE_URL);
    
    // Navigate to register
    await page.click('text=注册');
    await expect(page).toHaveURL(/\/register/);
    
    // Navigate back to home
    await page.click('text=Neon Protocol');
    await expect(page).toHaveURL(BASE_URL);
  });

  test('08 - Dark theme applied on all registration pages', async ({ page }) => {
    const pages = [
      `${BASE_URL}/register`,
      `${BASE_URL}/register/demander`,
      `${BASE_URL}/register/expert`
    ];
    
    for (const url of pages) {
      await page.goto(url);
      
      // Check dark theme classes
      const body = await page.locator('body');
      const classes = await body.getAttribute('class');
      expect(classes).toContain('bg-neon-dark');
    }
  });

  test('09 - Responsive layout - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}/register`);
    
    // Check both cards are visible in grid layout
    await expect(page.locator('text=需求方')).toBeVisible();
    await expect(page.locator('text=专家 Agent')).toBeVisible();
  });

  test('10 - Responsive layout - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/register`);
    
    // Check content still visible on mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=需求方')).toBeVisible();
  });
});
