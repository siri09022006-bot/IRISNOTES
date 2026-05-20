"use client";

import { create } from "zustand";
import type { Task } from "@/types";

interface TasksState {
  tasks: Task[];
  isLoading: boolean;

  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  fetchTasks: () => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<Task | null>;
  saveTask: (id: string, updates: Partial<Task>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  isLoading: false,

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  deleteTask: (id) =>
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      set({ tasks: data });
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (data) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const task = await res.json();
      get().addTask(task);
      return task;
    } catch (err) {
      console.error("Failed to create task:", err);
      return null;
    }
  },

  saveTask: async (id, updates) => {
    get().updateTask(id, updates);
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error("Failed to save task:", err);
    }
  },

  removeTask: async (id) => {
    get().deleteTask(id);
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  },

  toggleTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    await get().saveTask(id, { completed: !task.completed });
  },
}));
