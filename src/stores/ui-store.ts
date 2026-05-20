"use client";

import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  editorNoteId: string | null;
  editorOpen: boolean;
  toasts: { id: string; message: string; type: "success" | "info" | "error" }[];

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openEditor: (noteId?: string) => void;
  closeEditor: () => void;
  addToast: (message: string, type?: "success" | "info" | "error") => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: true,
  editorNoteId: null,
  editorOpen: false,
  toasts: [],

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  openEditor: (noteId) =>
    set({ editorOpen: true, editorNoteId: noteId || null }),
  closeEditor: () => set({ editorOpen: false, editorNoteId: null }),

  addToast: (message, type = "success") => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => get().removeToast(id), 3000);
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
