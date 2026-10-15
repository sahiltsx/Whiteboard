"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Diamond, Ellipse, Hand, MousePointer2, Square } from "lucide-react";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";

interface WhiteboardProps {
  projectId: string;
}

const tools = [
  {
    name: "selection",
    icon: MousePointer2,
    color: "text-blue-600",
  },
  {
    name: "hand",
    icon: Hand,
    color: "text-cyan-600",
  },
  {
    name: "rectangle",
    icon: Square,
    color: "text-blue-500",
  },
  {
    name: "diamond",
    icon: Diamond,
    color: "text-blue-500",
  },
  {
    name: "ellipse",
    icon: Ellipse,
    color: "text-blue-500",
  },
];

const Whiteboard = ({ projectId }: WhiteboardProps) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const saveTime = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestData = useRef<any>(null);
  const [activeTool, setActiveTool] = useState<string>("selection");

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
    latestData.current = { elements, appState, files };

    if (saveTime.current) {
      clearTimeout(saveTime.current);
    }

    // saveTime.current = setTimeout(() => {
    //   saveTime.current = null;
    //   void saveCanvasChanges();
    //   toast.add({
    //     type: "Success",
    //     title: "Changes Saved",
    //   });
    // }, 10000);
  };

  const handleChangeTool = (tool: any) => {
    if (!excalidrawAPI) return;

    setActiveTool(tool);
    excalidrawAPI.setActiveTool({
      type: tool,
    });
  };

  return (
    <div style={{ height: "90vh" }} className="relative">
      <Excalidraw
        excalidrawAPI={(api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api)}
        onChange={handleCanvasChange}
      />
      <div
        className="absolute left-4 top-1/2 z-50 -translate-y-1/2
       flex flex-col gap-1 bg-white border p-1.5 rounded-xl shadow-xl"
      >
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.name}
              type="button"
              className={`flex h-10 w-10 rounded-xl items-center justify-center transition hover:bg-primary/10 hover:cursor-pointer ${
                activeTool === tool.name ? "bg-blue-300/5" : ""
              }`}
              onClick={() => handleChangeTool(tool.name)}
            >
              <Icon size={19} className={tool.color} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Whiteboard;