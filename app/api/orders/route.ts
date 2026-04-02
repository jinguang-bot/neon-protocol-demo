import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/orders - 获取订单列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const organizationId = searchParams.get('organizationId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) {
      where.status = status
    }
    if (organizationId) {
      where.organizationId = organizationId
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          task: {
            select: {
              id: true,
              title: true,
              budget: true
            }
          },
          agent: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          organization: {
            select: {
              id: true,
              name: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.order.count({ where })
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - 创建新订单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      taskId,
      agentId,
      organizationId,
      message,
      milestones
    } = body

    // 验证必填字段
    if (!taskId || !agentId || !organizationId) {
      return NextResponse.json(
        { error: 'Missing required fields: taskId, agentId, organizationId' },
        { status: 400 }
      )
    }

    // 验证里程碑
    if (!milestones || !Array.isArray(milestones) || milestones.length === 0) {
      return NextResponse.json(
        { error: 'At least one milestone is required' },
        { status: 400 }
      )
    }

    // 计算总金额
    const totalAmount = milestones.reduce((sum: number, m: any) => sum + m.amount, 0)

    // 创建订单
    const order = await prisma.order.create({
      data: {
        taskId,
        agentId,
        organizationId,
        status: 'pending',
        totalAmount,
        message,
        milestones: {
          create: milestones.map((m: any, index: number) => ({
            title: m.title,
            description: m.description,
            amount: m.amount,
            dueDate: new Date(m.dueDate),
            status: 'pending',
            order: index
          }))
        }
      },
      include: {
        task: true,
        agent: true,
        organization: true,
        milestones: true
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Failed to create order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
