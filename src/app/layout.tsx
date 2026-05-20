import type { Metadata } from "next";
import { Inter, Kalam, Quicksand } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const kalam = Kalam({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-kalam",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IrisNotes — Your Aesthetic Second Brain",
  description:
    "A beautiful animated sticky notes workspace and digital second brain for students, creatives, designers, and chaotic thinkers.",
  keywords: [
    "notes",
    "sticky notes",
    "productivity",
    "second brain",
    "planning",
    "calendar",
    "whiteboard",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${kalam.variable} ${quicksand.variable}`}>
      <body className="antialiased font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
