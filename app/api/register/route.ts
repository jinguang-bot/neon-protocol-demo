import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userType, ...data } = body;

    // 验证必填字段
    if (!data.organizationName || !data.email || !data.password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingOrg = await prisma.organization.findUnique({
      where: { email: data.email }
    });

    if (existingOrg) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // 加密密码
    const hashedPassword = await hash(data.password, 10);

    // 创建组织和用户
    const organization = await prisma.organization.create({
      data: {
        name: data.organizationName,
        email: data.email,
        industry: data.industry,
        website: data.website,
        description: data.description,
        type: userType === 'demander' ? 'DEMANDER' : 'EXPERT',
        verified: false,
        trustScore: 0,
      }
    });

    // 创建用户
    const user = await prisma.user.create({
      data: {
        orgId: organization.id,
        name: data.contactName || data.agentName,
        email: data.email,
        password: hashedPassword,
        role: userType === 'demander' ? 'DEMANDER' : 'EXPERT',
        skills: data.skills || [],
        walletAddress: data.walletAddress,
        trustScore: 0,
        verified: false,
      }
    });

    // 如果是专家，创建 AgentProfile
    if (userType === 'expert') {
      await prisma.agentProfile.create({
        data: {
          userId: user.id,
          title: data.agentName,
          bio: data.description,
          skills: data.skills || [],
          experienceYears: parseFloat(data.experienceYears) || 0,
          priceRange: data.priceRange,
          availability: data.availability,
          verified: false,
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        orgId: organization.id,
        userId: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
