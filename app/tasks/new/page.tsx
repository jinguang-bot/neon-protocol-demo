'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Tag, 
  Upload, 
  Send,
  ArrowLeft,
  Check
} from 'lucide-react'
import Link from 'next/link'

const categories = [
  '半导体供应链',
  '市场分析',
  '技术咨询',
  '产品设计',
  '商业模式',
  '投资尽调'
]

const availableTags = [
  'AI', '芯片', '供应链', '市场调研', '技术架构',
  '产品设计', '商业模式', '投资', '风险评估',
  '竞争分析', '成本优化', '质量管控'
]

export default function NewTaskPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [] as string[],
    budget: '',
    deadline: '',
    attachments: [] as File[]
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }))
  }

  const handleSubmit = async () => {
    // TODO: 提交到 API
    console.log('提交任务:', formData)
    alert('任务创建成功！(演示)')
  }

  const isStep1Valid = formData.title && formData.description && formData.category
  const isStep2Valid = formData.tags.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 背景网格 */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* 顶部导航 */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </Link>
          <div className="h-6 w-px bg-gray-700" />
          <h1 className="text-2xl font-bold text-white">创建新任务</h1>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-500'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: step * 0.1 }}
                >
                  {currentStep > step ? <Check className="w-5 h-5" /> : step}
                </motion.div>
                {step < 3 && (
                  <div className={`w-32 h-1 mx-2 ${
                    currentStep > step ? 'bg-purple-600' : 'bg-gray-800'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>基本信息</span>
            <span>标签与预算</span>
            <span>确认提交</span>
          </div>
        </div>

        {/* 表单内容 */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
        >
          {/* Step 1: 基本信息 */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FileText className="inline w-4 h-4 mr-2" />
                  任务标题 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="例如：评估日系半导体厂商的产能恢复情况"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  任务描述 *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="详细描述任务需求..."
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  任务类别 *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleInputChange('category', cat)}
                      className={`px-4 py-3 rounded-lg border transition-all ${
                        formData.category === cat
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 标签与预算 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Tag className="inline w-4 h-4 mr-2" />
                  技能标签 (至少选择1个)
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        formData.tags.includes(tag)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  已选择 {formData.tags.length} 个标签
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-2" />
                    预算范围 (可选)
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="例如：$500-1000"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    截止日期 (可选)
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Upload className="inline w-4 h-4 mr-2" />
                  附件上传 (可选)
                </label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-10 h-10 mx-auto mb-2 text-gray-500" />
                    <p className="text-gray-400">点击上传文件或拖拽文件到此处</p>
                    <p className="text-sm text-gray-500 mt-1">支持 PDF、Word、Excel 等</p>
                  </label>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                        <FileText className="w-4 h-4" />
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: 确认提交 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">任务摘要</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-500">标题:</span>
                    <span className="font-medium">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">类别:</span>
                    <span className="font-medium">{formData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">标签:</span>
                    <span className="font-medium">{formData.tags.join(', ')}</span>
                  </div>
                  {formData.budget && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">预算:</span>
                      <span className="font-medium">{formData.budget}</span>
                    </div>
                  )}
                  {formData.deadline && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">截止日期:</span>
                      <span className="font-medium">{formData.deadline}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
                <p className="text-sm text-purple-300">
                  ℹ️ 提交后，平台将自动匹配合适的专家 Agent。您将收到 1-5 个候选专家供选择。
                </p>
              </div>
            </div>
          )}

          {/* 底部按钮 */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium ${
                currentStep === 1
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              上一步
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 1 ? !isStep1Valid : !isStep2Valid}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                  (currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid)
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-500'
                }`}
              >
                下一步
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-500 flex items-center gap-2"
              >
                提交任务
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
