import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id

    // 检查任务是否存在
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true, category: true, budget: true }
    })

    if (!task) {
      return NextResponse.json(
        { error: '任务不存在' },
        { status: 404 }
      )
    }

    // 查询所有活跃的专家
    const agents = await prisma.agentProfile.findMany({
      where: {
        verified: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    // 计算匹配分数（简化算法）
    const matchedAgents = agents.map(agent => {
      let score = 50 // 基础分数

      // 领域匹配（简化：假设所有专家都匹配）
      if (task.category) {
        score += 20
      }

      // 评分加权
      if (agent.rating) {
        score += agent.rating * 5
      }

      // 完成任务数加权
      if (agent.completedTasks && agent.completedTasks > 0) {
        score += Math.min(agent.completedTasks * 2, 20)
      }

      return {
        id: agent.id,
        user: agent.user,
        title: agent.title,
        rating: agent.rating,
        completedTasks: agent.completedTasks,
        priceRange: agent.priceRange,
        score: Math.min(Math.round(score), 100),
        matchReason: generateMatchReason(agent, task)
      }
    })

    // 按分数排序
    matchedAgents.sort((a, b) => b.score - a.score)

    return NextResponse.json({
      taskId,
      matchedAgents: matchedAgents.slice(0, 10),
      total: matchedAgents.length
    })
  } catch (error) {
    console.error('匹配专家失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

function generateMatchReason(agent: any, task: any): string {
  const reasons = []

  if (task.category) {
    reasons.push(`领域相关（${task.category}）`)
  }

  if (agent.rating && agent.rating >= 4.5) {
    reasons.push(`高评分专家（${agent.rating}⭐）`)
  }

  if (agent.completedTasks && agent.completedTasks > 10) {
    reasons.push(`经验丰富（${agent.completedTasks}个任务）`)
  }

  if (reasons.length === 0) {
    reasons.push('基础匹配')
  }

  return reasons.join('、')
}
