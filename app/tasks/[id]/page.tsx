'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Star,
  Building,
  Mail,
  Briefcase,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

interface Task {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  budget: number
  deadline: string
  status: 'open' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: string
  organization: {
    id: string
    name: string
    email: string
  }
}

interface MatchedAgent {
  id: string
  name: string
  avatar: string
  title: string
  skills: string[]
  rating: number
  completedTasks: number
  matchScore: number
  matchReasons: string[]
  verified: boolean
  hourlyRate?: number
}

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [matchedAgents, setMatchedAgents] = useState<MatchedAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState<MatchedAgent | null>(null)

  useEffect(() => {
    fetchTaskDetail()
    fetchMatchedAgents()
  }, [params.id])

  const fetchTaskDetail = async () => {
    try {
      // TODO: 从 API 获取任务详情
      // 模拟数据
      const mockTask: Task = {
        id: params.id as string,
        title: '开发基于 AI 的供应链优化系统',
        description: '我们需要开发一个 AI 驱动的供应链优化系统，用于预测库存需求、优化运输路线、降低运营成本。系统需要集成现有的 ERP 系统，并提供实时数据分析和可视化功能。',
        category: 'Manufacturing',
        tags: ['AI', 'Machine Learning', 'Supply Chain', 'ERP Integration'],
        budget: 50000,
        deadline: '2026-05-01',
        status: 'open',
        createdAt: '2026-04-01',
        organization: {
          id: 'org-1',
          name: 'Global Manufacturing Corp',
          email: 'contact@globalmanufacturing.com'
        }
      }
      setTask(mockTask)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch task:', error)
      setLoading(false)
    }
  }

  const fetchMatchedAgents = async () => {
    try {
      const response = await fetch(`/api/tasks/${params.id}/match`)
      if (response.ok) {
        const data = await response.json()
        setMatchedAgents(data.agents || [])
      } else {
        // 使用模拟数据
        const mockAgents: MatchedAgent[] = [
          {
            id: 'agent-1',
            name: 'Dr. Sarah Chen',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            title: 'AI Supply Chain Expert',
            skills: ['Machine Learning', 'Supply Chain', 'ERP Systems', 'Python'],
            rating: 4.9,
            completedTasks: 127,
            matchScore: 98,
            matchReasons: [
              '技能完全匹配',
              '相关经验 8+ 年',
              '评分 4.9/5.0'
            ],
            verified: true,
            hourlyRate: 150
          },
          {
            id: 'agent-2',
            name: 'Michael Roberts',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
            title: 'Manufacturing AI Consultant',
            skills: ['AI', 'Manufacturing', 'Data Analytics'],
            rating: 4.7,
            completedTasks: 89,
            matchScore: 94,
            matchReasons: [
              '技能高度匹配',
              '制造业专家',
              '已完成类似项目'
            ],
            verified: true,
            hourlyRate: 120
          },
          {
            id: 'agent-3',
            name: 'Lisa Wang',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
            title: 'ERP Integration Specialist',
            skills: ['ERP', 'System Integration', 'Python'],
            rating: 4.6,
            completedTasks: 64,
            matchScore: 91,
            matchReasons: [
              'ERP 集成专家',
              '技术栈匹配',
              '响应速度快'
            ],
            verified: false,
            hourlyRate: 100
          }
        ]
        setMatchedAgents(mockAgents)
      }
    } catch (error) {
      console.error('Failed to fetch matched agents:', error)
    }
  }

  const handleHireAgent = (agent: MatchedAgent) => {
    setSelectedAgent(agent)
    // TODO: 跳转到订单创建页面
    alert(`即将雇佣 ${agent.name}，订单功能将在下一步实现`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-green-400 bg-green-400/10'
      case 'in-progress':
        return 'text-blue-400 bg-blue-400/10'
      case 'completed':
        return 'text-purple-400 bg-purple-400/10'
      case 'cancelled':
        return 'text-red-400 bg-red-400/10'
      default:
        return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return '待匹配'
      case 'in-progress':
        return '进行中'
      case 'completed':
        return '已完成'
      case 'cancelled':
        return '已取消'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <div className="text-white text-xl mb-2">任务未找到</div>
          <Link href="/tasks" className="text-blue-400 hover:text-blue-300">
            返回任务列表
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
            返回任务列表
          </button>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  {getStatusText(task.status)}
                </span>
                <span className="text-gray-400 text-sm">
                  任务 ID: {task.id}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {task.title}
              </h1>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-blue-400" />
                任务详情
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                {task.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Task Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/40 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center text-gray-400 mb-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="text-sm">预算</span>
                  </div>
                  <div className="text-xl font-bold text-green-400">
                    ${task.budget.toLocaleString()}
                  </div>
                </div>

                <div className="bg-black/40 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center text-gray-400 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">截止日期</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {new Date(task.deadline).toLocaleDateString('zh-CN')}
                  </div>
                </div>

                <div className="bg-black/40 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center text-gray-400 mb-2">
                    <Tag className="w-4 h-4 mr-2" />
                    <span className="text-sm">类别</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {task.category}
                  </div>
                </div>

                <div className="bg-black/40 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center text-gray-400 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">创建时间</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {new Date(task.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Organization Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-purple-400" />
                发布方信息
              </h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {task.organization.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-white">{task.organization.name}</div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Mail className="w-4 h-4 mr-1" />
                      {task.organization.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  已验证
                </div>
              </div>
            </motion.div>
          </div>

          {/* Matched Agents */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 sticky top-8"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                推荐专家
              </h2>
              <div className="text-sm text-gray-400 mb-4">
                Top {matchedAgents.length} 位匹配专家
              </div>

              {/* Agent Cards */}
              <div className="space-y-4">
                {matchedAgents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-black/40 border border-gray-700 rounded-lg p-4 hover:border-blue-500/50 transition-all"
                  >
                    {/* Match Score */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                          {agent.matchScore}%
                        </div>
                        <div className="text-sm text-gray-400 ml-2">匹配度</div>
                      </div>
                      {agent.verified && (
                        <div className="flex items-center text-green-400 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          已验证
                        </div>
                      )}
                    </div>

                    {/* Agent Info */}
                    <div className="flex items-start mb-3">
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">{agent.name}</div>
                        <div className="text-sm text-gray-400 truncate">{agent.title}</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div className="flex items-center text-gray-300">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        {agent.rating}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <User className="w-4 h-4 text-blue-400 mr-1" />
                        {agent.completedTasks} 任务
                      </div>
                      {agent.hourlyRate && (
                        <div className="flex items-center text-gray-300 col-span-2">
                          <DollarSign className="w-4 h-4 text-green-400 mr-1" />
                          ${agent.hourlyRate}/小时
                        </div>
                      )}
                    </div>

                    {/* Match Reasons */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-400 mb-2">匹配原因:</div>
                      <div className="space-y-1">
                        {agent.matchReasons.map((reason, i) => (
                          <div key={i} className="flex items-start text-xs text-gray-300">
                            <CheckCircle className="w-3 h-3 mr-1 mt-0.5 text-green-400" />
                            {reason}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {agent.skills.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {agent.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                          +{agent.skills.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleHireAgent(agent)}
                      className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
                    >
                      雇佣此专家
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* View All Agents */}
              <button className="w-full mt-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors">
                查看所有专家
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
