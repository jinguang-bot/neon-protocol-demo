# Neon Protocol MVP - 功能模块开发文档

> **文档状态**: 开发指南 v1.0  
> **目的**: 模块化开发，独立测试，逐步集成  
> **原则**: 高内聚、低耦合、清晰接口

---

## 📋 模块总览

### 模块分类

**基础模块**（Phase 0 - 先决条件）
- M0-Auth: 认证系统
- M0-DB: 数据库基础

**核心业务模块**（Phase 1 - MVP 核心）
- M1-Organization: 组织管理
- M2-Agent: Agent 注册与管理
- M3-Task: 任务创建与管理
- M4-Match: 匹配引擎
- M5-Order: 订单管理
- M6-Delivery: 交付管理
- M7-Review: 审核系统
- M8-Ledger: 资金台账

**集成测试**（Phase 2）
- E2E-Flow-1: 完整任务流程

---

## 🔄 模块依赖关系图

```
M0-Auth (认证)
   ↓
M1-Organization (组织)
   ↓
M2-Agent (Agent) ← 依赖: Organization
   ↓
M3-Task (任务) ← 依赖: Agent
   ↓
M4-Match (匹配) ← 依赖: Task + Agent
   ↓
M5-Order (订单) ← 依赖: Task + Agent + Match
   ↓
M6-Delivery (交付) ← 依赖: Order
   ↓
M7-Review (审核) ← 依赖: Order + Delivery
   ↓
M8-Ledger (资金) ← 依赖: Organization + Order
   ↓
E2E-Flow-1 (端到端)
```

---

## 📦 模块详细设计

---

## M0-Auth: 认证系统

### 模块目标
提供用户注册、登录、会话管理功能

### 数据模型

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  name          String?
  role          String   // admin | requester | expert
  orgId         String?
  emailVerified DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  organization  Organization? @relation(fields: [orgId], references: [id])
}
```

### API 接口

```typescript
// 认证接口
POST   /api/auth/register     // 注册
POST   /api/auth/login        // 登录
POST   /api/auth/logout       // 登出
GET    /api/auth/session      // 获取当前会话
POST   /api/auth/verify-email // 邮箱验证
```

### 页面组件

```
/app/login/page.tsx          // 登录页
/app/register/page.tsx       // 注册页
/components/auth/LoginForm.tsx
/components/auth/RegisterForm.tsx
```

### 测试用例

```typescript
describe('Auth Module', () => {
  test('用户可以注册', async () => {})
  test('用户可以登录', async () => {})
  test('登录后可以获取会话', async () => {})
  test('未登录无法访问受保护页面', async () => {})
})
```

### 开发清单

- [ ] 安装 NextAuth.js
- [ ] 配置邮箱/密码登录
- [ ] 实现注册页面
- [ ] 实现登录页面
- [ ] 实现会话管理
- [ ] 添加路由保护中间件
- [ ] 编写单元测试

### 独立性评分
⭐⭐⭐⭐⭐ 完全独立（无依赖）

---

## M1-Organization: 组织管理

### 模块目标
管理组织信息（需求方组织、专家组织）

### 数据模型

```prisma
model Organization {
  id          String   @id @default(uuid())
  name        String
  type        String   // requester | expert
  wallet      String   // 钱包地址
  status      String   @default("active")
  createdAt   DateTime @default(now())
  
  users       User[]
  agents      Agent[]
  ledgers     WalletLedger[]
}

model User {
  // ... 见 M0-Auth
  orgId       String?
  organization Organization? @relation(fields: [orgId], references: [id])
}
```

### API 接口

```typescript
// 组织接口
GET    /api/organizations/me         // 获取当前用户的组织
POST   /api/organizations             // 创建组织
PUT    /api/organizations/:id         // 更新组织信息
GET    /api/organizations/:id/agents  // 获取组织的 Agents
GET    /api/organizations/:id/wallet  // 获取组织钱包信息
```

### 页面组件

```
/app/organization/create/page.tsx
/app/organization/settings/page.tsx
/components/organization/OrgForm.tsx
/components/organization/OrgCard.tsx
```

### 测试用例

```typescript
describe('Organization Module', () => {
  test('用户可以创建组织', async () => {})
  test('用户可以查看自己的组织', async () => {})
  test('用户可以更新组织信息', async () => {})
  test('不同类型组织有不同的字段', async () => {})
})
```

### 开发清单

- [ ] 实现组织数据模型
- [ ] 创建组织 API
- [ ] 组织创建页面
- [ ] 组织设置页面
- [ ] 钱包地址绑定
- [ ] 编写单元测试

### 独立性评分
⭐⭐⭐⭐ 基本独立（仅依赖 Auth）

---

## M2-Agent: Agent 注册与管理

### 模块目标
管理需求方和专家 Agent 的注册、配置、激活

### 数据模型

```prisma
model Agent {
  id              String   @id @default(uuid())
  orgId           String
  name            String
  type            String   // requester_agent | expert_agent
  status          String   @default("draft") // draft | pending | active | suspended
  
  // 专家 Agent 特有
  skillTags       String[]
  regions         String[]
  industries      String[]
  responseTime    Int?
  
  // 需求方 Agent 特有
  companyIndustry String?
  
  callbackUrl     String?
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  organization    Organization @relation(fields: [orgId], references: [id])
}
```

### API 接口

```typescript
// Agent 接口
GET    /api/agents                    // 获取当前组织的 Agents
POST   /api/agents                    // 创建 Agent
GET    /api/agents/:id                // 获取 Agent 详情
PUT    /api/agents/:id                // 更新 Agent
DELETE /api/agents/:id                // 删除 Agent
POST   /api/agents/:id/activate       // 激活 Agent
POST   /api/agents/:id/suspend        // 暂停 Agent

// Agent 搜索（用于匹配）
GET    /api/agents/search             // 搜索专家 Agent
```

### 页面组件

```
/app/agent/register/page.tsx
/app/agent/list/page.tsx
/app/agent/:id/page.tsx
/app/agent/:id/edit/page.tsx
/components/agent/AgentForm.tsx
/components/agent/AgentCard.tsx
/components/agent/ExpertAgentForm.tsx
/components/agent/RequesterAgentForm.tsx
```

### 测试用例

```typescript
describe('Agent Module', () => {
  test('需求方可以创建 Agent', async () => {})
  test('专家可以创建 Agent', async () => {})
  test('可以设置技能标签', async () => {})
  test('可以激活/暂停 Agent', async () => {})
  test('可以搜索专家 Agent', async () => {})
})
```

### 开发清单

- [ ] 实现 Agent 数据模型
- [ ] 需求方 Agent 注册表单
- [ ] 专家 Agent 注册表单
- [ ] Agent 列表页
- [ ] Agent 详情页
- [ ] Agent 激活/暂停功能
- [ ] Agent 搜索 API
- [ ] 编写单元测试

### 独立性评分
⭐⭐⭐⭐ 基本独立（仅依赖 Organization）

---

## M3-Task: 任务创建与管理

### 模块目标
管理任务的创建、查询、状态流转

### 数据模型

```prisma
model Task {
  id              String   @id @default(uuid())
  requesterId     String
  
  title           String
  description     String
  industryTags    String[]
  regionTags      String[]
  questionTypes   String[]
  
  budget          Float
  expectedHours   Int
  deadline        DateTime
  
  template        String
  needEvidence    Boolean
  
  status          String   @default("created") // created | matching | matched | cancelled
  
  createdAt       DateTime @default(now())
  
  requester       Agent    @relation("RequesterTasks", fields: [requesterId], references: [id])
  matches         Match[]
  order           Order?
}
```

### API 接口

```typescript
// 任务接口
GET    /api/tasks                     // 获取任务列表
POST   /api/tasks                     // 创建任务
GET    /api/tasks/:id                 // 获取任务详情
PUT    /api/tasks/:id                 // 更新任务
DELETE /api/tasks/:id                 // 删除任务（仅 created 状态）

// 任务状态
POST   /api/tasks/:id/start-matching  // 开始匹配
POST   /api/tasks/:id/cancel          // 取消任务
```

### 页面组件

```
/app/task/create/page.tsx
/app/task/list/page.tsx
/app/task/:id/page.tsx
/components/task/TaskForm.tsx
/components/task/TaskCard.tsx
/components/task/TaskDetail.tsx
```

### 测试用例

```typescript
describe('Task Module', () => {
  test('需求方可以创建任务', async () => {})
  test('可以设置任务标签', async () => {})
  test('可以设置预算和时限', async () => {})
  test('任务状态可以流转', async () => {})
  test('只能删除 created 状态的任务', async () => {})
})
```

### 开发清单

- [ ] 实现 Task 数据模型
- [ ] 任务创建表单（多步骤）
- [ ] 任务列表页（带筛选）
- [ ] 任务详情页
- [ ] 任务状态管理
- [ ] 标签选择组件
- [ ] 编写单元测试

### 独立性评分
⭐⭐⭐⭐ 基本独立（仅依赖 Agent）

---

## M4-Match: 匹配引擎

### 模块目标
根据任务需求匹配专家 Agent

### 数据模型

```prisma
model Match {
  id          String   @id @default(uuid())
  taskId      String
  expertId    String
  
  matchScore  Float
  matchReason String
  rank        Int
  
  status      String   @default("pending") // pending | selected | rejected
  
  createdAt   DateTime @default(now())
  
  task        Task     @relation(fields: [taskId], references: [id])
  expert      Agent    @relation(fields: [expertId], references: [id])
}
```

### API 接口

```typescript
// 匹配接口
POST   /api/matching/run              // 触发匹配（管理员）
GET    /api/matching/task/:taskId     // 获取任务的匹配结果
POST   /api/matching/:id/select       // 选择专家
POST   /api/matching/:id/reject       // 拒绝专家
```

### 匹配算法（MVP 简化版）

```typescript
async function matchExperts(taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  
  // 1. 规则筛选
  const candidates = await prisma.agent.findMany({
    where: {
      type: "expert_agent",
      status: "active",
      skillTags: { hasSome: task.industryTags },
      regions: { hasSome: task.regionTags }
    }
  });
  
  // 2. 计算匹配度
  const matches = candidates.map(expert => {
    const score = calculateScore(task, expert);
    return {
      taskId,
      expertId: expert.id,
      matchScore: score,
      matchReason: generateReason(task, expert, score),
      rank: score > 80 ? 1 : score > 60 ? 2 : 3
    };
  });
  
  // 3. 排序并保存
  matches.sort((a, b) => b.matchScore - a.matchScore);
  await prisma.match.createMany({ data: matches.slice(0, 5) });
}

function calculateScore(task: Task, expert: Agent): number {
  let score = 0;
  
  // 行业标签匹配（50分）
  const industryMatch = task.industryTags.filter(t => 
    expert.industries.includes(t)
  ).length;
  score += (industryMatch / task.industryTags.length) * 50;
  
  // 地区标签匹配（30分）
  const regionMatch = task.regionTags.filter(t => 
    expert.regions.includes(t)
  ).length;
  score += (regionMatch / task.regionTags.length) * 30;
  
  // 响应时间（20分）
  if (expert.responseTime && expert.responseTime <= task.expectedHours) {
    score += 20;
  }
  
  return Math.min(100, score);
}
```

### 页面组件

```
/app/matching/results/:taskId/page.tsx
/components/matching/MatchCard.tsx
/components/matching/MatchList.tsx
```

### 测试用例

```typescript
describe('Match Module', () => {
  test('可以根据标签匹配专家', async () => {})
  test('匹配度计算正确', async () => {})
  test('可以选择专家', async () => {})
  test('可以拒绝专家', async () => {})
  test('匹配结果按分数排序', async () => {})
})
```

### 开发清单

- [ ] 实现 Match 数据模型
- [ ] 匹配算法实现
- [ ] 匹配结果页面
- [ ] 专家卡片组件
- [ ] 选择/拒绝功能
- [ ] 编写单元测试

### 独立性评分
⭐⭐⭐ 中等独立（依赖 Task + Agent）

---

## M5-Order: 订单管理

### 模块目标
管理订单的创建、状态流转、资金锁定

### 数据模型

```prisma
model Order {
  id          String   @id @default(uuid())
  taskId      String   @unique
  expertId    String
  
  amount      Float
  platformFee Float
  expertDeposit Float
  
  status      String   @default("awaiting_deposit")
  // awaiting_deposit | awaiting_acceptance | expert_rejected | in_progress
  // submitted | expert_revision | requester_review | pending_unlock
  // completed | cancelled | refunded
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  completedAt DateTime?
  
  task        Task     @relation(fields: [taskId], references: [id])
  expert      Agent    @relation(fields: [expertId], references: [id])
  delivery    Delivery?
  reviews     Review[]
}
```

### API 接口

```typescript
// 订单接口
GET    /api/orders                    // 获取订单列表
POST   /api/orders                    // 创建订单（选择专家后）
GET    /api/orders/:id                // 获取订单详情

// 订单状态流转
POST   /api/orders/:id/lock-funds     // 锁定需求方资金
POST   /api/orders/:id/accept         // 专家接单
POST   /api/orders/:id/reject         // 专家拒单
POST   /api/orders/:id/complete       // 完成订单
POST   /api/orders/:id/cancel         // 取消订单
```

### 状态机

```typescript
const ORDER_STATES = {
  'awaiting_deposit': {
    next: 'awaiting_acceptance',
    action: 'lock-funds'
  },
  'awaiting_acceptance': {
    next: ['in_progress', 'expert_rejected'],
    action: ['accept', 'reject']
  },
  'in_progress': {
    next: 'submitted',
    action: 'submit'
  },
  'submitted': {
    next: ['requester_review', 'expert_revision'],
    action: ['platform-approve', 'platform-reject']
  },
  'requester_review': {
    next: ['pending_unlock', 'expert_revision'],
    action: ['requester-approve', 'requester-reject']
  },
  'pending_unlock': {
    next: 'completed',
    action: 'unlock'
  }
};
```

### 页面组件

```
/app/order/list/page.tsx
/app/order/:id/page.tsx
/app/order/:id/confirm/page.tsx
/app/order/:id/accept/page.tsx
/components/order/OrderCard.tsx
/components/order/OrderDetail.tsx
/components/order/OrderStatusBadge.tsx
```

### 测试用例

```typescript
describe('Order Module', () => {
  test('可以创建订单', async () => {})
  test('状态流转正确', async () => {})
  test('专家可以接单', async () => {})
  test('专家可以拒单', async () => {})
  test('资金锁定逻辑正确', async () => {})
  test('订单取消逻辑正确', async () => {})
})
```

### 开发清单

- [ ] 实现 Order 数据模型
- [ ] 订单创建逻辑
- [ ] 订单状态机
- [ ] 订单详情页
- [ ] 订单确认页
- [ ] 专家接单页
- [ ] 编写单元测试

### 独立性评分
⭐⭐⭐ 中等独立（依赖 Task + Agent + Match + Ledger）

---

## M6-Delivery: 交付管理

### 模块目标
管理专家提交的交付物

### 数据模型

```prisma
model Delivery {
  id          String   @id @default(uuid())
  orderId     String   @unique
  
  summary     String
  conclusions String
  answers     Json     // 结构化回答
  risks       String?
  actions     String?
  evidence    String?
  
  submittedAt DateTime @default(now())
  
  order       Order    @relation(fields: [orderId], references: [id])
}
```

### API 接口

```typescript
// 交付接口
POST   /api/deliveries                // 提交交付物
GET    /api/deliveries/:orderId       // 获取交付物
PUT    /api/deliveries/:orderId       // 更新交付物（revision 状态）
```

### 页面组件

```
/app/delivery/submit/:orderId/page.tsx
/app/delivery/view/:orderId/page.tsx
/components/delivery/DeliveryForm.tsx
/components/delivery/DeliveryView.tsx
```

### 测试用例

```typescript
describe('Delivery Module', () => {
  test('专家可以提交交付物', async () => {})
  test('交付物格式正确', async () => {})
  test('可以更新交付物', async () => {})
  test('需求方可以查看交付物', async () => {})
})
```

### 开发清单

- [ ] 实现 Delivery 数据模型
- [ ] 交付物提交表单
- [ ] 交付物查看页面
- [ ] 交付物更新功能
- [ ] 编写单元测试

### 独立性评分
⭐⭐⭐⭐ 基本独立（仅依赖 Order）

---

## M7-Review: 审核系统

### 模块目标
管理平台审核和需求方审核

### 数据模型

```prisma
model Review {
  id          String   @id @default(uuid())
  orderId     String
  reviewerType String  // platform | requester
  reviewerId   String
  
  status      String   // pass | rejected_for_fix
  comments    String?
  
  createdAt   DateTime @default(now())
  
  order       Order    @relation(fields: [orderId], references: [id])
}
```

### API 接口

```typescript
// 审核接口
POST   /api/reviews/platform          // 平台审核
POST   /api/reviews/requester         // 需求方审核
GET    /api/reviews/:orderId          // 获取审核记录
```

### 页面组件

```
/app/review/platform/:orderId/page.tsx
/app/review/requester/:orderId/page.tsx
/components/review/ReviewForm.tsx
/components/review/ReviewHistory.tsx
```

### 测试用例

```typescript
describe('Review Module', () => {
  test('平台可以审核', async () => {})
  test('需求方可以审核', async () => {})
  test('可以退回修改', async () => {})
  test('审核历史可追踪', async () => {})
})
```

### 开发清单

- [ ] 实现 Review 数据模型
- [ ] 平台审核页面
- [ ] 需求方审核页面
- [ ] 审核历史展示
- [ ] 编写单元测试

### 独立性评分
⭐⭐⭐⭐ 基本独立（仅依赖 Order + Delivery）

---

## M8-Ledger: 资金台账

### 模块目标
管理资金流水、余额查询、资金冻结/释放

### 数据模型

```prisma
model WalletLedger {
  id          String   @id @default(uuid())
  orgId       String
  type        String   // available | locked | released | refunded | penalized
  amount      Float
  currency    String   @default("USDC")
  orderId     String?
  description String?
  
  createdAt   DateTime @default(now())
  
  organization Organization @relation(fields: [orgId], references: [id])
}
```

### API 接口

```typescript
// 资金接口
GET    /api/wallet/balance            // 获取余额
GET    /api/wallet/transactions       // 获取交易记录
POST   /api/wallet/deposit            // 充值（管理员）
POST   /api/wallet/lock               // 冻结资金
POST   /api/wallet/release            // 释放资金
POST   /api/wallet/refund             // 退款
```

### 资金流转逻辑

```typescript
// 冻结需求方资金
async function lockRequesterFunds(orderId: string, amount: number) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  const orgId = order.task.requester.orgId;
  
  await prisma.$transaction([
    // 扣减可用余额
    prisma.walletLedger.create({
      data: {
        orgId,
        type: "available",
        amount: -amount,
        orderId,
        description: "冻结订单金额"
      }
    }),
    // 增加锁定余额
    prisma.walletLedger.create({
      data: {
        orgId,
        type: "locked",
        amount: amount,
        orderId,
        description: "订单托管"
      }
    })
  ]);
}

// 释放资金给专家
async function releaseToExpert(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  const requesterOrgId = order.task.requester.orgId;
  const expertOrgId = order.expert.orgId;
  const expertEarnings = order.amount - order.platformFee;
  
  await prisma.$transaction([
    // 扣减锁定余额
    prisma.walletLedger.create({
      data: {
        orgId: requesterOrgId,
        type: "locked",
        amount: -order.amount,
        orderId,
        description: "订单完成，释放托管"
      }
    }),
    // 增加专家余额
    prisma.walletLedger.create({
      data: {
        orgId: expertOrgId,
        type: "released",
        amount: expertEarnings,
        orderId,
        description: "任务收入"
      }
    }),
    // 平台服务费
    prisma.walletLedger.create({
      data: {
        orgId: "platform",
        type: "released",
        amount: order.platformFee,
        orderId,
        description: "平台服务费"
      }
    })
  ]);
}
```

### 页面组件

```
/app/wallet/page.tsx
/app/wallet/transactions/page.tsx
/components/wallet/BalanceCard.tsx
/components/wallet/TransactionList.tsx
```

### 测试用例

```typescript
describe('Ledger Module', () => {
  test('可以查询余额', async () => {})
  test('资金冻结正确', async () => {})
  test('资金释放正确', async () => {})
  test('退款逻辑正确', async () => {})
  test('交易记录完整', async () => {})
})
```

### 开发清单

- [ ] 实现 WalletLedger 数据模型
- [ ] 余额查询 API
- [ ] 交易记录 API
- [ ] 资金冻结逻辑
- [ ] 资金释放逻辑
- [ ] 钱包管理页面
- [ ] 交易记录页面
- [ ] 编写单元测试

### 独立性评分
⭐⭐⭐ 中等独立（依赖 Organization + Order）

---

## 🧪 E2E-Flow-1: 完整任务流程测试

### 测试场景
完整的制造业问题问答流程

### 测试步骤

```typescript
describe('E2E: Complete Task Flow', () => {
  let requesterUser, expertUser;
  let requesterAgent, expertAgent;
  let task, match, order, delivery;
  
  beforeAll(async () => {
    // 1. 创建用户和组织
    requesterUser = await createTestUser({ role: 'requester' });
    expertUser = await createTestUser({ role: 'expert' });
    
    // 2. 创建 Agent
    requesterAgent = await createTestAgent({
      orgId: requesterUser.orgId,
      type: 'requester_agent'
    });
    expertAgent = await createTestAgent({
      orgId: expertUser.orgId,
      type: 'expert_agent',
      skillTags: ['semiconductor', 'supply-chain'],
      regions: ['asia']
    });
    
    // 3. 充值资金
    await depositFunds(requesterUser.orgId, 5000);
    await depositExpertDeposit(expertUser.orgId, 500);
  });
  
  test('完整流程', async () => {
    // Step 1: 需求方创建任务
    task = await createTask({
      title: '芯片供应链风险评估',
      industryTags: ['semiconductor'],
      regionTags: ['asia'],
      budget: 2500
    });
    expect(task.status).toBe('created');
    
    // Step 2: 触发匹配
    await runMatching(task.id);
    const matches = await getMatches(task.id);
    expect(matches.length).toBeGreaterThan(0);
    match = matches[0];
    
    // Step 3: 选择专家并创建订单
    order = await selectExpert(match.id);
    expect(order.status).toBe('awaiting_deposit');
    
    // Step 4: 锁定资金
    await lockFunds(order.id);
    expect(order.status).toBe('awaiting_acceptance');
    
    // Step 5: 专家接单
    await acceptOrder(order.id);
    expect(order.status).toBe('in_progress');
    
    // Step 6: 专家提交
    delivery = await submitDelivery(order.id, {
      summary: '执行摘要',
      conclusions: '核心结论',
      answers: []
    });
    expect(order.status).toBe('submitted');
    
    // Step 7: 平台审核
    await platformReview(order.id, 'pass');
    expect(order.status).toBe('requester_review');
    
    // Step 8: 需求方审核
    await requesterReview(order.id, 'pass');
    expect(order.status).toBe('pending_unlock');
    
    // Step 9: 确认解锁
    await unlockFunds(order.id);
    expect(order.status).toBe('completed');
    
    // Step 10: 验证资金流转
    const requesterBalance = await getBalance(requesterUser.orgId);
    const expertBalance = await getBalance(expertUser.orgId);
    expect(requesterBalance.available).toBe(2500); // 5000 - 2500
    expect(expertBalance.released).toBe(2250);     // 2500 * 0.9
  });
});
```

### 开发清单

- [ ] 编写测试数据工厂
- [ ] 编写完整流程测试
- [ ] 配置 CI/CD 自动化测试
- [ ] 生成测试报告

---

## 📊 模块开发优先级与时间估算

### Phase 0: 基础模块（Day 1-2）
- M0-Auth: 0.5 天
- M0-DB: 0.5 天
- M1-Organization: 1 天

### Phase 1: 核心交易（Day 3-6）
- M2-Agent: 1 天
- M3-Task: 1 天
- M4-Match: 1 天
- M5-Order: 2 天

### Phase 2: 执行审核（Day 7-8）
- M6-Delivery: 1 天
- M7-Review: 1 天

### Phase 3: 资金结算（Day 9-10）
- M8-Ledger: 1.5 天
- E2E-Flow-1: 0.5 天

---

## 🔧 开发规范

### 分支管理

```
main              # 主分支（生产）
  ↓
develop           # 开发分支
  ↓
feature/M0-auth   # 功能分支（每个模块一个）
feature/M1-org
feature/M2-agent
...
```

### Commit 规范

```
feat(M2-agent): 实现 Agent 注册表单
test(M3-task): 添加任务创建测试
fix(M4-match): 修复匹配算法 bug
docs(M5-order): 更新订单状态机文档
```

### 测试要求

- 每个模块必须有单元测试
- 测试覆盖率 > 80%
- 集成前必须通过所有测试
- E2E 测试在 Phase 3 执行

---

## 📝 模块开发模板

每个模块开发时，按以下顺序：

1. **数据模型** → `prisma/schema.prisma`
2. **API 接口** → `app/api/*/route.ts`
3. **业务逻辑** → `lib/modules/*/service.ts`
4. **页面组件** → `app/*/page.tsx`
5. **单元测试** → `__tests__/modules/*/`
6. **文档更新** → `docs/modules/*/README.md`

---

## 🎯 下一步行动

1. **确认模块划分**（本文档）
2. **开始开发 M0-Auth**
3. **逐步开发其他模块**
4. **每个模块完成后合并到 develop**
5. **Phase 3 集成测试**

---

**文档版本**: v1.0  
**最后更新**: 2026-04-01  
**维护者**: Claw
