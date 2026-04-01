import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('任务创建流程', () => {
  test.beforeEach(async ({ page }) => {
    // 访问任务创建页面
    await page.goto(`${BASE_URL}/tasks/new`)
    await page.waitForLoadState('networkidle')
  })

  test('页面加载成功', async ({ page }) => {
    // 验证页面标题
    await expect(page.locator('h1:has-text("创建新任务")')).toBeVisible()
    
    // 验证进度条显示
    await expect(page.locator('text=基本信息')).toBeVisible()
    await expect(page.locator('text=标签与预算')).toBeVisible()
    await expect(page.locator('text=确认提交')).toBeVisible()
  })

  test('Step 1: 填写基本信息', async ({ page }) => {
    // 填写标题
    const titleInput = page.locator('input[placeholder*="评估日系半导体"]')
    await titleInput.fill('测试任务：评估AI芯片市场趋势')
    
    // 填写描述
    const descInput = page.locator('textarea[placeholder*="详细描述"]')
    await descInput.fill('这是一个测试任务的描述，用于验证任务创建功能。')
    
    // 选择类别
    await page.click('button:has-text("半导体供应链")')
    
    // 验证类别已选中
    await expect(page.locator('button:has-text("半导体供应链").bg-purple-600')).toBeVisible()
    
    // 点击"下一步"
    await page.click('button:has-text("下一步")')
    
    // 验证进入 Step 2
    await expect(page.locator('text=技能标签')).toBeVisible()
  })

  test('Step 2: 选择标签和预算', async ({ page }) => {
    // 先完成 Step 1
    await page.locator('input[placeholder*="评估日系半导体"]').fill('测试任务')
    await page.locator('textarea[placeholder*="详细描述"]').fill('测试描述')
    await page.click('button:has-text("半导体供应链")')
    await page.click('button:has-text("下一步")')
    
    // 选择标签
    await page.click('button:has-text("AI")')
    await page.click('button:has-text("芯片")')
    await page.click('button:has-text("市场调研")')
    
    // 验证标签已选中
    await expect(page.locator('button:has-text("AI").bg-purple-600')).toBeVisible()
    await expect(page.locator('text=已选择 3 个标签')).toBeVisible()
    
    // 填写预算
    await page.locator('input[placeholder*="$500-1000"]').fill('$1000-2000')
    
    // 选择截止日期
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 7)
    const dateStr = tomorrow.toISOString().split('T')[0]
    await page.locator('input[type="date"]').fill(dateStr)
    
    // 点击"下一步"
    await page.click('button:has-text("下一步")')
    
    // 验证进入 Step 3
    await expect(page.locator('text=任务摘要')).toBeVisible()
  })

  test('Step 3: 确认并提交', async ({ page }) => {
    // 完成 Step 1 和 Step 2
    await page.locator('input[placeholder*="评估日系半导体"]').fill('测试任务')
    await page.locator('textarea[placeholder*="详细描述"]').fill('测试描述')
    await page.click('button:has-text("半导体供应链")')
    await page.click('button:has-text("下一步")')
    
    await page.click('button:has-text("AI")')
    await page.click('button:has-text("下一步")')
    
    // 验证摘要信息
    await expect(page.locator('text=测试任务')).toBeVisible()
    await expect(page.locator('text=半导体供应链')).toBeVisible()
    await expect(page.locator('text=AI')).toBeVisible()
    
    // 提交任务
    await page.click('button:has-text("提交任务")')
    
    // 验证提交成功（等待 alert）
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('任务创建成功')
      await dialog.accept()
    })
  })

  test('表单验证 - 必填字段', async ({ page }) => {
    // 尝试不填写任何信息直接点击"下一步"
    await page.click('button:has-text("下一步")')
    
    // 验证按钮被禁用（仍在 Step 1）
    await expect(page.locator('text=基本信息')).toBeVisible()
    await expect(page.locator('button:has-text("下一步").bg-gray-700')).toBeVisible()
  })

  test('返回按钮功能', async ({ page }) => {
    // 填写部分信息
    await page.locator('input[placeholder*="评估日系半导体"]').fill('测试')
    
    // 点击返回
    await page.click('a:has-text("返回")')
    
    // 验证跳转到 dashboard
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('步骤导航功能', async ({ page }) => {
    // 完成 Step 1
    await page.locator('input[placeholder*="评估日系半导体"]').fill('测试')
    await page.locator('textarea[placeholder*="详细描述"]').fill('测试描述')
    await page.click('button:has-text("半导体供应链")')
    await page.click('button:has-text("下一步")')
    
    // 验证进度条更新
    await expect(page.locator('.bg-purple-600').first()).toBeVisible()
    
    // 点击"上一步"返回
    await page.click('button:has-text("上一步")')
    
    // 验证返回 Step 1
    await expect(page.locator('text=任务标题')).toBeVisible()
    
    // 数据应该保留
    await expect(page.locator('input[value="测试"]')).toBeVisible()
  })

  test('响应式布局 - 移动端', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 })
    
    // 验证页面元素正常显示
    await expect(page.locator('h1:has-text("创建新任务")')).toBeVisible()
    await expect(page.locator('input[placeholder*="评估日系半导体"]')).toBeVisible()
    
    // 验证按钮可点击
    await page.click('button:has-text("半导体供应链")')
    await expect(page.locator('button:has-text("半导体供应链").bg-purple-600')).toBeVisible()
  })
})

test.describe('API 端点测试', () => {
  test('POST /api/tasks - 创建任务成功', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/tasks`, {
      data: {
        orgId: 'test-org-id',
        title: '测试任务：AI市场分析',
        description: '这是一个测试任务的详细描述',
        category: '市场分析',
        tags: ['AI', '市场调研'],
        budget: '1000-2000',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    })
    
    expect(response.status()).toBe(201)
    
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data.title).toBe('测试任务：AI市场分析')
    expect(data.data.status).toBe('OPEN')
  })

  test('POST /api/tasks - 缺少必填字段', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/tasks`, {
      data: {
        title: '不完整的任务'
        // 缺少 orgId, description, category, tags
      }
    })
    
    expect(response.status()).toBe(400)
    
    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('缺少必填字段')
  })

  test('GET /api/tasks - 获取任务列表', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tasks?limit=5`)
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
    expect(data.pagination).toBeDefined()
  })

  test('GET /api/tasks - 按状态筛选', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tasks?status=OPEN`)
    
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data.success).toBe(true)
    
    // 验证所有返回的任务都是 OPEN 状态
    data.data.forEach((task: any) => {
      expect(task.status).toBe('OPEN')
    })
  })
})
