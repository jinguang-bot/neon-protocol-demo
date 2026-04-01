"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Clock,
  Target,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

const questions = [
  {
    id: 1,
    question: "Which specific chip model or component?",
    placeholder: "e.g., 7nm automotive-grade MCU, TSMC 28nm...",
    type: "text",
  },
  {
    id: 2,
    question: "Geographic focus?",
    placeholder: "e.g., Japan & Korea, Southeast Asia...",
    type: "options",
    options: ["China", "Japan & Korea", "Southeast Asia", "Europe", "Americas", "Global"],
  },
  {
    id: 3,
    question: "Urgency level?",
    type: "options",
    options: ["Low (1-2 weeks)", "Medium (3-5 days)", "High (24-48 hours)", "Critical (< 24 hours)"],
  },
  {
    id: 4,
    question: "Budget range?",
    type: "options",
    options: ["$500-$1,000", "$1,000-$3,000", "$3,000-$5,000", "$5,000+"],
  },
  {
    id: 5,
    question: "Preferred expert background?",
    placeholder: "e.g., Former TSMC supply chain manager...",
    type: "text",
  },
];

export default function ClarifyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [displayedQuestions, setDisplayedQuestions] = useState<number[]>([]);

  useEffect(() => {
    // 逐步显示问题
    const timer = setInterval(() => {
      setDisplayedQuestions((prev) => {
        if (prev.length < currentStep + 1) {
          return [...prev, questions[prev.length].id];
        }
        return prev;
      });
    }, 500);

    return () => clearInterval(timer);
  }, [currentStep]);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 800);
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-neon-darker grid-bg noise-overlay">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-neon-darker/80 backdrop-blur-md border-b border-neon-blue/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 text-neon-gray hover:text-white transition-colors" />
              <span className="text-neon-gray">Back</span>
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-white">Clarifying Your Request</h1>
              <p className="text-sm text-neon-gray">Step {currentStep + 1} of {questions.length}</p>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-neon-purple/20">
        <div className="h-1 bg-neon-dark">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-blue to-neon-violet"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* AI Avatar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4 mb-8"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="card">
                <p className="text-neon-gray mb-2">
                  I'm analyzing your request. Let me ask a few questions to match you with the perfect expert...
                </p>
                <div className="flex items-center gap-2 text-sm text-neon-blue">
                  <Clock className="w-4 h-4" />
                  <span>Analyzing... {currentStep + 1}/{questions.length} questions</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Questions List */}
          <div className="space-y-4 mb-8">
            <AnimatePresence>
              {questions.slice(0, currentStep + 1).map((q, index) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = index === currentStep;

                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`card ${isCurrent ? "border-neon-blue/40" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      {isAnswered ? (
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                          <Target className="w-5 h-5 text-neon-blue" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-neon-gray" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-white font-medium mb-2">{q.question}</p>
                        {isAnswered ? (
                          <p className="text-neon-gray">{answers[q.id]}</p>
                        ) : isCurrent ? (
                          <div className="mt-3">
                            {q.type === "options" ? (
                              <div className="grid grid-cols-2 gap-2">
                                {q.options?.map((option) => (
                                  <button
                                    key={option}
                                    onClick={() => handleAnswer(q.id, option)}
                                    className="px-4 py-2 rounded-lg border border-neon-blue/20 hover:border-neon-blue hover:bg-neon-blue/10 text-neon-gray hover:text-white transition-all text-sm"
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder={q.placeholder}
                                  className="input flex-1"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleAnswer(q.id, (e.target as HTMLInputElement).value);
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    const input = document.querySelector('input') as HTMLInputElement;
                                    if (input?.value) {
                                      handleAnswer(q.id, input.value);
                                    }
                                  }}
                                  className="btn-primary px-6"
                                >
                                  <ArrowRight className="w-5 h-5" />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-neon-gray"
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-neon-blue animate-bounce" style={{ animationDelay: "0s" }} />
                  <div className="w-2 h-2 rounded-full bg-neon-blue animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 rounded-full bg-neon-blue animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
                <span className="text-sm">Analyzing...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {currentStep === questions.length - 1 && answers[questions[currentStep].id] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Link href="/market">
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  View Matched Agents
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
