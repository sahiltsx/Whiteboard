
"use client";

import { toast } from "@/components/ui/toast";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import axios from "axios";
import { useEffect, useRef } from "react";

interface WhiteboardProps {
  projectId: string;
}

const Whiteboard = ({ projectId }: WhiteboardProps) => {
  const saveTime = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestData = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (saveTime.current) {
        clearTimeout(saveTime.current);
        saveTime.current = null;
      }
    };
  }, [projectId]);

  const saveCanvasChanges = async () => {
    const data = latestData.current;

    if (!data) return;

    try {
      const response = await axios.post("/api/whiteboard", {
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
      void saveCanvasChanges();
      toast.add({
        type:"Success",
        title:"Changes Saved"
      })
    }, 10000);
  };

  return (
    <div style={{ height: "90vh" }}>
      <Excalidraw onChange={handleCanvasChange} />
    </div>
  );
};

export default Whiteboard;
