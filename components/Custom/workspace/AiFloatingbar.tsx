'use client'

import { useEffect, useState } from 'react'
import { Monitor, PencilRuler, Smartphone, Sparkles, Workflow, X } from 'lucide-react'
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import { convertToExcalidrawElements } from '@excalidraw/excalidraw'

type Props = {
  excalidrawAPI: ExcalidrawImperativeAPI | null
}

type AiNode = { id: string; shape: string; label: string }
type AiArrow = { from: string; to: string; label?: string }
type AiResult = { nodes: AiNode[]; arrows: AiArrow[] }

const TOOLS = [
  {
    id: 'diagram',
    title: 'Diagrams',
    description: 'Generate diagrams in seconds',
    prompt:
      'Create a system architecture diagram for a MERN chat app. Show the React client, Express API, MongoDB database, and Socket.IO server, with arrows for how requests and real-time messages flow between them.',
    icon: PencilRuler,
  },
  {
    id: 'flowchart',
    title: 'Flowchart',
    description: 'Turn ideas into visual workflows',
    prompt:
      'Create a flowchart for user login with email and OTP. Start at the login page, check whether the email exists, send a six-digit OTP, verify it within five minutes, and handle wrong or expired codes with a retry option.',
    icon: Workflow,
  },
  {
    id: 'web',
    title: 'Web Mockup',
    description: 'Generate website wireframes',
    prompt:
      'Design a landing page for a task management app called TaskFlow. Include a top navigation bar with logo and login button, a hero section with a headline, subtext, and a Get Started button, three feature cards with icons, a pricing section, and a footer with links.',
    icon: Monitor,
  },
  {
    id: 'mobile',
    title: 'Mobile Mockup',
    description: 'Generate mobile app wireframes',
    prompt:
      "Design a mobile home screen for a task management app. Include a header with the user's name and a notification icon, a list of task cards showing title, due date, and a completion checkbox, a floating add button, and a bottom navigation bar with Home, Calendar, and Profile tabs.",
    icon: Smartphone,
  },
]

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2'

const AI_PLACEHOLDER_PREFIX = 'ai-placeholder'

function AiFloatingbar({ excalidrawAPI }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const handleToolClick = (tool: (typeof TOOLS)[number]) => {
    const isTemplate =
      prompt.trim() === '' || TOOLS.some((t) => t.prompt === prompt)

    if (selectedId === tool.id) {
      setSelectedId(null)
      if (isTemplate) setPrompt('')
      return
    }

    setSelectedId(tool.id)
    if (isTemplate) setPrompt(tool.prompt)
  }

  // ---------- Canvas helpers ----------

  const getEmptyCanvas = () => {
    if (!excalidrawAPI) return { x: 100, y: 100 }

    // Ignore the placeholder so it doesn't push new content further right
    const elements = excalidrawAPI
      .getSceneElements()
      .filter((el) => !el.isDeleted && !el.id.startsWith(AI_PLACEHOLDER_PREFIX))

    if (elements.length === 0) return { x: 100, y: 100 }

    const maxRight = Math.max(...elements.map((el) => el.x + el.width))
    const minTop = Math.min(...elements.map((el) => el.y))

    return { x: maxRight + 150, y: minTop }
  }

  const addAiPlaceholder = () => {
    if (!excalidrawAPI) return

    const position = getEmptyCanvas()

    const placeholderElements = convertToExcalidrawElements([
      {
        type: 'rectangle',
        id: `${AI_PLACEHOLDER_PREFIX}-box`,
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
        id: `${AI_PLACEHOLDER_PREFIX}-title`,
        x: position.x + 28,
        y: position.y + 28,
        text: '✨ Generating with AI',
        fontSize: 22,
        strokeColor: '#6d28d9',
        autoResize: true,
      },
      {
        type: 'text',
        id: `${AI_PLACEHOLDER_PREFIX}-subtitle`,
        x: position.x + 28,
        y: position.y + 72,
        text: 'Preparing your diagram...',
        fontSize: 16,
        strokeColor: '#64748b',
        autoResize: true,
      },
      {
        type: 'rectangle',
        id: `${AI_PLACEHOLDER_PREFIX}-bar-1`,
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
        id: `${AI_PLACEHOLDER_PREFIX}-bar-2`,
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
        id: `${AI_PLACEHOLDER_PREFIX}-bar-3`,
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

    const currentElements = excalidrawAPI
      .getSceneElements()
      .filter((el) => !el.id.startsWith(AI_PLACEHOLDER_PREFIX))

    excalidrawAPI.updateScene({
      elements: [...currentElements, ...placeholderElements],
    })
  }

  const removeAiPlaceholders = () => {
    if (!excalidrawAPI) return
    excalidrawAPI.updateScene({
      elements: excalidrawAPI
        .getSceneElements()
        .filter((el) => !el.id.startsWith(AI_PLACEHOLDER_PREFIX)),
    })
  }

  const drawAiResult = (result: AiResult) => {
    if (!excalidrawAPI || result.nodes.length === 0) return

    const origin = getEmptyCanvas()
    const COLS = 3
    const W = 180
    const H = 80
    const GAP_X = 60
    const GAP_Y = 80

    const nodeIds = new Set(result.nodes.map((n) => n.id))

    const nodeSkeletons = result.nodes.map((node, i) => {
      const col = i % COLS
      const row = Math.floor(i / COLS)
      return {
        type:
          node.shape === 'diamond'
            ? 'diamond'
            : node.shape === 'ellipse'
              ? 'ellipse'
              : 'rectangle',
        id: `ai-node-${node.id}`,
        x: origin.x + col * (W + GAP_X),
        y: origin.y + row * (H + GAP_Y),
        width: W,
        height: H,
        strokeColor: '#8b5cf6',
        backgroundColor: '#f5f3ff',
        fillStyle: 'solid',
        roundness: { type: 3 },
        label: { text: String(node.label ?? ''), fontSize: 16 },
      }
    })

    const arrowSkeletons = result.arrows
      .filter((a) => nodeIds.has(a.from) && nodeIds.has(a.to))
      .map((arrow, i) => ({
        type: 'arrow',
        id: `ai-arrow-${i}`,
        start: { id: `ai-node-${arrow.from}` },
        end: { id: `ai-node-${arrow.to}` },
        ...(arrow.label
          ? { label: { text: String(arrow.label), fontSize: 14 } }
          : {}),
      }))

    const newElements = convertToExcalidrawElements([
      ...nodeSkeletons,
      ...arrowSkeletons,
    ] as any)

    const current = excalidrawAPI
      .getSceneElements()
      .filter((el) => !el.id.startsWith(AI_PLACEHOLDER_PREFIX))

    excalidrawAPI.updateScene({ elements: [...current, ...newElements] })
    excalidrawAPI.scrollToContent(newElements, { fitToContent: true })
  }


  const onClickGenerate = async () => {
    if (!excalidrawAPI || !prompt.trim() || !selectedId || isGenerating) return

    setIsGenerating(true)
    setError(null)
    try {
      await document.fonts.load('22px Excalifont')
      await document.fonts.ready
      addAiPlaceholder()

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, toolType: selectedId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Request failed')

      drawAiResult(data as AiResult)
    } catch (err) {
      console.error(err)
      removeAiPlaceholders()
      setError('Could not generate the diagram. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  if (!isOpen) return null

  return (
    <div className="absolute bottom-12 right-4 z-50 max-h-[calc(100vh-8rem)] w-[28rem] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl">
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
              onClick={() => handleToolClick(tool)}
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
            placeholder="Select a tool above, or describe what you want to create"
            rows={6}
            className="min-h-36 w-full resize-none rounded-xl border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!prompt.trim() || !selectedId || isGenerating}
              onClick={onClickGenerate}
              className={`flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 ${FOCUS_RING}`}
            >
              <Sparkles size={16} aria-hidden="true" />
              {isGenerating ? 'Working...' : 'Generate'}
            </button>
          </div>
        </div>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  )
}

export default AiFloatingbar