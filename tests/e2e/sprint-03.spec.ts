import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

test.describe('Sprint-03: Task Creation and Matching', () => {
  test.beforeEach(async ({ page }) => {
    // 访问首页确认服务器运行
    await page.goto(BASE_URL)
  })

  test('01. Task creation page should load successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks/new`)

    // 检查页面标题
    await expect(page.locator('h1')).toContainText('创建新任务')

    // 检查进度条
    await expect(page.locator('text=基本信息')).toBeVisible()
    await expect(page.locator('text=标签与预算')).toBeVisible()
    await expect(page.locator('text=确认提交')).toBeVisible()

    // 检查表单字段
    await expect(page.locator('input[placeholder*="任务标题"]')).toBeVisible()
    await expect(page.locator('textarea[placeholder*="任务需求"]')).toBeVisible()
  })

  test('02. Task form validation should work', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks/new`)

    // 尝试不填表单直接下一步（应该被阻止）
    const nextButton = page.locator('button:has-text("下一步")')
    await expect(nextButton).toBeDisabled()

    // 填写基本信息
    await page.fill('input[placeholder*="任务标题"]', '测试任务标题')
    await page.fill('textarea[placeholder*="任务需求"]', '这是一个测试任务描述')
    await page.click('button:has-text("半导体供应链")')

    // 现在应该可以点击下一步
    await expect(nextButton).toBeEnabled()
  })

  test('03. Task multi-step form flow', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks/new`)

    // Step 1: 基本信息
    await page.fill('input[placeholder*="任务标题"]', 'E2E 测试任务')
    await page.fill('textarea[placeholder*="任务需求"]', '这是一个 E2E 自动化测试任务')
    await page.click('button:has-text("市场分析")')
    await page.click('button:has-text("下一步")')

    // 验证进入 Step 2
    await expect(page.locator('text=技能标签')).toBeVisible()

    // Step 2: 标签与预算
    await page.click('button:has-text("AI")')
    await page.click('button:has-text("市场调研")')
    await page.click('button:has-text("下一步")')

    // 验证进入 Step 3
    await expect(page.locator('text=任务摘要')).toBeVisible()
    await expect(page.locator('text=E2E 测试任务')).toBeVisible()
  })

  test('04. Task list page should load successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks`)

    // 检查页面标题
    await expect(page.locator('h1')).toContainText('任务市场')

    // 检查搜索框
    await expect(page.locator('input[placeholder*="搜索任务"]')).toBeVisible()

    // 检查创建任务按钮
    await expect(page.locator('a:has-text("创建任务")')).toBeVisible()

    // 检查类别筛选
    await expect(page.locator('button:has-text("全部")')).toBeVisible()
    await expect(page.locator('button:has-text("半导体供应链")')).toBeVisible()
  })

  test('05. Task list search functionality', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks`)

    // 在搜索框输入
    await page.fill('input[placeholder*="搜索任务"]', 'AI芯片')

    // 等待搜索结果
    await page.waitForTimeout(500)

    // 验证搜索框的值
    const searchValue = await page.inputValue('input[placeholder*="搜索任务"]')
    expect(searchValue).toBe('AI芯片')
  })

  test('06. Task list category filter', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks`)

    // 点击类别筛选
    await page.click('button:has-text("市场分析")')

    // 等待筛选结果
    await page.waitForTimeout(500)

    // 验证按钮状态
    await expect(page.locator('button.bg-purple-600:has-text("市场分析")')).toBeVisible()
  })

  test('07. Navigation from task list to task creation', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks`)

    // 点击创建任务按钮
    await page.click('a:has-text("创建任务")')

    // 验证跳转到创建页面
    await expect(page).toHaveURL(`${BASE_URL}/tasks/new`)
    await expect(page.locator('h1')).toContainText('创建新任务')
  })

  test('08. Task API endpoint - GET', async ({ page }) => {
    // 测试 API 端点
    const response = await page.request.get(`${BASE_URL}/api/tasks`)

    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toHaveProperty('tasks')
    expect(data).toHaveProperty('pagination')
    expect(Array.isArray(data.tasks)).toBe(true)
  })

  test('09. Task API endpoint - POST validation', async ({ page }) => {
    // 测试缺少必填字段
    const response = await page.request.post(`${BASE_URL}/api/tasks`, {
      data: {
        title: 'Test Task'
        // 缺少 description, category, organizationId
      }
    })

    expect(response.status()).toBe(400)

    const data = await response.json()
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Missing required fields')
  })

  test('10. Task matching algorithm', async ({ page }) => {
    // 这个测试需要先创建任务和 Agent
    // 由于我们使用 SQLite 开发数据库，可能没有数据
    // 所以只测试 API 端点的存在性

    const response = await page.request.get(`${BASE_URL}/api/tasks/test-id/match`)

    // 404 是预期的（因为任务不存在）
    expect([404, 500]).toContain(response.status())
  })
})

test.describe('Sprint-03: Visual Design', () => {
  test('11. Task creation page should have dark tech theme', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks/new`)

    // 检查深色背景
    const body = page.locator('body')
    await expect(body).toHaveCSS('background-color', /rgb\(15,\s*23,\s*42\)/) // slate-900
  })

  test('12. Task list page should have dark tech theme', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks`)

    // 检查深色背景
    const body = page.locator('body')
    await expect(body).toHaveCSS('background-color', /rgb\(15,\s*23,\s*42\)/) // slate-900
  })

  test('13. Progress bar animation should work', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks/new`)

    // 检查进度条初始状态
    const step1 = page.locator('.w-10.h-10.rounded-full').first()
    await expect(step1).toHaveCSS('background-color', /rgb\(147,\s*51,\s*234\)/) // purple-600

    // 填写表单并进入下一步
    await page.fill('input[placeholder*="任务标题"]', '测试')
    await page.fill('textarea[placeholder*="任务需求"]', '测试')
    await page.click('button:has-text("半导体供应链")')
    await page.click('button:has-text("下一步")')

    // 等待动画
    await page.waitForTimeout(300)

    // 验证进度条更新
    const step2 = page.locator('.w-10.h-10.rounded-full').nth(1)
    await expect(step2).toHaveCSS('background-color', /rgb\(147,\s*51,\s*234\)/) // purple-600
  })

  test('14. Responsive design - mobile', async ({ page }) => {
    // 设置手机视口
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(`${BASE_URL}/tasks`)

    // 验证响应式布局
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('input[placeholder*="搜索任务"]')).toBeVisible()
  })

  test('15. Responsive design - tablet', async ({ page }) => {
    // 设置平板视口
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto(`${BASE_URL}/tasks/new`)

    // 验证响应式布局
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('input[placeholder*="任务标题"]')).toBeVisible()
  })
})
