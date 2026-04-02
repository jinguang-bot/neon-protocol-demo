/**
 * 订单服务层
 * 处理订单相关的业务逻辑
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface CreateOrderInput {
  taskId: string
  agentId: string
  organizationId: string
  milestones: {
    title: string
    description: string
    amount: number
    dueDate?: Date
  }[]
  message?: string
  paymentMethod: string
}

export interface UpdateOrderInput {
  status?: string
  message?: string
}

export class OrderService {
  /**
   * 创建新订单
   */
  static async createOrder(input: CreateOrderInput) {
    const { taskId, agentId, organizationId, milestones, message, paymentMethod } = input

    // 验证任务存在
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    })

    if (!task) {
      throw new Error('Task not found')
    }

    // 验证 Agent 存在（通过 userId 查找 AgentProfile）
    const agent = await prisma.agentProfile.findFirst({
      where: { userId: agentId }
    })

    if (!agent) {
      throw new Error('Agent not found')
    }

    // 计算总金额
    const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0)

    // 创建订单
    const order = await prisma.order.create({
      data: {
        taskId,
        agentId,
        organizationId,
        totalAmount,
        status: 'PENDING',
        paymentMethod: paymentMethod as any,
        message,
        milestones: {
          create: milestones.map((m, index) => ({
            title: m.title,
            description: m.description,
            amount: m.amount,
            dueDate: m.dueDate || null,
            status: 'PENDING',
            order: index
          }))
        }
      },
      include: {
        task: true,
        agent: {
          include: {
            organization: true,
            agentProfile: true
          }
        },
        organization: true,
        milestones: true
      }
    })

    return order
  }

  /**
   * 获取订单详情
   */
  static async getOrderById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        task: true,
        agent: {
          include: {
            organization: true,
            agentProfile: true
          }
        },
        organization: true,
        milestones: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    return order
  }

  /**
   * 获取订单列表
   */
  static async getOrders(filters: {
    organizationId?: string
    agentId?: string
    status?: string
    page?: number
    limit?: number
  }) {
    const { organizationId, agentId, status, page = 1, limit = 10 } = filters

    const where: any = {}
    if (organizationId) where.organizationId = organizationId
    if (agentId) where.agentId = agentId
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          task: true,
          agent: {
            include: {
              organization: true,
              agentProfile: true
            }
          },
          organization: true,
          milestones: {
            orderBy: {
              order: 'asc'
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.order.count({ where })
    ])

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * 更新订单状态
   */
  static async updateOrderStatus(id: string, input: UpdateOrderInput) {
    const { status, message } = input

    // 验证订单存在
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    })

    if (!existingOrder) {
      throw new Error('Order not found')
    }

    // 更新订单
    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status: status as any }),
        ...(message && { message }),
        updatedAt: new Date()
      },
      include: {
        task: true,
        agent: {
          include: {
            organization: true,
            agentProfile: true
          }
        },
        organization: true,
        milestones: true
      }
    })

    return order
  }

  /**
   * 确认订单（Agent 接受）
   */
  static async confirmOrder(id: string) {
    return this.updateOrderStatus(id, {
      status: 'CONFIRMED'
    })
  }

  /**
   * 开始执行订单
   */
  static async startOrder(id: string) {
    return this.updateOrderStatus(id, {
      status: 'IN_PROGRESS'
    })
  }

  /**
   * 完成订单
   */
  static async completeOrder(id: string) {
    return this.updateOrderStatus(id, {
      status: 'COMPLETED'
    })
  }

  /**
   * 取消订单
   */
  static async cancelOrder(id: string, reason?: string) {
    return this.updateOrderStatus(id, {
      status: 'CANCELLED',
      message: reason
    })
  }

  /**
   * 更新里程碑状态
   */
  static async updateMilestoneStatus(
    orderId: string,
    milestoneId: string,
    status: string
  ) {
    const milestone = await prisma.milestone.update({
      where: {
        id: milestoneId
      },
      data: {
        status: status as any,
        ...(status === 'COMPLETED' && { completedAt: new Date() })
      }
    })

    return milestone
  }

  /**
   * 计算订单完成度
   */
  static async calculateOrderCompletion(orderId: string) {
    const order = await this.getOrderById(orderId)

    if (order.milestones.length === 0) {
      return 0
    }

    const completedMilestones = order.milestones.filter(
      m => m.status === 'COMPLETED'
    ).length

    return (completedMilestones / order.milestones.length) * 100
  }
}
