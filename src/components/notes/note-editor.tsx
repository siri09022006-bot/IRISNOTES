"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useUIStore } from "@/stores/ui-store";
import { useNotesStore } from "@/stores/notes-store";
import { ColorPicker } from "@/components/shared/color-picker";
import { TagInput } from "@/components/shared/tag-input";
import { NOTE_TYPES } from "@/lib/utils";
import { getRandomMessage } from "@/lib/microcopy";
import type { NoteType } from "@/types";

export function NoteEditorModal() {
  const editorOpen = useUIStore((s) => s.editorOpen);
  const editorNoteId = useUIStore((s) => s.editorNoteId);
  const closeEditor = useUIStore((s) => s.closeEditor);
  const addToast = useUIStore((s) => s.addToast);
  const notes = useNotesStore((s) => s.notes);
  const createNote = useNotesStore((s) => s.createNote);
  const saveNote = useNotesStore((s) => s.saveNote);

  const editingNote = editorNoteId ? notes.find((n) => n.id === editorNoteId) : null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#FFF5F5");
  const [type, setType] = useState<NoteType>("pastel");
  const [tags, setTags] = useState<string[]>([]);
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setColor(editingNote.color);
      setType(editingNote.type);
      setTags(editingNote.tags || []);
      setEmoji(editingNote.emoji || "");
    } else {
      setTitle("");
      setContent("");
      setColor("#FFF5F5");
      setType("pastel");
      setTags([]);
      setEmoji("");
    }
  }, [editingNote, editorOpen]);

  const handleSave = async () => {
    if (editingNote) {
      await saveNote(editingNote.id, { title, content, color, type, tags, emoji: emoji || null });
      addToast("changes saved ✨");
    } else {
      await createNote({ title, content, color, type, tags, emoji: emoji || null });
      addToast(getRandomMessage("creation"));
    }
    closeEditor();
  };

  const quickEmojis = ["✨", "💡", "🎯", "📌", "💭", "🔥", "🌸", "⭐", "📝", "🧠", "💫", "🌈"];

  return (
    <AnimatePresence>
      {editorOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={closeEditor}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-4 top-[10%] mx-auto max-w-lg z-50 glass-strong rounded-[20px] shadow-iris-xl overflow-hidden"
          >
            {/* Top gradient bar */}
            <div
              className="h-1.5 w-full"
              style={{
                background: "linear-gradient(90deg, #FFD6E0, #E8D5F5, #C5D5EA)",
              }}
            />

            <div className="p-6 max-h-[75vh] overflow-y-auto">
              <h2 className="text-lg font-bold text-iris-gray-800 mb-5">
                {editingNote ? "Edit Note ✏️" : "New Note ✨"}
              </h2>

              {/* Emoji selector */}
              <div className="mb-4">
                <label className="text-xs font-medium text-iris-gray-500 mb-1.5 block">
                  Emoji
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {quickEmojis.map((e) => (
                    <button
                      key={e}
                      onClick={() => setEmoji(emoji === e ? "" : e)}
                      className={`w-8 h-8 rounded-[8px] flex items-center justify-center text-base transition-all duration-150 ${
                        emoji === e
                          ? "bg-iris-lavender-soft scale-110 shadow-sm"
                          : "hover:bg-iris-gray-100 hover:scale-105"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title..."
                  className="w-full text-lg font-semibold bg-transparent outline-none text-iris-gray-800 placeholder:text-iris-gray-300"
                />
              </div>

              {/* Content */}
              <div className="mb-4">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind? 💭"
                  rows={5}
                  className="w-full bg-iris-gray-50 rounded-[12px] p-3 text-sm text-iris-gray-700 outline-none resize-none border border-iris-gray-200 focus:border-iris-lavender transition-colors placeholder:text-iris-gray-400"
                />
              </div>

              {/* Note Type */}
              <div className="mb-4">
                <label className="text-xs font-medium text-iris-gray-500 mb-1.5 block">
                  Style
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {NOTE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setType(t.value as NoteType)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                        type === t.value
                          ? "bg-iris-lavender text-iris-gray-800 shadow-sm"
                          : "bg-iris-gray-100 text-iris-gray-500 hover:bg-iris-gray-200"
                      }`}
                    >
                      {t.icon} {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="mb-4">
                <label className="text-xs font-medium text-iris-gray-500 mb-1.5 block">
                  Color
                </label>
                <ColorPicker value={color} onChange={setColor} />
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label className="text-xs font-medium text-iris-gray-500 mb-1.5 block">
                  Tags
                </label>
                <TagInput tags={tags} onChange={setTags} />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeEditor}
                  className="flex-1 py-2.5 rounded-[12px] text-sm font-medium text-iris-gray-500 bg-iris-gray-100 hover:bg-iris-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex-1 py-2.5 rounded-[12px] text-sm font-medium text-iris-gray-800 transition-colors"
                  style={{
                    background: "linear-gradient(135deg, #FFD6E0, #E8D5F5)",
                  }}
                >
                  {editingNote ? "Save Changes ✨" : "Create Note ✨"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
