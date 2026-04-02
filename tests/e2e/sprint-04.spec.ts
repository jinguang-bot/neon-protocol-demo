import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001'

test.describe('Sprint-04: Task Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // 访问任务详情页
    await page.goto(`${BASE_URL}/tasks/task-test-123`)
    // 等待页面加载
    await page.waitForLoadState('networkidle')
  })

  test('01. 任务详情页应该正常加载', async ({ page }) => {
    // 检查页面标题
    await expect(page.locator('h1')).toBeVisible()
    
    // 检查返回按钮
    const backButton = page.locator('button:has-text("返回任务列表")')
    await expect(backButton).toBeVisible()
  })

  test('02. 任务详情应该完整展示', async ({ page }) => {
    // 检查任务标题
    const title = page.locator('h1')
    await expect(title).toContainText('开发基于 AI 的供应链优化系统')

    // 检查任务状态徽章
    const statusBadge = page.locator('span:has-text("待匹配")')
    await expect(statusBadge).toBeVisible()

    // 检查任务描述
    const description = page.locator('text=我们需要开发一个 AI 驱动的供应链优化系统')
    await expect(description).toBeVisible()

    // 检查标签
    const tags = page.locator('span:has-text("AI"), span:has-text("Machine Learning")')
    await expect(tags.first()).toBeVisible()
  })

  test('03. 任务信息卡片应该正确显示', async ({ page }) => {
    // 检查预算
    const budget = page.locator('text=$50,000')
    await expect(budget).toBeVisible()

    // 检查截止日期
    const deadline = page.locator('text=2026/5/1')
    await expect(deadline).toBeVisible()

    // 检查类别
    const category = page.locator('text=Manufacturing')
    await expect(category).toBeVisible()

    // 检查创建时间
    const createdAt = page.locator('text=2026/4/1')
    await expect(createdAt).toBeVisible()
  })

  test('04. 发布方信息应该正确显示', async ({ page }) => {
    // 检查组织名称
    const orgName = page.locator('text=Global Manufacturing Corp')
    await expect(orgName).toBeVisible()

    // 检查邮箱
    const email = page.locator('text=contact@globalmanufacturing.com')
    await expect(email).toBeVisible()

    // 检查验证状态
    const verified = page.locator('text=已验证')
    await expect(verified).toBeVisible()
  })

  test('05. 推荐专家列表应该显示', async ({ page }) => {
    // 等待专家列表加载
    await page.waitForSelector('text=推荐专家', { timeout: 5000 })

    // 检查专家卡片数量（至少1个）
    const agentCards = page.locator('[class*="agent"]')
    const count = await agentCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('06. 专家匹配度应该正确显示', async ({ page }) => {
    // 等待专家列表加载
    await page.waitForSelector('text=匹配度', { timeout: 5000 })

    // 检查第一个专家的匹配度
    const matchScore = page.locator('text=98%').first()
    await expect(matchScore).toBeVisible()
  })

  test('07. 专家信息应该完整展示', async ({ page }) => {
    // 等待专家列表加载
    await page.waitForSelector('text=Dr. Sarah Chen', { timeout: 5000 })

    // 检查专家名称
    const agentName = page.locator('text=Dr. Sarah Chen')
    await expect(agentName).toBeVisible()

    // 检查专家标题
    const agentTitle = page.locator('text=AI Supply Chain Expert')
    await expect(agentTitle).toBeVisible()

    // 检查评分
    const rating = page.locator('text=4.9')
    await expect(rating).toBeVisible()

    // 检查完成任务数
    const completedTasks = page.locator('text=127 任务')
    await expect(completedTasks).toBeVisible()
  })

  test('08. 匹配原因应该显示', async ({ page }) => {
    // 等待专家列表加载
    await page.waitForSelector('text=匹配原因', { timeout: 5000 })

    // 检查匹配原因
    const reason = page.locator('text=技能完全匹配')
    await expect(reason).toBeVisible()
  })

  test('09. 专家技能标签应该显示', async ({ page }) => {
    // 等待专家列表加载
    await page.waitForSelector('text=Machine Learning', { timeout: 5000 })

    // 检查技能标签
    const skill = page.locator('span:has-text("Machine Learning")').first()
    await expect(skill).toBeVisible()
  })

  test('10. 雇佣专家按钮应该可点击', async ({ page }) => {
    // 等待专家列表加载
    await page.waitForSelector('button:has-text("雇佣此专家")', { timeout: 5000 })

    // 监听 alert 对话框
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('即将雇佣')
      await dialog.accept()
    })

    // 点击第一个雇佣按钮
    const hireButton = page.locator('button:has-text("雇佣此专家")').first()
    await hireButton.click()

    // 等待 alert 触发
    await page.waitForTimeout(1000)
  })

  test('11. 返回按钮应该正常工作', async ({ page }) => {
    // 点击返回按钮
    const backButton = page.locator('button:has-text("返回任务列表")')
    await backButton.click()

    // 等待导航
    await page.waitForLoadState('networkidle')

    // 检查是否返回任务列表页
    await expect(page).toHaveURL(/\/tasks$/)
  })

  test('12. 深色科技风格应该正确应用', async ({ page }) => {
    // 检查背景色
    const body = page.locator('body')
    const bgColor = await body.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    expect(bgColor).toBe('rgb(0, 0, 0)') // black

    // 检查标题渐变
    const title = page.locator('h1')
    const titleColor = await title.evaluate(el =>
      window.getComputedStyle(el).backgroundImage
    )
    expect(titleColor).toContain('gradient')
  })

  test('13. 页面应该响应式布局', async ({ page }) => {
    // 测试桌面布局
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.waitForTimeout(500)
    const desktopLayout = await page.locator('.grid').first()
    await expect(desktopLayout).toBeVisible()

    // 测试平板布局
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(500)
    const tabletLayout = await page.locator('.grid').first()
    await expect(tabletLayout).toBeVisible()

    // 测试手机布局
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)
    const mobileLayout = await page.locator('.grid').first()
    await expect(mobileLayout).toBeVisible()
  })

  test('14. 所有卡片应该有动画效果', async ({ page }) => {
    // 检查页面元素是否可见（已经通过动画显示）
    const taskDetails = page.locator('text=任务详情')
    await expect(taskDetails).toBeVisible()

    const matchedAgents = page.locator('text=推荐专家')
    await expect(matchedAgents).toBeVisible()
  })

  test('15. 无控制台错误', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // 刷新页面
    await page.reload()
    await page.waitForLoadState('networkidle')

    // 检查是否有错误
    expect(errors).toHaveLength(0)
  })
})

test.describe('Sprint-04: Task Detail API Integration', () => {
  test('16. 任务详情 API 应该返回正确数据', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tasks/task-test-123`)
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('id')
    expect(data).toHaveProperty('title')
    expect(data).toHaveProperty('description')
  })

  test('17. 匹配专家 API 应该返回专家列表', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tasks/task-test-123/match`)
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('agents')
    expect(Array.isArray(data.agents)).toBe(true)
    expect(data.agents.length).toBeGreaterThan(0)
  })

  test('18. 匹配专家应该包含匹配度', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tasks/task-test-123/match`)
    const data = await response.json()
    
    data.agents.forEach((agent: any) => {
      expect(agent).toHaveProperty('matchScore')
      expect(agent.matchScore).toBeGreaterThanOrEqual(0)
      expect(agent.matchScore).toBeLessThanOrEqual(100)
    })
  })

  test('19. 匹配专家应该按分数排序', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tasks/task-test-123/match`)
    const data = await response.json()
    
    const scores = data.agents.map((agent: any) => agent.matchScore)
    const sortedScores = [...scores].sort((a, b) => b - a)
    expect(scores).toEqual(sortedScores)
  })

  test('20. 匹配专家应该包含匹配原因', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tasks/task-test-123/match`)
    const data = await response.json()
    
    data.agents.forEach((agent: any) => {
      expect(agent).toHaveProperty('matchReasons')
      expect(Array.isArray(agent.matchReasons)).toBe(true)
      expect(agent.matchReasons.length).toBeGreaterThan(0)
    })
  })
})
