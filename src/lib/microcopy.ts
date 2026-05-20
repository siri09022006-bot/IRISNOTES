const creationMessages = [
  "another thought saved ✨",
  "chaos successfully organized 📝",
  "future you will appreciate this 💭",
  "tiny idea captured 🌱",
  "your brain just got lighter ☁️",
  "noted, bestie 💅",
  "thought: secured 🔒",
  "adding to the vision board ✨",
  "manifesting productivity 🌟",
  "slay, you remembered something 💫",
];

const deletionMessages = [
  "poof, gone ✨",
  "decluttering energy 🧹",
  "letting go is growth 🌿",
  "minimalist arc unlocked 💅",
  "out with the old ✨",
];

const greetingMessages = [
  "your desk looks cute today ✨",
  "welcome back to your second brain 🧠",
  "ready to organize some chaos? 💫",
  "your thoughts missed you 💭",
  "let's make today aesthetic ✨",
  "the vibes are immaculate today 🌸",
  "your creative space awaits 🎨",
  "time to turn thoughts into plans 📋",
];

const productiveMessages = [
  "you cooked today fr 🔥",
  "future you is proud 🥹",
  "locked in energy detected 🎯",
  "main character productivity arc 🌟",
  "rare productive species spotted 👀",
  "bro actually locked in 💪",
  "certified getting-things-done era 💅",
  "the grind is real and aesthetic ✨",
  "your to-do list is shaking rn 📋",
  "academic weapon mode: activated 🎓",
];

const lowProductivityMessages = [
  "tomorrow comeback arc? 🌅",
  "even legends rest 😌",
  "tiny progress still counts 🌱",
  "rest is part of the process 💤",
  "recharging for tomorrow's slay 🔋",
  "soft launch into productivity mode 🐌",
  "it's giving: self-care day 🧖",
  "plot twist: rest is productive too 💫",
];

const streakMessages = [
  "streak is giving consistency 🔥",
  "the discipline is disciplining ✨",
  "unstoppable era loading... 💫",
  "consistent queen/king behavior 👑",
  "momentum: acquired 🚀",
];

const comebackMessages = [
  "the comeback is always stronger 💪",
  "redemption arc activated ✨",
  "we're so back 🔥",
  "plot twist: you showed up 🌟",
  "character development >>>  📈",
];

export function getRandomMessage(type: "creation" | "deletion" | "greeting" | "productive" | "low" | "streak" | "comeback"): string {
  const messages = {
    creation: creationMessages,
    deletion: deletionMessages,
    greeting: greetingMessages,
    productive: productiveMessages,
    low: lowProductivityMessages,
    streak: streakMessages,
    comeback: comebackMessages,
  };
  const arr = messages[type];
  return arr[Math.floor(Math.random() * arr.length)];
}
