"use client";

import { create } from "zustand";
import type { Note } from "@/types";

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  activeNoteId: string | null;
  maxZIndex: number;
  toastMessage: string | null;

  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  bringToFront: (id: string) => void;
  setToast: (msg: string | null) => void;

  fetchNotes: (section?: string) => Promise<void>;
  createNote: (data: Partial<Note>) => Promise<Note | null>;
  saveNote: (id: string, updates: Partial<Note>) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
  toggleNoteTask: (noteId: string, taskId: string, currentCompleted: boolean) => Promise<void>;
  addNoteTask: (noteId: string, text: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: false,
  activeNoteId: null,
  maxZIndex: 0,
  toastMessage: null,

  setNotes: (notes) => {
    const maxZ = notes.reduce((max, n) => Math.max(max, n.zIndex), 0);
    set({ notes, maxZIndex: maxZ });
  },

  addNote: (note) =>
    set((s) => ({
      notes: [note, ...s.notes],
      maxZIndex: Math.max(s.maxZIndex, note.zIndex),
    })),

  updateNote: (id, updates) =>
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    })),

  deleteNote: (id) =>
    set((s) => ({
      notes: s.notes.filter((n) => n.id !== id),
      activeNoteId: s.activeNoteId === id ? null : s.activeNoteId,
    })),

  setActiveNote: (id) => set({ activeNoteId: id }),

  bringToFront: (id) => {
    const newZ = get().maxZIndex + 1;
    set((s) => ({
      maxZIndex: newZ,
      notes: s.notes.map((n) => (n.id === id ? { ...n, zIndex: newZ } : n)),
    }));
  },

  setToast: (msg) => set({ toastMessage: msg }),

  fetchNotes: async (section) => {
    set({ isLoading: true });
    try {
      const url = section ? `/api/notes?section=${section}` : "/api/notes";
      const res = await fetch(url);
      const data = await res.json();
      get().setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  createNote: async (data) => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const note = await res.json();
      const parsed: Note = { ...note, tags: JSON.parse(note.tags || "[]") };
      get().addNote(parsed);
      return parsed;
    } catch (err) {
      console.error("Failed to create note:", err);
      return null;
    }
  },

  saveNote: async (id, updates) => {
    get().updateNote(id, updates);
    try {
      const body = { ...updates };
      if (body.tags) {
        (body as Record<string, unknown>).tags = JSON.stringify(body.tags);
      }
      await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  },

  removeNote: async (id) => {
    get().deleteNote(id);
    try {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  },

  toggleNoteTask: async (noteId, taskId, currentCompleted) => {
    // Optimistic update
    set((s) => ({
      notes: s.notes.map((n) => {
        if (n.id !== noteId || !n.tasks) return n;
        const updatedTasks = n.tasks.map((t) => (t.id === taskId ? { ...t, completed: !currentCompleted } : t));
        const allDone = updatedTasks.length > 0 && updatedTasks.every(t => t.completed);
        return {
          ...n,
          tasks: updatedTasks,
          section: allDone ? "completed" : "active",
        } as Note;
      }),
    }));

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentCompleted }),
      });
      const data = await res.json();
      if (data.noteCompleted) {
        get().setToast("Note Completed! ✨🎉");
      }
    } catch (err) {
      console.error("Failed to toggle note task:", err);
    }
  },

  addNoteTask: async (noteId, text) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId, text }),
      });
      const newTask = await res.json();
      set((s) => ({
        notes: s.notes.map(n => n.id === noteId ? { ...n, tasks: [...(n.tasks || []), newTask], section: "active" } : n)
      }));
    } catch (err) {
      console.error("Failed to add note task:", err);
    }
  },
}));
