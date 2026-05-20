"use client";

import { useState, KeyboardEvent } from "react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const tag = input.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const tagColors = [
    "bg-iris-pink-soft text-iris-gray-700",
    "bg-iris-lavender-soft text-iris-gray-700",
    "bg-iris-blue-soft text-iris-gray-700",
    "bg-iris-mint-soft text-iris-gray-700",
    "bg-iris-peach-soft text-iris-gray-700",
    "bg-iris-yellow-soft text-iris-gray-700",
  ];

  return (
    <div className="flex flex-wrap gap-1.5 items-center min-h-[36px] p-1.5 rounded-[10px] bg-iris-gray-50 border border-iris-gray-200">
      {tags.map((tag, i) => (
        <span
          key={tag}
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${tagColors[i % tagColors.length]}`}
        >
          #{tag}
          <button
            onClick={() => removeTag(tag)}
            className="hover:opacity-70 transition-opacity ml-0.5"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? "Add tags..." : ""}
        className="flex-1 min-w-[80px] bg-transparent text-sm outline-none px-1 text-iris-gray-700 placeholder:text-iris-gray-400"
      />
    </div>
  );
}
