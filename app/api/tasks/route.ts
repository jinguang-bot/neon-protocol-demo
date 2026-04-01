import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../prisma/prisma/client'

const prisma = new PrismaClient()

// GET /api/tasks - 获取任务列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    if (status) where.status = status
    if (category) where.category = category

    const tasks = await prisma.task.findMany({
      where,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            email: true,
            type: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const total = await prisma.task.count({ where })

    return NextResponse.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error: any) {
    console.error('获取任务列表失败:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/tasks - 创建新任务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      orgId,
      title,
      description,
      category,
      tags,
      budget,
      deadline,
      attachments,
      requirements
    } = body

    // 验证必填字段
    if (!orgId || !title || !description || !category || !tags || tags.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: '缺少必填字段: orgId, title, description, category, tags' 
        },
        { status: 400 }
      )
    }

    // 验证组织是否存在
    const org = await prisma.organization.findUnique({
      where: { id: orgId }
    })

    if (!org) {
      return NextResponse.json(
        { success: false, error: '组织不存在' },
        { status: 404 }
      )
    }

    // 创建任务
    const task = await prisma.task.create({
      data: {
        orgId,
        title,
        description,
        category,
        tags: JSON.parse(JSON.stringify(tags)),
        budget: budget ? parseFloat(budget) : null,
        deadline: deadline ? new Date(deadline) : null,
        attachments: attachments ? JSON.parse(JSON.stringify(attachments)) : null,
        requirements: requirements ? JSON.parse(JSON.stringify(requirements)) : null,
        status: 'OPEN'
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            email: true,
            type: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: task,
      message: '任务创建成功'
    }, { status: 201 })

  } catch (error: any) {
    console.error('创建任务失败:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
