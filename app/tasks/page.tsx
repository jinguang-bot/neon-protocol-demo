'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  FileText, 
  DollarSign, 
  Calendar,
  Tag,
  User,
  ChevronRight,
  Plus
} from 'lucide-react'
import Link from 'next/link'

const categories = [
  '全部',
  '半导体供应链',
  '市场分析',
  '技术咨询',
  '产品设计',
  '商业模式',
  '投资尽调'
]

const statusColors: Record<string, string> = {
  'OPEN': 'bg-green-500/20 text-green-400',
  'MATCHED': 'bg-blue-500/20 text-blue-400',
  'IN_PROGRESS': 'bg-yellow-500/20 text-yellow-400',
  'COMPLETED': 'bg-purple-500/20 text-purple-400',
  'CANCELLED': 'bg-gray-500/20 text-gray-400'
}

const statusText: Record<string, string> = {
  'OPEN': '开放中',
  'MATCHED': '已匹配',
  'IN_PROGRESS': '进行中',
  'COMPLETED': '已完成',
  'CANCELLED': '已取消'
}

interface Task {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  budget?: number
  deadline?: string
  status: string
  createdAt: string
  organization: {
    name: string
  }
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [selectedCategory, selectedStatus])

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory && selectedCategory !== '全部') {
        params.append('category', selectedCategory)
      }
      if (selectedStatus) {
        params.append('status', selectedStatus)
      }

      const response = await fetch(`/api/tasks?${params}`)
      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 背景网格 */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* 顶部标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">任务市场</h1>
            <p className="text-gray-400">找到适合你专长的任务</p>
          </div>
          <Link
            href="/tasks/new"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-500 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            创建任务
          </Link>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-6 space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索任务标题或描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* 类别筛选 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-900/50 border border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 状态筛选 */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">状态:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-gray-900/50 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="">全部</option>
              <option value="OPEN">开放中</option>
              <option value="MATCHED">已匹配</option>
              <option value="IN_PROGRESS">进行中</option>
              <option value="COMPLETED">已完成</option>
            </select>
          </div>
        </div>

        {/* 任务列表 */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-700" />
            <p className="text-gray-500 text-lg">没有找到匹配的任务</p>
            <p className="text-gray-600 text-sm mt-2">尝试调整筛选条件</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-purple-700 transition-all cursor-pointer group"
              >
                {/* 任务头部 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                        {statusText[task.status]}
                      </span>
                      <span className="text-xs text-gray-500">{task.category}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {task.title}
                    </h3>
                  </div>
                </div>

                {/* 任务描述 */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {task.description}
                </p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(task.tags as string[]).slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {(task.tags as string[]).length > 3 && (
                    <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded-full text-xs">
                      +{(task.tags as string[]).length - 3}
                    </span>
                  )}
                </div>

                {/* 任务元信息 */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{task.organization.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                    {task.budget && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${task.budget}</span>
                      </div>
                    )}
                    {task.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(task.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 查看详情按钮 */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <button className="w-full flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
                    查看详情
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
