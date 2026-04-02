/**
 * 测试订单服务层
 */

import { OrderService } from './lib/order-service'

async function testOrderService() {
  console.log('🧪 Testing Order Service Layer...\n')

  try {
    // 测试 1: 获取订单列表
    console.log('📋 Test 1: Get Orders List')
    const result = await OrderService.getOrders({ page: 1, limit: 10 })
    console.log(`   Orders: ${result.orders.length}`)
    console.log(`   Pagination: ${JSON.stringify(result.pagination)}\n`)

    // 测试 2: 创建新订单
    console.log('📝 Test 2: Create Order')
    const newOrder = await OrderService.createOrder({
      taskId: 'task-test-123',
      agentId: 'agent-1',
      organizationId: 'org-test-123',
      milestones: [
        {
          title: '需求分析',
          description: '完成需求文档',
          amount: 10000,
          dueDate: new Date('2026-04-10')
        },
        {
          title: '开发阶段',
          description: '完成核心功能开发',
          amount: 20000,
          dueDate: new Date('2026-04-20')
        },
        {
          title: '测试交付',
          description: '完成测试并交付',
          amount: 20000,
          dueDate: new Date('2026-04-30')
        }
      ],
      message: '请按照里程碑完成工作',
      paymentMethod: 'USDC'
    })
    console.log(`   ✅ Order created: ${newOrder.id}`)
    console.log(`   Status: ${newOrder.status}`)
    console.log(`   Total Amount: $${newOrder.totalAmount}`)
    console.log(`   Milestones: ${newOrder.milestones.length}\n`)

    // 测试 3: 获取订单详情
    console.log('🔍 Test 3: Get Order by ID')
    const order = await OrderService.getOrderById(newOrder.id)
    console.log(`   Order ID: ${order.id}`)
    console.log(`   Task: ${order.task.title}`)
    console.log(`   Agent: ${order.agent.name}`)
    console.log(`   Organization: ${order.organization.name}\n`)

    // 测试 4: 更新订单状态
    console.log('✅ Test 4: Update Order Status')
    const confirmed = await OrderService.confirmOrder(newOrder.id)
    console.log(`   Status: ${confirmed.status}\n`)

    const inProgress = await OrderService.startOrder(newOrder.id)
    console.log(`   Status: ${inProgress.status}\n`)

    // 测试 5: 计算订单完成度
    console.log('📊 Test 5: Calculate Order Completion')
    const completion = await OrderService.calculateOrderCompletion(newOrder.id)
    console.log(`   Completion: ${completion}%\n`)

    console.log('✅ All tests passed!\n')
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

testOrderService()
  .catch(console.error)
  .finally(() => {
    process.exit(0)
  })
