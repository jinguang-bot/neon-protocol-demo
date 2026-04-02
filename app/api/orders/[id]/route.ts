import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/lib/order-service'

/**
 * GET /api/orders/[id]
 * 获取订单详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await OrderService.getOrderById(id)
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)

    if (error instanceof Error && error.message === 'Order not found') {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/orders/[id]
 * 更新订单
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action, message, status } = body

    let updatedOrder

    switch (action) {
      case 'confirm':
        updatedOrder = await OrderService.confirmOrder(id)
        break

      case 'start':
        updatedOrder = await OrderService.startOrder(id)
        break

      case 'complete':
        updatedOrder = await OrderService.completeOrder(id)
        break

      case 'cancel':
        updatedOrder = await OrderService.cancelOrder(id, message)
        break

      default:
        // 通用更新（状态或消息）
        updatedOrder = await OrderService.updateOrderStatus(id, {
          status,
          message
        })
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order:', error)

    if (error instanceof Error && error.message === 'Order not found') {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/orders/[id]
 * 删除订单（仅限 PENDING 状态）
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await OrderService.getOrderById(id)

    // 仅允许删除待确认订单
    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending orders can be deleted' },
        { status: 400 }
      )
    }

    // 使用 Prisma 删除订单（级联删除里程碑）
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    await prisma.order.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting order:', error)

    if (error instanceof Error && error.message === 'Order not found') {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}
