import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/orders/[id]/review - 提交审核（平台或需求方）
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const body = await request.json()

    const { 
      reviewerType,  // 'PLATFORM' 或 'CLIENT'
      action,        // 'APPROVE' 或 'REJECT'
      notes 
    } = body

    // 验证必填字段
    if (!reviewerType || !action) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      )
    }

    if (!['PLATFORM', 'CLIENT'].includes(reviewerType)) {
      return NextResponse.json(
        { error: '审核类型必须是 PLATFORM 或 CLIENT' },
        { status: 400 }
      )
    }

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json(
        { error: '操作必须是 APPROVE 或 REJECT' },
        { status: 400 }
      )
    }

    // 检查订单和交付记录是否存在
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        task: true,
        deliveries: {
          orderBy: { submittedAt: 'desc' },
          take: 1
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      )
    }

    if (order.deliveries.length === 0) {
      return NextResponse.json(
        { error: '没有找到交付记录' },
        { status: 404 }
      )
    }

    const delivery = order.deliveries[0]

    // 验证订单状态
    if (order.status !== 'DELIVERED') {
      return NextResponse.json(
        { error: '订单状态不正确，无法审核' },
        { status: 400 }
      )
    }

    // 平台审核
    if (reviewerType === 'PLATFORM') {
      if (delivery.status !== 'PENDING_REVIEW') {
        return NextResponse.json(
          { error: '交付记录不在待审核状态' },
          { status: 400 }
        )
      }

      if (action === 'APPROVE') {
        // 平台通过 - 更新交付状态，等待需求方审核
        await prisma.delivery.update({
          where: { id: delivery.id },
          data: {
            status: 'PLATFORM_APPROVED',
            reviewedAt: new Date(),
            reviewNotes: notes || ''
          }
        })

        // 订单状态保持 DELIVERED，等待需求方审核
        return NextResponse.json({
          success: true,
          message: '平台审核通过，等待需求方验收',
          delivery: {
            id: delivery.id,
            status: 'PLATFORM_APPROVED'
          }
        })
      } else {
        // 平台拒绝 - 退回给专家修改
        await prisma.delivery.update({
          where: { id: delivery.id },
          data: {
            status: 'PLATFORM_REJECTED',
            reviewedAt: new Date(),
            reviewNotes: notes || '审核未通过，请修改后重新提交'
          }
        })

        // 订单状态改回 IN_PROGRESS
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'IN_PROGRESS',
            updatedAt: new Date()
          }
        })

        return NextResponse.json({
          success: true,
          message: '平台审核未通过，已退回给专家',
          delivery: {
            id: delivery.id,
            status: 'PLATFORM_REJECTED'
          }
        })
      }
    }

    // 需求方审核
    if (reviewerType === 'CLIENT') {
      if (delivery.status !== 'PLATFORM_APPROVED') {
        return NextResponse.json(
          { error: '交付记录未通过平台审核，无法进行需求方审核' },
          { status: 400 }
        )
      }

      if (action === 'APPROVE') {
        // 需求方验收通过 - 完成订单
        await prisma.delivery.update({
          where: { id: delivery.id },
          data: {
            status: 'CLIENT_APPROVED',
            clientReviewedAt: new Date(),
            clientReviewNotes: notes || ''
          }
        })

        // 更新订单状态为已完成
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'COMPLETED',
            updatedAt: new Date()
          }
        })

        // 更新任务状态为已完成
        await prisma.task.update({
          where: { id: order.taskId },
          data: {
            status: 'COMPLETED',
            updatedAt: new Date()
          }
        })

        // 更新订单完成度为100%
        await prisma.order.update({
          where: { id: orderId },
          data: { progress: 100 }
        })

        return NextResponse.json({
          success: true,
          message: '需求方验收通过，订单已完成',
          delivery: {
            id: delivery.id,
            status: 'CLIENT_APPROVED'
          },
          order: {
            id: orderId,
            status: 'COMPLETED'
          }
        })
      } else {
        // 需求方拒绝 - 退回给专家修改
        await prisma.delivery.update({
          where: { id: delivery.id },
          data: {
            status: 'CLIENT_REJECTED',
            clientReviewedAt: new Date(),
            clientReviewNotes: notes || '需求方验收未通过，请修改后重新提交'
          }
        })

        // 订单状态改回 IN_PROGRESS
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'IN_PROGRESS',
            updatedAt: new Date()
          }
        })

        return NextResponse.json({
          success: true,
          message: '需求方验收未通过，已退回给专家',
          delivery: {
            id: delivery.id,
            status: 'CLIENT_REJECTED'
          }
        })
      }
    }

    return NextResponse.json(
      { error: '未知的审核类型' },
      { status: 400 }
    )
  } catch (error) {
    console.error('审核失败:', error)
    return NextResponse.json(
      { error: '审核失败，请重试', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// GET /api/orders/[id]/review - 获取审核记录
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        deliveries: {
          orderBy: { submittedAt: 'desc' }
        },
        task: true,
        organization: true,
        agent: {
          include: {
            agentProfile: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      },
      task: {
        id: order.task.id,
        title: order.task.title,
        category: order.task.category,
        description: order.task.description
      },
      organization: {
        id: order.organization.id,
        name: order.organization.name,
        email: order.organization.email
      },
      agent: order.agent.agentProfile ? {
        name: order.agent.agentProfile.name,
        avatar: order.agent.agentProfile.avatar,
        rating: order.agent.agentProfile.rating
      } : null,
      deliveries: order.deliveries.map(d => ({
        id: d.id,
        summary: d.summary,
        status: d.status,
        submittedAt: d.submittedAt,
        reviewedAt: d.reviewedAt,
        reviewNotes: d.reviewNotes,
        clientReviewedAt: d.clientReviewedAt,
        clientReviewNotes: d.clientReviewNotes
      }))
    })
  } catch (error) {
    console.error('获取审核记录失败:', error)
    return NextResponse.json(
      { error: '获取失败，请重试' },
      { status: 500 }
    )
  }
}
