"use client";

import { motion } from "motion/react";
import { getGreeting } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

export function Topbar() {
  const openEditor = useUIStore((s) => s.openEditor);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-6 py-4 lg:px-8"
    >
      <div className="flex items-center gap-4">
        <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg lg:text-xl font-bold text-black/70 font-sans"
          style={{ fontFamily: "'Nunito', 'Quicksand', sans-serif" }}
        >
          Welcome to IrisNotes 🌸
        </motion.h2>
      </div>

    </motion.header>
  );
}
