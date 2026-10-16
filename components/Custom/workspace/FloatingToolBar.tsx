
"use client";

import {Copy,Palette,SlidersHorizontal,Trash2} from "lucide-react";

interface FloatingToolbarProps {
  onChangeColor: (color: string) => void;
  onChangeOpacity: (opacity: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const colors = [
  "#ffc9c9",
  "#ffec99",
  "#b2f2bb",
  "#a5d8ff",
  "#d0bfff",
  "#ffffff",
];

export default function FloatingToolbar({
  onChangeColor,
  onChangeOpacity,
  onDuplicate,
  onDelete,
}: FloatingToolbarProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#242424] p-3 text-white shadow-2xl">
      
      <div className="flex items-center gap-2">
        <Palette size={16} className="text-gray-300" />

        {colors.map((color) => (
          <button
            key={color}
            type="button"
            title={`Fill ${color}`}
            aria-label={`Change fill color to ${color}`}
            onClick={() => onChangeColor(color)}
            className="h-5 w-5 rounded-full border border-white/30 transition hover:scale-110"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="h-7 w-px bg-white/20" />

      <div className="flex items-center gap-2">
        <SlidersHorizontal size={16} />

        <input
          type="range"
          min={10}
          max={100}
          defaultValue={100}
          aria-label="Shape opacity"
          onChange={(event) =>
            onChangeOpacity(Number(event.target.value))
          }
          className="w-20 accent-indigo-400"
        />
      </div>

      <div className="h-7 w-px bg-white/20" />

      <button
        type="button"
        title="Duplicate"
        aria-label="Duplicate selected shapes"
        onClick={onDuplicate}
        className="rounded-md p-2 hover:bg-white/10"
      >
        <Copy size={17} />
      </button>

      <button
        type="button"
        title="Delete"
        aria-label="Delete selected shapes"
        onClick={onDelete}
        className="rounded-md p-2 text-red-400 hover:bg-red-500/10"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}
