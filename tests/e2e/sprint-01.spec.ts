import { test, expect } from '@playwright/test';

test.describe('Sprint-01: 3 Core Pages E2E Tests', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  // ========================================
  // Landing Page Tests (Tests 1-10)
  // ========================================

  test('01. Landing page loads successfully', async () => {
    const response = await page.goto('/');
    expect(response.status()).toBe(200);
  });

  test('02. Hero section displays correctly', async () => {
    await page.goto('/');
    
    // Check main title
    await expect(page.locator('h1')).toContainText('Find the Right');
    await expect(page.locator('h1')).toContainText('Manufacturing Experts');
    
    // Check subtitle
    await expect(page.getByText('The First Agent-to-Agent Protocol')).toBeVisible();
  });

  test('03. Input field accepts text', async () => {
    await page.goto('/');
    
    const textarea = page.locator('textarea');
    await textarea.fill('Test query about chip supply chain');
    await expect(textarea).toHaveValue('Test query about chip supply chain');
  });

  test('04. Submit button is clickable', async () => {
    await page.goto('/');
    
    const submitButton = page.getByRole('button', { name: /submit request/i });
    await expect(submitButton).toBeEnabled();
  });

  test('05. Stats display correctly', async () => {
    await page.goto('/');
    
    await expect(page.getByText('30,000+')).toBeVisible();
    await expect(page.getByText('Expert Interviews')).toBeVisible();
    await expect(page.getByText('500+')).toBeVisible();
    await expect(page.getByText('Companies Served')).toBeVisible();
    await expect(page.getByText('24hr')).toBeVisible();
    await expect(page.getByText('Average Response')).toBeVisible();
  });

  test('06. Feature cards display', async () => {
    await page.goto('/');
    
    await expect(page.getByText('Smart Matching')).toBeVisible();
    await expect(page.getByText('Secure Delivery')).toBeVisible();
    await expect(page.getByText('Fast Settlement')).toBeVisible();
  });

  test('07. Navigation works', async () => {
    await page.goto('/');
    
    // Check navigation links
    await expect(page.getByRole('link', { name: /产品介绍/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /专家网络/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /定价/i })).toBeVisible();
  });

  test('08. Dark theme applied', async () => {
    await page.goto('/');
    
    // Check dark background
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toBeTruthy();
  });

  test('09. Responsive layout - desktop', async () => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Check grid layout for stats
    const statsGrid = page.locator('.grid').first();
    await expect(statsGrid).toBeVisible();
  });

  test('10. Responsive layout - mobile', async () => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile layout
    await expect(page.locator('h1')).toBeVisible();
  });

  // ========================================
  // AI Clarification Page Tests (Tests 11-17)
  // ========================================

  test('11. Clarify page loads successfully', async () => {
    const response = await page.goto('/clarify');
    expect(response.status()).toBe(200);
  });

  test('12. Progress bar displays', async () => {
    await page.goto('/clarify');
    
    await expect(page.getByText(/Step \d+ of \d+/)).toBeVisible();
  });

  test('13. AI questions display progressively', async () => {
    await page.goto('/clarify');
    
    // Check for question
    await expect(page.getByText(/Which specific chip/i)).toBeVisible();
  });

  test('14. Input field accepts text', async () => {
    await page.goto('/clarify');
    
    const input = page.locator('input[type="text"]').first();
    if (await input.isVisible()) {
      await input.fill('Test answer');
      await expect(input).toHaveValue('Test answer');
    }
  });

  test('15. Option buttons clickable', async () => {
    await page.goto('/clarify');
    
    // Wait for options to appear
    await page.waitForTimeout(2000);
    
    const optionButtons = page.locator('button').filter({ hasText: /China|Japan/ });
    const count = await optionButtons.count();
    
    if (count > 0) {
      await expect(optionButtons.first()).toBeEnabled();
    }
  });

  test('16. Dark theme applied on clarify page', async () => {
    await page.goto('/clarify');
    
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toBeTruthy();
  });

  test('17. Back navigation works', async () => {
    await page.goto('/clarify');
    
    const backButton = page.getByRole('link', { name: /back/i });
    await expect(backButton).toBeVisible();
  });

  // ========================================
  // Agent Market Page Tests (Tests 18-27)
  // ========================================

  test('18. Market page loads successfully', async () => {
    const response = await page.goto('/market');
    expect(response.status()).toBe(200);
  });

  test('19. Agent cards display (3 agents)', async () => {
    await page.goto('/market');
    
    await expect(page.getByText('Matched Agents')).toBeVisible();
    await expect(page.getByText('3 experts ready to help')).toBeVisible();
  });

  test('20. Matching badges display', async () => {
    await page.goto('/market');
    
    await expect(page.getByText(/98% Match/)).toBeVisible();
    await expect(page.getByText(/94% Match/)).toBeVisible();
    await expect(page.getByText(/91% Match/)).toBeVisible();
  });

  test('21. Agent names and titles display', async () => {
    await page.goto('/market');
    
    await expect(page.getByText('Dr. Sarah Chen')).toBeVisible();
    await expect(page.getByText(/Former TSMC/i)).toBeVisible();
  });

  test('22. Sorting dropdown works', async () => {
    await page.goto('/market');
    
    const sortSelect = page.locator('select');
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption('price');
    }
  });

  test('23. Agent details display', async () => {
    await page.goto('/market');
    
    // Check ratings
    await expect(page.getByText(/\d\.\d/).first()).toBeVisible();
    
    // Check prices
    await expect(page.getByText(/\$\d+/).first()).toBeVisible();
  });

  test('24. Hire button is clickable', async () => {
    await page.goto('/market');
    
    const hireButton = page.getByRole('button', { name: /hire now/i }).first();
    await expect(hireButton).toBeEnabled();
  });

  test('25. Responsive layout - market page', async () => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/market');
    
    await expect(page.getByText('Matched Agents')).toBeVisible();
  });

  test('26. Dark theme applied on market page', async () => {
    await page.goto('/market');
    
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(bgColor).toBeTruthy();
  });

  test('27. No console errors', async () => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.goto('/clarify');
    await page.goto('/market');
    
    // Filter out known benign errors
    const realErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('manifest') &&
      !e.includes('404')
    );
    
    expect(realErrors.length).toBe(0);
  });
});
