"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

export default function DemanderRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: 组织信息
    organizationName: '',
    email: '',
    industry: '',
    // Step 2: 联系人信息
    contactName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const industries = [
    "汽车制造",
    "电子制造",
    "机械制造",
    "化工制造",
    "食品制造",
    "纺织制造",
    "其他制造业"
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      // 验证第一步
      if (!formData.organizationName || !formData.email || !formData.industry) {
        alert("请填写所有必填字段");
        return;
      }
      if (!formData.email.includes("@")) {
        alert("请输入有效的邮箱地址");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    // 验证第二步
    if (!formData.contactName || !formData.password) {
      alert("请填写所有必填字段");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("两次输入的密码不一致");
      return;
    }
    if (formData.password.length < 8) {
      alert("密码至少需要8个字符");
      return;
    }

    // TODO: 提交注册表单到后端
    console.log("提交注册:", formData);
    alert("注册成功！即将跳转到控制台");
    // window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-neon-dark text-white">
      {/* 背景网格 */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to right, rgba(15, 23, 42, 0.8) 0%, rgba(59, 130, 246, 0.1) 100%),
              repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(59, 130, 246, 0.03) 40px, rgba(59, 130, 246, 0.03) 41px),
              repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(59, 130, 246, 0.03) 40px, rgba(59, 130, 246, 0.03) 41px)
            `
          }}
        />
      </div>

      {/* 主内容 */}
      <div className="relative z-10">
        {/* 顶部导航 */}
        <nav className="flex items-center justify-between mb-8">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-violet bg-clip-text text-transparent">
            Neon Protocol
          </Link>
          <Link href="/register" className="text-neon-blue hover:text-neon-violet flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            返回选择身份
          </Link>
        </nav>

        {/* 进度条 */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= 1 ? "bg-neon-blue text-white" : "bg-neon-gray text-neon-gray/50"
              }`}>
                1
              </div>
              <span className="text-sm">组织信息</span>
            </div>
            <div className={`h-1 w-16 ${currentStep >= 2 ? "bg-neon-blue" : "bg-neon-gray"}`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= 2 ? "bg-neon-blue text-white" : "bg-neon-gray text-neon-gray/50"
              }`}>
                2
              </div>
              <span className="text-sm">联系人信息</span>
            </div>
          </div>
        </div>

        {/* 表单区域 */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: currentStep === 1 ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl mx-auto"
        >
          {currentStep === 1 && (
            <div className="bg-neon-gray/50 border border-neon-blue/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">组织信息</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    组织名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-blue/30 rounded-lg focus:border-neon-blue focus:outline-none"
                    placeholder="例如：某某制造有限公司"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    企业邮箱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-blue/30 rounded-lg focus:border-neon-blue focus:outline-none"
                    placeholder="例如：contact@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    所属行业 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-blue/30 rounded-lg focus:border-neon-blue focus:outline-none"
                  >
                    <option value="">请选择行业</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-neon-blue hover:bg-neon-blue/80 rounded-lg font-semibold transition-colors"
                >
                  下一步 →
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-neon-gray/50 border border-neon-blue/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">联系人信息</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    联系人姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-blue/30 rounded-lg focus:border-neon-blue focus:outline-none"
                    placeholder="例如：张三"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    联系电话
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-blue/30 rounded-lg focus:border-neon-blue focus:outline-none"
                    placeholder="例如：13800138000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    登录密码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-blue/30 rounded-lg focus:border-neon-blue focus:outline-none"
                    placeholder="至少8个字符"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    确认密码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-blue/30 rounded-lg focus:border-neon-blue focus:outline-none"
                    placeholder="再次输入密码"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-8 py-3 bg-neon-gray hover:bg-neon-gray/80 rounded-lg font-semibold transition-colors"
                >
                  ← 上一步
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-neon-blue hover:bg-neon-blue/80 rounded-lg font-semibold transition-colors"
                >
                  <Check className="inline w-4 h-4 mr-2" />
                  提交注册
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
