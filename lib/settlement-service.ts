/**
 * 资金结算服务
 * Sprint-07: 资金解锁与结算
 */

import { PrismaClient, OrderStatus, MilestoneStatus } from '@prisma/client'

const prisma = new PrismaClient()

export interface SettlementResult {
  success: boolean
  message: string
  transactionHash?: string
  amount?: number
  completedAt?: Date
  errors?: string[]
}

/**
 * 验证订单是否可以解锁资金
 * 条件：
 * 1. 订单状态为 IN_PROGRESS
 * 2. 存在已通过双重审核的交付成果
 * 3. 所有里程碑已完成
 */
export async function canUnlockFunds(orderId: string): Promise<{
  canUnlock: boolean
  reasons: string[]
}> {
  const reasons: string[] = []

  try {
    // 获取订单及其关联数据
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        deliveries: true,
        milestones: true,
        task: true,
        agent: true,
        organization: true,
      },
    })

    if (!order) {
      reasons.push('订单不存在')
      return { canUnlock: false, reasons }
    }

    // 检查订单状态
    if (order.status !== OrderStatus.IN_PROGRESS) {
      reasons.push(`订单状态不正确（当前：${order.status}，需要：IN_PROGRESS）`)
    }

    // 检查交付成果审核状态
    const approvedDeliveries = order.deliveries.filter(
      (d) => d.status === 'CLIENT_APPROVED'
    )

    if (approvedDeliveries.length === 0) {
      reasons.push('没有通过需求方审核的交付成果')
    }

    // 检查里程碑完成情况
    const completedMilestones = order.milestones.filter(
      (m) => m.status === MilestoneStatus.COMPLETED
    )

    if (completedMilestones.length < order.milestones.length) {
      reasons.push(
        `还有 ${order.milestones.length - completedMilestones.length} 个里程碑未完成`
      )
    }

    const canUnlock = reasons.length === 0

    return { canUnlock, reasons }
  } catch (error) {
    reasons.push(`验证失败：${error instanceof Error ? error.message : '未知错误'}`)
    return { canUnlock: false, reasons }
  }
}

/**
 * 执行资金解锁
 * 1. 验证订单状态
 * 2. 更新订单状态为 COMPLETED
 * 3. 更新所有里程碑为 COMPLETED
 * 4. 模拟区块链交易
 * 5. 记录交易哈希
 */
export async function unlockFunds(orderId: string): Promise<SettlementResult> {
  try {
    // 验证是否可以解锁
    const { canUnlock, reasons } = await canUnlockFunds(orderId)

    if (!canUnlock) {
      return {
        success: false,
        message: '资金解锁条件不满足',
        errors: reasons,
      }
    }

    // 获取订单信息
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        milestones: true,
        agent: {
          include: {
            agentProfile: true,
          },
        },
      },
    })

    if (!order) {
      return {
        success: false,
        message: '订单不存在',
      }
    }

    // 模拟区块链交易（90%成功率）
    const transactionSuccess = Math.random() < 0.9

    if (!transactionSuccess) {
      return {
        success: false,
        message: '区块链交易失败，请稍后重试',
      }
    }

    // 生成模拟交易哈希
    const transactionHash = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`

    const completedAt = new Date()

    // 更新订单状态为 COMPLETED
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.COMPLETED,
        progress: 100,
        updatedAt: completedAt,
      },
    })

    // 更新所有里程碑为 COMPLETED
    await prisma.milestone.updateMany({
      where: { orderId },
      data: {
        status: MilestoneStatus.COMPLETED,
        completedAt,
        updatedAt: completedAt,
      },
    })

    // 更新任务状态为 COMPLETED
    await prisma.task.update({
      where: { id: order.taskId },
      data: {
        status: 'COMPLETED',
        updatedAt: completedAt,
      },
    })

    // 更新 Agent 统计数据
    if (order.agent.agentProfile) {
      await prisma.agentProfile.update({
        where: { userId: order.agentId },
        data: {
          completedTasks: {
            increment: 1,
          },
          updatedAt: completedAt,
        },
      })
    }

    return {
      success: true,
      message: '资金解锁成功',
      transactionHash,
      amount: order.totalAmount,
      completedAt,
    }
  } catch (error) {
    return {
      success: false,
      message: `资金解锁失败：${error instanceof Error ? error.message : '未知错误'}`,
    }
  }
}

/**
 * 获取订单结算详情
 */
export async function getSettlementDetails(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        task: {
          include: {
            organization: true,
          },
        },
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
      return null
    }

    // 计算里程碑完成情况
    const completedMilestones = order.milestones.filter(
      (m) => m.status === MilestoneStatus.COMPLETED
    )

    // 获取最新审核通过的交付成果
    const approvedDelivery = order.deliveries.find(
      (d) => d.status === 'CLIENT_APPROVED'
    )

    return {
      order: {
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        progress: order.progress,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
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
      milestones: {
        total: order.milestones.length,
        completed: completedMilestones.length,
        items: order.milestones.map((m) => ({
          id: m.id,
          title: m.title,
          amount: m.amount,
          status: m.status,
          completedAt: m.completedAt,
        })),
      },
      delivery: approvedDelivery
        ? {
            id: approvedDelivery.id,
            summary: approvedDelivery.summary,
            submittedAt: approvedDelivery.submittedAt,
            reviewedAt: approvedDelivery.reviewedAt,
            clientReviewedAt: approvedDelivery.clientReviewedAt,
          }
        : null,
      canUnlock: order.status === OrderStatus.IN_PROGRESS && !!approvedDelivery,
    }
  } catch (error) {
    console.error('获取结算详情失败：', error)
    return null
  }
}
