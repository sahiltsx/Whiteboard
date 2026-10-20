'use client'

import { useEffect, useState } from 'react'
import { Monitor, PencilRuler, Smartphone, Sparkles, Workflow, X } from 'lucide-react'
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import { convertToExcalidrawElements } from '@excalidraw/excalidraw'

type Props = {
  excalidrawAPI: ExcalidrawImperativeAPI | null
}

const TOOLS = [
  {
    id: 'diagram',
    title: 'Diagrams',
    description: 'Generate diagrams in seconds',
    example: 'A diagram showing how a user signs up and verifies email',
    icon: PencilRuler,
  },
  {
    id: 'flowchart',
    title: 'Flowchart',
    description: 'Turn ideas into visual workflows',
    example: 'A flowchart for login with email and OTP',
    icon: Workflow,
  },
  {
    id: 'web',
    title: 'Web Mockup',
    description: 'Generate website wireframes',
    example: 'A landing page with a hero section, features, and a signup form',
    icon: Monitor,
  },
  {
    id: 'mobile',
    title: 'Mobile Mockup',
    description: 'Generate mobile app wireframes',
    example: 'A mobile home screen with a bottom nav and a list of task cards',
    icon: Smartphone,
  },
]

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2'

const AI_PLACEHOLDER_ID = 'ai-generation-placeholder'

function AiFloatingbar({ excalidrawAPI }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')

  const getEmptyCanvas = () => {
    if (!excalidrawAPI) {
      return { x: 100, y: 100 }
    }

    const elements = excalidrawAPI
      .getSceneElements()
      .filter((element) => !element.isDeleted)

    if (elements.length === 0) {
      return { x: 100, y: 100 }
    }

    const maxRight = Math.max(...elements.map((element) => element.x + element.width))
    const minTop = Math.min(...elements.map((element) => element.y))

    return {
      x: maxRight + 150,
      y: minTop,
    }
  }

  const addAiPlaceholder = () => {
    if (!excalidrawAPI) return

    const position = getEmptyCanvas()

   const placeholderElements = convertToExcalidrawElements([
  {
    type: 'rectangle',
    id: AI_PLACEHOLDER_ID,
    x: position.x,
    y: position.y,
    width: 420,
    height: 260,
    backgroundColor: '#f5f3ff',
    strokeColor: '#8b5cf6',
    fillStyle: 'solid',
    strokeWidth: 2,
    roughness: 0,
    roundness: { type: 3 },
  },
  {
    type: 'text',
    x: position.x + 28,
    y: position.y + 28,
    text: '✨ Generating with AI',
    fontSize: 22,
    strokeColor: '#6d28d9',
    autoResize: true,
  },
  {
    type: 'text',
    x: position.x + 28,
    y: position.y + 72,
    text: 'Preparing your diagram...',
    fontSize: 16,
    strokeColor: '#64748b',
    autoResize: true,
  },
  {
    type: 'rectangle',
    x: position.x + 28,
    y: position.y + 130,
    width: 300,
    height: 16,
    backgroundColor: '#ddd6fe',
    strokeColor: '#ddd6fe',
    fillStyle: 'solid',
    roughness: 0,
    roundness: { type: 3 },
  },
  {
    type: 'rectangle',
    x: position.x + 28,
    y: position.y + 160,
    width: 260,
    height: 16,
    backgroundColor: '#ede9fe',
    strokeColor: '#ede9fe',
    fillStyle: 'solid',
    roughness: 0,
    roundness: { type: 3 },
  },
  {
    type: 'rectangle',
    x: position.x + 28,
    y: position.y + 190,
    width: 180,
    height: 16,
    backgroundColor: '#ddd6fe',
    strokeColor: '#ddd6fe',
    fillStyle: 'solid',
    roughness: 0,
    roundness: { type: 3 },
  },
])
    const currentElements = excalidrawAPI.getSceneElements()

    excalidrawAPI.updateScene({
      elements: [...currentElements, ...placeholderElements],
    })
  }

  const onClickGenerate = async () => {
  await document.fonts.load('22px Excalifont')
  await document.fonts.ready
  addAiPlaceholder()
}

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (!isOpen) return null

  const selectedTool = TOOLS.find((t) => t.id === selectedId)

  return (
    <div className="absolute bottom-24 right-20 z-50 max-h-[90vh] w-md overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl">

      <div className="flex items-start justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Sparkles className="text-violet-500" size={18} aria-hidden="true" />
            AI Helper
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Turn your ideas into visuals in seconds
          </p>
        </div>
        <button
          type="button"
          aria-label="Close AI Helper"
          onClick={() => setIsOpen(false)}
          className={`rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 ${FOCUS_RING}`}
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2.5">
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          const isSelected = selectedId === tool.id
          return (
            <button
              key={tool.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedId(isSelected ? null : tool.id)}
              className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition ${FOCUS_RING} ${
                isSelected
                  ? 'border-violet-300 bg-violet-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition ${
                  isSelected ? 'bg-violet-100' : 'bg-slate-100'
                }`}
              >
                <Icon
                  className={isSelected ? 'text-violet-600' : 'text-slate-500'}
                  size={18}
                  aria-hidden="true"
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-slate-900">
                  {tool.title}
                </span>
                <span className="block truncate text-xs text-slate-500">
                  {tool.description}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        <label htmlFor="ai-prompt" className="mb-1.5 block text-sm font-medium text-neutral-500">
          Describe what you want
        </label>

        <div className="flex items-center gap-3">
          <textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={selectedTool ? selectedTool.example : 'Select a tool above to get started'}
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!prompt.trim()}
              onClick={onClickGenerate}
              className={`flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 ${FOCUS_RING}`}
            >
              <Sparkles size={16} aria-hidden="true" />
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiFloatingbar