'use client'

import { useState } from 'react'
import { PencilRuler, Smartphone, Sparkles, Workflow, X } from 'lucide-react'

const aiTools = [
  {
    name: 'Generate diagrams',
    desc: 'Generate diagrams in seconds',
    icon: PencilRuler,
    color: 'text-blue-600',
  },
  {
    name: 'Flowchart',
    desc: 'Turn ideas into visual workflows',
    icon: Workflow,
    color: 'text-violet-500',
  },
  {
    name: 'Mobile Mockup',
    desc: 'Generate mobile app wireframes',
    icon: Smartphone,
    color: 'text-emerald-600',
  },
]

function AiFloatingbar() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) return null

  return (
    <div className="absolute right-20 bottom-24 z-50 w-80 max-h-100 p-5 overflow-hidden border rounded-xl shadow-2xl bg-white">
      <div>
        <div className="flex justify-between items-center">
          <h2 className="flex items-center text-xl font-medium gap-2">
            <Sparkles className="text-violet-400"  size={19}/>
            AI Helper
          </h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-muted-foreground text-sm pt-1.5">
          Turn your ideas into visuals in seconds
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {aiTools.map((tool) => {
          const Icon = tool.icon
          return (
            <div
              key={tool.name}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <Icon className={tool.color} size={20} />
              <div>
                <p className="font-medium text-sm">{tool.name}</p>
                <p className="text-xs text-muted-foreground">{tool.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AiFloatingbar