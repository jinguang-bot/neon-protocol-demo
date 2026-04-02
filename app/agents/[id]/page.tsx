'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  CheckCircle,
  Mail,
  Globe,
  Wallet,
  Briefcase,
  Calendar,
  MessageCircle,
  TrendingUp,
  Award,
  Users,
  Clock,
  ThumbsUp
} from 'lucide-react'
import Link from 'next/link'

interface Agent {
  id: string
  name: string
  avatar: string
  title: string
  bio: string
  skills: string[]
  rating: number
  totalReviews: number
  completedTasks: number
  responseTime: string
  hourlyRate: number
  verified: {
    email: boolean
    domain: boolean
    web3: boolean
    linkedin: boolean
    github: boolean
  }
  badges: string[]
  portfolio: {
    id: string
    title: string
    description: string
    category: string
    completedAt: string
    rating: number
  }[]
  reviews: {
    id: string
    reviewer: string
    rating: number
    comment: string
    createdAt: string
    organization: string
  }[]
}

export default function AgentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews'>('portfolio')

  useEffect(() => {
    fetchAgentDetail()
  }, [params.id])

  const fetchAgentDetail = async () => {
    try {
      // TODO: 从 API 获取 Agent 详情
      // 模拟数据
      const mockAgent: Agent = {
        id: params.id as string,
        name: 'Dr. Sarah Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        title: 'AI Supply Chain Expert',
        bio: '8+ years of experience in AI-driven supply chain optimization. Specialized in machine learning algorithms for inventory prediction and logistics optimization. Former Google and Amazon engineer.',
        skills: [
          'Machine Learning',
          'Supply Chain',
          'ERP Systems',
          'Python',
          'TensorFlow',
          'Data Analytics',
          'Optimization Algorithms'
        ],
        rating: 4.9,
        totalReviews: 127,
        completedTasks: 89,
        responseTime: '< 2 hours',
        hourlyRate: 150,
        verified: {
          email: true,
          domain: true,
          web3: true,
          linkedin: true,
          github: true
        },
        badges: [
          'Top Performer',
          'Fast Responder',
          'Expert Verified',
          '5-Star Rating'
        ],
        portfolio: [
          {
            id: 'project-1',
            title: 'AI-Driven Inventory Management System',
            description: 'Developed ML model to predict inventory needs with 95% accuracy, reducing stockouts by 40%',
            category: 'Machine Learning',
            completedAt: '2026-03-15',
            rating: 5.0
          },
          {
            id: 'project-2',
            title: 'Supply Chain Optimization Platform',
            description: 'Built real-time supply chain visibility platform, reducing logistics costs by 25%',
            category: 'Supply Chain',
            completedAt: '2026-02-20',
            rating: 4.8
          },
          {
            id: 'project-3',
            title: 'ERP Integration for Manufacturing',
            description: 'Integrated SAP with custom AI modules for predictive maintenance',
            category: 'ERP Integration',
            completedAt: '2026-01-10',
            rating: 4.9
          }
        ],
        reviews: [
          {
            id: 'review-1',
            reviewer: 'John Smith',
            rating: 5.0,
            comment: 'Exceptional work on our supply chain optimization project. Dr. Chen delivered beyond expectations and provided actionable insights that saved us $500K annually.',
            createdAt: '2026-03-20',
            organization: 'Global Manufacturing Corp'
          },
          {
            id: 'review-2',
            reviewer: 'Emily Wang',
            rating: 5.0,
            comment: 'Professional, responsive, and highly skilled. The ML model she developed for us has been running flawlessly for 3 months.',
            createdAt: '2026-03-10',
            organization: 'Tech Logistics Inc'
          },
          {
            id: 'review-3',
            reviewer: 'Michael Roberts',
            rating: 4.8,
            comment: 'Great communication and technical expertise. Delivered the project on time with excellent documentation.',
            createdAt: '2026-02-25',
            organization: 'Smart Factory Solutions'
          }
        ]
      }
      setAgent(mockAgent)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch agent:', error)
      setLoading(false)
    }
  }

  const handleContact = () => {
    // TODO: 实现联系功能（跳转到对话页面）
    alert(`即将联系 ${agent?.name}，对话功能将在下一步实现`)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400/50 text-yellow-400" />)
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-600" />)
      }
    }
    return stars
  }

  const getVerificationBadge = (type: string, verified: boolean) => {
    if (!verified) return null

    const badges: Record<string, { icon: any; label: string; color: string }> = {
      email: { icon: Mail, label: '邮箱验证', color: 'text-blue-400' },
      domain: { icon: Globe, label: '域名验证', color: 'text-purple-400' },
      web3: { icon: Wallet, label: 'Web3验证', color: 'text-orange-400' },
      linkedin: { icon: Users, label: 'LinkedIn', color: 'text-blue-500' },
      github: { icon: Globe, label: 'GitHub', color: 'text-gray-400' }
    }

    const badge = badges[type]
    if (!badge) return null

    const Icon = badge.icon
    return (
      <div key={type} className="flex items-center space-x-2 bg-black/40 px-3 py-2 rounded-lg border border-gray-700">
        <Icon className={`w-4 h-4 ${badge.color}`} />
        <span className="text-sm text-gray-300">{badge.label}</span>
        <CheckCircle className="w-4 h-4 text-green-400" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-2">Agent 未找到</div>
          <Link href="/market" className="text-blue-400 hover:text-blue-300">
            返回市场
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 pointer-events-none" />
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agent Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6"
            >
              {/* Avatar and Basic Info */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-20 h-20 rounded-full border-2 border-blue-500"
                  />
                  <div className="ml-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {agent.name}
                    </h1>
                    <p className="text-gray-400 text-lg mt-1">{agent.title}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {renderStars(agent.rating)}
                        <span className="ml-2 text-white font-semibold">{agent.rating}</span>
                        <span className="ml-2 text-gray-400">({agent.totalReviews} 评价)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {agent.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30 flex items-center"
                  >
                    <Award className="w-4 h-4 mr-1" />
                    {badge}
                  </span>
                ))}
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-blue-400" />
                  简介
                </h2>
                <p className="text-gray-300 leading-relaxed">{agent.bio}</p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">技能</h2>
                <div className="flex flex-wrap gap-2">
                  {agent.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/40 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center text-gray-400 mb-2">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span className="text-sm">完成任务</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{agent.completedTasks}</div>
                </div>

                <div className="bg-black/40 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center text-gray-400 mb-2">
                    <Star className="w-4 h-4 mr-2" />
                    <span className="text-sm">平均评分</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">{agent.rating}</div>
                </div>

                <div className="bg-black/40 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center text-gray-400 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">响应时间</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{agent.responseTime}</div>
                </div>

                <div className="bg-black/40 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center text-gray-400 mb-2">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span className="text-sm">评价数</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{agent.totalReviews}</div>
                </div>
              </div>
            </motion.div>

            {/* Verification Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                认证徽章
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(agent.verified).map(([key, value]) => 
                  getVerificationBadge(key, value)
                )}
              </div>
            </motion.div>

            {/* Tabs: Portfolio & Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6"
            >
              {/* Tab Buttons */}
              <div className="flex space-x-4 mb-6 border-b border-gray-700">
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`pb-3 px-4 font-medium transition-colors ${
                    activeTab === 'portfolio'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  案例展示 ({agent.portfolio.length})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 px-4 font-medium transition-colors ${
                    activeTab === 'reviews'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  用户评价 ({agent.reviews.length})
                </button>
              </div>

              {/* Portfolio Tab */}
              {activeTab === 'portfolio' && (
                <div className="space-y-4">
                  {agent.portfolio.map((project) => (
                    <div
                      key={project.id}
                      className="bg-black/40 border border-gray-700 rounded-lg p-4 hover:border-blue-500/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="text-white font-medium">{project.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3">{project.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded">
                          {project.category}
                        </span>
                        <span className="text-gray-400 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(project.completedAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {agent.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-black/40 border border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-white">{review.reviewer}</div>
                          <div className="text-sm text-gray-400">{review.organization}</div>
                        </div>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-white font-medium">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3">{review.comment}</p>
                      <div className="text-sm text-gray-400 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Contact Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 sticky top-8"
            >
              {/* Rate */}
              <div className="mb-6">
                <div className="text-gray-400 text-sm mb-1">时薪</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  ${agent.hourlyRate}
                  <span className="text-lg text-gray-400">/小时</span>
                </div>
              </div>

              {/* Response Time */}
              <div className="mb-6 flex items-center text-gray-300">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                通常在 {agent.responseTime} 内回复
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleContact}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  联系专家
                </button>
                <button className="w-full py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors">
                  预约咨询
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-3">信任保障</div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-300">
                    <ThumbsUp className="w-4 h-4 mr-2 text-green-400" />
                    高评分专家（{agent.rating}/5.0）
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    完成任务 {agent.completedTasks}+
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    多重认证
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
