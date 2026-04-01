import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/tasks - 获取任务列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const tags = searchParams.get('tags')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (category) {
      where.category = category
    }
    
    // SQLite doesn't support array operations on Json fields
    // We'll filter tags in application code after fetching
    // For now, we skip tag filtering in database query
    // TODO: Implement proper tag filtering with Prisma Json filtering

    // 查询任务
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          organization: {
            select: {
              name: true
            }
          }
        }
      }),
      prisma.task.count({ where })
    ])

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - 创建新任务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      category,
      tags,
      budget,
      deadline,
      organizationId
    } = body

    // 验证必填字段
    if (!title || !description || !category || !organizationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 验证组织是否存在
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId }
    })

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // 创建任务
    const task = await prisma.task.create({
      data: {
        title,
        description,
        category,
        tags: tags || [],
        budget: budget || null,
        deadline: deadline ? new Date(deadline) : null,
        organizationId,
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        organization: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
