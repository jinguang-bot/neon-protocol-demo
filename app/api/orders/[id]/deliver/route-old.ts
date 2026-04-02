import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/orders/[id]/deliver - 提交交付成果
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const body = await request.json()

    // 验证必填字段
    const { summary, detailedAnswer, hoursSpent, notes, files } = body

    if (!summary || summary.length < 10) {
      return NextResponse.json(
        { error: '摘要至少需要10个字符' },
        { status: 400 }
      )
    }

    if (!detailedAnswer || detailedAnswer.length < 50) {
      return NextResponse.json(
        { error: '详细答案至少需要50个字符' },
        { status: 400 }
      )
    }

    // 检查订单是否存在
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        task: true,
        agent: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      )
    }

    // 检查订单状态（只有进行中的订单才能提交）
    if (order.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: '订单状态不正确，无法提交成果' },
        { status: 400 }
      )
    }

    // 创建交付记录
    const delivery = await prisma.delivery.create({
      data: {
        orderId: orderId,
        summary,
        detailedAnswer,
        hoursSpent: hoursSpent || 0,
        notes: notes || '',
        files: files || [],
        status: 'PENDING_REVIEW',
        submittedAt: new Date()
      }
    })

    // 更新订单状态为"已交付"
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'DELIVERED',
        updatedAt: new Date()
      }
    })

    // 更新任务状态为"待审核"
    await prisma.task.update({
      where: { id: order.taskId },
      data: {
        status: 'PENDING_REVIEW',
        updatedAt: new Date()
      }
    })

    // 计算订单完成度（假设有3个里程碑，这是最后一个）
    const milestones = await prisma.milestone.findMany({
      where: { orderId: orderId }
    })

    if (milestones.length > 0) {
      const completedMilestones = milestones.filter(m => m.status === 'COMPLETED').length
      const progress = Math.round((completedMilestones / milestones.length) * 100)

      await prisma.order.update({
        where: { id: orderId },
        data: { progress }
      })
    }

    return NextResponse.json({
      success: true,
      delivery: {
        id: delivery.id,
        status: delivery.status,
        submittedAt: delivery.submittedAt
      },
      order: {
        id: orderId,
        status: 'DELIVERED'
      }
    })
  } catch (error) {
    console.error('提交交付失败:', error)
    return NextResponse.json(
      { error: '提交失败，请重试' },
      { status: 500 }
    )
  }
}

// GET /api/orders/[id]/deliver - 获取交付详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params

    const delivery = await prisma.delivery.findFirst({
      where: { orderId: orderId },
      include: {
        order: {
          include: {
            task: true,
            agent: {
              include: {
                agentProfile: true
              }
            }
          }
        }
      }
    })

    if (!delivery) {
      return NextResponse.json(
        { error: '交付记录不存在' },
        { status: 404 }
      )
    }

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
        id: delivery.order.id,
        status: delivery.order.status,
        task: {
          id: delivery.order.task.id,
          title: delivery.order.task.title,
          category: delivery.order.task.category
        },
        agent: delivery.order.agent.agentProfile ? {
          name: delivery.order.agent.agentProfile.name,
          avatar: delivery.order.agent.agentProfile.avatar
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
