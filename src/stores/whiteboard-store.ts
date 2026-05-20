"use client";

import { create } from "zustand";
import type { Connection } from "@/types";

interface WhiteboardState {
  panX: number;
  panY: number;
  zoom: number;
  isPanning: boolean;
  connections: Connection[];
  connectingFrom: string | null;

  setPan: (x: number, y: number) => void;
  setZoom: (zoom: number) => void;
  setIsPanning: (v: boolean) => void;
  setConnectingFrom: (id: string | null) => void;

  addConnection: (conn: Connection) => void;
  removeConnection: (id: string) => void;
  setConnections: (conns: Connection[]) => void;
}

export const useWhiteboardStore = create<WhiteboardState>((set) => ({
  panX: 0,
  panY: 0,
  zoom: 1,
  isPanning: false,
  connections: [],
  connectingFrom: null,

  setPan: (x, y) => set({ panX: x, panY: y }),
  setZoom: (zoom) => set({ zoom: Math.min(3, Math.max(0.2, zoom)) }),
  setIsPanning: (v) => set({ isPanning: v }),
  setConnectingFrom: (id) => set({ connectingFrom: id }),

  addConnection: (conn) =>
    set((s) => ({ connections: [...s.connections, conn] })),
  removeConnection: (id) =>
    set((s) => ({ connections: s.connections.filter((c) => c.id !== id) })),
  setConnections: (conns) => set({ connections: conns }),
}));
