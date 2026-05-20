"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNotesStore } from "@/stores/notes-store";
import { useUIStore } from "@/stores/ui-store";
import { StickyNote } from "./sticky-note";
import { NOTE_TYPES } from "@/lib/utils";

export function NotesDesk() {
  const notes = useNotesStore((s) => s.notes);
  const fetchNotes = useNotesStore((s) => s.fetchNotes);
  const isLoading = useNotesStore((s) => s.isLoading);
  const openEditor = useUIStore((s) => s.openEditor);

  const [viewMode, setViewMode] = useState<"desk" | "grid">("grid");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterFav, setFilterFav] = useState(false);

  useEffect(() => {
    fetchNotes("desk");
  }, [fetchNotes]);

  const deskNotes = notes.filter((n) => {
    if (n.isArchived) return false;
    if (filterType !== "all" && n.type !== filterType) return false;
    if (filterFav && !n.isFavorite) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-iris-gray-800">
            Notes Desk 📝
          </h1>
          <p className="text-sm text-iris-gray-400 mt-0.5">
            {deskNotes.length} note{deskNotes.length !== 1 ? "s" : ""} • your creative space
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex items-center bg-iris-gray-100 rounded-full p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-iris-gray-800"
                  : "text-iris-gray-500"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("desk")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                viewMode === "desk"
                  ? "bg-white shadow-sm text-iris-gray-800"
                  : "text-iris-gray-500"
              }`}
            >
              Desk
            </button>
          </div>

          {/* Favorites filter */}
          <button
            onClick={() => setFilterFav(!filterFav)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterFav
                ? "bg-iris-pink-soft text-iris-gray-800"
                : "bg-iris-gray-100 text-iris-gray-500"
            }`}
          >
            💖 Favorites
          </button>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-iris-gray-100 text-iris-gray-600 outline-none border-none cursor-pointer"
          >
            <option value="all">All Types</option>
            {NOTE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.icon} {t.name}
              </option>
            ))}
          </select>

          {/* Create button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openEditor()}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-iris-gray-800"
            style={{
              background: "linear-gradient(135deg, #FFD6E0, #E8D5F5)",
            }}
          >
            + New Note
          </motion.button>
        </div>
      </div>

      {/* Notes area */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-3xl"
          >
            🌸
          </motion.div>
        </div>
      ) : deskNotes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            📝
          </motion.div>
          <h3 className="text-lg font-semibold text-iris-gray-600 mb-1">
            Your desk is empty
          </h3>
          <p className="text-sm text-iris-gray-400 mb-4">
            Time to fill it with beautiful thoughts ✨
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openEditor()}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-iris-gray-800"
            style={{
              background: "linear-gradient(135deg, #FFD6E0, #E8D5F5)",
            }}
          >
            Create Your First Note ✨
          </motion.button>
        </motion.div>
      ) : viewMode === "desk" ? (
        /* Free-form desk view */
        <div className="flex-1 relative desk-bg rounded-[20px] overflow-hidden min-h-[500px]">
          <AnimatePresence>
            {deskNotes.map((note) => (
              <StickyNote key={note.id} note={note} onDeskMode />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Grid view */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {deskNotes.map((note) => (
              <StickyNote key={note.id} note={note} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
