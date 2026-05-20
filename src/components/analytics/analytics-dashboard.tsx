"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { useNotesStore } from "@/stores/notes-store";

export function AnalyticsDashboard() {
  const notes = useNotesStore((s) => s.notes);
  const fetchNotes = useNotesStore((s) => s.fetchNotes);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // --- Analytics Logic ---
  const activeNotes = notes.filter((n) => n.section !== "completed" && !n.isArchived);
  const completedNotes = notes.filter((n) => n.section === "completed" && !n.isArchived);

  let totalTasks = 0;
  let completedTasks = 0;
  let emptyNotesCount = 0;
  let totalNotes = notes.length;

  notes.forEach(n => {
    if (n.tasks && n.tasks.length > 0) {
      totalTasks += n.tasks.length;
      completedTasks += n.tasks.filter(t => t.completed).length;
    } else {
      emptyNotesCount++;
      if (n.section === "completed") {
        totalTasks += 1;
        completedTasks += 1;
      } else {
        totalTasks += 1;
      }
    }
  });

  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // --- Generate Insights ---
  let insightTitle = "Ready to start!";
  let insightMessage = "You haven't created any tasks yet. Create a cute sticky note to begin your journey! 🌸";

  if (totalTasks > 0) {
    if (completionRate === 100) {
      insightTitle = "Absolute Perfection! 👑";
      insightMessage = "You've crushed every single task on your board. Take a well-deserved break, get a cute coffee, and enjoy the peace! ☕✨";
    } else if (completionRate > 75) {
      insightTitle = "On Fire! 🔥";
      insightMessage = "You are blazing through your tasks! You only have a little bit left. Keep up this amazing momentum! 💕";
    } else if (completionRate > 40) {
      insightTitle = "Steady Progress 🌸";
      if (emptyNotesCount > activeNotes.length / 2) {
        insightMessage = "You're doing great! But I noticed you have a lot of empty notes. Try writing down smaller, actionable tasks so you get that sweet dopamine hit when you check them off! 📝";
      } else {
        insightMessage = "You are halfway there! The hardest part is starting, and you've already crushed that. Keep checking those boxes! ✨";
      }
    } else {
      insightTitle = "Taking it Easy 🐢";
      if (activeNotes.length > 5) {
        insightMessage = "It looks like you have a LOT on your plate right now. Don't let it overwhelm you! Try focusing on just ONE sticky note today and ignore the rest. You got this! 💪🎀";
      } else {
        insightMessage = "Every big accomplishment starts with a single step. Pick the easiest task on your board right now and just do it! 💕";
      }
    }
  }

  // --- SVG Ring Math ---
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="min-h-[calc(100vh-40px)] p-6 lg:p-12 font-sans w-full max-w-[1200px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold text-[#44403c] mb-2" style={{ fontFamily: "var(--font-kalam)" }}>
          Productivity Analytics 📊
        </h1>
        <p className="text-[#a8a29e] font-medium" style={{ fontFamily: "var(--font-quicksand)" }}>
          A cute overview of how you're doing
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. Completion Ring */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 bg-white rounded-[32px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border-2 border-pink-50 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-50" />
          
          <h2 className="text-xl font-bold text-[#78716c] mb-6 w-full text-center" style={{ fontFamily: "var(--font-quicksand)" }}>Overall Completion</h2>
          
          <div className="relative flex items-center justify-center w-48 h-48">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-100"
              />
              <motion.circle
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="96"
                cy="96"
                r={radius}
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeLinecap="round"
                className="text-[#f472b6]"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-[#44403c]" style={{ fontFamily: "var(--font-kalam)" }}>{completionRate}%</span>
              <span className="text-sm font-bold text-[#a8a29e] tracking-widest uppercase mt-1" style={{ fontFamily: "var(--font-quicksand)" }}>Done</span>
            </div>
          </div>
        </motion.div>

        {/* 2. Stats Breakdown */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-1 lg:col-span-2 bg-white rounded-[32px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border-2 border-pink-50 flex flex-col justify-center"
        >
          <h2 className="text-xl font-bold text-[#78716c] mb-8" style={{ fontFamily: "var(--font-quicksand)" }}>The Numbers 🌸</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1 p-4 bg-[#fdf2f8] rounded-2xl border border-pink-100">
              <span className="text-4xl font-bold text-[#f472b6]" style={{ fontFamily: "var(--font-kalam)" }}>{totalNotes}</span>
              <span className="text-xs font-bold text-pink-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-quicksand)" }}>Total Notes</span>
            </div>
            <div className="flex flex-col gap-1 p-4 bg-[#f0f9ff] rounded-2xl border border-blue-100">
              <span className="text-4xl font-bold text-[#38bdf8]" style={{ fontFamily: "var(--font-kalam)" }}>{activeNotes.length}</span>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-quicksand)" }}>Active Notes</span>
            </div>
            <div className="flex flex-col gap-1 p-4 bg-[#f0fdf4] rounded-2xl border border-green-100">
              <span className="text-4xl font-bold text-[#4ade80]" style={{ fontFamily: "var(--font-kalam)" }}>{completedNotes.length}</span>
              <span className="text-xs font-bold text-green-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-quicksand)" }}>Completed Notes</span>
            </div>
            <div className="flex flex-col gap-1 p-4 bg-[#fefce8] rounded-2xl border border-yellow-100">
              <span className="text-4xl font-bold text-[#facc15]" style={{ fontFamily: "var(--font-kalam)" }}>{totalTasks}</span>
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-quicksand)" }}>Total Tasks</span>
            </div>
          </div>
        </motion.div>

        {/* 3. Vibe Insights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-1 lg:col-span-3 bg-gradient-to-br from-[#fdf2f8] to-[#f3e8ff] rounded-[32px] p-8 md:p-12 shadow-[0_10px_40px_rgba(244,114,182,0.15)] border-2 border-pink-200 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-sm font-bold text-pink-500 uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-quicksand)" }}>AI Vibe Analysis ✨</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-[#44403c] mb-6" style={{ fontFamily: "var(--font-kalam)" }}>{insightTitle}</h3>
            <p className="text-lg md:text-xl text-[#57534e] leading-relaxed font-medium" style={{ fontFamily: "var(--font-quicksand)" }}>
              {insightMessage}
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
