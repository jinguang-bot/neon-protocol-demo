/**
 * 资金解锁 API
 * Sprint-07: POST /api/orders/[id]/unlock
 */

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { id: string }
) {
  try {
    const { id: orderId } = await params
    const { transactionHash } = await request.json()

    // 验证订单存在
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        task: true,
        agent: {
          include: {
            agentProfile: true,
          },
        },
        organization: true,
        milestones: {
          orderBy: {
            order: 'asc',
          },
        },
        deliveries: {
          orderBy: {
            submittedAt: 'desc',
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      )
    }

    // 验证订单状态
    if (order.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: '订单状态不正确，只有进行中的订单可以解锁资金' },
        { status: 400 }
      )
    }

    // 验证是否有审核通过的交付成果
    const approvedDelivery = order.deliveries.find(
      (d) => d.status === 'CLIENT_APPROVED'
    )

    if (!approvedDelivery) {
      return NextResponse.json(
        { error: '没有通过需求方审核的交付成果' },
        { status: 400 }
      )
    }

    // 验证里程碑完成情况
    const completedMilestones = order.milestones.filter(
      (m) => m.status === 'COMPLETED'
    )

    if (completedMilestones.length < order.milestones.length) {
      return NextResponse.json(
        { error: `还有 ${order.milestones.length - completedMilestones.length} 个里程碑未完成` },
        { status: 400 }
      )
    }

    // 模拟区块链交易（测试环境 100% 成功率，生产环境 90%）
    const isTestEnv = process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST === 'true'
    const transactionSuccess = isTestEnv ? true : Math.random() < 0.9

    if (!transactionSuccess) {
      return NextResponse.json(
        { error: '区块链交易失败，请稍后重试' },
        { status: 500 }
      )
    }

    // 生成交易哈希
    const txHash = transactionHash || `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`

    const completedAt = new Date()

    // 更新订单状态为 COMPLETED
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
        updatedAt: completedAt,
      },
    })

    // 更新所有里程碑状态为 COMPLETED
    await prisma.milestone.updateMany({
      where: { orderId: orderId },
      data: {
        status: 'COMPLETED',
        completedAt: completedAt,
      },
    })

    // 获取更新后的订单详情
    const updatedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        task: true,
        agent: {
          include: {
            agentProfile: true,
          },
        },
        organization: true,
        milestones: {
          orderBy: {
            order: 'asc',
          },
        },
        deliveries: {
          orderBy: {
            submittedAt: 'desc',
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: '资金解锁成功',
      order: {
        id: updatedOrder!.id,
        status: updatedOrder!.status,
        completedAt: completedAt,
        transactionHash: txHash,
      },
      milestones: updatedOrder!.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        amount: m.amount,
        status: m.status,
      })),
      totalAmount: updatedOrder!.totalAmount,
    })
  } catch (error) {
    console.error('资金解锁失败: ', error)
    return NextResponse.json(
      { error: '资金解锁失败', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { id: string }
) {
  try {
    const { id: orderId } = await params

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        task: true,
        agent: {
          include: {
            agentProfile: true,
          },
        },
        organization: true,
        milestones: {
          orderBy: {
            order: 'asc',
          },
        },
        deliveries: {
          orderBy: {
            submittedAt: 'desc',
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: '订单不存在' },
        { status: 404 }
      )
    }

    // 检查是否可以解锁
    const canUnlock = order.status === 'IN_PROGRESS' &&
      order.deliveries.some((d) => d.status === 'CLIENT_APPROVED')

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        canUnlock,
      },
      task: {
        id: order.task.id,
        title: order.task.title,
        category: order.task.category,
      },
      agent: {
        id: order.agent.id,
        name: order.agent.name,
        title: order.agent.agentProfile?.title || '',
        avatar: order.agent.avatar,
      },
      organization: {
        id: order.organization.id,
        name: order.organization.name,
      },
      milestones: order.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        amount: m.amount,
        status: m.status,
        completedAt: m.completedAt,
      })),
      delivery: order.deliveries[0]
        ? {
            id: order.deliveries[0].id,
            summary: order.deliveries[0].summary,
            submittedAt: order.deliveries[0].submittedAt,
            reviewedAt: order.deliveries[0].reviewedAt,
            clientReviewedAt: order.deliveries[0].clientReviewedAt,
          }
        : null,
    })
  } catch (error) {
    console.error('获取结算详情失败: ', error)
    return NextResponse.json(
      { error: '获取结算详情失败' },
      { status: 500 }
    )
  }
}
