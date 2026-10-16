"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
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
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";
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
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const saveTime = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestData = useRef<any>(null);
  const [activeTool, setActiveTool] = useState<ToolType>("selection");
  const[selectedElementIds,setSelectedElementIds]=useState<Record<string,boolean>>({});
 
  

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

  const hasSelection=Object.values(selectedElementIds).some(Boolean);

  const handleChangeColor=(color:string)=>{
     console.log("Color changed",color)
  }

  const handleChangeOpacity=(opacity:number)=>{
    console.log("Opacity changed",opacity)
  }

  const handleDuplicate=()=>{
    console.log("selected shapes duplicate")
  }

  const handleDelete=()=>{
    console.log("selected shapes deleted")
  }
  const handleTool = (name: ToolType) => {
    if (!excalidrawAPI) return;

    setActiveTool(name);
    excalidrawAPI.setActiveTool({ type: name });
  };

  return (
    <div style={{ height: "90vh" }} className="relative">
      <Excalidraw
        excalidrawAPI={(api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api)}
        onChange={handleCanvasChange}
      />

         {hasSelection && (
      <div className="absolute right-4 top-4 z-50 rounded-lg border bg-white px-4 py-2 text-sm text-black shadow-xl">
        <FloatingToolbar
         onChangeColor={handleChangeColor}
         onChangeOpacity={handleChangeOpacity}
         onDuplicate={handleDuplicate}
         onDelete={handleDelete}
        />
      </div>
    )}

      <div className="absolute left-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-1 rounded-xl border bg-white p-1.5 shadow-xl">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.name}
              type="button"
              title={tool.name}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition hover:cursor-pointer hover:bg-primary/10 ${
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