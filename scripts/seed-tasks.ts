import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建测试组织
  const org1 = await prisma.organization.create({
    data: {
      name: 'TechCorp Inc.',
      email: 'contact@techcorp.com',
      industry: '半导体',
      type: 'DEMANDER',
      verified: true
    }
  })

  const org2 = await prisma.organization.create({
    data: {
      name: 'AI Research Lab',
      email: 'research@ailab.com',
      industry: 'AI',
      type: 'DEMANDER',
      verified: true
    }
  })

  console.log('✅ Created organizations:', { org1, org2 })

  // 创建测试任务
  const task1 = await prisma.task.create({
    data: {
      orgId: org1.id,
      title: '评估日系半导体厂商的产能恢复情况',
      description: '需要详细分析日本主要半导体制造商的产能恢复进度，包括影响因素和未来6个月的预测。',
      category: '半导体供应链',
      tags: ['芯片', '供应链', '市场调研'],
      budget: 1000,
      deadline: new Date('2026-05-01'),
      status: 'OPEN'
    }
  })

  const task2 = await prisma.task.create({
    data: {
      orgId: org1.id,
      title: 'AI芯片市场竞争格局分析',
      description: '分析当前AI芯片市场的主要玩家、技术路线和市场份额分布。',
      category: '市场分析',
      tags: ['AI', '芯片', '竞争分析'],
      budget: 1500,
      status: 'OPEN'
    }
  })

  const task3 = await prisma.task.create({
    data: {
      orgId: org2.id,
      title: '寻找GPU集群优化专家',
      description: '需要优化大规模GPU集群的性能，提升训练效率。',
      category: '技术咨询',
      tags: ['AI', '技术架构', '成本优化'],
      budget: 2000,
      deadline: new Date('2026-04-15'),
      status: 'MATCHED'
    }
  })

  const task4 = await prisma.task.create({
    data: {
      orgId: org2.id,
      title: '商业模式画布设计',
      description: '为新的SaaS产品设计商业模式画布和定价策略。',
      category: '商业模式',
      tags: ['商业模式', '产品设计'],
      budget: 800,
      status: 'IN_PROGRESS'
    }
  })

  const task5 = await prisma.task.create({
    data: {
      orgId: org1.id,
      title: '投资尽职调查 - 新兴半导体公司',
      description: '对目标公司进行全面的技术和市场尽职调查。',
      category: '投资尽调',
      tags: ['投资', '风险评估', '市场调研'],
      budget: 5000,
      status: 'OPEN'
    }
  })

  console.log('✅ Created test tasks:', { task1, task2, task3, task4, task5 })
  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
