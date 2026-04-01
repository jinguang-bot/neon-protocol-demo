import { test, expect } from '@playwright/test';

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
  });

  test('should display registration selection page', async ({ page }) => {
    await page.goto('http://localhost:3001/register');
    
    // Check page title
    await expect(page.locator('h1')).toContainText('选择您的身份');
    
    // Check both identity cards exist
    await expect(page.locator('text=需求方')).toBeVisible();
    await expect(page.locator('text=专家 Agent')).toBeVisible();
  });

  test('should complete demander registration flow', async ({ page }) => {
    // Navigate to registration page
    await page.goto('http://localhost:3001/register');
    
    // Click demander registration button
    await page.click('text=作为需求方注册');
    
    // Wait for demander registration page
    await expect(page).toHaveURL(/\/register\/demander/);
    
    // Fill Step 1: Organization info
    await page.fill('input[placeholder*="某某制造有限公司"]', '测试制造公司');
    await page.fill('input[type="email"]', 'test-demander@example.com');
    await page.selectOption('select', '汽车制造');
    
    // Click next
    await page.click('button:has-text("下一步")');
    
    // Wait for Step 2
    await page.waitForSelector('text=联系人信息');
    
    // Fill Step 2: Contact info
    await page.fill('input[placeholder*="张三"]', '测试联系人');
    await page.fill('input[type="tel"]', '13800138000');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[placeholder*="再次输入密码"]', 'password123');
    
    // Submit registration
    await page.click('button:has-text("提交注册")');
    
    // Check for success message (alert)
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('注册成功');
      await dialog.accept();
    });
  });

  test('should complete expert registration flow', async ({ page }) => {
    // Navigate to registration page
    await page.goto('http://localhost:3001/register');
    
    // Click expert registration button
    await page.click('text=作为专家注册');
    
    // Wait for expert registration page
    await expect(page).toHaveURL(/\/register\/expert/);
    
    // Fill Step 1: Organization info
    await page.fill('input[placeholder*="某某制造有限公司"]', '测试专家公司');
    await page.fill('input[type="email"]', 'test-expert@example.com');
    await page.selectOption('select', '电子制造');
    
    // Click next
    await page.click('button:has-text("下一步")');
    
    // Wait for Step 2
    await page.waitForSelector('text=Agent信息');
    
    // Fill Step 2: Agent info
    await page.fill('input[placeholder*="制造专家"]', '测试专家-张三');
    
    // Select some skills
    await page.click('button:has-text("机械设计")');
    await page.click('button:has-text("电子工程")');
    
    // Click next
    await page.click('button:has-text("下一步")');
    
    // Wait for Step 3
    await page.waitForSelector('text=价格与可用性');
    
    // Fill Step 3: Pricing
    await page.selectOption('select', '¥1000-¥2000');
    await page.selectOption('select', '工作日 9:00-18:00');
    
    // Submit registration
    await page.click('button:has-text("提交注册")');
    
    // Check for success message
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('注册成功');
      await dialog.accept();
    });
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('http://localhost:3001/register/demander');
    
    // Try to submit without filling fields
    await page.click('button:has-text("下一步")');
    
    // Should show validation error
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('请填写所有必填字段');
      await dialog.accept();
    });
  });

  test('should validate password match', async ({ page }) => {
    await page.goto('http://localhost:3001/register/demander');
    
    // Fill Step 1
    await page.fill('input[placeholder*="某某制造有限公司"]', '测试公司');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.selectOption('select', '汽车制造');
    await page.click('button:has-text("下一步")');
    
    // Fill Step 2 with mismatched passwords
    await page.waitForSelector('text=联系人信息');
    await page.fill('input[placeholder*="张三"]', '测试联系人');
    await page.fill('input[type="password"]', 'password123');
    await page.fill('input[placeholder*="再次输入密码"]', 'password456');
    
    // Try to submit
    await page.click('button:has-text("提交注册")');
    
    // Should show error
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('两次输入的密码不一致');
      await dialog.accept();
    });
  });
});
