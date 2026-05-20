import type { MemeCard } from "@/types";

export const memeCards: MemeCard[] = [
  {
    id: "1",
    title: "Productivity Legend",
    message: "rare productive species spotted in the wild 👀",
    emoji: "🦄",
    gradient: "linear-gradient(135deg, #FFD6E0, #E8D5F5)",
    trigger: "completion",
  },
  {
    id: "2",
    title: "Locked In",
    message: "bro actually locked in today. no cap. 🔐",
    emoji: "🔥",
    gradient: "linear-gradient(135deg, #E8D5F5, #C5D5EA)",
    trigger: "streak",
  },
  {
    id: "3",
    title: "Academic Comeback",
    message: "academic comeback loading... 99% complete 📚",
    emoji: "📈",
    gradient: "linear-gradient(135deg, #C5D5EA, #D4EDDA)",
    trigger: "comeback",
  },
  {
    id: "4",
    title: "Main Character Energy",
    message: "POV: you're the productive friend for once ✨",
    emoji: "💅",
    gradient: "linear-gradient(135deg, #FFD6E0, #FFDAB9)",
    trigger: "completion",
  },
  {
    id: "5",
    title: "Streak Mode",
    message: "the consistency is giving... unstoppable 🏃‍♀️",
    emoji: "⚡",
    gradient: "linear-gradient(135deg, #FFF3CD, #FFDAB9)",
    trigger: "streak",
  },
  {
    id: "6",
    title: "We're So Back",
    message: "the comeback kid just entered the chat 🎤",
    emoji: "🎯",
    gradient: "linear-gradient(135deg, #D4EDDA, #C5D5EA)",
    trigger: "comeback",
  },
  {
    id: "7",
    title: "Getting Things Done",
    message: "today's vibe: actually crossing things off the list ✅",
    emoji: "✨",
    gradient: "linear-gradient(135deg, #E8D5F5, #FFD6E0)",
    trigger: "completion",
  },
  {
    id: "8",
    title: "Discipline Era",
    message: "you woke up and chose productivity. respect. 🫡",
    emoji: "👑",
    gradient: "linear-gradient(135deg, #FFDAB9, #FFD6E0)",
    trigger: "streak",
  },
  {
    id: "9",
    title: "Rest & Reset",
    message: "plot twist: resting IS being productive 🧖",
    emoji: "😌",
    gradient: "linear-gradient(135deg, #C5D5EA, #E8D5F5)",
    trigger: "random",
  },
  {
    id: "10",
    title: "Tiny Wins",
    message: "every small step is still a step forward 🐾",
    emoji: "🌱",
    gradient: "linear-gradient(135deg, #D4EDDA, #FFF3CD)",
    trigger: "random",
  },
];

export function getMemeForContext(trigger: MemeCard["trigger"]): MemeCard {
  const filtered = memeCards.filter((m) => m.trigger === trigger);
  if (filtered.length === 0) {
    return memeCards[Math.floor(Math.random() * memeCards.length)];
  }
  return filtered[Math.floor(Math.random() * filtered.length)];
}
