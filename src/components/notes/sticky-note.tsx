"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "motion/react";
import type { Note } from "@/types";
import { useNotesStore } from "@/stores/notes-store";
import { useUIStore } from "@/stores/ui-store";
import { cn, formatRelative } from "@/lib/utils";

interface StickyNoteProps {
  note: Note;
  onDeskMode?: boolean;
}

export function StickyNote({ note, onDeskMode = false }: StickyNoteProps) {
  const saveNote = useNotesStore((s) => s.saveNote);
  const removeNote = useNotesStore((s) => s.removeNote);
  const bringToFront = useNotesStore((s) => s.bringToFront);
  const openEditor = useUIStore((s) => s.openEditor);
  const addToast = useUIStore((s) => s.addToast);
  const [isDragging, setIsDragging] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, noteX: note.posX, noteY: note.posY });

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    e.preventDefault();
    setIsDragging(true);
    bringToFront(note.id);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      noteX: note.posX,
      noteY: note.posY,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      saveNote(note.id, {
        posX: dragRef.current.noteX + dx,
        posY: dragRef.current.noteY + dy,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [note.id, note.posX, note.posY, bringToFront, saveNote]);

  const handleDelete = () => {
    removeNote(note.id);
    addToast("poof, gone ✨");
  };

  const handlePin = () => {
    saveNote(note.id, { isPinned: !note.isPinned });
    addToast(note.isPinned ? "unpinned 📌" : "pinned! 📌");
  };

  const handleFavorite = () => {
    saveNote(note.id, { isFavorite: !note.isFavorite });
  };

  const getNoteClass = () => {
    switch (note.type) {
      case "minimal": return "note-minimal";
      case "glass": return "note-glass";
      case "neon": return "note-neon";
      case "focus": return "note-focus";
      case "braindump": return "note-braindump";
      case "doodle": return "note-doodle";
      default: return "note-pastel";
    }
  };

  const noteStyle = onDeskMode
    ? {
        position: "absolute" as const,
        left: note.posX,
        top: note.posY,
        width: note.width,
        zIndex: note.zIndex,
        backgroundColor: (note.type === "neon" || note.type === "glass" || note.type === "doodle" || note.type === "braindump" || note.type === "minimal" || note.type === "focus") ? undefined : note.color,
      }
    : {
        backgroundColor: (note.type === "neon" || note.type === "glass" || note.type === "doodle" || note.type === "braindump" || note.type === "minimal" || note.type === "focus") ? undefined : note.color,
      };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: isDragging ? 2 : 0,
      }}
      exit={{ opacity: 0, scale: 0.8, rotate: -5 }}
      whileHover={!isDragging ? { y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" } : undefined}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className={cn(
        "rounded-[14px] overflow-hidden group",
        getNoteClass(),
        isDragging ? "cursor-grabbing shadow-iris-xl" : onDeskMode ? "cursor-grab" : "cursor-pointer",
        !onDeskMode && "w-full"
      )}
      style={noteStyle}
      onMouseDown={onDeskMode ? handleDragStart : undefined}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onDoubleClick={() => openEditor(note.id)}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{
          background: note.type === "neon"
            ? "linear-gradient(90deg, #E8D5F5, #FFD6E0, #C5D5EA)"
            : `linear-gradient(90deg, ${note.color}, transparent)`,
        }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {note.emoji && <span className="text-lg">{note.emoji}</span>}
            {note.title && (
              <h3
                className={cn(
                  "font-semibold text-sm truncate",
                  note.type === "neon" ? "text-white" : "text-iris-gray-800"
                )}
              >
                {note.title}
              </h3>
            )}
            {note.isPinned && <span className="text-xs">📌</span>}
          </div>

          {/* Action buttons */}
          <motion.div
            initial={false}
            animate={{ opacity: showActions ? 1 : 0 }}
            className="flex items-center gap-1 ml-2"
            data-no-drag
          >
            <button
              onClick={handleFavorite}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-xs"
            >
              {note.isFavorite ? "💖" : "🤍"}
            </button>
            <button
              onClick={handlePin}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-xs"
            >
              📌
            </button>
            <button
              onClick={handleDelete}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors text-xs"
            >
              🗑️
            </button>
          </motion.div>
        </div>

        {/* Content */}
        {note.content && (
          <p
            className={cn(
              "text-sm leading-relaxed mb-3 line-clamp-6",
              note.type === "neon" ? "text-gray-300" : "text-iris-gray-600"
            )}
          >
            {note.content}
          </p>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p
          className={cn(
            "text-[10px] mt-2",
            note.type === "neon" ? "text-gray-500" : "text-iris-gray-400"
          )}
        >
          {formatRelative(note.updatedAt)}
        </p>
      </div>
    </motion.div>
  );
}
