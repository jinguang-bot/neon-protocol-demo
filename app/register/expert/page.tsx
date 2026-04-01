"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

export default function ExpertRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: 组织信息
    organizationName: "",
    email: "",
    industry: "",
    website: "",
    description: "",
    // Step 2: Agent信息
    agentName: "",
    skills: [] as string[],
    experienceYears: "",
    priceRange: "",
    availability: "",
    walletAddress: "",
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

  const skillOptions = [
    "机械设计",
    "电子工程",
    "生产管理",
    "质量控制",
    "自动化与AI",
    "数据分析",
    "供应链管理",
    "其他"
  ];

  const handleNext = () => {
    if (!formData.organizationName || !formData.email || !formData.industry) {
      alert("请完善基本信息");
      return;
    }

    if (formData.skills.length === 0) {
      alert("请至少选择一个技能领域");
      return;
    }

    // 食品行业特殊处理
    if (!formData.email.includes("@")) {
      alert("请输入有效的企业邮箱");
      return;
    }

    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    if (!formData.agentName || !formData.skills || !formData.priceRange) {
      alert("请完善所有必填字段");
      return;
    }

    if (formData.walletAddress && !formData.walletAddress.startsWith("0x")) {
      alert("请输入有效的钱包地址");
      return;
    }

    // 提交到服务器
    try {
      const response = await fetch('/api/register/success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: "注册成功！欢迎加入 Neon Protocol!",
          data: formData
        })
      });

      if (response.ok) {
        alert("注册成功！");
        window.location.href = "/dashboard";
      } else {
        alert("注册失败，请重试");
      }
    } catch (error) {
      console.error("注册错误:", error);
      alert("注册失败，请重试");
    }
  };

  const toggleSkill = (skill: string) => {
    if (formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter(s => s !== skill)
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill]
      });
    }
  };

  return (
    <div className="min-h-screen bg-neon-dark text-white">
      {/* 背景网格 */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to right, rgba(15, 23, 42, 0.8) 0%, rgba(139, 92, 246, 0.1) 100%),
              repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(139, 92, 246, 0.03) 40px, rgba(139, 92, 246, 0.03) 41px),
              repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(139, 92, 246, 0.03) 40px, rgba(139, 92, 246, 0.03) 41px)
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
          <Link href="/register" className="text-neon-violet hover:text-neon-blue flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            返回选择身份
          </Link>
        </nav>

        {/* 进度条 */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= 1 ? "bg-neon-violet text-white" : "bg-neon-gray text-neon-gray/50"
              }`}>
                1
              </div>
              <span className="text-sm">组织信息</span>
            </div>
            <div className={`h-1 w-16 ${currentStep >= 2 ? "bg-neon-violet" : "bg-neon-gray"}`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= 2 ? "bg-neon-violet text-white" : "bg-neon-gray text-neon-gray/50"
              }`}>
                2
              </div>
              <span className="text-sm">Agent信息</span>
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
            <div className="bg-neon-gray/50 border border-neon-violet/30 rounded-2xl p-8">
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
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-violet/30 rounded-lg focus:border-neon-violet focus:outline-none"
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
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-violet/30 rounded-lg focus:border-neon-violet focus:outline-none"
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
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-violet/30 rounded-lg focus:border-neon-violet focus:outline-none"
                  >
                    <option value="">请选择行业</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    网站
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-violet/30 rounded-lg focus:border-neon-violet focus:outline-none"
                    placeholder="https://www.company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    简介
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-violet/30 rounded-lg focus:border-neon-violet focus:outline-none"
                    rows={4}
                    placeholder="简要介绍您的组织..."
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-neon-violet hover:bg-neon-violet/80 rounded-lg font-semibold transition-colors"
                >
                  下一步 →
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-neon-gray/50 border border-neon-violet/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Agent信息</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Agent名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.agentName}
                    onChange={(e) => setFormData({...formData, agentName: e.target.value})}
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-violet/30 rounded-lg focus:border-neon-violet focus:outline-none"
                    placeholder="例如：张三 - 机械设计专家"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    技能领域 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {skillOptions.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-3 rounded-lg border transition-colors text-left ${
                          formData.skills.includes(skill)
                            ? "bg-neon-violet border-neon-violet text-white"
                            : "bg-neon-dark border-neon-violet/30 text-neon-gray hover:border-neon-violet"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    经验年限
                  </label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-violet/30 rounded-lg focus:border-neon-violet focus:outline-none"
                    placeholder="例如：10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    价格区间 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.priceRange}
                    onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-violet/30 rounded-lg focus:border-neon-violet focus:outline-none"
                  >
                    <option value="">请选择价格区间</option>
                    <option value="1000-5000">¥1,000 - ¥5,000</option>
                    <option value="5000-10000">¥5,000 - ¥10,000</option>
                    <option value="10000-50000">¥10,000 - ¥50,000</option>
                    <option value="50000+">¥50,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    可用时间
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => setFormData({...formData, availability: e.target.value})}
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-violet/30 rounded-lg focus:border-neon-violet focus:outline-none"
                  >
                    <option value="">请选择可用时间</option>
                    <option value="fulltime">全职</option>
                    <option value="parttime">兼职</option>
                    <option value="flexible">灵活</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    钱包地址（可选）
                  </label>
                  <input
                    type="text"
                    value={formData.walletAddress}
                    onChange={(e) => setFormData({...formData, walletAddress: e.target.value})}
                    className="w-full px-4 py-3 bg-neon-dark border border-neon-violet/30 rounded-lg focus:border-neon-violet focus:outline-none"
                    placeholder="例如：0x1234..."
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
                  className="px-8 py-3 bg-neon-violet hover:bg-neon-violet/80 rounded-lg font-semibold transition-colors"
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
