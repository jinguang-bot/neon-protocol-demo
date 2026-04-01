"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Check,
  Zap,
  Users,
  Clock,
  DollarSign,
  Filter,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

const agents = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    title: "Former TSMC Supply Chain Director",
    matchScore: 98,
    rating: 4.9,
    completedTasks: 142,
    responseTime: "12 hours",
    price: 2500,
    tags: ["semiconductor", "automotive", "supply-chain", "asia"],
    verified: true,
  },
  {
    id: 2,
    name: "Michael K.",
    title: "Former Samsung Electronics Procurement Lead",
    matchScore: 94,
    rating: 4.7,
    completedTasks: 89,
    responseTime: "18 hours",
    price: 1800,
    tags: ["semiconductor", "korea", "procurement", "chips"],
    verified: true,
  },
  {
    id: 3,
    name: "Kenji T.",
    title: "Ex-Renesas Automotive Division Manager",
    matchScore: 91,
    rating: 4.5,
    completedTasks: 67,
    responseTime: "24 hours",
    price: 2200,
    tags: ["automotive", "japan", "chips", "manufacturing"],
    verified: true,
  },
];

export default function MarketPage() {
  const [sortBy, setSortBy] = useState("match");
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);

  const sortedAgents = [...agents].sort((a, b) => {
    if (sortBy === "match") return b.matchScore - a.matchScore;
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-neon-darker grid-bg noise-overlay">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-neon-darker/80 backdrop-blur-md border-b border-neon-blue/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/clarify" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 text-neon-gray hover:text-white transition-colors" />
              <span className="text-neon-gray">Back</span>
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-white">Matched Agents</h1>
              <p className="text-sm text-neon-gray">{agents.length} experts ready to help</p>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neon-blue/20 hover:border-neon-blue/40 text-neon-gray hover:text-white transition-all">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neon-gray">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-neon-dark border border-neon-blue/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-blue"
                >
                  <option value="match">Match Score</option>
                  <option value="price">Price: Low to High</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Agent Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card group cursor-pointer ${
                  selectedAgent === agent.id ? "border-neon-blue" : ""
                } ${index === 0 ? "ring-2 ring-neon-blue/40" : ""}`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                {/* Match Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-neon-blue to-neon-violet text-white text-sm font-semibold">
                      {agent.matchScore}% Match
                    </div>
                    {agent.verified && (
                      <div className="flex items-center gap-1 text-green-400">
                        <Check className="w-4 h-4" />
                        <span className="text-xs">Verified</span>
                      </div>
                    )}
                  </div>
                  {index === 0 && (
                    <div className="flex items-center gap-1 text-neon-blue text-xs">
                      <Zap className="w-3 h-3" />
                      <span>Best Match</span>
                    </div>
                  )}
                </div>

                {/* Agent Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-violet/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-neon-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                      <p className="text-sm text-neon-gray">{agent.title}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {agent.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-neon-purple/20 text-neon-gray text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-neon-gray">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{agent.rating}</span>
                      <span className="text-neon-gray/60">· {agent.completedTasks} tasks</span>
                    </div>
                    <div className="flex items-center gap-1 text-neon-gray">
                      <Clock className="w-4 h-4" />
                      <span>{agent.responseTime}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-neon-blue/10">
                  <div>
                    <div className="flex items-center gap-1 text-neon-blue">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xl font-bold">${agent.price}</span>
                    </div>
                    <span className="text-xs text-neon-gray">per task</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg border border-neon-blue/20 text-neon-gray hover:text-white hover:border-neon-blue/40 transition-all text-sm">
                      View Profile
                    </button>
                    <Link href="/order">
                      <button className="btn-primary px-4 py-2 text-sm">
                        Hire Now
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Compare Button */}
          {selectedAgent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-8 left-0 right-0 flex justify-center"
            >
              <div className="bg-neon-purple/90 backdrop-blur-md border border-neon-blue/20 rounded-xl px-6 py-4 flex items-center gap-4">
                <div className="text-white">
                  <span className="font-semibold">{agents.find(a => a.id === selectedAgent)?.name}</span>
                  <span className="text-neon-gray"> selected</span>
                </div>
                <Link href="/order">
                  <button className="btn-primary flex items-center gap-2">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Open Bounty Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-neon-gray mb-2">Don't see the right fit?</p>
            <button className="text-neon-blue hover:underline">
              Post as Open Bounty →
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
