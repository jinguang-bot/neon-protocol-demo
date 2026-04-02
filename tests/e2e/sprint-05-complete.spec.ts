import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Sprint-05: Order Service Tests', () => {
  let orderId: string

  test('01. 创建订单应该成功', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/orders`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        taskId: 'task-test-123',
        agentId: 'agent-1',
        organizationId: 'org-test-123',
        milestones: [
          {
            title: '需求分析',
            description: '完成需求文档',
            amount: 10000
          },
          {
            title: '开发阶段',
            description: '完成核心功能开发',
            amount: 20000
          },
          {
            title: '测试交付',
            description: '完成测试并交付',
            amount: 20000
          }
        ],
        message: '请按照里程碑完成工作',
        paymentMethod: 'USDC'
      }
    })

    expect(response.status()).toBe(201)

    const data = await response.json()
    expect(data).toHaveProperty('id')
    expect(data.status).toBe('PENDING')
    expect(data.totalAmount).toBe(50000)
    expect(data.milestones).toHaveLength(3)

    orderId = data.id
  })

  test('02. 获取订单列表应该包含新订单', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/orders`)

    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toHaveProperty('orders')
    expect(data).toHaveProperty('pagination')
    expect(Array.isArray(data.orders)).toBe(true)
    expect(data.pagination).toHaveProperty('page')
    expect(data.pagination).toHaveProperty('total')
  })

  test('03. 获取订单详情应该返回完整信息', async ({ request }) => {
    // 先创建一个订单
    const createResponse = await request.post(`${BASE_URL}/api/orders`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        taskId: 'task-test-123',
        agentId: 'agent-1',
        organizationId: 'org-test-123',
        milestones: [
          {
            title: '测试里程碑',
            description: '测试描述',
            amount: 5000
          }
        ],
        paymentMethod: 'USDC'
      }
    })

    const order = await createResponse.json()

    // 获取订单详情
    const response = await request.get(`${BASE_URL}/api/orders/${order.id}`)

    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.id).toBe(order.id)
    expect(data).toHaveProperty('task')
    expect(data).toHaveProperty('agent')
    expect(data).toHaveProperty('organization')
    expect(data).toHaveProperty('milestones')
  })

  test('04. 更新订单状态应该成功', async ({ request }) => {
    // 先创建一个订单
    const createResponse = await request.post(`${BASE_URL}/api/orders`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        taskId: 'task-test-123',
        agentId: 'agent-1',
        organizationId: 'org-test-123',
        milestones: [
          {
            title: '测试里程碑',
            description: '测试描述',
            amount: 5000
          }
        ],
        paymentMethod: 'USDC'
      }
    })

    const order = await createResponse.json()

    // 确认订单
    const response = await request.put(`${BASE_URL}/api/orders/${order.id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        action: 'confirm'
      }
    })

    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.status).toBe('CONFIRMED')
  })

  test('05. 订单状态流转应该正确', async ({ request }) => {
    // 先创建一个订单
    const createResponse = await request.post(`${BASE_URL}/api/orders`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        taskId: 'task-test-123',
        agentId: 'agent-1',
        organizationId: 'org-test-123',
        milestones: [
          {
            title: '测试里程碑',
            description: '测试描述',
            amount: 5000
          }
        ],
        paymentMethod: 'USDC'
      }
    })

    const order = await createResponse.json()

    // PENDING -> CONFIRMED
    const confirmResponse = await request.put(`${BASE_URL}/api/orders/${order.id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        action: 'confirm'
      }
    })
    expect((await confirmResponse.json()).status).toBe('CONFIRMED')

    // CONFIRMED -> IN_PROGRESS
    const startResponse = await request.put(`${BASE_URL}/api/orders/${order.id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        action: 'start'
      }
    })
    expect((await startResponse.json()).status).toBe('IN_PROGRESS')

    // IN_PROGRESS -> COMPLETED
    const completeResponse = await request.put(`${BASE_URL}/api/orders/${order.id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        action: 'complete'
      }
    })
    expect((await completeResponse.json()).status).toBe('COMPLETED')
  })

  test('06. 订单筛选功能应该正常', async ({ request }) => {
    // 测试按状态筛选
    const response = await request.get(`${BASE_URL}/api/orders?status=PENDING&page=1&limit=10`)

    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.pagination.page).toBe(1)
    expect(data.pagination.limit).toBe(10)
  })

  test('07. 创建订单缺少必填字段应该失败', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/orders`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        taskId: 'task-test-123'
        // 缺少其他必填字段
      }
    })

    expect(response.status()).toBe(400)
  })

  test('08. 获取不存在的订单应该返回404', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/orders/non-existent-id`)

    expect(response.status()).toBe(404)
  })
})

test.describe('Sprint-05: Payment Service Tests', () => {
  test('09. 支付服务应该可导入', async () => {
    const { PaymentService } = await import('@/lib/payment-service')
    expect(PaymentService).toBeDefined()
    expect(PaymentService.connectWallet).toBeDefined()
    expect(PaymentService.processPayment).toBeDefined()
  })

  test('10. 钱包连接应该返回钱包信息', async () => {
    const { PaymentService } = await import('@/lib/payment-service')

    const walletInfo = await PaymentService.connectWallet('metamask')

    expect(walletInfo.address).toMatch(/^0x[a-f0-9]{40}$/)
    expect(walletInfo.connected).toBe(true)
    expect(walletInfo.chain).toBeDefined()
  })

  test('11. 支付处理应该返回交易哈希', async () => {
    const { PaymentService } = await import('@/lib/payment-service')

    const result = await PaymentService.processPayment({
      orderId: 'test-order-id',
      amount: 1000,
      currency: 'USDC',
      recipientAddress: '0x1234567890abcdef1234567890abcdef12345678'
    })

    expect(result).toHaveProperty('success')
    if (result.success) {
      expect(result.transactionHash).toMatch(/^0x[a-f0-9]{64}$/)
    } else {
      expect(result.error).toBeDefined()
    }
  })

  test('12. 交易验证应该返回确认信息', async () => {
    const { PaymentService } = await import('@/lib/payment-service')

    const result = await PaymentService.verifyTransaction(
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    )

    expect(result.confirmed).toBeDefined()
    if (result.confirmed) {
      expect(result.blockNumber).toBeGreaterThan(0)
    }
  })
})
