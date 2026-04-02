'use client'

/**
 * 资金解锁页面
 * Sprint-07: F010 - 资金结算与端到端测试
 */

import { use } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  Shield,
  ArrowLeft,
  Unlock,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

export default function UnlockFundsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id

  const [step, setStep] = useState(1) // 1: 查看详情, 2: 确认解锁, 3: 完成
  const [isLoading, setIsLoading] = useState(true)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)

  // 加载订单详情
  React.useEffect(() => {
    fetchOrderDetails()
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/unlock`)
      if (!response.ok) {
        throw new Error('获取订单详情失败')
      }
      const data = await response.json()
      setOrderData(data)
      setIsLoading(false)
    } catch (err) {
      setError('加载订单详情失败，请稍后重试')
      setIsLoading(false)
    }
  }

  const handleUnlock = async () => {
    if (!orderData?.order.canUnlock) {
      setError('当前订单不满足解锁条件')
      return
    }

    setIsUnlocking(true)
    setError(null)

    try {
      const response = await fetch(`/api/orders/${orderId}/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '解锁失败')
      }

      const data = await response.json()
      setTransactionHash(data.transactionHash)
      setStep(3) // 跳转到完成步骤
    } catch (err) {
      setError(err instanceof Error ? err.message : '解锁失败，请稍后重试')
    } finally {
      setIsUnlocking(false)
    }
  }

  // 加载中状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-gray-400">加载订单详情...</p>
        </div>
      </div>
    )
  }

  // 错误状态
  if (error && !orderData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/tasks')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            返回任务列表
          </button>
        </div>
      </div>
    )
  }

  const steps = [
    { id: 1, title: '查看详情', description: '确认订单信息' },
    { id: 2, title: '确认解锁', description: '执行资金解锁' },
    { id: 3, title: '完成', description: '解锁成功' },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 背景渐变 */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-900 opacity-50 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <Link
          href={`/orders/${orderId}`}
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回订单详情
        </Link>

        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">资金解锁</h1>
          <p className="text-gray-400">确认订单信息并解锁托管资金</p>
        </motion.div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= s.id ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  {step > s.id ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-sm font-medium text-white">{s.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-20 h-1 mx-2 ${
                      step > s.id ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            {steps.map((s) => (
              <div key={s.id} className="text-center">
                <div className="font-medium">{s.title}</div>
                <div>{s.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: 查看详情 */}
        {step === 1 && orderData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 警告信息 */}
            {!orderData.order.canUnlock && (
              <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-medium">无法解锁资金</p>
                    <p className="text-sm text-red-300 mt-1">
                      请确保订单状态为"进行中"且交付成果已通过需求方审核
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 订单信息 */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-400" />
                订单信息
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">订单ID</p>
                  <p className="text-white font-mono">{orderData.order.id}</p>
                </div>
                <div>
                  <p className="text-gray-400">订单状态</p>
                  <p className="text-blue-400 font-medium">{orderData.order.status}</p>
                </div>
                <div>
                  <p className="text-gray-400">支付金额</p>
                  <p className="text-white font-bold text-lg">${orderData.order.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">支付方式</p>
                  <p className="text-white">{orderData.order.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* 任务信息 */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">任务信息</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-gray-400 text-sm">任务标题</p>
                  <p className="text-white font-medium">{orderData.task.title}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">任务类别</p>
                  <p className="text-blue-400">{orderData.task.category}</p>
                </div>
              </div>
            </div>

            {/* 专家信息 */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">专家信息</h3>
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mr-4">
                  {orderData.agent.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{orderData.agent.name}</p>
                  <p className="text-sm text-gray-400">{orderData.agent.title}</p>
                </div>
              </div>
            </div>

            {/* 里程碑信息 */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                里程碑 ({orderData.milestones.length})
              </h3>
              <div className="space-y-3">
                {orderData.milestones.map((milestone: any, index: number) => (
                  <div key={milestone.id} className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">里程碑 #{index + 1}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        milestone.status === 'COMPLETED'
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {milestone.status}
                      </span>
                    </div>
                    <p className="text-white font-medium">{milestone.title}</p>
                    <p className="text-sm text-gray-400 mt-1">${milestone.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 交付成果 */}
            {orderData.delivery && (
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  交付成果
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">成果摘要</p>
                    <p className="text-white">{orderData.delivery.summary}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">提交时间</p>
                      <p className="text-white">
                        {new Date(orderData.delivery.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">需求方审核</p>
                      <p className="text-green-400">✓ 已通过</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 安全保障 */}
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-6">
              <div className="flex items-start">
                <Shield className="w-6 h-6 text-blue-400 mr-3 mt-1" />
                <div>
                  <h4 className="text-blue-400 font-semibold mb-2">智能合约保障</h4>
                  <ul className="text-sm text-blue-200 space-y-1">
                    <li>✓ 资金已托管在智能合约中</li>
                    <li>✓ 交付成果已通过需求方审核</li>
                    <li>✓ 解锁后资金将自动释放给专家</li>
                    <li>✓ 交易记录将永久保存在区块链上</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 下一步按钮 */}
            <button
              onClick={() => setStep(2)}
              disabled={!orderData.order.canUnlock}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                orderData.order.canUnlock
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {orderData.order.canUnlock ? '下一步：确认解锁' : '订单不满足解锁条件'}
            </button>
          </motion.div>
        )}

        {/* Step 2: 确认解锁 */}
        {step === 2 && orderData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-yellow-400 mr-3 mt-1" />
                <div>
                  <h4 className="text-yellow-400 font-semibold mb-2">确认解锁资金</h4>
                  <p className="text-sm text-yellow-200">
                    您即将解锁托管资金给专家。此操作不可撤销，请确认订单已完成且交付成果符合要求。
                  </p>
                </div>
              </div>
            </div>

            {/* 解锁摘要 */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">解锁摘要</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">解锁金额</span>
                  <span className="text-2xl font-bold text-white">
                    ${orderData.order.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-gray-700" />
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">接收方</span>
                  <span className="text-white">{orderData.agent.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">支付方式</span>
                  <span className="text-white">{orderData.order.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">里程碑完成</span>
                  <span className="text-green-400">
                    {orderData.milestones.filter((m: any) => m.status === 'COMPLETED').length} / {orderData.milestones.length}
                  </span>
                </div>
              </div>
            </div>

            {/* 按钮 */}
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors"
              >
                返回修改
              </button>
              <button
                onClick={handleUnlock}
                disabled={isUnlocking}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isUnlocking ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    解锁中...
                  </>
                ) : (
                  <>
                    <Unlock className="w-5 h-5 mr-2" />
                    确认解锁
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: 完成 */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">资金解锁成功!</h2>
            <p className="text-gray-400 mb-8">
              资金已成功释放给专家，交易已记录在区块链上
            </p>

            {/* 交易信息 */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 mb-8 text-left max-w-md mx-auto">
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">交易哈希</p>
                  <p className="text-white font-mono text-xs break-all">{transactionHash}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">解锁金额</p>
                  <p className="text-white font-bold">${orderData?.order.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">接收方</p>
                  <p className="text-white">{orderData?.agent.name}</p>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4 justify-center">
              <Link
                href={`/orders/${orderId}`}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                查看订单
              </Link>
              <Link
                href="/tasks"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                浏览任务
              </Link>
            </div>
          </motion.div>
        )}

        {/* 错误提示 */}
        {error && step !== 3 && (
          <div className="mt-4 bg-red-900/30 border border-red-500 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
