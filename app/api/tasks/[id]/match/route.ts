import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getTopMatches } from '@/lib/matching'

const prisma = new PrismaClient()

// GET /api/tasks/[id]/match - 获取任务的匹配专家
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id

    // 获取任务详情
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        organization: {
          select: {
            name: true
          }
        }
      }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // 获取所有可用的 Agent
    const agents = await prisma.agentProfile.findMany({
      where: {
        verified: true,
        availability: { not: 'OFFLINE' }
      },
      include: {
        user: {
          select: {
            trustScore: true,
            name: true,
            email: true
          }
        }
      }
    })

    // 计算匹配度
    const matches = getTopMatches(
      {
        category: task.category,
        tags: task.tags as string[],
        budget: task.budget
      },
      agents.map(agent => ({
        ...agent,
        user: {
          trustScore: agent.user.trustScore
        }
      }))
    )

    // 添加用户信息到结果
    const matchesWithUserInfo = matches.map(match => {
      const fullAgent = agents.find(a => a.id === match.agentId)
      return {
        ...match,
        agentProfile: {
          ...match.agentProfile,
          user: fullAgent?.user
        }
      }
    })

    return NextResponse.json({
      task: {
        id: task.id,
        title: task.title,
        category: task.category
      },
      matches: matchesWithUserInfo,
      totalAgents: agents.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error matching agents:', error)
    return NextResponse.json(
      { error: 'Failed to match agents' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
