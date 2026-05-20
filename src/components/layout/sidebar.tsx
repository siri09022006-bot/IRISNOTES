"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: "📖", label: "The Book", emoji2: "✨" },
  { href: "/analytics", icon: "📊", label: "Analytics", emoji2: "🎀" },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden glass rounded-full w-10 h-10 flex items-center justify-center hover:scale-105 transition-transform"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className={cn(
          "fixed left-4 top-4 bottom-4 w-[240px] z-40",
          "glass-strong rounded-[24px]",
          "flex flex-col py-8 px-4",
          "lg:relative lg:translate-x-0 lg:opacity-100 lg:left-0 lg:top-0 lg:bottom-0 lg:my-4 lg:ml-4"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-3 mb-10 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-10 h-10 rounded-[14px] flex items-center justify-center text-xl shadow-iris-glow-pink"
            style={{ background: "linear-gradient(135deg, #f472b6, #c084fc)" }}
          >
            🌸
          </motion.div>
          <div>
            <h1 className="text-lg font-bold text-iris-gray-800 tracking-tight">IrisNotes</h1>
            <p className="text-[10px] text-iris-gray-500 font-medium tracking-widest uppercase">
              your workspace
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => window.innerWidth < 1024 && toggleSidebar()}>
                <motion.div
                  whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-[16px] transition-all duration-300 group relative",
                    isActive ? "bg-iris-gray-100/50 shadow-sm" : ""
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-full shadow-iris-glow-pink"
                      style={{ background: "linear-gradient(180deg, #f472b6, #c084fc)" }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    />
                  )}
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">{item.icon}</span>
                  <span className={cn("text-sm font-medium transition-colors", isActive ? "text-iris-gray-800" : "text-iris-gray-500 group-hover:text-iris-gray-700")}>
                    {item.label}
                  </span>
                  <span className="ml-auto text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-sm">
                    {item.emoji2}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="mt-auto pt-6 border-t border-iris-gray-200/50">
          <div className="px-3 py-3 glass-subtle rounded-[16px] text-center">
            <p className="text-xs text-iris-gray-500 font-medium flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-iris-success shadow-[0_0_8px_#34d399]" />
              Workspace Active
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
