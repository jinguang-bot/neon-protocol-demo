// Agent 匹配算法
// 基于技能标签、类别、评分等因素计算匹配度

import { AgentProfile, Task } from '@prisma/client'

interface MatchingResult {
  agentId: string
  agentProfile: AgentProfile
  score: number // 0-100
  reasons: string[]
}

export function calculateMatchingScore(
  task: { category: string; tags: string[]; budget?: number | null },
  agent: AgentProfile & { user: { trustScore: number } }
): MatchingResult {
  let score = 0
  const reasons: string[] = []

  // 1. 技能匹配度（0-40分）
  const agentSkills = agent.skills as string[]
  const taskTags = task.tags

  const matchedSkills = agentSkills.filter(skill => taskTags.includes(skill))
  const skillMatchRatio = matchedSkills.length / taskTags.length
  const skillScore = skillMatchRatio * 40

  if (matchedSkills.length > 0) {
    reasons.push(`技能匹配 ${matchedSkills.length}/${taskTags.length}: ${matchedSkills.join(', ')}`)
  }
  score += skillScore

  // 2. 类别经验（0-25分）
  // 假设 Agent 的 title 或 bio 中包含相关类别关键词会加分
  const categoryKeywords = {
    '半导体供应链': ['半导体', '芯片', '供应链', '晶圆'],
    '市场分析': ['市场', '分析', '调研', '趋势'],
    '技术咨询': ['技术', '架构', '优化', '性能'],
    '产品设计': ['产品', '设计', 'UX', 'UI'],
    '商业模式': ['商业', '模式', '定价', '策略'],
    '投资尽调': ['投资', '尽调', '风险评估', '财务']
  }

  const keywords = categoryKeywords[task.category as keyof typeof categoryKeywords] || []
  const agentText = `${agent.title} ${agent.bio || ''}`.toLowerCase()
  const hasCategoryExperience = keywords.some(keyword => agentText.includes(keyword.toLowerCase()))

  if (hasCategoryExperience) {
    score += 25
    reasons.push(`有${task.category}相关经验`)
  }

  // 3. 评分和信任度（0-20分）
  const ratingScore = agent.rating * 4 // 5分制 -> 20分
  const trustScore = agent.user.trustScore * 2 // 10分制 -> 20分

  if (agent.rating >= 4.5) {
    reasons.push(`高评分专家 (${agent.rating.toFixed(1)})`)
  }
  score += ratingScore + trustScore

  // 4. 完成任务数量（0-10分）
  const experienceScore = Math.min(agent.completedTasks, 10)
  if (agent.completedTasks >= 10) {
    reasons.push(`经验丰富 (${agent.completedTasks}个任务)`)
  }
  score += experienceScore

  // 5. 价格匹配（0-5分）
  if (task.budget && agent.priceRange) {
    // 简单的价格范围匹配
    const priceRangeMatch = checkPriceRangeMatch(task.budget, agent.priceRange)
    if (priceRangeMatch) {
      score += 5
      reasons.push(`价格范围匹配`)
    }
  }

  // 6. 验证状态加分（0-5分）
  if (agent.verified) {
    score += 5
    reasons.push(`已验证专家`)
  }

  // 限制最高分 100
  score = Math.min(score, 100)

  return {
    agentId: agent.id,
    agentProfile: agent,
    score: Math.round(score),
    reasons
  }
}

function checkPriceRangeMatch(budget: number, priceRange: string): boolean {
  // 解析价格范围，格式如 "$500-1000" 或 "$100+"
  const match = priceRange.match(/\$(\d+)-?(\d+)?/)
  if (!match) return false

  const minPrice = parseInt(match[1])
  const maxPrice = match[2] ? parseInt(match[2]) : Infinity

  return budget >= minPrice && budget <= maxPrice
}

export function rankAgents(
  task: { category: string; tags: string[]; budget?: number | null },
  agents: (AgentProfile & { user: { trustScore: number } })[]
): MatchingResult[] {
  const results = agents.map(agent => calculateMatchingScore(task, agent))

  // 按分数降序排序
  return results.sort((a, b) => b.score - a.score)
}

// 示例：获取推荐专家（返回前5个）
export function getTopMatches(
  task: { category: string; tags: string[]; budget?: number | null },
  agents: (AgentProfile & { user: { trustScore: number } })[],
  topN: number = 5
): MatchingResult[] {
  const ranked = rankAgents(task, agents)
  return ranked.slice(0, topN)
}
