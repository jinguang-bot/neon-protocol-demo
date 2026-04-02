import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/orders/[id]/deliver - 获取交付详情（优化版）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params

    // 优化1: 使用 findFirst + select，减少嵌套
    const delivery = await prisma.delivery.findFirst({
      where: { orderId: orderId },
      select: {
        id: true,
        summary: true,
        detailedAnswer: true,
        hoursSpent: true,
        notes: true,
        files: true,
        status: true,
        submittedAt: true,
        reviewedAt: true,
        reviewNotes: true,
        orderId: true
      }
    })

    if (!delivery) {
      return NextResponse.json(
        { error: '交付记录不存在' },
        { status: 404 }
      )
    }

    // 优化2: 分步查询，减少嵌套层级
    const order = await prisma.order.findUnique({
      where: { id: delivery.orderId },
      select: {
        id: true,
        status: true,
        taskId: true,
        agentId: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      )
    }

    // 优化3: 并行查询任务和专家信息
    const [task, agent] = await Promise.all([
      prisma.task.findUnique({
        where: { id: order.taskId },
        select: {
          id: true,
          title: true,
          category: true
        }
      }),
      prisma.agentProfile.findFirst({
        where: { userId: order.agentId },
        select: {
          id: true,
          name: true,
          avatar: true
        }
      })
    ])

    return NextResponse.json({
      delivery: {
        id: delivery.id,
        summary: delivery.summary,
        detailedAnswer: delivery.detailedAnswer,
        hoursSpent: delivery.hoursSpent,
        notes: delivery.notes,
        files: delivery.files,
        status: delivery.status,
        submittedAt: delivery.submittedAt,
        reviewedAt: delivery.reviewedAt,
        reviewNotes: delivery.reviewNotes
      },
      order: {
        id: order.id,
        status: order.status,
        task: {
          id: task?.id || '',
          title: task?.title || '',
          category: task?.category || ''
        },
        agent: agent ? {
          name: agent.name,
          avatar: agent.avatar
        } : null
      }
    })
  } catch (error) {
    console.error('获取交付详情失败:', error)
    return NextResponse.json(
      { error: '获取失败，请重试' },
      { status: 500 }
    )
  }
}
