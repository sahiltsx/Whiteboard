
"use client";

import { Excalidraw, CaptureUpdateAction } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";

import {
  ArrowRight,
  Circle,
  Diamond,
  Eraser,
  Hand,
  Image as ImageIcon,
  Minus,
  MousePointer2,
  Square,
  Type,
} from "lucide-react";

import FloatingToolbar from "./FloatingToolBar";

type ToolType =
  | "selection"
  | "hand"
  | "rectangle"
  | "diamond"
  | "ellipse"
  | "arrow"
  | "line"
  | "text"
  | "eraser"
  | "image";

interface WhiteboardProps {
  projectId: string;
}

const tools: {
  name: ToolType;
  icon: ComponentType<{ size?: number; className?: string }>;
  color: string;
}[] = [
  { name: "selection", icon: MousePointer2, color: "text-blue-900" },
  { name: "hand", icon: Hand, color: "text-slate-800" },
  { name: "rectangle", icon: Square, color: "text-indigo-900" },
  { name: "diamond", icon: Diamond, color: "text-slate-900" },
  { name: "ellipse", icon: Circle, color: "text-blue-900" },
  { name: "arrow", icon: ArrowRight, color: "text-zinc-800" },
  { name: "line", icon: Minus, color: "text-slate-800" },
  { name: "text", icon: Type, color: "text-indigo-900" },
  { name: "image", icon: ImageIcon, color: "text-emerald-900" },
  { name: "eraser", icon: Eraser, color: "text-slate-900" },
];

const Whiteboard = ({ projectId }: WhiteboardProps) => {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const [activeTool, setActiveTool] =
    useState<ToolType>("selection");

  const [selectedElementIds, setSelectedElementIds] =
    useState<Record<string, boolean>>({});

  const saveTime = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestData = useRef<any>(null);

  const saveCanvasChanges = async () => {
    const data = latestData.current;
    if (!data) return;

    try {
      await axios.post("/api/whiteboard", {
        projectId,
        elements: data.elements,
        appState: data.appState,
        files: data.files,
      });
    } catch (error: any) {
      console.error("Save failed:", {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (saveTime.current) {
        clearTimeout(saveTime.current);
        saveTime.current = null;
        void saveCanvasChanges();
      }
    };
  }, [projectId]);

  const handleCanvasChange = (
    elements: readonly any[],
    appState: any,
    files: any
  ) => {
    setSelectedElementIds(appState.selectedElementIds ?? {});
    latestData.current = { elements, appState, files };

    if (saveTime.current) {
      clearTimeout(saveTime.current);
    }

    saveTime.current = setTimeout(() => {
      saveTime.current = null;
      void saveCanvasChanges();
    }, 10000);
  };

  const hasSelection = Object.values(selectedElementIds).some(Boolean);

  const getSelectedIds = (): string[] => {
    if (!excalidrawAPI) return [];

    const selected =
      excalidrawAPI.getAppState().selectedElementIds ?? {};

    return Object.keys(selected).filter((id) => selected[id]);
  };

  const handleChangeColor = (color: string) => {
    if (!excalidrawAPI) return;

    const selectedIds = getSelectedIds();
    if (selectedIds.length === 0) return;

    const elements = excalidrawAPI.getSceneElements();

    const updatedElements = elements.map((element) => {
      if (!selectedIds.includes(element.id)) return element;

      return {
        ...element,
        backgroundColor: color,
        version: element.version + 1,
        versionNonce: Math.floor(Math.random() * 2 ** 31),
      };
    });

    excalidrawAPI.updateScene({
      elements: updatedElements,
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    });
  };

  const handleChangeBorderColor = (color: string) => {
  if (!excalidrawAPI) return;

  const selectedIds = getSelectedIds();
  if (selectedIds.length === 0) return;

  const updatedElements = excalidrawAPI
    .getSceneElements()
    .map((element) => {
      if (!selectedIds.includes(element.id)) return element;

      return {
        ...element,
        strokeColor: color,
        version: element.version + 1,
        versionNonce: Math.floor(Math.random() * 2 ** 31),
      };
    });

  excalidrawAPI.updateScene({
    elements: updatedElements,
    captureUpdate: CaptureUpdateAction.IMMEDIATELY,
  });
};

  const handleChangeOpacity = (opacity: number) => {
    if (!excalidrawAPI) return;

    const selectedIds = getSelectedIds();
    if (selectedIds.length === 0) return;

    const elements = excalidrawAPI.getSceneElements();

    const updatedElements = elements.map((element) => {
      if (!selectedIds.includes(element.id)) return element;

      return {
        ...element,
        opacity,
        version: element.version + 1,
        versionNonce: Math.floor(Math.random() * 2 ** 31),
      };
    });

    excalidrawAPI.updateScene({
      elements: updatedElements,
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    });
  };

  const handleDuplicate = () => {
    if (!excalidrawAPI) return;

    const selectedIds = getSelectedIds();
    if (selectedIds.length === 0) return;

    const elements = excalidrawAPI.getSceneElements();

    const selectedElements = elements.filter((element) =>
      selectedIds.includes(element.id)
    );

    const duplicates = selectedElements.map((element) => ({
      ...element,
      id: crypto.randomUUID(),
      x: element.x + 20,
      y: element.y + 20,
      version: 1,
      versionNonce: Math.floor(Math.random() * 2 ** 31),
      seed: Math.floor(Math.random() * 2 ** 31),
      isDeleted: false,
    }));

   const newSelection: Record<string, true> = {};

   duplicates.forEach((element) => {
      newSelection[element.id] = true;
     });

excalidrawAPI.updateScene({
  elements: [...elements, ...duplicates],
  appState: {
    selectedElementIds: newSelection,
  },
  captureUpdate: CaptureUpdateAction.IMMEDIATELY,
});
  };

  const handleDelete = () => {
    if (!excalidrawAPI) return;

    const selectedIds = getSelectedIds();
    if (selectedIds.length === 0) return;

    const elements = excalidrawAPI.getSceneElementsIncludingDeleted();

    const updatedElements = elements.map((element) => {
      if (!selectedIds.includes(element.id)) return element;

      return {
        ...element,
        isDeleted: true,
        version: element.version + 1,
        versionNonce: Math.floor(Math.random() * 2 ** 31),
      };
    });

    excalidrawAPI.updateScene({
      elements: updatedElements,
      appState: {
        selectedElementIds: {},
      },
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    });

    setSelectedElementIds({});
  };

  const handleTool = (name: ToolType) => {
    if (!excalidrawAPI) return;

    setActiveTool(name);
    excalidrawAPI.setActiveTool({ type: name });
  };

  return (
    <div style={{ height: "90vh" }} className="relative">
      <Excalidraw
        excalidrawAPI={(api: ExcalidrawImperativeAPI) =>
          setExcalidrawAPI(api)
        }
        onChange={handleCanvasChange}
      />

      {hasSelection && (
       <div className="absolute left-1/2 top-20 z-50 -translate-x-1/2">
          <FloatingToolbar
            onChangeColor={handleChangeColor}
            onChangeBorderColor={handleChangeBorderColor}
            onChangeOpacity={handleChangeOpacity}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        </div>
      )}

      <div className="absolute left-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <button
              key={tool.name}
              type="button"
              title={tool.name}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-primary/10 ${
                activeTool === tool.name ? "bg-blue-100" : ""
              }`}
              onClick={() => handleTool(tool.name)}
            >
              <Icon size={16} className={tool.color} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Whiteboard;
