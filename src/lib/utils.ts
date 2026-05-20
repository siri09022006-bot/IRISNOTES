import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatRelative(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "Late night thoughts? ✨";
  if (hour < 12) return "Good morning, sunshine ☀️";
  if (hour < 17) return "Good afternoon ✨";
  if (hour < 21) return "Good evening 🌙";
  return "Burning the midnight oil? 🌟";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export const NOTE_COLORS = [
  { name: "Rose", value: "#FFF5F5", accent: "#FFD6E0" },
  { name: "Lavender", value: "#F3EDFA", accent: "#E8D5F5" },
  { name: "Sky", value: "#E8F0FA", accent: "#C5D5EA" },
  { name: "Mint", value: "#EDFAF0", accent: "#D4EDDA" },
  { name: "Peach", value: "#FFF0E0", accent: "#FFDAB9" },
  { name: "Lemon", value: "#FFFBEB", accent: "#FFF3CD" },
  { name: "Cream", value: "#FFF8F0", accent: "#F5EDE4" },
  { name: "White", value: "#FFFFFF", accent: "#F0EEEB" },
];

export const NOTE_TYPES = [
  { name: "Pastel", value: "pastel", icon: "🎨" },
  { name: "Minimal", value: "minimal", icon: "✦" },
  { name: "Glass", value: "glass", icon: "💎" },
  { name: "Doodle", value: "doodle", icon: "✏️" },
  { name: "Neon", value: "neon", icon: "⚡" },
  { name: "Focus", value: "focus", icon: "🎯" },
  { name: "Brain Dump", value: "braindump", icon: "🧠" },
] as const;
