'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Upload, 
  AlertCircle,
  ChevronRight,
  Save,
  Send
} from 'lucide-react'

interface DeliverFormData {
  summary: string
  detailedAnswer: string
  files: File[]
  hoursSpent: number
  notes: string
}

export default function DeliverPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<DeliverFormData>({
    summary: '',
    detailedAnswer: '',
    files: [],
    hoursSpent: 0,
    notes: ''
  })
  
  // Mock order data
  const order = {
    id: orderId,
    task: {
      title: '生产线效率优化咨询',
      category: '工业工程',
      budget: 50000
    },
    agent: {
      name: '张博士',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=agent-1',
      hourlyRate: 150
    },
    createdAt: '2026-04-01',
    deadline: '2026-04-05'
  }

  const steps = [
    { id: 1, title: '填写摘要', icon: FileText },
    { id: 2, title: '详细答案', icon: FileText },
    { id: 3, title: '上传附件', icon: Upload },
    { id: 4, title: '确认提交', icon: Send }
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('成果提交成功！等待平台审核。')
    router.push(`/orders/${orderId}`)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.summary.length >= 10
      case 2:
        return formData.detailedAnswer.length >= 50
      case 3:
        return true // Files are optional
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950/20 to-gray-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10" 
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.15) 1px, transparent 0)' }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">提交成果</h1>
          <p className="text-gray-400">订单 ID: {orderId}</p>
        </motion.div>

        {/* Order Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 border border-blue-500/20 rounded-xl p-6 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {/* Task Info */}
            <div>
              <p className="text-sm text-gray-400 mb-1">任务标题</p>
              <p className="text-white font-medium">{order.task.title}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                {order.task.category}
              </span>
            </div>

            {/* Budget & Deadline */}
            <div>
              <p className="text-sm text-gray-400 mb-1">预算 & 截止日期</p>
              <p className="text-green-400 font-bold">${order.task.budget.toLocaleString()}</p>
              <p className="text-gray-400 text-sm mt-1">截止：{order.deadline}</p>
            </div>

            {/* Agent Info */}
            <div className="flex items-center">
              <img 
                src={order.agent.avatar} 
                alt={order.agent.name}
                className="w-12 h-12 rounded-full mr-3 bg-gray-700"
              />
              <div>
                <p className="text-sm text-gray-400 mb-1">专家</p>
                <p className="text-white font-medium">{order.agent.name}</p>
                <p className="text-blue-400 text-sm">${order.agent.hourlyRate}/小时</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div 
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                      ${currentStep >= step.id 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-gray-800 border-gray-700 text-gray-500'}
                    `}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <p className={`text-sm mt-2 ${currentStep >= step.id ? 'text-white' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-6 h-6 text-gray-700 mx-2" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-gray-900/50 border border-blue-500/20 rounded-xl p-8 mb-8"
        >
          {/* Step 1: Summary */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">1. 成果摘要</h2>
              <p className="text-gray-400 mb-4">
                简要描述你的解决方案和核心发现（10-200字）
              </p>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="例如：通过分析生产数据，发现了3个主要瓶颈，优化后预计可提升效率15%..."
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>至少10个字符</span>
                <span>{formData.summary.length}/200</span>
              </div>
            </div>
          )}

          {/* Step 2: Detailed Answer */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">2. 详细答案</h2>
              <p className="text-gray-400 mb-4">
                提供完整的分析过程、数据支持和建议（支持 Markdown）
              </p>
              <textarea
                value={formData.detailedAnswer}
                onChange={(e) => setFormData({ ...formData, detailedAnswer: e.target.value })}
                placeholder="## 问题分析&#10;&#10;经过调研发现...&#10;&#10;## 解决方案&#10;&#10;1. 第一步：...&#10;2. 第二步：...&#10;&#10;## 预期效果&#10;&#10;预计可提升..."
                className="w-full h-96 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-mono text-sm"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>至少50个字符</span>
                <span>{formData.detailedAnswer.length} 字符</span>
              </div>
            </div>
          )}

          {/* Step 3: Upload Files */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">3. 上传附件（可选）</h2>
              <p className="text-gray-400 mb-4">
                上传相关文档、数据表格、图表等支持材料
              </p>
              
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500/50 transition-colors">
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">拖拽文件到此处或点击上传</p>
                <p className="text-gray-500 text-sm">支持 PDF, Excel, Word, 图片等（最大 10MB）</p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    setFormData({ ...formData, files: [...formData.files, ...files] })
                  }}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  选择文件
                </label>
              </div>

              {formData.files.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-white font-medium mb-3">已上传文件：</h3>
                  <div className="space-y-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-blue-400 mr-3" />
                          <span className="text-white">{file.name}</span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <label className="block text-white font-medium mb-2">工作时长（小时）</label>
                <input
                  type="number"
                  value={formData.hoursSpent}
                  onChange={(e) => setFormData({ ...formData, hoursSpent: parseFloat(e.target.value) || 0 })}
                  className="w-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">4. 确认提交</h2>
              
              <div className="space-y-6">
                {/* Summary */}
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">成果摘要</h3>
                  <p className="text-white bg-gray-800 rounded-lg p-4">{formData.summary}</p>
                </div>

                {/* Hours */}
                <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                  <span className="text-gray-400">工作时长</span>
                  <span className="text-white font-bold">{formData.hoursSpent} 小时</span>
                </div>

                {/* Files */}
                {formData.files.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm mb-2">附件文件</h3>
                    <div className="space-y-2">
                      {formData.files.map((file, index) => (
                        <div key={index} className="flex items-center text-white bg-gray-800 rounded-lg p-3">
                          <FileText className="w-5 h-5 text-blue-400 mr-3" />
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                <div>
                  <label className="block text-white font-medium mb-2">补充说明（可选）</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="有任何需要补充说明的信息..."
                    className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Important Notice */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-white font-medium mb-2">提交说明</p>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• 提交后将进入平台审核（1-2个工作日）</li>
                        <li>• 平台审核通过后，需求方将在3个工作日内验收</li>
                        <li>• 需求方验收通过后，资金将自动解锁</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all
              ${currentStep === 1 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-800 text-white hover:bg-gray-700'}
            `}
          >
            上一步
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`
                px-8 py-3 rounded-lg font-medium transition-all flex items-center
                ${canProceed()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
              `}
            >
              下一步
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all flex items-center disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  提交中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  确认提交
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
