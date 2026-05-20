import type { ProductivityMood } from "@/types";

export function calculateProductivityMood(
  completed: number,
  total: number
): ProductivityMood {
  if (total === 0) return "start";
  const rate = completed / total;
  if (rate >= 0.8) return "fire";
  if (rate >= 0.5) return "good";
  if (rate >= 0.2) return "okay";
  return "rest";
}

export function getMoodEmoji(mood: ProductivityMood): string {
  const map: Record<ProductivityMood, string> = {
    fire: "🔥",
    good: "✨",
    okay: "🌱",
    rest: "😌",
    start: "🌅",
  };
  return map[mood];
}

export function getMoodLabel(mood: ProductivityMood): string {
  const map: Record<ProductivityMood, string> = {
    fire: "On fire today!",
    good: "Good vibes ✨",
    okay: "Steady progress",
    rest: "Rest day energy",
    start: "Ready to begin?",
  };
  return map[mood];
}

export function getMoodColor(mood: ProductivityMood): string {
  const map: Record<ProductivityMood, string> = {
    fire: "#FFD6E0",
    good: "#E8D5F5",
    okay: "#D4EDDA",
    rest: "#C5D5EA",
    start: "#FFF3CD",
  };
  return map[mood];
}

export function calculateStreak(logs: { date: string; tasksCompleted: number }[]): number {
  if (logs.length === 0) return 0;

  const sorted = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sorted.length; i++) {
    const logDate = new Date(sorted[i].date);
    logDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (logDate.getTime() === expectedDate.getTime() && sorted[i].tasksCompleted > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
