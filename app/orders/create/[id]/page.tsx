'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  User,
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Wallet,
  Shield,
  Clock,
  FileText,
  MessageCircle
} from 'lucide-react'

export default function CreateOrderPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [taskTitle, setTaskTitle] = useState('开发基于 AI 的供应链优化系统')
  const [taskBudget, setTaskBudget] = useState(50000)
  const [agentName, setAgentName] = useState('Dr. Sarah Chen')
  const [agentRate, setAgentRate] = useState(150)
  const [message, setMessage] = useState('')
  const [deadline, setDeadline] = useState('')

  useEffect(() => {
    // 设置默认截止日期（30天后）
    const date = new Date()
    date.setDate(date.getDate() + 30)
    setDeadline(date.toISOString().split('T')[0])
  }, [params.id])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('订单创建成功！即将跳转到订单详情页')
      router.push('/orders/order-test-123')
    } catch (error) {
      console.error('Failed to create order:', error)
      alert('订单创建失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-blue-400" />
          任务信息
        </h2>
        
        <div className="space-y-4">
          <div>
            <div className="text-gray-400 text-sm mb-1">任务标题</div>
            <div className="text-white font-medium">{taskTitle}</div>
          </div>
          
          <div>
            <div className="text-gray-400 text-sm mb-1">预算范围</div>
            <div className="text-2xl font-bold text-green-400">${taskBudget.toLocaleString()}</div>
          </div>
          
          <div>
            <div className="text-gray-400 text-sm mb-1">交付日期</div>
            <div className="text-white">{new Date(deadline).toLocaleDateString('zh-CN')}</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-purple-400" />
          专家信息
        </h2>
        
        <div className="space-y-4">
          <div>
            <div className="text-gray-400 text-sm mb-1">专家姓名</div>
            <div className="text-white font-medium">{agentName}</div>
          </div>
          
          <div>
            <div className="text-gray-400 text-sm mb-1">时薪</div>
            <div className="text-xl font-bold text-blue-400">${agentRate}/小时</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-green-400" />
          给专家的留言
        </h2>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          placeholder="简要描述您的需求，或者问专家一些问题..."
        />
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!message}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        下一步：确认订单
      </button>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-400" />
          付款里程碑
        </h2>
        
        <div className="space-y-4">
          <div className="bg-black/40 border border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-medium mr-3">
                  1
                </div>
                <div>
                  <div className="font-medium text-white">需求确认与系统设计</div>
                  <div className="text-sm text-gray-400">完成需求分析、技术方案设计和原型设计</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">$10,000</div>
              </div>
            </div>
          </div>

          <div className="bg-black/40 border border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-medium mr-3">
                  2
                </div>
                <div>
                  <div className="font-medium text-white">核心功能开发</div>
                  <div className="text-sm text-gray-400">完成AI模型开发、数据集成和API开发</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">$20,000</div>
              </div>
            </div>
          </div>

          <div className="bg-black/40 border border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-medium mr-3">
                  3
                </div>
                <div>
                  <div className="font-medium text-white">测试与部署</div>
                  <div className="text-sm text-gray-400">完成系统测试、优化和生产环境部署</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">$20,000</div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-gray-400">总金额</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                $50,000
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-purple-400" />
          支付方式
        </h2>
        
        <div className="space-y-3">
          <button className="w-full p-4 border-2 border-blue-500 bg-blue-500/10 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="w-6 h-6 text-blue-400 mr-3" />
              <div className="text-left">
                <div className="font-medium text-white">USDC（推荐）</div>
                <div className="text-sm text-gray-400">使用加密货币支付</div>
              </div>
            </div>
            <CheckCircle className="w-5 h-5 text-blue-400" />
          </button>
          
          <button className="w-full p-4 border border-gray-700 rounded-lg flex items-center opacity-50 cursor-not-allowed">
            <div className="flex items-center">
              <CreditCard className="w-6 h-6 text-gray-400 mr-3" />
              <div className="text-left">
                <div className="font-medium text-gray-400">信用卡</div>
                <div className="text-sm text-gray-500">即将支持</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
          <div>
            <div className="font-medium text-blue-400 mb-1">智能合约保障</div>
            <div className="text-sm text-gray-300">
              付款将由智能合约托管，仅在您确认满意后才会释放给专家。保障您的资金安全。
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setStep(1)}
          className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
        >
          返回修改
        </button>
        <button
          onClick={() => setStep(3)}
          className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
        >
          确认订单
        </button>
      </div>
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">确认订单</h2>
        <p className="text-gray-400 text-center mb-6">
          请仔细核对以下订单信息
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <div className="text-gray-400">任务</div>
            <div className="text-white font-medium text-right flex-1 ml-4">
              {taskTitle}
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <div className="text-gray-400">专家</div>
            <div className="text-white font-medium">{agentName}</div>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <div className="text-gray-400">里程碑数</div>
            <div className="text-white font-medium">3 个</div>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <div className="text-gray-400">总金额</div>
            <div className="text-2xl font-bold text-green-400">$50,000</div>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <div className="text-gray-400">支付方式</div>
            <div className="text-white font-medium flex items-center">
              <Wallet className="w-4 h-4 mr-2 text-blue-400" />
              USDC
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="text-gray-400">交付日期</div>
            <div className="text-white font-medium flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-purple-400" />
              {new Date(deadline).toLocaleDateString('zh-CN')}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
          <div className="text-sm text-gray-300">
            <div className="font-medium text-yellow-400 mb-1">重要提示</div>
            <ul className="list-disc list-inside space-y-1">
              <li>订单创建后，系统将锁定资金到智能合约</li>
              <li>您可以随时与专家沟通并跟踪进度</li>
              <li>每个里程碑完成后，需您确认才会释放付款</li>
              <li>如有争议，可申请平台仲裁</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setStep(2)}
          className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
        >
          返回修改
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              创建中...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              确认创建订单
            </>
          )}
        </button>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 pointer-events-none" />
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
        }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            创建订单
          </h1>
          <p className="text-gray-400 mt-2">
            与专家合作，开启您的项目
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-medium
                  ${step >= s 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                    : 'bg-gray-800 text-gray-400'}
                `}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-full h-1 mx-2 ${
                    step > s ? 'bg-blue-500' : 'bg-gray-800'
                  }`} style={{ width: '80px' }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className={step === 1 ? 'text-white' : 'text-gray-400'}>填写信息</div>
            <div className={step === 2 ? 'text-white' : 'text-gray-400'}>确认订单</div>
            <div className={step === 3 ? 'text-white' : 'text-gray-400'}>完成创建</div>
          </div>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  )
}
