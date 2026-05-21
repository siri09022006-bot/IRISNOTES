// ━━━ Note Types ━━━
export type NoteType = "pastel" | "minimal" | "glass" | "doodle" | "neon" | "focus" | "braindump";

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  color: string;
  tags: string[];
  emoji?: string | null;
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  posX: number;
  posY: number;
  width: number;
  height: number;
  zIndex: number;
  section: string;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
}

// ━━━ Task Types ━━━
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  noteId?: string | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ━━━ Event Types ━━━
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string | null;
  color: string;
  isRecurring: boolean;
  recurType?: string | null;
  noteId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ━━━ Connection Types ━━━
export interface Connection {
  id: string;
  fromNoteId: string;
  toNoteId: string;
  createdAt: string;
}

// ━━━ Productivity Types ━━━
export interface ProductivityLog {
  id: string;
  date: string;
  tasksCompleted: number;
  tasksTotal: number;
  streak: number;
  memeShown?: string | null;
  createdAt: string;
}

export type ProductivityMood = "fire" | "good" | "okay" | "rest" | "start";

// ━━━ Meme Types ━━━
export interface MemeCard {
  id: string;
  title: string;
  message: string;
  emoji: string;
  gradient: string;
  trigger: "streak" | "completion" | "comeback" | "random";
}

// ━━━ Calendar Types ━━━
export type CalendarView = "month" | "week" | "day";

// ━━━ UI Types ━━━
export type AppSection = "dashboard" | "notes" | "whiteboard" | "calendar";
