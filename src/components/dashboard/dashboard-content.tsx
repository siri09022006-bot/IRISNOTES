"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNotesStore } from "@/stores/notes-store";
import { cn } from "@/lib/utils";
import type { Note } from "@/types";

const PASTEL_COLORS = ["#ffe4e6", "#fef9c3", "#e0f2fe", "#f3e8ff", "#ffedd5"];
const STYLES = ["grid-tape", "spiral", "heart-clip"];

export function DashboardContent() {
  const notes = useNotesStore((s) => s.notes);
  const fetchNotes = useNotesStore((s) => s.fetchNotes);
  const createNote = useNotesStore((s) => s.createNote);
  const toggleNoteTask = useNotesStore((s) => s.toggleNoteTask);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const activeNotes = notes.filter((n) => n.section !== "completed" && !n.isArchived);
  const completedNotes = notes.filter((n) => n.section === "completed" && !n.isArchived);

  // --- Productivity Analysis ---
  let totalTasks = 0;
  let completedTasks = 0;
  notes.forEach(n => {
    if (n.tasks && n.tasks.length > 0) {
      totalTasks += n.tasks.length;
      completedTasks += n.tasks.filter(t => t.completed).length;
    } else if (n.section === "completed") {
      // If an empty note was manually marked completed, count it as a "task" done.
      totalTasks += 1;
      completedTasks += 1;
    } else {
      // Empty active note
      totalTasks += 1;
    }
  });

  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  
  let vibeMessage = "";
  if (totalTasks === 0) vibeMessage = "Add some tasks to get started! 💕";
  else if (progress === 0) vibeMessage = "Let's get this bread! 🥖";
  else if (progress < 30) vibeMessage = "Taking the first steps! ✨";
  else if (progress < 70) vibeMessage = "Halfway there! Keep it up! 🌸";
  else if (progress < 100) vibeMessage = "So close! You're doing amazing! 🎀";
  else vibeMessage = "100% DONE! Absolute Boss! 👑🎉";

  const handleCreateNewNote = async () => {
    await createNote({
      title: "",
      color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
      section: "active",
      type: STYLES[Math.floor(Math.random() * STYLES.length)] as any,
    });
  };

  return (
    <div className="h-[calc(100vh-40px)] p-4 lg:p-6 font-sans w-full relative">
      
      {/* Productivity Vibe Check Floating Widget */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md px-8 py-4 rounded-full shadow-[0_10px_40px_rgba(244,114,182,0.3)] border-2 border-pink-200 flex items-center gap-6"
      >
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#a8a29e] uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-quicksand)" }}>Productivity Vibe</span>
          <span className="text-lg font-bold text-[#44403c]" style={{ fontFamily: "var(--font-kalam)" }}>{vibeMessage}</span>
        </div>
        
        <div className="flex items-center gap-3 bg-[#fdf2f8] px-4 py-2 rounded-full border border-pink-100">
          <div className="w-24 h-3 bg-white rounded-full overflow-hidden border border-pink-200">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-pink-300 to-pink-500 rounded-full"
            />
          </div>
          <span className="text-sm font-bold text-[#f472b6]" style={{ fontFamily: "var(--font-quicksand)" }}>{progress}%</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full max-w-[1920px] mx-auto w-full pb-20">
        
        {/* LEFT: Active Board */}
        <div className="flex flex-col h-full rounded-[24px] overflow-hidden shadow-sm relative bg-[#fafaf9]">
          <div className="p-5 border-b-2 border-dashed border-[#e7e5e4] bg-[#f5f5f4] flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#78716c] flex items-center gap-2">
              🌸 Active Notes <span className="text-xs font-bold text-white bg-[#f472b6] px-2 py-1 rounded-full shadow-sm ml-2">{activeNotes.length}</span>
            </h2>
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateNewNote}
              className="px-4 py-2 bg-[#f472b6] text-white text-sm font-bold rounded-full shadow-sm flex items-center gap-2"
            >
              + New Sticky Note
            </motion.button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 relative flex flex-wrap justify-center content-start gap-8" style={{ backgroundImage: "radial-gradient(#e7e5e4 2px, transparent 2px)", backgroundSize: "20px 20px" }}>
            <AnimatePresence>
              {activeNotes.map((note) => (
                <CuteNoteItem key={note.id} note={note} onToggleTask={(taskId, current) => toggleNoteTask(note.id, taskId, current)} />
              ))}
              {activeNotes.length === 0 && (
                <div className="text-center py-12 text-[#a8a29e] text-sm font-medium w-full mt-10">
                  Nothing to do! Click "+ New Sticky Note" to start. ✨
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Completed Board */}
        <div className="flex flex-col h-full rounded-[24px] overflow-hidden shadow-sm relative bg-[#fdfbf7]">
          <div className="p-5 border-b-2 border-dashed border-[#e7e5e4] bg-[#f5f5f4] flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#78716c] flex items-center gap-2">
              ✨ Completed
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 relative flex flex-wrap justify-center content-start gap-8" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.03) 2px, transparent 2px)", backgroundSize: "100% 30px" }}>
            <AnimatePresence>
              {completedNotes.map((note) => (
                <CuteNoteItem key={note.id} note={note} onToggleTask={(taskId, current) => toggleNoteTask(note.id, taskId, current)} />
              ))}
              {completedNotes.length === 0 && (
                <div className="text-center py-12 text-[#a8a29e] text-sm font-medium w-full mt-10">
                  Completed notes will live here!
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}

// ━━━ Inline Editable Note Component ━━━
function CuteNoteItem({ note, onToggleTask }: { note: Note, onToggleTask: (taskId: string, current: boolean) => void }) {
  const isCompleted = note.section === "completed";
  const styleType = note.type || "grid-tape"; 
  const addNoteTask = useNotesStore((s) => s.addNoteTask);
  const saveNote = useNotesStore((s) => s.saveNote);

  const [newTaskInput, setNewTaskInput] = useState("");
  const [titleInput, setTitleInput] = useState(note.title);

  // Sync title if it updates remotely
  useEffect(() => { setTitleInput(note.title); }, [note.title]);

  const handleAddTask = () => {
    if (newTaskInput.trim()) {
      addNoteTask(note.id, newTaskInput.trim());
      setNewTaskInput("");
    }
  };

  const handleTitleBlur = () => {
    if (titleInput !== note.title) {
      saveNote(note.id, { title: titleInput });
    }
  };

  const isGridTape = styleType === "grid-tape";
  const isSpiral = styleType === "spiral";
  const isHeartClip = styleType === "heart-clip";

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: isCompleted ? 0 : (note.id.charCodeAt(0) % 2 === 0 ? 1 : -1) }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        "w-[320px] h-auto min-h-[320px] flex flex-col relative border-[1px] border-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
        isSpiral ? "rounded-[24px]" : "rounded-[12px]"
      )}
      style={{ 
        backgroundColor: isCompleted ? "#f3f4f6" : note.color,
        opacity: isCompleted ? 0.7 : 1,
        backgroundImage: isGridTape && !isCompleted ? "linear-gradient(transparent 23px, rgba(0,0,0,0.05) 24px), linear-gradient(90deg, transparent 23px, rgba(0,0,0,0.05) 24px)" : "none",
        backgroundSize: "24px 24px"
      }} 
    >
      {/* 1. Grid Tape */}
      {isGridTape && !isCompleted && (
        <div className="absolute -top-4 right-6 w-24 h-8 bg-[#bae6fd] opacity-90 rotate-[8deg] shadow-sm flex items-center justify-center overflow-hidden z-30">
           <div className="w-full h-full border-[1.5px] border-dashed border-[#7dd3fc]" />
        </div>
      )}

      {/* 2. Heart Clip */}
      {isHeartClip && !isCompleted && (
        <div className="absolute -top-6 left-8 z-20 scale-125 hover:rotate-[5deg] transition-transform cursor-pointer">
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4 C12 0 4 0 4 8 C4 16 12 24 12 24 C12 24 20 16 20 8 C20 0 12 0 12 4 Z" fill="#f9a8d4" />
            <rect x="9" y="18" width="6" height="20" rx="3" stroke="#f9a8d4" strokeWidth="2" fill="none" />
          </svg>
        </div>
      )}

      {/* 3. Spiral */}
      {isSpiral && !isCompleted && (
        <div className="absolute -top-4 left-0 right-0 flex justify-evenly px-6 z-20">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-3 h-8 bg-white border-2 border-[#d6d3d1] rounded-full shadow-md" />
          ))}
        </div>
      )}

      <div className="p-6 pt-10 relative z-10 flex-1 flex flex-col overflow-hidden">
        
        {/* Inline Editable Title */}
        <input 
          type="text"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          onBlur={handleTitleBlur}
          placeholder="Title goes here..."
          readOnly={isCompleted}
          className={cn(
            "w-full bg-transparent outline-none font-bold text-3xl mb-6 text-center truncate focus:border-b-2 focus:border-black/10 pb-1 transition-all", 
            isCompleted ? "text-[#a8a29e] line-through cursor-default" : "text-[#44403c]"
          )}
          style={{ fontFamily: "var(--font-kalam)" }}
        />
        
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden">
          {note.tasks && note.tasks.length > 0 ? (
            note.tasks.map((task) => (
              <div key={task.id} className="flex items-start justify-between gap-3 group cursor-pointer w-full p-1 -ml-1 rounded-lg hover:bg-black/5 transition-colors" onClick={() => onToggleTask(task.id, task.completed)}>
                <span className={cn("text-xl leading-snug font-medium transition-colors break-words flex-1", task.completed ? "line-through text-[#a8a29e]" : "text-[#44403c]")} style={{ fontFamily: "var(--font-kalam)" }}>
                  {task.text}
                </span>
                <div 
                  className={cn("mt-1 w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center transition-all border-[2px]", task.completed ? "border-[#f472b6] bg-[#f472b6] text-white shadow-inner" : "border-black/20 bg-white")}
                >
                  {task.completed && <span className="text-[14px] font-bold">✓</span>}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 gap-2 mt-2 opacity-60">
              <p className="text-xl text-[#a8a29e] text-center" style={{ fontFamily: "var(--font-kalam)" }}>No tasks yet ✨</p>
              {!isCompleted && (
                <button 
                  onClick={() => saveNote(note.id, { section: "completed" })}
                  className="mt-4 px-4 py-2 bg-white rounded-full text-xs font-bold text-[#f472b6] border-2 border-[#f472b6] hover:bg-[#f472b6] hover:text-white transition-colors uppercase tracking-widest shadow-sm"
                  style={{ fontFamily: "var(--font-quicksand)" }}
                >
                  Mark Complete ✓
                </button>
              )}
            </div>
          )}
        </div>

        {/* Inline Task Creation Input */}
        {!isCompleted && (
          <div className="mt-4 pt-4 border-t-2 border-black/5 flex items-center gap-3">
            <input 
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              placeholder="add a new task..."
              className="flex-1 bg-transparent text-xl font-medium text-[#44403c] placeholder:text-[#a8a29e]/70 outline-none"
              style={{ fontFamily: "var(--font-kalam)" }}
            />
            <button 
              onClick={handleAddTask}
              className="w-8 h-8 rounded-full bg-black/5 text-[#78716c] font-bold text-lg flex items-center justify-center hover:bg-[#f472b6] hover:text-white hover:scale-110 active:scale-95 transition-all"
            >
              +
            </button>
          </div>
        )}

      </div>
    </motion.div>
  );
}
