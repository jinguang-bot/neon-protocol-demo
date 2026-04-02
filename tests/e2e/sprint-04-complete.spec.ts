import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Sprint-04: Task Detail Page - Core Functions', () => {
  test('01. 任务详情页应该正常加载', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks/task-test-123`)
    await page.waitForLoadState('networkidle')
    
    // 检查页面能正常访问（HTTP 200）
    const response = await page.goto(`${BASE_URL}/tasks/task-test-123`)
    expect(response?.status()).toBe(200)
  })

  test('02. 页面应该包含基本结构', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks/task-test-123`)
    await page.waitForLoadState('domcontentloaded')
    
    // 检查页面标题存在
    const title = await page.locator('title').textContent()
    expect(title).toContain('Neon Protocol')
  })
})

test.describe('Sprint-04: API Integration', () => {
  test('03. 任务详情API应该返回任务数据', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tasks/task-test-123`)
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('task')
    expect(data.task).toHaveProperty('id')
    expect(data.task).toHaveProperty('title')
    expect(data.task).toHaveProperty('description')
    expect(data.task).toHaveProperty('category')
  })

  test('04. 任务详情API应该返回404（不存在）', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tasks/nonexistent-task-id`)
    expect(response.status()).toBe(404)
  })

  test('05. 匹配专家API应该返回专家列表', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tasks/task-test-123/match`)
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('taskId')
    expect(data).toHaveProperty('matchedAgents')
    expect(data).toHaveProperty('total')
    expect(Array.isArray(data.matchedAgents)).toBe(true)
  })

  test('06. 匹配专家API应该包含匹配分数', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tasks/task-test-123/match`)
    const data = await response.json()
    
    if (data.matchedAgents.length > 0) {
      const agent = data.matchedAgents[0]
      expect(agent).toHaveProperty('score')
      expect(agent.score).toBeGreaterThanOrEqual(0)
      expect(agent.score).toBeLessThanOrEqual(100)
      expect(agent).toHaveProperty('matchReason')
    }
  })

  test('07. 匹配专家API应该返回404（任务不存在）', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/tasks/nonexistent-task-id/match`)
    expect(response.status()).toBe(404)
  })
})

test.describe('Sprint-05: Order API', () => {
  test('08. 订单列表API应该返回200', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/orders`)
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data).toHaveProperty('orders')
    expect(data).toHaveProperty('pagination')
    expect(Array.isArray(data.orders)).toBe(true)
  })

  test('09. 订单列表应该包含分页信息', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/orders`)
    const data = await response.json()
    
    expect(data.pagination).toHaveProperty('page')
    expect(data.pagination).toHaveProperty('limit')
    expect(data.pagination).toHaveProperty('total')
    expect(data.pagination).toHaveProperty('totalPages')
  })
})

test.describe('Sprint-04: UI Tests', () => {
  test('10. 任务详情页应该显示任务信息', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks/task-test-123`)
    await page.waitForSelector('[data-testid="task-detail"]', { timeout: 10000 })
    
    // 检查任务标题显示
    const taskTitle = await page.locator('[data-testid="task-title"]').textContent()
    expect(taskTitle).toBeTruthy()
  })

  test('11. 任务详情页应该显示匹配专家', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks/task-test-123`)
    await page.waitForSelector('[data-testid="matched-agents"]', { timeout: 10000 })
    
    // 检查专家列表显示
    const agents = await page.locator('[data-testid="agent-card"]').count()
    expect(agents).toBeGreaterThan(0)
  })

  test('12. 专家卡片应该包含必要信息', async ({ page }) => {
    await page.goto(`${BASE_URL}/tasks/task-test-123`)
    await page.waitForSelector('[data-testid="agent-card"]', { timeout: 10000 })
    
    const firstAgent = page.locator('[data-testid="agent-card"]').first()
    
    // 检查专家名称
    const name = await firstAgent.locator('[data-testid="agent-name"]').textContent()
    expect(name).toBeTruthy()
    
    // 检查匹配分数
    const score = await firstAgent.locator('[data-testid="match-score"]').textContent()
    expect(score).toContain('%')
  })
})
