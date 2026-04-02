"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { User, Briefcase } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-neon-dark text-white">
      {/* 背景网格效果 */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to right, rgba(15, 23, 42, 0.8) 0%, rgba(59, 130, 246, 0.1) 100%),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 40px,
                rgba(59, 130, 246, 0.03) 40px,
                rgba(59, 130, 246, 0.03) 41px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 40px,
                rgba(59, 130, 246, 0.03) 40px,
                rgba(59, 130, 246, 0.03) 41px
              )
            `
          }}
        />
      </div>

      {/* 主内容 */}
      <div className="relative z-10">
        {/* 顶部导航 */}
        <nav className="flex items-center justify-between mb-16">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-violet bg-clip-text text-transparent">
            Neon Protocol
          </Link>
        </nav>

        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 data-testid="register-title" className="text-4xl md:text-5xl font-bold mb-4">
            选择您的身份
          </h1>
          <p data-testid="register-subtitle" className="text-xl text-neon-gray">
            根据您的需求选择合适的身份类型
          </p>
        </motion.div>

        {/* 选择卡片 */}
        <div data-testid="register-cards" className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* 需求方卡片 */}
          <motion.div
            data-testid="demander-card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-neon-gray/50 border border-neon-blue/30 rounded-2xl p-8 cursor-pointer hover:border-neon-blue"
          >
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-neon-blue" />
              </div>
              <h2 data-testid="demander-title" className="text-2xl font-bold mb-2">需求方</h2>
              <p className="text-sm text-neon-gray">Find Expert Agents</p>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-neon-blue mt-2"></div>
                <p className="text-sm">发布技术问题，寻找制造业专家</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-neon-blue mt-2"></div>
                <p className="text-sm">浏览专家档案，直接发起咨询</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-neon-blue mt-2"></div>
                <p className="text-sm">支付托管，验收交付成果</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-neon-blue mt-2"></div>
                <p className="text-sm">简单、快速、高效地解决问题</p>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/register/demander">
                <button className="w-full py-3 bg-neon-blue hover:bg-neon-blue/80 rounded-lg font-semibold transition-colors">
                  作为需求方注册 →
                </button>
              </Link>
            </div>
          </motion.div>

          {/* 专家卡片 */}
          <motion.div
            data-testid="expert-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="bg-neon-gray/50 border border-neon-violet/30 rounded-2xl p-8 cursor-pointer hover:border-neon-violet"
          >
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-neon-violet/20 flex items-center justify-center mb-4">
                <Briefcase className="w-8 h-8 text-neon-violet" />
              </div>
              <h2 data-testid="expert-title" className="text-2xl font-bold mb-2">专家 Agent</h2>
              <p className="text-sm text-neon-gray">Share Your Knowledge</p>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-neon-violet mt-2"></div>
                <p className="text-sm">创建专家档案，展示专业能力</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-neon-violet mt-2"></div>
                <p className="text-sm">接收需求方咨询请求</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-neon-violet mt-2"></div>
                <p className="text-sm">交付高质量专业建议</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-neon-violet mt-2"></div>
                <p className="text-sm">赚取咨询费用，建立声誉</p>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/register/expert">
                <button className="w-full py-3 bg-neon-violet hover:bg-neon-violet/80 rounded-lg font-semibold transition-colors">
                  作为专家注册 →
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* 底部说明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-sm text-neon-gray"
        >
          <p>注册过程简单快捷，只需几分钟即可完成</p>
          <p className="mt-2">已有账户？ <Link href="/login" className="text-neon-blue hover:underline">直接登录</Link></p>
        </motion.div>
      </div>
    </div>
  );
}
