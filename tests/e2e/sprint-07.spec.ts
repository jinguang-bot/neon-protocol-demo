/**
 * Sprint-07 E2E 测试
 * 完整业务流程: 任务创建 → Agent 匹配 → 订单创建 → 交付提交 → 审核 → 资金解锁
 */

import { test, expect, describe, beforeAll, afterAll } from '@playwright/test'

import { PrismaClient } from '@prisma/client'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

const prisma = new PrismaClient()

// 辅助函数: 创建测试数据
async function setupTestData() {
  // 创建测试组织
  const org = await prisma.organization.create({
    data: {
      name: 'Test Org',
      email: `test-org-${Date.now()}@example.com`,
      industry: 'Technology',
      type: 'DEMANDER',
    },
  })

  // 创建测试用户
  const demander = await prisma.user.create({
    data: {
      orgId: org.id,
      name: 'Test Demander',
      email: `demander-${Date.now()}@example.com`,
      password: 'password123',
      role: 'DEMANDER',
    },
  })

  const agent = await prisma.user.create({
    data: {
      orgId: org.id,
      name: 'Test Agent',
      email: `agent-${Date.now()}@example.com`,
      password: 'password123',
      role: 'EXPERT',
    },
  })

  // 创建 Agent Profile
  await prisma.agentProfile.create({
    data: {
      userId: agent.id,
      title: 'AI Expert',
      bio: 'Expert in manufacturing AI',
      skills: ['AI', 'Machine Learning', 'Manufacturing'],
      experienceYears: 5,
      rating: 4.8,
      verified: true,
    },
  })

  // 创建测试任务
  const task = await prisma.task.create({
    data: {
      orgId: org.id,
      title: 'Test Task - AI Optimization',
      description: 'Need help optimizing manufacturing process',
      category: 'AI/ML',
      tags: ['AI', 'Manufacturing'],
      budget: 50000,
      deadline: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      status: 'OPEN',
    },
  })

  // 创建测试订单
  const order = await prisma.order.create({
    data: {
      taskId: task.id,
      agentId: agent.id,
      organizationId: org.id,
      status: 'PENDING',
      totalAmount: 50000,
      paymentMethod: 'USDC',
    },
  })

  // 创建测试里程碑
  await prisma.milestone.createMany({
    data: [
      {
        orderId: order.id,
        title: 'Milestone 1',
        description: 'First milestone',
        amount: 20000,
        order: 1,
      },
      {
        orderId: order.id,
        title: 'Milestone 2',
        description: 'Second milestone',
        amount: 20000,
        order: 2,
      },
      {
        orderId: order.id,
        title: 'Milestone 3',
        description: 'Final milestone',
        amount: 10000,
        order: 3,
      },
    ],
  })

  // 创建测试交付成果
  const delivery = await prisma.delivery.create({
    data: {
      orderId: order.id,
      summary: 'Delivered AI optimization solution',
      detailedAnswer: 'Successfully implemented AI solution with 95%+ accuracy',
      hoursSpent: 8,
      notes: 'Initial delivery',
      status: 'PENDING_REVIEW',
    },
  })

  // 更新订单状态为 IN_PROGRESS
  await prisma.order.update({
    where: { id: order.id },
    data: { status: 'IN_PROGRESS' },
  })

  return { org, demander, agent, task, order, delivery }
}

describe('Sprint-07 Complete business flow', () => {
  let testData: any

  beforeAll(async () => {
    testData = await setupTestData()
  })

  afterAll(async () => {
    // 清理测试数据
    await prisma.delivery.deleteMany({
      where: { orderId: testData.order.id },
    })
    await prisma.milestone.deleteMany({
      where: { orderId: testData.order.id },
    })
    await prisma.order.delete({
      where: { id: testData.order.id },
    })
    await prisma.task.delete({
      where: { id: testData.task.id },
    })
    await prisma.agentProfile.delete({
      where: { userId: testData.agent.id },
    })
    await prisma.user.deleteMany({
      where: { orgId: testData.org.id },
    })
    await prisma.organization.delete({
      where: { id: testData.org.id },
    })
  })

  test('should complete full business flow', async () => {
    const { order, delivery } = testData

    // 1. 平台审核通过
    await prisma.delivery.update({
      where: { id: delivery.id },
      data: {
        status: 'PLATFORM_APPROVED',
        reviewedAt: new Date(),
        reviewNotes: 'Platform approved: great work!',
      },
    })

    // 2. 需求方审核通过
    await prisma.delivery.update({
      where: { id: delivery.id },
      data: {
        status: 'CLIENT_APPROVED',
        clientReviewedAt: new Date(),
        clientReviewNotes: 'Client approved: excellent work!',
      },
    })

    // 2.5. 完成所有里程碑
    await prisma.milestone.updateMany({
      where: { orderId: order.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    })

    // 3. 解锁资金
    const unlockResponse = await fetch(`${BASE_URL}/api/orders/${order.id}/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    // 调试：打印响应状态和详情
    console.log('Unlock Response Status:', unlockResponse.status)
    const responseText = await unlockResponse.text()
    console.log('Unlock Response Body:', responseText)
    
    // 重新解析 JSON
    const unlockData = JSON.parse(responseText)
    
    // 验证响应
    expect(unlockResponse.status).toBe(200)
    expect(unlockData.success).toBe(true)
    expect(unlockData.order.transactionHash).toBeDefined()
    expect(unlockData.order.status).toBe('COMPLETED')

    // 4. 验证订单状态
    const finalOrder = await prisma.order.findUnique({
      where: { id: order.id },
    })
    expect(finalOrder!.status).toBe('COMPLETED')

  })
})
