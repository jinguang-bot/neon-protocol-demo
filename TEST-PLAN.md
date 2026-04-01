# Neon Protocol Demo - 测试计划

> **最后更新**: 2026-04-01  
> **维护者**: Claw (AI Agent)

---

## 🎯 测试目标

1. **功能正确性**: 验证所有功能按需求工作
2. **数据完整性**: 确保资金流转和状态变更准确
3. **用户体验**: 验证用户流程流畅无阻塞
4. **端到端验证**: 跑通完整的任务闭环

---

## 🧪 测试金字塔

```
        E2E Tests (50% coverage)
       /                     \
    Integration Tests (60% coverage)
   /                               \
Unit Tests (80% coverage)
```

### 测试层次

1. **单元测试（80% 覆盖率）**
   - 工具函数
   - 数据验证（Zod schemas）
   - 业务逻辑（计算匹配度、资金流转）
   - 状态机（订单状态流转）

2. **集成测试（60% 覆盖率）**
   - API 路由测试
   - 数据库操作测试
   - 第三方服务集成（支付、通知）

3. **端到端测试（50% 覆盖率）**
   - 完整用户流程
   - 多页面交互
   - 资金流转验证

---

## 📋 测试策略

### 1. 单元测试（Jest + Testing Library）

**测试内容**:
- ✅ 数据验证（Zod schemas）
- ✅ 匹配度计算算法
- ✅ 资金流转逻辑
- ✅ 订单状态机
- ✅ 工具函数（日期格式化、金额计算）

**示例**:
```typescript
// tests/unit/matching.test.ts
import { calculateMatchScore } from '@/lib/matching'

describe('Matching Algorithm', () => {
  it('should calculate match score correctly', () => {
    const task = { tags: ['semiconductor', 'asia'] }
    const expert = { tags: ['semiconductor', 'japan', 'korea'] }
    const score = calculateMatchScore(task, expert)
    expect(score).toBe(98)
  })
})
```

---

### 2. 集成测试（Jest + Prisma）

**测试内容**:
- ✅ API 路由（/api/tasks, /api/orders, /api/wallet）
- ✅ 数据库 CRUD 操作
- ✅ 邮件/通知发送

**示例**:
```typescript
// tests/integration/tasks.test.ts
import { POST } from '@/app/api/tasks/route'
import { prisma } from '@/lib/prisma'

describe('Task API', () => {
  it('should create a task', async () => {
    const request = new Request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Task',
        description: '...',
        budget: 2500,
        // ...
      })
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(201)
    expect(data.taskId).toBeDefined()
  })
})
```

---

### 3. 端到端测试（Playwright）

**测试内容**:
- ✅ 完整用户旅程（需求方 + 专家 + 平台）
- ✅ 多页面交互
- ✅ 表单填写和提交
- ✅ 资金流转验证

**测试场景**:

#### 场景 1: 需求方完成一次任务
```typescript
// tests/e2e/requester-flow.spec.ts
import { test, expect } from '@playwright/test'

test('Requester can complete a task end-to-end', async ({ page }) => {
  // 1. 注册需求方
  await page.goto('/register/requester')
  await page.fill('[name="organizationName"]', 'Test Company')
  await page.fill('[name="email"]', 'test@company.com')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
  
  // 2. 创建任务
  await page.click('text=创建新任务')
  await page.fill('[name="title"]', '芯片供应链风险评估')
  await page.fill('[name="description"]', '我们需要评估...')
  await page.click('button:has-text("提交")')
  await expect(page.locator('.task-created')).toBeVisible()
  
  // 3. 查看匹配结果
  await page.click('text=查看匹配')
  await expect(page.locator('.expert-card')).toHaveCount(3)
  
  // 4. 选择专家
  await page.click('.expert-card:first-child .hire-button')
  await expect(page.locator('.order-confirmed')).toBeVisible()
  
  // 5. 冻结资金
  await page.click('button:has-text("确认冻结")')
  await expect(page.locator('.fund-locked')).toBeVisible()
  
  // 6. 等待专家接单（模拟）
  // ...
  
  // 7. 审核交付
  await page.click('text=审核交付')
  await page.click('button:has-text("验收通过")')
  
  // 8. 确认解锁
  await page.click('button:has-text("确认解锁")')
  await expect(page.locator('.order-completed')).toBeVisible()
})
```

#### 场景 2: 专家接单并交付
```typescript
// tests/e2e/expert-flow.spec.ts
test('Expert can accept and deliver a task', async ({ page }) => {
  // 1. 注册专家
  await page.goto('/register/expert')
  await page.fill('[name="organizationName"]', 'Dr. Sarah Chen')
  await page.fill('[name="email"]', 'sarah@expert.com')
  await page.click('button[type="submit"]')
  
  // 2. 收到任务通知
  await page.goto('/dashboard')
  await expect(page.locator('.task-notification')).toBeVisible()
  
  // 3. 查看任务并接单
  await page.click('text=查看任务')
  await page.click('button:has-text("接受任务")')
  await expect(page.locator('.task-accepted')).toBeVisible()
  
  // 4. 提交交付
  await page.fill('[name="summary"]', '执行摘要...')
  await page.fill('[name="conclusion1"]', '结论 1...')
  await page.click('button:has-text("提交交付")')
  
  // 5. 等待审核
  await expect(page.locator('.waiting-review')).toBeVisible()
  
  // 6. 收到验收通知
  await expect(page.locator('.task-completed')).toBeVisible()
  await expect(page.locator('.income-received')).toContainText('$2,250')
})
```

#### 场景 3: 平台审核
```typescript
// tests/e2e/admin-flow.spec.ts
test('Admin can review delivery', async ({ page }) => {
  // 1. 登录管理员
  await page.goto('/admin/login')
  await page.fill('[name="email"]', 'admin@neon.com')
  await page.click('button[type="submit"]')
  
  // 2. 查看待审核订单
  await page.click('text=待审核')
  await expect(page.locator('.order-card')).toHaveCount(1)
  
  // 3. 查看交付物
  await page.click('text=查看交付')
  await expect(page.locator('.delivery-summary')).toBeVisible()
  
  // 4. 审核通过
  await page.click('input[value="pass"]')
  await page.click('button:has-text("提交审核")')
  await expect(page.locator('.review-passed')).toBeVisible()
})
```

---

## 🎯 测试覆盖目标

### Phase 1（MVP）
- **单元测试**: 80% 覆盖率
- **集成测试**: 60% 覆盖率
- **端到端测试**: 50% 覆盖率（至少覆盖核心流程）

### Phase 2（可运营）
- **单元测试**: 85% 覆盖率
- **集成测试**: 70% 覆盖率
- **端到端测试**: 60% 覆盖率

### Phase 3（增强）
- **单元测试**: 90% 覆盖率
- **集成测试**: 80% 覆盖率
- **端到端测试**: 70% 覆盖率

---

## 🧰 测试工具

### 单元测试和集成测试
- **Jest**: 测试运行器
- **Testing Library**: React 组件测试
- **Prisma**: 数据库测试（使用测试数据库）

### 端到端测试
- **Playwright**: 浏览器自动化
- **axe-core**: 可访问性测试（可选）

### API 测试
- **Postman**: 手动 API 测试
- **curl**: 快速验证

---

## 📊 测试数据

### 种子数据（开发环境）
```typescript
// prisma/seed.ts
const experts = [
  {
    name: 'Dr. Sarah Chen',
    email: 'sarah@expert.com',
    tags: ['semiconductor', 'supply-chain', 'asia'],
    rating: 4.9,
    completedTasks: 142,
    pricePerTask: 2500,
  },
  {
    name: 'Michael K.',
    email: 'michael@expert.com',
    tags: ['semiconductor', 'korea', 'procurement'],
    rating: 4.7,
    completedTasks: 89,
    pricePerTask: 1800,
  },
  // ...
]

const requesters = [
  {
    name: 'Test Company',
    email: 'test@company.com',
    industry: 'automotive',
    wallet: {
      balance: 10000,
    },
  },
  // ...
]
```

### 测试账户
- **需求方**: `test-requester@neon.com` / `password123`
- **专家**: `test-expert@neon.com` / `password123`
- **管理员**: `admin@neon.com` / `admin123`

---

## ✅ 验收标准（每个特性）

### 功能验收
- [ ] 所有测试用例通过
- [ ] 代码覆盖率达标（单元 80% / 集成 60% / E2E 50%）
- [ ] 无重大 bug
- [ ] 手动验证通过（开发人员自测）

### 代码质量
- [ ] ESLint 无错误
- [ ] TypeScript 无类型错误
- [ ] 代码评审通过

---

## 📝 测试执行流程

### 每次提交（CI/CD）
1. ✅ 运行单元测试（Jest）
2. ✅ 运行集成测试（Jest）
3. ✅ ESLint 检查
4. ✅ TypeScript 类型检查

### 每个特性完成
1. ✅ 运行单元测试 + 集成测试
2. ✅ 运行相关 E2E 测试
3. ✅ 手动验证
4. ✅ 更新测试报告

### 每个 Sprint 结束
1. ✅ 运行完整测试套件（单元 + 集成 + E2E）
2. ✅ 生成测试覆盖率报告
3. ✅ 回归测试（确保新功能未破坏旧功能）

---

## 🐛 缺陷管理

### 缺陷优先级
- **P0（阻塞性）**: 立即修复（核心功能无法使用）
- **P1（严重）**: 24 小时内修复（主要功能受影响）
- **P2（一般）**: 3 天内修复（次要功能）
- **P3（轻微）**: 下个版本修复（UI 小问题）

### 缺陷记录
```markdown
## Bug Report

**Feature**: F005 - 需求方选择专家
**Priority**: P1
**Description**: 选择专家后，订单状态未更新
**Steps to Reproduce**:
1. 登录需求方
2. 创建任务
3. 选择专家
4. 点击"确认"
**Expected**: 订单状态变为 "awaiting_deposit"
**Actual**: 订单状态仍为 "created"
**Environment**: Chrome 120, macOS 14
```

---

## 📊 测试报告模板

```markdown
# Neon Protocol Demo - 测试报告

**Date**: 2026-04-XX
**Feature**: F005 - 需求方选择专家
**Tester**: Claw

## Test Results

### Unit Tests
- ✅ 15/15 passed
- Coverage: 85%

### Integration Tests
- ✅ 8/10 passed
- ❌ 2 failed (API timeout issues)
- Coverage: 60%

### E2E Tests
- ✅ 3/5 passed
- ❌ 2 failed (UI rendering issues)
- Coverage: 50%

## Issues Found
1. API 超时（已修复）
2. UI 渲染延迟（待修复）

## Conclusion
✅ Feature ready for review (after fixing UI issues)
```

---

## 🎯 下一步

1. ✅ 设置测试环境（Jest + Playwright）
2. ✅ 创建测试数据库
3. ✅ 编写种子数据
4. ✅ 开始实现 F001（专家注册）并同步编写测试

---

_本文件遵循 long-running-dev skill 规范，随项目进展持续更新。_
