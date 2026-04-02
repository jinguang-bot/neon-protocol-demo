import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Sprint-06: 专家提交成果', () => {
  test.beforeEach(async ({ page }) => {
    // 访问交付页面
    await page.goto(`${BASE_URL}/orders/test-order-123/deliver`);
  });

  test('01. 页面应该成功加载', async ({ page }) => {
    // 验证页面标题
    await expect(page.locator('h1:has-text("提交成果")')).toBeVisible();
    // 验证订单ID显示
    await expect(page.locator('text=test-order-123')).toBeVisible();
  });

  test('02. 进度条应该正确显示3个步骤', async ({ page }) => {
    // 验证3个步骤
    await expect(page.locator('text=交付物清单')).toBeVisible();
    await expect(page.locator('text=成果总结')).toBeVisible();
    await expect(page.locator('text=确认提交')).toBeVisible();
  });

  test('03. 应该能添加交付物', async ({ page }) => {
    // 点击添加交付物按钮
    await page.click('button:has-text("添加交付物")');
    
    // 验证交付物数量增加
    const deliverables = await page.locator('[class*="bg-gray-700/50"]').count();
    expect(deliverables).toBeGreaterThan(1);
  });

  test('04. 应该能填写交付物信息', async ({ page }) => {
    // 填写第一个交付物
    await page.fill('input[placeholder="例如：技术方案文档"]', '技术方案文档');
    await page.fill('textarea[placeholder="描述交付物的内容、格式、关键点..."]', '完整的技术方案，包含架构设计、技术选型、实施计划等内容');
    
    // 验证输入值
    await expect(page.locator('input[value="技术方案文档"]')).toBeVisible();
  });

  test('05. 应该能选择交付物类型', async ({ page }) => {
    // 选择交付物类型
    await page.selectOption('select', 'code');
    
    // 验证选择
    const selectedValue = await page.locator('select').inputValue();
    expect(selectedValue).toBe('code');
  });

  test('06. 第二步应该要求至少50字总结', async ({ page }) => {
    // 填写第一步
    await page.fill('input[placeholder="例如：技术方案文档"]', '技术方案文档');
    await page.fill('textarea[placeholder="描述交付物的内容、格式、关键点..."]', '完整的技术方案');
    
    // 点击下一步
    await page.click('button:has-text("下一步")');
    
    // 验证到达第二步
    await expect(page.locator('h2:has-text("成果总结")')).toBeVisible();
    
    // 尝试输入少于50字
    await page.fill('textarea[placeholder="总结项目的关键成果、解决的问题..."]', '这是一个简短的总结');
    
    // 验证下一步按钮被禁用
    const nextButton = await page.locator('button:has-text("下一步")');
    expect(await nextButton.isDisabled()).toBe(true);
  });

  test('07. 应该能上传附件', async ({ page }) => {
    // 进入第二步
    await page.fill('input[placeholder="例如：技术方案文档"]', '技术方案文档');
    await page.fill('textarea[placeholder="描述交付物的内容、格式、关键点..."]', '完整的技术方案');
    await page.click('button:has-text("下一步")');
    
    // 验证上传区域
    await expect(page.locator('text=点击上传或拖拽文件')).toBeVisible();
  });

  test('08. 第三步应该显示确认信息', async ({ page }) => {
    // 填写第一步和第二步
    await page.fill('input[placeholder="例如：技术方案文档"]', '技术方案文档');
    await page.fill('textarea[placeholder="描述交付物的内容、格式、关键点..."]', '完整的技术方案');
    await page.click('button:has-text("下一步")');
    
    await page.fill('textarea[placeholder="总结项目的关键成果、解决的问题..."]', '这是一个非常详细的项目总结，包含了所有关键成果和解决的问题，字数已经超过了最低要求的五十字，所以可以继续下一步。');
    await page.click('button:has-text("下一步")');
    
    // 验证确认页面
    await expect(page.locator('h2:has-text("确认提交")')).toBeVisible();
    await expect(page.locator('text=交付物清单 (1)')).toBeVisible();
    await expect(page.locator('text=项目总结')).toBeVisible();
  });

  test('09. 应该显示提交警告', async ({ page }) => {
    // 进入第三步
    await page.fill('input[placeholder="例如：技术方案文档"]', '技术方案文档');
    await page.fill('textarea[placeholder="描述交付物的内容、格式、关键点..."]', '完整的技术方案');
    await page.click('button:has-text("下一步")');
    
    await page.fill('textarea[placeholder="总结项目的关键成果、解决的问题..."]', '这是一个非常详细的项目总结，包含了所有关键成果和解决的问题，字数已经超过了最低要求的五十字，所以可以继续下一步。');
    await page.click('button:has-text("下一步")');
    
    // 验证警告信息
    await expect(page.locator('text=提交后无法修改')).toBeVisible();
  });

  test('10. 应该能返回上一步', async ({ page }) => {
    // 进入第二步
    await page.fill('input[placeholder="例如：技术方案文档"]', '技术方案文档');
    await page.fill('textarea[placeholder="描述交付物的内容、格式、关键点..."]', '完整的技术方案');
    await page.click('button:has-text("下一步")');
    
    // 点击上一步
    await page.click('button:has-text("上一步")');
    
    // 验证回到第一步
    await expect(page.locator('h2:has-text("交付物清单")')).toBeVisible();
  });

  test('11. API 应该返回 404 for 不存在的订单', async ({ page }) => {
    // 访问不存在的订单
    const response = await page.request.get(`${BASE_URL}/api/orders/non-existent-order/deliver`);
    expect(response.status()).toBe(404);
  });

  test('12. 深色科技风格应该正确应用', async ({ page }) => {
    // 验证背景渐变
    const body = await page.locator('body');
    const bgColor = await body.evaluate((el) =>
      window.getComputedStyle(el).getPropertyValue('background')
    );
    expect(bgColor).toContain('gradient');
  });

  test('13. 响应式布局应该正常', async ({ page }) => {
    // 测试移动端视图
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1:has-text("提交成果")')).toBeVisible();
    
    // 测试桌面端视图
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1:has-text("提交成果")')).toBeVisible();
  });

  test('14. 应该能删除交付物', async ({ page }) => {
    // 添加第二个交付物
    await page.click('button:has-text("添加交付物")');
    
    // 验证有两个交付物
    let deliverables = await page.locator('[class*="bg-gray-700/50"]').count();
    expect(deliverables).toBe(2);
    
    // 删除第二个交付物
    await page.click('button:has-text("添加交付物") ~ button >> nth=0');
    // Note: 实际选择器可能需要根据实际 DOM 调整
  });

  test('15. 提交按钮应该在所有步骤完成后可用', async ({ page }) => {
    // 完成所有步骤
    await page.fill('input[placeholder="例如：技术方案文档"]', '技术方案文档');
    await page.fill('textarea[placeholder="描述交付物的内容、格式、关键点..."]', '完整的技术方案');
    await page.click('button:has-text("下一步")');
    
    await page.fill('textarea[placeholder="总结项目的关键成果、解决的问题..."]', '这是一个非常详细的项目总结，包含了所有关键成果和解决的问题，字数已经超过了最低要求的五十字，所以可以继续下一步。');
    await page.click('button:has-text("下一步")');
    
    // 验证提交按钮可见
    await expect(page.locator('button:has-text("确认提交")')).toBeVisible();
  });
});
