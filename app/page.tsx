"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Building2,
  Users,
  TrendingUp
} from "lucide-react";

export default function LandingPage() {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (!query.trim()) return;
    // TODO: Navigate to task creation page
    console.log("Submit query:", query);
  };

  return (
    <div className="min-h-screen bg-neon-darker grid-bg noise-overlay">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neon-darker/80 backdrop-blur-md border-b border-neon-blue/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Neon Protocol</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-neon-gray hover:text-white transition-colors">产品介绍</a>
              <a href="#" className="text-neon-gray hover:text-white transition-colors">专家网络</a>
              <a href="#" className="text-neon-gray hover:text-white transition-colors">定价</a>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-neon-gray hover:text-white transition-colors">
                登录
              </button>
              <button className="btn-primary text-sm">
                注册
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Find the Right</span>
              <br />
              <span className="text-gradient">Manufacturing Experts</span>
              <br />
              <span className="text-white">Instantly</span>
            </h1>
            <p className="text-xl text-neon-gray max-w-2xl mx-auto">
              The First Agent-to-Agent Protocol for Professional Knowledge Trading
            </p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="card">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-neon-blue mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neon-gray mb-2">
                    What problem are you trying to solve?
                  </label>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="We need to evaluate [chip model] supply risk under new export controls for our automotive production line in Southeast Asia..."
                    className="input min-h-[120px] resize-none"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-neon-gray">
                      Powered by 30,000+ Expert Interviews
                    </span>
                    <button
                      onClick={handleSubmit}
                      className="btn-primary flex items-center gap-2"
                    >
                      Submit Request
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          >
            {[
              { icon: Users, label: "Expert Interviews", value: "30,000+" },
              { icon: Building2, label: "Companies Served", value: "500+" },
              { icon: Clock, label: "Average Response", value: "24hr" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-neon-purple/20 border border-neon-blue/10"
              >
                <stat.icon className="w-8 h-8 text-neon-blue mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-neon-gray">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Zap,
                title: "Smart Matching",
                description: "AI-driven expert matching based on skills, experience, and availability",
              },
              {
                icon: Shield,
                title: "Secure Delivery",
                description: "Local Agent execution protects your IP and confidential data",
              },
              {
                icon: TrendingUp,
                title: "Fast Settlement",
                description: "USDC instant settlement with smart contract guarantee",
              },
            ].map((feature, index) => (
              <div key={index} className="card group cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-neon-blue/10 flex items-center justify-center mb-4 group-hover:bg-neon-blue/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-neon-blue" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-neon-gray">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neon-blue/10 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-neon-gray">© 2026 Neon Protocol. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-neon-gray">
            <a href="#" className="hover:text-white transition-colors">关于</a>
            <a href="#" className="hover:text-white transition-colors">联系</a>
            <a href="#" className="hover:text-white transition-colors">条款</a>
            <a href="#" className="hover:text-white transition-colors">隐私</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
