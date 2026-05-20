"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Particles } from "@/components/shared/particles";
import { ToastContainer } from "@/components/shared/toast";
import { NoteEditorModal } from "@/components/notes/note-editor";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen relative">
      <Particles />
      <Sidebar />
      <main className="flex-1 flex flex-col relative z-10 min-w-0">
        <Topbar />
        <div className="flex-1 px-4 pb-6 lg:px-8 overflow-y-auto">
          {children}
        </div>
      </main>
      <NoteEditorModal />
      <ToastContainer />
    </div>
  );
}
