"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCalendarStore } from "@/stores/calendar-store";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const EVENT_COLORS = ["#FFD6E0", "#E8D5F5", "#C5D5EA", "#D4EDDA", "#FFDAB9", "#FFF3CD"];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function CalendarView() {
  const { events, view, selectedDate, currentMonth, setView, setSelectedDate, navigateMonth, fetchEvents, createEvent, removeEvent } = useCalendarStore();
  const addToast = useUIStore((s) => s.addToast);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("#E8D5F5");

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const today = new Date();

  const monthDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const days: { date: Date; current: boolean }[] = [];
    for (let i = firstDay - 1; i >= 0; i--) days.push({ date: new Date(year, month - 1, prevDays - i), current: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ date: new Date(year, month, i), current: true });
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ date: new Date(year, month + 1, i), current: false });
    return days;
  }, [currentMonth]);

  const weekDays = useMemo(() => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
  }, [selectedDate]);

  const getEventsForDate = (date: Date) => events.filter((e) => isSameDay(new Date(e.date), date));

  const handleAddEvent = async () => {
    if (!newTitle.trim()) return;
    await createEvent({ title: newTitle, date: selectedDate.toISOString(), color: newColor });
    setNewTitle(""); setShowAdd(false);
    addToast("event added ✨");
  };

  const dayEvents = getEventsForDate(selectedDate);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-iris-gray-800">Calendar 📅</h1>
          <p className="text-sm text-iris-gray-400 mt-0.5">{events.length} events planned</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-iris-gray-100 rounded-full p-0.5">
            {(["month", "week", "day"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={cn("px-3 py-1 rounded-full text-xs font-medium capitalize transition-all", view === v ? "bg-white shadow-sm text-iris-gray-800" : "text-iris-gray-500")}>{v}</button>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAdd(true)} className="px-4 py-1.5 rounded-full text-xs font-medium text-iris-gray-800" style={{ background: "linear-gradient(135deg, #FFD6E0, #E8D5F5)" }}>+ Add Event</motion.button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        {/* Calendar grid */}
        <div className="flex-1">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigateMonth(-1)} className="w-8 h-8 rounded-full bg-iris-gray-100 flex items-center justify-center text-iris-gray-500 hover:bg-iris-gray-200 transition-colors">←</button>
            <h2 className="text-lg font-semibold text-iris-gray-700">{MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
            <button onClick={() => navigateMonth(1)} className="w-8 h-8 rounded-full bg-iris-gray-100 flex items-center justify-center text-iris-gray-500 hover:bg-iris-gray-200 transition-colors">→</button>
          </div>

          {view === "month" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-[16px] p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map((d) => (<div key={d} className="text-center text-[10px] font-semibold text-iris-gray-400 uppercase tracking-wider py-1">{d}</div>))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map(({ date, current }, i) => {
                  const isToday = isSameDay(date, today);
                  const isSelected = isSameDay(date, selectedDate);
                  const dayEvts = getEventsForDate(date);
                  return (
                    <motion.button key={i} whileHover={{ scale: 1.05 }} onClick={() => setSelectedDate(new Date(date))}
                      className={cn("aspect-square rounded-[10px] flex flex-col items-center justify-center gap-0.5 text-sm transition-all relative", !current && "opacity-30", isToday && "calendar-day today", isSelected && !isToday && "calendar-day selected", !isToday && !isSelected && "calendar-day hover:bg-iris-gray-100")}>
                      <span className={cn("font-medium", isToday && "text-iris-gray-800")}>{date.getDate()}</span>
                      {dayEvts.length > 0 && (
                        <div className="flex gap-0.5">
                          {dayEvts.slice(0, 3).map((e, j) => (<div key={j} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.color }} />))}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {view === "week" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-[16px] p-4">
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((date, i) => {
                  const isToday = isSameDay(date, today);
                  const isSelected = isSameDay(date, selectedDate);
                  const dayEvts = getEventsForDate(date);
                  return (
                    <button key={i} onClick={() => setSelectedDate(new Date(date))}
                      className={cn("rounded-[12px] p-3 flex flex-col items-center gap-2 transition-all", isToday && "bg-gradient-to-b from-iris-pink-soft to-iris-lavender-soft", isSelected && !isToday && "bg-iris-lavender-soft", !isToday && !isSelected && "hover:bg-iris-gray-100")}>
                      <span className="text-[10px] font-medium text-iris-gray-400 uppercase">{DAYS[i]}</span>
                      <span className={cn("text-lg font-bold", isToday ? "text-iris-gray-800" : "text-iris-gray-600")}>{date.getDate()}</span>
                      <div className="flex flex-col gap-1 w-full">
                        {dayEvts.slice(0, 2).map((e, j) => (<div key={j} className="text-[9px] px-1.5 py-0.5 rounded-full truncate font-medium" style={{ backgroundColor: e.color }}>{e.title}</div>))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {view === "day" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-[16px] p-6">
              <h3 className="text-lg font-semibold text-iris-gray-700 mb-4">{selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
              {dayEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-3xl mb-2">📅</p>
                  <p className="text-sm text-iris-gray-400">No events today — enjoy the free time ✨</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {dayEvents.map((e) => (<EventCard key={e.id} event={e} onDelete={() => { removeEvent(e.id); addToast("event removed ✨"); }} />))}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Side panel */}
        <div className="lg:w-[280px] flex flex-col gap-4">
          <div className="glass rounded-[16px] p-4">
            <h3 className="text-sm font-semibold text-iris-gray-700 mb-3">
              {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} events
            </h3>
            {dayEvents.length === 0 ? (
              <p className="text-xs text-iris-gray-400 italic">nothing planned ✨</p>
            ) : (
              <div className="flex flex-col gap-2">
                {dayEvents.map((e) => (<EventCard key={e.id} event={e} compact onDelete={() => { removeEvent(e.id); addToast("event removed ✨"); }} />))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add event modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={() => setShowAdd(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed inset-x-4 top-[20%] mx-auto max-w-md z-50 glass-strong rounded-[20px] shadow-iris-xl p-6">
              <h3 className="text-lg font-bold text-iris-gray-800 mb-4">Add Event ✨</h3>
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Event title..." className="w-full px-3 py-2 rounded-[10px] bg-iris-gray-50 border border-iris-gray-200 text-sm outline-none mb-3" autoFocus />
              <p className="text-xs text-iris-gray-500 mb-2">Date: {selectedDate.toLocaleDateString()}</p>
              <div className="flex gap-1.5 mb-4">
                {EVENT_COLORS.map((c) => (<button key={c} onClick={() => setNewColor(c)} className="w-6 h-6 rounded-full transition-transform hover:scale-110" style={{ backgroundColor: c, border: newColor === c ? "2px solid #78736D" : "2px solid transparent" }} />))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-[10px] text-sm bg-iris-gray-100 text-iris-gray-500">Cancel</button>
                <motion.button whileTap={{ scale: 0.98 }} onClick={handleAddEvent} className="flex-1 py-2 rounded-[10px] text-sm font-medium text-iris-gray-800" style={{ background: "linear-gradient(135deg, #FFD6E0, #E8D5F5)" }}>Add ✨</motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function EventCard({ event, compact, onDelete }: { event: CalendarEvent; compact?: boolean; onDelete: () => void }) {
  return (
    <motion.div layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={cn("rounded-[10px] flex items-center gap-2 group", compact ? "p-2" : "p-3")} style={{ backgroundColor: event.color + "40" }}>
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: event.color }} />
      <span className={cn("font-medium text-iris-gray-700 flex-1 truncate", compact ? "text-xs" : "text-sm")}>{event.title}</span>
      <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-iris-gray-400 hover:text-iris-error">✕</button>
    </motion.div>
  );
}
