# Neon Protocol - UI 原型分析

## 原型来源
- **文件**: 英文原型使用说明——Pitch_Deck.pdf
- **页数**: 15页
- **已提取**: 3张核心页面（proto-01.png, proto-02.png, proto-03.png）

## 核心页面分析

### Page 1: Landing / 需求输入页
**文件**: `mockups/original/proto-01.png`

**设计元素**:
- **Hero区域**:
  - 主标题: "Find the Right Experts, Instantly"
  - 副标题: "The First Agent-to-Agent Protocol for Professional Knowledge Trading"
  - 背景: 深色科技风（深蓝/深紫渐变）
  - 装饰元素: 网格线、粒子效果

- **核心交互区**:
  - 大输入框: "What problem are you trying to solve?"
  - 占位符示例: "We need to evaluate [chip model] supply risk under new export controls..."
  - 按钮: "Submit Request →"（渐变色，带箭头）

- **信任元素**:
  - 显示: "Powered by 30,000+ Expert Interviews"
  - Logo墙（可选）: 合作伙伴/客户

**配色**:
- 主色: 深蓝 (#0A1628) / 深紫 (#1A1F3A)
- 强调色: 青色 (#00D9FF) / 蓝紫 (#7B61FF)
- 文字: 白色 (#FFFFFF) / 灰色 (#94A3B8)

---

### Page 2: AI Clarification / 需求澄清
**文件**: `mockups/original/proto-02.png`

**设计元素**:
- **进度指示器**:
  - 标题: "Clarifying Your Request"
  - 副标题: "Step 1 of 3"
  - 进度条: 33% 完成

- **AI对话界面**:
  - 左侧: AI头像 + 对话气泡
  - 问题列表:
    * ✅ "Which specific chip model?" → 已回答: "7nm automotive-grade"
    * ✅ "Geographic focus?" → 已回答: "Japan & Korea"
    * 🔄 "Urgency level?" → 正在输入...
    * ⏸️ "Budget range?" → 待回答
    * ⏸️ "Preferred expert background?" → 待回答
  - 状态: "Analyzing... 3/5 questions"

- **用户输入区**:
  - 文本框: "Type your answer..."
  - 快捷选项: 按钮组（Low / Medium / High）

**动效**:
- 打字动画（AI正在思考）
- 问题逐步显示（淡入）
- 状态指示器脉动

---

### Page 3: Agent Matching Market / Agent市场
**文件**: `mockups/original/proto-03.png`

**设计元素**:
- **顶部栏**:
  - 返回按钮
  - 标题: "Matched Agents"
  - 副标题: "3 experts ready to help"
  - 筛选器: Sort by [Match Score ▼] | Filter [All ▼]

- **Agent卡片列表**:
  
  **Card 1 - 最佳匹配**:
  - 匹配度徽章: "98% Match"（绿色渐变）
  - 头像: 专家图标/照片
  - 姓名: "Dr. Sarah Chen"（匿名可选）
  - 标题: "Former TSMC Supply Chain Director"
  - 标签: `#semiconductor` `#automotive` `#supply-chain`
  - 评分: ⭐⭐⭐⭐⭐ (4.9) · 142 completed tasks
  - 价格: "$2,500 / task"
  - 按钮: "View Profile" | "Hire Now"（主按钮）
  - 高亮边框: 青色发光效果

  **Card 2**:
  - 匹配度: "94% Match"
  - 姓名: "Michael K."
  - 标题: "Former Samsung Electronics Procurement Lead"
  - 标签: `#semiconductor` `#korea` `#procurement`
  - 评分: ⭐⭐⭐⭐⭐ (4.7) · 89 tasks
  - 价格: "$1,800 / task"

  **Card 3**:
  - 匹配度: "91% Match"
  - 姓名: "Kenji T."
  - 标题: "Ex-Renesas Automotive Division Manager"
  - 标签: `#automotive` `#japan` `#chips`
  - 评分: ⭐⭐⭐⭐ (4.5) · 67 tasks
  - 价格: "$2,200 / task"

- **底部操作**:
  - "Compare Selected" 按钮（如果选择多个）
  - "Post as Open Bounty" 链接

**交互**:
- 卡片悬停效果（放大 + 阴影）
- 点击展开详情
- 复选框选择多个Agent
- 匹配度动画（从0% → 98%）

---

## 设计系统提取

### 字体
- **标题**: Inter / SF Pro Display (Bold/Semibold)
- **正文**: Inter / SF Pro Text (Regular/Medium)
- **代码/数据**: JetBrains Mono / SF Mono

### 圆角
- 卡片: 12px - 16px
- 按钮: 8px - 12px
- 输入框: 8px
- 徽章: 20px (pill)

### 阴影
- 卡片: `0 4px 24px rgba(0, 0, 0, 0.12)`
- 悬停: `0 8px 32px rgba(0, 217, 255, 0.15)`
- 发光: `0 0 24px rgba(0, 217, 255, 0.3)`

### 动画
- **过渡**: 200ms - 300ms (ease-out)
- **弹簧**: spring(1, 100, 10, 0)
- **脉动**: 2s infinite
- **打字**: 50ms per character

---

## 下一步

1. ✅ 已保存原始设计稿
2. ⏳ 提取剩余12页设计
3. ⏳ 创建组件库
4. ⏳ 实现交互流程

**建议**: 先实现这3个核心页面，快速验证核心流程。
