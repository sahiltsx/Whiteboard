"use client";

import dynamic from "next/dynamic";
import { CaptureUpdateAction } from "@excalidraw/excalidraw";
import type {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";

type ExcalidrawElement = any;

import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
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
  Sparkles,
  Square,
  Type,
} from "lucide-react";

import FloatingToolbar from "./FloatingToolBar";
import AiFloatingbar from "./AiFloatingbar";
import { Button } from "@/components/ui/button";

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((m) => m.Excalidraw),
  { ssr: false }
);

const SAVE_DELAY_MS = 3000;

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

interface SceneSnapshot {
  projectId: string;
  elements: readonly ExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles;
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

const pickPersistentAppState = (appState: AppState) => ({
  viewBackgroundColor: appState.viewBackgroundColor,
  scrollX: appState.scrollX,
  scrollY: appState.scrollY,
  zoom: appState.zoom,
  gridSize: appState.gridSize,
});

const randomNonce = () => Math.floor(Math.random() * 2 ** 31);

const bump = (el: ExcalidrawElement, patch: Partial<ExcalidrawElement>) =>
  ({
    ...el,
    ...patch,
    version: el.version + 1,
    versionNonce: randomNonce(),
  } as ExcalidrawElement);

const Whiteboard = ({ projectId }: WhiteboardProps) => {
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const [initialData, setInitialData] = useState<ExcalidrawInitialDataState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType>("selection");
  const [hasSelection, setHasSelection] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ left: 0, top: 0 });
  const[showSidebar,setShowSidebar]=useState(true);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestScene = useRef<SceneSnapshot | null>(null);
  const isDirty = useRef(false);
  const canSave = useRef(false);

  const persist = useCallback(async (scene: SceneSnapshot) => {
    try {
      await axios.post("/api/whiteboard", {
        projectId: scene.projectId,
        elements: scene.elements,
        appState: pickPersistentAppState(scene.appState),
        files: scene.files,
      });
    } catch (error: any) {
      console.error("Save failed:", {
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }, []);

  const flush = useCallback(() => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    if (isDirty.current && latestScene.current) {
      isDirty.current = false;
      void persist(latestScene.current);
    }
  }, [persist]);

  useEffect(() => {
    let cancelled = false;
    setIsLoaded(false);
    setInitialData(null);

    axios
      .get("/api/whiteboard", { params: { projectId } })
      .then((res) => {
        if (cancelled) return;
        setInitialData(res.data ?? null);
        canSave.current = true;
      })
      .catch((err) => {
        console.error("Load failed:", err);
        canSave.current = false;
      })
      .finally(() => {
        if (!cancelled) setIsLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  useEffect(() => {
    const onPageHide = () => flush();
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.removeEventListener("pagehide", onPageHide);
      flush();
      latestScene.current = null;
      canSave.current = false;
    };
  }, [projectId, flush]);

  const handleChange = (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles
  ) => {

    const selectedIds = appState.selectedElementIds ?? {};
    const selected = elements.filter((el) => selectedIds[el.id] && !el.isDeleted);

    setActiveTool((appState.activeTool?.type as ToolType) ?? "selection");
    setHasSelection(selected.length > 0);

    if (selected.length > 0) {
      const minX = Math.min(...selected.map((el) => el.x));
      const minY = Math.min(...selected.map((el) => el.y));
      const maxX = Math.max(...selected.map((el) => el.x + el.width));

      const zoom = appState.zoom?.value ?? 1;
      const scrollX = appState.scrollX ?? 0;
      const scrollY = appState.scrollY ?? 0;

      const left = ((minX + maxX) / 2 + scrollX) * zoom;
      const top = Math.max(8, (minY + scrollY) * zoom - 100);

      setToolbarPosition((prev) =>
        prev.left === left && prev.top === top ? prev : { left, top }
      );
    }

    if (!canSave.current) return;

    latestScene.current = { projectId, elements, appState, files };
    isDirty.current = true;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flush, SAVE_DELAY_MS);
  };

  const getSelectedIds = (): string[] => {
    if (!api) return [];
    const selected = api.getAppState().selectedElementIds ?? {};
    return Object.keys(selected).filter((id) => selected[id]);
  };

  const updateSelected = (patch: Partial<ExcalidrawElement>) => {
    if (!api) return;

    const ids = getSelectedIds();
    if (ids.length === 0) return;

    const next = api
      .getSceneElementsIncludingDeleted()
      .map((el) => (ids.includes(el.id) && !el.isDeleted ? bump(el, patch) : el));

    api.updateScene({
      elements: next,
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    });
  };

  const handleChangeColor = (color: string) =>
    updateSelected({ backgroundColor: color });

  const handleChangeBorderColor = (color: string) =>
    updateSelected({ strokeColor: color });

  const handleChangeOpacity = (opacity: number) =>
    updateSelected({ opacity });

  const handleDuplicate = () => {
    if (!api) return;

    const ids = getSelectedIds();
    if (ids.length === 0) return;

    const all = api.getSceneElementsIncludingDeleted();
    const selected = all.filter((el) => ids.includes(el.id) && !el.isDeleted);

    const groupMap = new Map<string, string>();
    const remapGroup = (g: string) => {
      if (!groupMap.has(g)) groupMap.set(g, crypto.randomUUID());
      return groupMap.get(g)!;
    };

    const copies = selected.map(
      (el) =>
        ({
          ...el,
          id: crypto.randomUUID(),
          x: el.x + 20,
          y: el.y + 20,
          groupIds: el.groupIds.map(remapGroup),
          boundElements: null, 
          version: 1,
          versionNonce: randomNonce(),
          seed: randomNonce(),
          isDeleted: false,
        } as ExcalidrawElement)
    );

    const newSelection = Object.fromEntries(
      copies.map((c) => [c.id, true])
    ) as Record<string, true>;

    api.updateScene({
      elements: [...all, ...copies],
      appState: { selectedElementIds: newSelection },
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    });
  };

  const handleDelete = () => {
    if (!api) return;

    const ids = getSelectedIds();
    if (ids.length === 0) return;

    const next = api
      .getSceneElementsIncludingDeleted()
      .map((el) => (ids.includes(el.id) ? bump(el, { isDeleted: true }) : el));

    api.updateScene({
      elements: next,
      appState: { selectedElementIds: {} },
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    });
  };

  const handleTool = (name: ToolType) => {
    if (!api) return;
    api.setActiveTool({ type: name });
  };

  return (
    <div style={{ height: "90vh" }} className="relative">
      {isLoaded && (
        <Excalidraw
          key={projectId}
          initialData={initialData}
          excalidrawAPI={(a: ExcalidrawImperativeAPI) => setApi(a)}
          onChange={handleChange}
        />
      )}

      {hasSelection && (
        <div
          className="absolute z-50 -translate-x-1/2"
          style={{
            left: `${toolbarPosition.left}px`,
            top: `${toolbarPosition.top}px`,
          }}
        >
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
      <div className="absolute right-10 bottom-3 z-50">
        <Button size={"lg"} onClick={()=>setShowSidebar(!showSidebar)}>
          <Sparkles/> AI
        </Button>
        {showSidebar && <AiFloatingbar/>}
      </div>
    </div>
  );
};

export default Whiteboard;