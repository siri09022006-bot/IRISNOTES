"use client";

import { NOTE_COLORS } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {NOTE_COLORS.map((c) => (
        <button
          key={c.value}
          onClick={() => onChange(c.value)}
          className="w-7 h-7 rounded-full transition-all duration-200 hover:scale-110 relative"
          style={{
            backgroundColor: c.value,
            border: `2px solid ${c.accent}`,
            boxShadow: value === c.value ? `0 0 0 2px ${c.accent}` : "none",
          }}
          title={c.name}
        >
          {value === c.value && (
            <span className="absolute inset-0 flex items-center justify-center text-xs">✓</span>
          )}
        </button>
      ))}
    </div>
  );
}
