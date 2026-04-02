import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始填充测试数据...')

  // 清理现有数据
  await prisma.order.deleteMany()
  await prisma.task.deleteMany()
  await prisma.agentProfile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()

  // 创建测试组织
  const org = await prisma.organization.create({
    data: {
      id: 'org-test-123',
      name: 'Test Company',
      email: 'test@company.com',
      industry: 'Technology'
    }
  })
  console.log('✅ 创建组织:', org.name)

  // 创建测试用户（需求方）
  const hashedPassword = await bcrypt.hash('password123', 10)
  const demanderUser = await prisma.user.create({
    data: {
      id: 'user-demander-123',
      orgId: org.id,
      email: 'demander@test.com',
      name: 'Test Demander',
      password: hashedPassword,
      role: 'DEMANDER'
    }
  })
  console.log('✅ 创建需求方用户:', demanderUser.name)

  // 创建测试专家用户
  const expertUsers = []
  for (let i = 1; i <= 5; i++) {
    const expertUser = await prisma.user.create({
      data: {
        id: `user-expert-${i}`,
        orgId: org.id,
        email: `expert${i}@test.com`,
        name: `Expert ${i}`,
        password: hashedPassword,
        role: 'EXPERT'
      }
    })

    // 创建专家资料
    const agentProfile = await prisma.agentProfile.create({
      data: {
        id: `agent-${i}`,
        userId: expertUser.id,
        title: `AI Expert ${i}`,
        bio: `Experienced AI expert ${i} with ${5 + i * 2} years of experience`,
        skills: ['AI', 'Machine Learning', 'Data Science'],
        rating: 4.0 + (i * 0.2),
        completedTasks: 10 + i * 5,
        priceRange: '$50-150/hr',
        verified: true
      }
    })

    expertUsers.push({ user: expertUser, profile: agentProfile })
    console.log(`✅ 创建专家 ${i}:`, expertUser.name)
  }

  // 创建测试任务
  const task = await prisma.task.create({
    data: {
      id: 'task-test-123',
      orgId: org.id,
      title: 'AI Model Development',
      description: 'Need an expert to develop a custom AI model for image classification',
      category: 'AI',
      budget: 5000,
      status: 'OPEN',
      tags: ['AI', 'Machine Learning'],
      requirements: {
        skills: ['Python', 'TensorFlow', 'Computer Vision'],
        experience: '3+ years'
      }
    }
  })
  console.log('✅ 创建任务:', task.title)

  console.log('🎉 测试数据填充完成！')
  console.log('\n📊 数据统计:')
  console.log(`  - 组织: 1`)
  console.log(`  - 需求方用户: 1`)
  console.log(`  - 专家用户: 5`)
  console.log(`  - 任务: 1`)
}

main()
  .catch((e) => {
    console.error('❌ 填充数据失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
