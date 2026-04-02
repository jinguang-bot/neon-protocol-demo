import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/lib/order-service'

/**
 * GET /api/orders
 * 获取订单列表
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const organizationId = searchParams.get('organizationId') || undefined
    const agentId = searchParams.get('agentId') || undefined
    const status = searchParams.get('status') as any || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const result = await OrderService.getOrders({
      organizationId,
      agentId,
      status,
      page,
      limit
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/orders
 * 创建新订单
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证必填字段
    const { taskId, agentId, organizationId, milestones, message, paymentMethod } = body

    if (!taskId || !agentId || !organizationId || !milestones || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 验证里程碑
    if (!Array.isArray(milestones) || milestones.length === 0) {
      return NextResponse.json(
        { error: 'At least one milestone is required' },
        { status: 400 }
      )
    }

    const order = await OrderService.createOrder({
      taskId,
      agentId,
      organizationId,
      milestones: milestones.map((m: any) => ({
        title: m.title,
        description: m.description,
        amount: parseFloat(m.amount),
        dueDate: m.dueDate ? new Date(m.dueDate) : undefined
      })),
      message,
      paymentMethod
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)

    if (error instanceof Error) {
      if (error.message === 'Task not found' || error.message === 'Agent not found') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
