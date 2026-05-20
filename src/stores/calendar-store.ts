"use client";

import { create } from "zustand";
import type { CalendarEvent, CalendarView } from "@/types";

interface CalendarState {
  events: CalendarEvent[];
  isLoading: boolean;
  view: CalendarView;
  selectedDate: Date;
  currentMonth: Date;

  setView: (view: CalendarView) => void;
  setSelectedDate: (date: Date) => void;
  setCurrentMonth: (date: Date) => void;
  navigateMonth: (direction: 1 | -1) => void;

  fetchEvents: () => Promise<void>;
  createEvent: (data: Partial<CalendarEvent>) => Promise<CalendarEvent | null>;
  saveEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  isLoading: false,
  view: "month",
  selectedDate: new Date(),
  currentMonth: new Date(),

  setView: (view) => set({ view }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setCurrentMonth: (date) => set({ currentMonth: date }),

  navigateMonth: (direction) => {
    const current = get().currentMonth;
    const next = new Date(current);
    next.setMonth(next.getMonth() + direction);
    set({ currentMonth: next });
  },

  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      set({ events: data });
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  createEvent: async (data) => {
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const event = await res.json();
      set((s) => ({ events: [event, ...s.events] }));
      return event;
    } catch (err) {
      console.error("Failed to create event:", err);
      return null;
    }
  },

  saveEvent: async (id, updates) => {
    set((s) => ({
      events: s.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
    try {
      await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error("Failed to save event:", err);
    }
  },

  removeEvent: async (id) => {
    set((s) => ({ events: s.events.filter((e) => e.id !== id) }));
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  },
}));
