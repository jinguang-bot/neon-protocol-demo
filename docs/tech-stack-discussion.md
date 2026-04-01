# Neon Protocol MVP - 技术实现路径讨论

> **文档状态**: 草稿（待讨论）  
> **创建时间**: 2026-04-01 10:00  
> **目的**: 讨论并确定技术方案，避免后期返工

---

## 🎯 技术选型的核心原则

基于 MVP 需求文档的"极致收敛"和"快速验证"原则，技术选型应该：

1. ✅ **快速开发** - 优先选择成熟框架，不造轮子
2. ✅ **易于迭代** - 支持快速修改和扩展
3. ✅ **低成本运行** - 初期服务器成本 < $50/月
4. ✅ **易于部署** - 一键部署，无需复杂运维
5. ✅ **可演进** - MVP 验证成功后可平滑升级

---

## 🏗️ 整体架构建议

### 架构模式：单体应用（Monolithic）+ 模块化

**理由**：
- MVP 阶段无需微服务复杂度
- 单体应用开发效率高
- 模块化设计便于后期拆分
- 部署简单，运维成本低

**架构图**：
```
┌─────────────────────────────────────────────────────┐
│                  Neon Protocol MVP                  │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   Frontend   │  │   Backend    │  │  Database │ │
│  │  (Next.js)   │←→│  (Next.js)   │←→│ (SQLite)  │ │
│  │              │  │  API Routes  │  │           │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
│         ↓                  ↓                 ↓      │
│  ┌──────────────────────────────────────────────┐  │
│  │         Shared Business Logic                │  │
│  │  - Task Management                           │  │
│  │  - Matching Engine                           │  │
│  │  - Payment Ledger                            │  │
│  │  - Review System                             │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 📦 技术栈详细建议

### 前端（Frontend）

**框架**: Next.js 15 (App Router)
- ✅ React Server Components（性能优）
- ✅ 内置 API Routes（后端 API）
- ✅ 文件系统路由（开发快）
- ✅ 内置优化（图片、字体等）

**UI 组件**: 
- **shadcn/ui** - 高质量组件库，可定制
- **Tailwind CSS** - 快速开发
- **Framer Motion** - 动画（可选）

**状态管理**:
- **Zustand** - 轻量级，适合 MVP
- **React Hook Form** - 表单管理
- **TanStack Query** - 数据获取和缓存（可选）

**推荐理由**：
- 成熟稳定，生态完善
- 开发效率极高
- 社区活跃，问题易解决

---

### 后端（Backend）

**方案 A：Next.js API Routes（推荐）**

**优势**：
- ✅ 前后端一体，部署简单
- ✅ 无需单独后端服务器
- ✅ 开发效率高
- ✅ TypeScript 原生支持

**劣势**：
- ⚠️ Serverless 限制（执行时间、内存）
- ⚠️ 不适合复杂后台任务

**适用场景**：
- MVP 阶段（1-1000 用户）
- 简单的业务逻辑
- 快速验证

---

**方案 B：Next.js + Express（分离）**

**架构**：
```
Next.js (Frontend) → Express API (Backend) → SQLite
```

**优势**：
- ✅ 后端更灵活
- ✅ 支持复杂后台任务
- ✅ 可独立扩展

**劣势**：
- ⚠️ 需要维护两个服务
- ⚠️ 部署复杂度增加

**适用场景**：
- 需要复杂后台任务
- 需要长时间运行的 Job
- MVP 验证成功后

---

### 数据库（Database）

**推荐**: SQLite + Prisma ORM

**SQLite 优势**：
- ✅ 零配置，无需安装
- ✅ 单文件，易于备份
- ✅ 性能足够（读多写少场景）
- ✅ 可演进到 PostgreSQL

**Prisma 优势**：
- ✅ 类型安全
- ✅ 自动迁移
- ✅ 优秀的开发体验
- ✅ 易于切换数据库

**数据量估算**：
- MVP 阶段：< 10,000 条记录
- SQLite 完全够用
- 验证成功后可平滑迁移到 PostgreSQL

---

### 支付系统（Payment）

**MVP 阶段**: 平台账本模拟（无真实支付）

**实现方式**：
```typescript
// Ledger 表结构
model WalletLedger {
  id          String   @id @default(uuid())
  orgId       String   // 组织 ID
  type        String   // available | locked | released
  amount      Float    // 金额
  currency    String   @default("USDC")
  orderId     String?  // 关联订单
  createdAt   DateTime @default(now())
  
  organization Organization @relation(fields: [orgId], references: [id])
}
```

**资金流转逻辑**：
1. **充值**: 手动操作（管理员录入）→ 增加 available_balance
2. **冻结**: 创建订单 → 从 available → locked
3. **释放**: 完成验收 → 从 locked → released → 专家余额
4. **退款**: 取消订单 → 从 locked → available

**未来演进**：
- Phase 2: Stripe / PayPal 法币支付
- Phase 3: USDC 智能合约结算

---

### Agent 接入方式

**方案 A: Web 界面（推荐 MVP）**

**流程**：
1. 专家/需求方在 Web 界面注册
2. 填写 Agent 信息（名称、技能标签等）
3. 绑定钱包地址
4. 提供 Agent 回调 URL（可选）

**优势**：
- ✅ 降低接入门槛
- ✅ 人类操作，易于理解
- ✅ 适合冷启动阶段

---

**方案 B: API 注册（自动化）**

**流程**：
1. Agent 通过 API 注册
2. 提供认证 Token
3. 通过 API 接收任务通知
4. 通过 API 提交结果

**API 端点**：
```
POST /api/agents/register
POST /api/agents/tasks
POST /api/agents/accept
POST /api/agents/submit
```

**优势**：
- ✅ 完全自动化
- ✅ 适合真实的 AI Agent

**建议**：
- **MVP 阶段**: 优先实现 Web 界面
- **API 接口**: 同时开发，供技术型用户使用

---

### 认证系统（Authentication）

**推荐**: NextAuth.js (Auth.js v5)

**功能**：
- ✅ 邮箱/密码登录
- ✅ 组织账户管理
- ✅ Session 管理
- ✅ 角色权限控制

**用户类型**：
```typescript
enum UserType {
  REQUESTER_ORG    // 需求方组织
  EXPERT_ORG       // 专家组织
  PLATFORM_ADMIN   // 平台管理员
}
```

---

### 文件存储（File Storage）

**MVP 阶段**: 本地文件系统

**存储内容**：
- 专家提交的答案包（PDF/Word/Markdown）
- 用户头像
- 组织 Logo

**未来演进**：
- AWS S3 / Cloudflare R2

---

## 🗄️ 数据库设计（核心表）

### 组织与用户

```prisma
model Organization {
  id          String   @id @default(uuid())
  name        String
  type        String   // requester | expert
  wallet      String   // 钱包地址
  createdAt   DateTime @default(now())
  
  agents      Agent[]
  ledgers     WalletLedger[]
}

model Agent {
  id              String   @id @default(uuid())
  orgId           String
  name            String
  type            String   // requester_agent | expert_agent
  status          String   @default("draft") // draft | pending | active | suspended
  
  // 专家 Agent 特有
  skillTags       String[] // 技能标签
  regions         String[] // 服务地区
  industries      String[] // 行业
  responseTime    Int?     // 响应时间（小时）
  
  // 需求方 Agent 特有
  companyIndustry String?
  
  callbackUrl     String?  // Agent 回调地址
  
  organization    Organization @relation(fields: [orgId], references: [id])
  tasks           Task[]
  orders          Order[]
}
```

### 任务与订单

```prisma
model Task {
  id              String   @id @default(uuid())
  requesterId     String   // 需求方 Agent ID
  
  title           String
  description     String
  industryTags    String[]
  regionTags      String[]
  questionTypes   String[]
  
  budget          Float
  expectedHours   Int
  deadline        DateTime
  
  template        String   // 交付模板
  needEvidence    Boolean  // 是否需要依据
  
  status          String   @default("created") // created | matching | matched | cancelled
  
  createdAt       DateTime @default(now())
  
  requester       Agent    @relation("RequesterTasks", fields: [requesterId], references: [id])
  matches         Match[]
  order           Order?
}

model Match {
  id          String   @id @default(uuid())
  taskId      String
  expertId    String
  
  matchScore  Float    // 匹配度 0-100
  matchReason String   // 匹配理由
  rank        Int      // 推荐等级
  
  status      String   @default("pending") // pending | selected | rejected
  
  task        Task     @relation(fields: [taskId], references: [id])
  expert      Agent    @relation(fields: [expertId], references: [id])
}

model Order {
  id          String   @id @default(uuid())
  taskId      String   @unique
  expertId    String
  
  amount      Float    // 订单金额
  platformFee Float    // 平台服务费
  expertDeposit Float  // 专家保证金
  
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

model Delivery {
  id          String   @id @default(uuid())
  orderId     String   @unique
  
  summary     String   // 执行摘要
  conclusions String   // 核心结论
  answers     Json     // 逐问题回答（JSON）
  risks       String?  // 风险与假设
  actions     String?  // 建议行动项
  evidence    String?  // 引用依据
  
  submittedAt DateTime @default(now())
  
  order       Order    @relation(fields: [orderId], references: [id])
}
```

### 审核与资金

```prisma
model Review {
  id          String   @id @default(uuid())
  orderId     String
  reviewerType String  // platform | requester
  reviewerId   String  // 审核人 ID
  
  status      String   // pass | rejected_for_fix
  comments    String?  // 审核意见
  
  createdAt   DateTime @default(now())
  
  order       Order    @relation(fields: [orderId], references: [id])
}

model WalletLedger {
  id          String   @id @default(uuid())
  orgId       String
  type        String   // available | locked | released | refunded
  amount      Float
  currency    String   @default("USDC")
  orderId     String?
  description String?
  
  createdAt   DateTime @default(now())
  
  organization Organization @relation(fields: [orgId], references: [id])
}
```

---

## 🔄 核心业务流程实现

### 1. 任务创建与匹配

```typescript
// API: POST /api/tasks
async function createTask(data: CreateTaskInput) {
  // 1. 创建任务
  const task = await prisma.task.create({
    data: {
      ...data,
      status: "matching"
    }
  });
  
  // 2. 触发匹配引擎
  await matchExperts(task.id);
  
  return task;
}

// 匹配引擎
async function matchExperts(taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId }
  });
  
  // 简单规则匹配
  const experts = await prisma.agent.findMany({
    where: {
      type: "expert_agent",
      status: "active",
      skillTags: { hasSome: task.industryTags },
      regions: { hasSome: task.regionTags }
    }
  });
  
  // 计算匹配度
  const matches = experts.map(expert => ({
    taskId,
    expertId: expert.id,
    matchScore: calculateMatchScore(task, expert),
    matchReason: generateMatchReason(task, expert),
    rank: 1
  }));
  
  // 保存匹配结果
  await prisma.match.createMany({ data: matches });
  
  // 更新任务状态
  await prisma.task.update({
    where: { id: taskId },
    data: { status: "matched" }
  });
}
```

### 2. 资金流转

```typescript
// 冻结需求方资金
async function lockRequesterFunds(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });
  
  await prisma.$transaction([
    // 扣减可用余额
    prisma.walletLedger.create({
      data: {
        orgId: order.task.requester.orgId,
        type: "available",
        amount: -order.amount,
        orderId,
        description: "冻结订单金额"
      }
    }),
    // 增加锁定余额
    prisma.walletLedger.create({
      data: {
        orgId: order.task.requester.orgId,
        type: "locked",
        amount: order.amount,
        orderId,
        description: "订单托管"
      }
    })
  ]);
}

// 释放资金
async function releaseFunds(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });
  
  const expertEarnings = order.amount - order.platformFee;
  
  await prisma.$transaction([
    // 扣减锁定余额
    prisma.walletLedger.create({
      data: {
        orgId: order.task.requester.orgId,
        type: "locked",
        amount: -order.amount,
        orderId,
        description: "订单完成，释放托管"
      }
    }),
    // 增加专家余额
    prisma.walletLedger.create({
      data: {
        orgId: order.expert.orgId,
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

---

## 📱 页面路由设计

### 公开页面
```
/                       # Landing Page
/login                  # 登录
/register               # 注册选择（需求方/专家）
```

### 需求方页面
```
/requester/dashboard          # 控制台
/requester/tasks/new          # 创建任务
/requester/tasks/[id]         # 任务详情
/requester/matches/[id]       # 查看匹配结果
/requester/orders/[id]        # 订单详情
/requester/orders/[id]/review # 需求方审核
/requester/wallet             # 钱包管理
```

### 专家页面
```
/expert/dashboard            # 控制台
/expert/agent/register       # 注册 Agent
/expert/agent/[id]           # Agent 详情
/expert/orders/[id]          # 订单详情
/expert/orders/[id]/accept   # 接单确认
/expert/orders/[id]/submit   # 提交成果
/expert/wallet               # 钱包管理
```

### 平台管理员页面
```
/admin/dashboard             # 控制台
/admin/tasks                 # 任务列表
/admin/orders/[id]/review    # 平台审核
/admin/users                 # 用户管理
/admin/ledgers               # 资金流水
```

---

## 🚀 开发优先级与里程碑

### Milestone 1: 基础架构（Day 1-2）
**目标**: 项目骨架搭建完成

**任务**：
- [ ] 初始化 Next.js 项目
- [ ] 配置 Prisma + SQLite
- [ ] 设计数据库 Schema
- [ ] 实现基础认证（NextAuth）
- [ ] 基础布局组件

**交付物**：
- 可运行的项目
- 数据库迁移文件
- 登录/注册页面

---

### Milestone 2: 核心交易流程（Day 3-5）
**目标**: 跑通最短闭环

**任务**：
- [ ] 需求方 Agent 注册
- [ ] 专家 Agent 注册
- [ ] 任务创建页面
- [ ] 匹配引擎实现
- [ ] 匹配结果展示
- [ ] 订单确认页面

**交付物**：
- 完整的注册流程
- 任务创建和匹配流程

---

### Milestone 3: 执行与审核（Day 6-7）
**目标**: 完成交付和审核

**任务**：
- [ ] 专家接单/拒单
- [ ] 专家提交页面
- [ ] 平台审核页面
- [ ] 需求方审核页面
- [ ] 交付物展示

**交付物**：
- 完整的执行流程
- 双重审核机制

---

### Milestone 4: 资金流转（Day 8-9）
**目标**: 完成资金闭环

**任务**：
- [ ] 钱包管理页面
- [ ] 资金冻结逻辑
- [ ] 资金释放逻辑
- [ ] 资金流水页面
- [ ] 解锁确认页面

**交付物**：
- 完整的资金流转
- 余额和流水查询

---

### Milestone 5: 整合与测试（Day 10）
**目标**: 端到端验收

**任务**：
- [ ] 完整流程测试
- [ ] UI 优化
- [ ] 错误处理
- [ ] 部署上线

**交付物**：
- 可演示的 MVP
- 测试报告

---

## 🌐 部署方案

### 推荐方案: Vercel

**优势**：
- ✅ Next.js 原生支持
- ✅ 自动部署（Git push）
- ✅ 全球 CDN
- ✅ 免费额度足够 MVP

**成本**：
- Free Plan: 足够 MVP 阶段
- Pro Plan: $20/月（如需更多资源）

**数据库**：
- SQLite 文件存储在 Vercel（临时）
- 或使用 PlanetScale（免费额度）

---

### 备选方案: Railway

**优势**：
- ✅ 支持持久化存储
- ✅ 数据库和部署一体
- ✅ 简单易用

**成本**：
- $5/月 起步

---

## ⚠️ 风险与备选方案

### 风险 1: SQLite 性能瓶颈

**应对**：
- MVP 阶段监控查询性能
- 准备 PostgreSQL 迁移脚本
- Prisma 易于切换数据库

---

### 风险 2: Serverless 执行时间限制

**应对**：
- 优化匹配算法（简单规则）
- 避免长时间运行的 Job
- 如需复杂任务，迁移到独立服务器

---

### 风险 3: 文件存储限制

**应对**：
- 初期限制文件大小（< 10MB）
- 准备 S3/R2 迁移方案

---

## 🤔 需要讨论的关键问题

### 问题 1: Next.js API Routes vs 独立后端？

**我的建议**: Next.js API Routes（MVP 阶段）

**你的想法**: ?

---

### 问题 2: Agent 接入方式？

**我的建议**: 优先 Web 界面 + 同步开发 API

**你的想法**: ?

---

### 问题 3: 匹配算法复杂度？

**我的建议**: 简单规则匹配 + 人工调整（MVP）

**你的想法**: ?

---

### 问题 4: 支付系统？

**我的建议**: 平台账本模拟（无真实支付）

**你的想法**: ?

---

### 问题 5: 部署方案？

**我的建议**: Vercel（免费 + 简单）

**你的想法**: ?

---

### 问题 6: 开发时间线？

**我的建议**: 10 天完成 Phase 1

**你的想法**: ?

---

## 📋 下一步行动

1. **讨论并确定**技术方案（本文档）
2. **保存技术文档**到项目仓库
3. **开始搭建**项目骨架
4. **每周同步**进展和调整

---

**等待你的反馈！** 🎯

请告诉我：
- 哪些方案你认同？
- 哪些需要调整？
- 还有什么疑问？
