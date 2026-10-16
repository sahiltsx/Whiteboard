
"use client";

import { Copy, Trash2 } from "lucide-react";

interface FloatingToolbarProps {
  onChangeColor: (color: string) => void;
  onChangeBorderColor: (color: string) => void;
  onChangeOpacity: (opacity: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const backgroundColors = [
  "#ffffff",
  "#ffc9c9",
  "#ffec99",
  "#b2f2bb",
  "#a5d8ff",
  "#d0bfff",
];

const borderColors = [
  "#1f2937",
  "#ef4444",
  "#f97316",
  "#16a34a",
  "#2563eb",
  "#9333ea",
];

export default function FloatingToolbar({
  onChangeColor,
  onChangeBorderColor,
  onChangeOpacity,
  onDuplicate,
  onDelete,
}: FloatingToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-xl">

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-500">
          Fill
        </span>

        <div className="flex items-center gap-1.5">
          {backgroundColors.map((color) => (
            <button
              key={color}
              type="button"
              title={`Background ${color}`}
              aria-label={`Change background color to ${color}`}
              onClick={() => onChangeColor(color)}
              className="h-5 w-5 rounded-full border border-slate-300 transition hover:scale-110"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="h-10 w-px bg-slate-200" />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-500">
          Border
        </span>

        <div className="flex items-center gap-1.5">
          {borderColors.map((color) => (
            <button
              key={color}
              type="button"
              title={`Border ${color}`}
              aria-label={`Change border color to ${color}`}
              onClick={() => onChangeBorderColor(color)}
              className="h-5 w-5 rounded-full border border-slate-300 transition hover:scale-110"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="h-10 w-px bg-slate-200" />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-500">
          Opacity
        </span>

        <input
          type="range"
          min={10}
          max={100}
          defaultValue={100}
          aria-label="Shape opacity"
          onChange={(event) =>
            onChangeOpacity(Number(event.target.value))
          }
          className="w-24 cursor-pointer accent-indigo-600"
        />
      </div>

      <div className="h-10 w-px bg-slate-200" />

      <button
        type="button"
        title="Copy selected shape"
        aria-label="Copy selected shape"
        onClick={onDuplicate}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
      >
        <Copy size={18} />
      </button>

     
      <button
        type="button"
        title="Delete selected shape"
        aria-label="Delete selected shape"
        onClick={onDelete}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
