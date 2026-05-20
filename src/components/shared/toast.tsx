"use client";

import { motion, AnimatePresence } from "motion/react";
import { useUIStore } from "@/stores/ui-store";

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="glass-strong px-4 py-3 rounded-[14px] shadow-iris-lg flex items-center gap-3 cursor-pointer min-w-[240px]"
            onClick={() => removeToast(toast.id)}
          >
            <span className="text-lg">
              {toast.type === "success" ? "✨" : toast.type === "error" ? "😅" : "💭"}
            </span>
            <span className="text-sm text-iris-gray-700 font-medium">
              {toast.message}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
