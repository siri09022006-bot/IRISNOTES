"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNotesStore } from "@/stores/notes-store";
import { useWhiteboardStore } from "@/stores/whiteboard-store";
import { useUIStore } from "@/stores/ui-store";
import { cn, formatRelative } from "@/lib/utils";

export function WhiteboardCanvas() {
  const notes = useNotesStore((s) => s.notes);
  const fetchNotes = useNotesStore((s) => s.fetchNotes);
  const saveNote = useNotesStore((s) => s.saveNote);
  const createNote = useNotesStore((s) => s.createNote);
  const removeNote = useNotesStore((s) => s.removeNote);
  const bringToFront = useNotesStore((s) => s.bringToFront);
  const openEditor = useUIStore((s) => s.openEditor);
  const addToast = useUIStore((s) => s.addToast);
  const { panX, panY, zoom, isPanning, setPan, setZoom, setIsPanning, connections, connectingFrom, setConnectingFrom, addConnection, removeConnection } = useWhiteboardStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const panStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const [dragging, setDragging] = useState<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0, nx: 0, ny: 0 });

  useEffect(() => { fetchNotes("whiteboard"); }, [fetchNotes]);

  const boardNotes = notes.filter((n) => n.section === "whiteboard" && !n.isArchived);

  const handleCanvasDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-bn]")) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, px: panX, py: panY };
    const move = (ev: MouseEvent) => { setPan(panStart.current.px + ev.clientX - panStart.current.x, panStart.current.py + ev.clientY - panStart.current.y); };
    const up = () => { setIsPanning(false); document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  }, [panX, panY, setPan, setIsPanning]);

  const handleWheel = useCallback((e: React.WheelEvent) => { e.preventDefault(); setZoom(zoom + (e.deltaY > 0 ? -0.1 : 0.1)); }, [zoom, setZoom]);

  const handleNoteDown = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectingFrom && connectingFrom !== id) {
      addConnection({ id: Math.random().toString(36).slice(2), fromNoteId: connectingFrom, toNoteId: id, createdAt: new Date().toISOString() });
      setConnectingFrom(null); addToast("connected! 🔗"); return;
    }
    setDragging(id); bringToFront(id);
    const note = notes.find((n) => n.id === id); if (!note) return;
    dragStart.current = { x: e.clientX, y: e.clientY, nx: note.posX, ny: note.posY };
    const move = (ev: MouseEvent) => { saveNote(id, { posX: dragStart.current.nx + (ev.clientX - dragStart.current.x) / zoom, posY: dragStart.current.ny + (ev.clientY - dragStart.current.y) / zoom }); };
    const up = () => { setDragging(null); document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  }, [connectingFrom, notes, zoom, bringToFront, saveNote, addConnection, addToast, setConnectingFrom]);

  const handleAdd = async () => {
    const cx = (-panX + (canvasRef.current?.clientWidth || 800) / 2) / zoom;
    const cy = (-panY + (canvasRef.current?.clientHeight || 600) / 2) / zoom;
    await createNote({ section: "whiteboard", posX: cx - 120, posY: cy - 100 });
    addToast("note placed ✨");
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-iris-gray-800">Whiteboard 🎯</h1>
          <p className="text-sm text-iris-gray-400 mt-0.5">{boardNotes.length} notes • plan & connect</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setConnectingFrom(connectingFrom ? null : "__pending__")} className={cn("px-3 py-1.5 rounded-full text-xs font-medium transition-all", connectingFrom ? "bg-iris-pink text-iris-gray-900" : "bg-iris-gray-100 text-iris-gray-500")}>
            🔗 {connectingFrom ? "Cancel" : "Connect"}
          </button>
          <button onClick={() => { setPan(0, 0); setZoom(1); }} className="px-3 py-1.5 rounded-full text-xs font-medium bg-iris-gray-100 text-iris-gray-500">🎯 Reset</button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAdd} className="px-4 py-1.5 rounded-full text-xs font-medium text-iris-gray-900" style={{ background: "linear-gradient(135deg, #FF6699, #b08bb6)" }}>+ Add Note</motion.button>
        </div>
      </div>
      <div ref={canvasRef} className={cn("flex-1 min-h-[500px] h-full rounded-[20px] overflow-hidden relative board-bg", isPanning ? "cursor-grabbing" : "cursor-grab")} onMouseDown={handleCanvasDown} onWheel={handleWheel}>
        <div className="absolute top-3 right-3 z-10 glass px-3 py-1 rounded-full text-xs text-iris-gray-500 font-medium">{Math.round(zoom * 100)}%</div>
        <div style={{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})`, transformOrigin: "0 0", position: "absolute", inset: 0 }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
            {connections.map((c) => {
              const f = boardNotes.find((n) => n.id === c.fromNoteId);
              const t = boardNotes.find((n) => n.id === c.toNoteId);
              if (!f || !t) return null;
              const x1 = f.posX + f.width / 2, y1 = f.posY + 100, x2 = t.posX + t.width / 2, y2 = t.posY + 100;
              return (
                <g key={c.id} className="cursor-pointer pointer-events-auto" onClick={() => removeConnection(c.id)}>
                  <path d={`M ${x1} ${y1} C ${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}`} fill="none" stroke="#FF6699" strokeWidth="2" strokeDasharray="6 4" />
                  <circle cx={x1} cy={y1} r="4" fill="#FF6699" /><circle cx={x2} cy={y2} r="4" fill="#FF6699" />
                </g>
              );
            })}
          </svg>
          <AnimatePresence>
            {boardNotes.map((note) => (
              <motion.div key={note.id} data-bn initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                className={cn("absolute rounded-[14px] shadow-iris-md group", dragging === note.id ? "cursor-grabbing shadow-iris-xl" : "cursor-grab", connectingFrom && connectingFrom !== note.id ? "ring-2 ring-iris-pink" : "")}
                style={{ left: note.posX, top: note.posY, width: note.width, zIndex: note.zIndex, backgroundColor: (note.type === "neon" || note.type === "glass" || note.type === "doodle" || note.type === "braindump" || note.type === "minimal" || note.type === "focus") ? undefined : note.color }}
                onMouseDown={(e) => handleNoteDown(note.id, e)} onDoubleClick={() => openEditor(note.id)}>
                <div className="h-1 rounded-t-[14px]" style={{ background: `linear-gradient(90deg, ${note.color}, #FF6699)` }} />
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-iris-gray-800 truncate">{note.emoji && <span className="mr-1">{note.emoji}</span>}{note.title || "Untitled"}</h4>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setConnectingFrom(note.id); }} className="w-5 h-5 rounded-full bg-iris-pink-soft flex items-center justify-center text-[10px] text-white">🔗</button>
                      <button onClick={(e) => { e.stopPropagation(); removeNote(note.id); }} className="w-5 h-5 rounded-full bg-iris-gray-300 flex items-center justify-center text-[10px] text-white">✕</button>
                    </div>
                  </div>
                  {note.content && <p className="text-xs text-iris-gray-500 line-clamp-3 mb-1">{note.content}</p>}
                  <p className="text-[9px] text-iris-gray-400">{formatRelative(note.updatedAt)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {boardNotes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl mb-3">🎯</motion.div>
            <h3 className="text-lg font-semibold text-iris-gray-500">Your planning space awaits</h3>
            <p className="text-sm text-iris-gray-400 mb-4">Add notes and connect your ideas</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleAdd} className="px-6 py-2 rounded-full text-sm font-medium text-iris-gray-900" style={{ background: "linear-gradient(135deg, #FF6699, #b08bb6)" }}>Add First Note ✨</motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
