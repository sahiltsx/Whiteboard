"use client";

import { toast } from "@/components/ui/toast";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import axios from "axios";
import { useEffect, useRef } from "react";
import "@excalidraw/excalidraw/index.css"
import { MousePointer2 } from "lucide-react";
interface WhiteboardProps {
  projectId: string;
}

const tools=[
  {
    name:'selection',
    icon:MousePointer2,
    color:"text-blue-600"
  }
]

const Whiteboard = ({ projectId }: WhiteboardProps) => {
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
    latestData.current = { elements, appState, files };

    if (saveTime.current) {
      clearTimeout(saveTime.current);
    }

    saveTime.current = setTimeout(() => {
      saveTime.current = null;
      void saveCanvasChanges();
      toast.add({
        type: "Success",
        title: "Changes Saved",
      });
    }, 10000);
  };

  return (
    <div style={{ height: "90vh" }} className="relative">
      <Excalidraw onChange={handleCanvasChange} />
      <div className="absolute left-4 top-1/2 z-50 -translate-y-1/2
       flex flex-col gap-1 bg-white border p-1.5 rounded-xl shadow-xl">
        {tools.map((tool)=>{
          const Icon=tool.icon
          return(
            <button key={tool.name}>
              <Icon size="19" className={tool.color}/>
            </button>
          )
        })}
      </div>
    </div>   
  );
};

export default Whiteboard;