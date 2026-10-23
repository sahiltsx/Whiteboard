import { NextResponse } from 'next/server'

const TOOL_INSTRUCTIONS: Record<string, string> = {
  diagram:
    'Create a system or concept diagram. Use rectangles for components and arrows for how data flows between them.',
  flowchart:
    'Create a flowchart. Use diamonds for decisions, rectangles for steps, and label the branches of each decision.',
  web:
    'Create a website wireframe. Use a wide rectangle for the navigation bar, rectangles for each section, and labeled boxes for buttons.',
  mobile:
    'Create a mobile screen wireframe. Use one tall rectangle for the screen, with boxes for the header, list items, and bottom navigation.',
}

const SYSTEM_PROMPT = `You create whiteboard diagrams. Respond ONLY with JSON, with no preamble and no markdown.

Use this exact shape:
{
  "nodes": [
    { "id": "n1", "shape": "rectangle" | "diamond" | "ellipse", "label": "short text" }
  ],
  "arrows": [
    { "from": "n1", "to": "n2", "label": "optional short text" }
  ]
}

Rules:
- Use short labels, at most 4 words each.
- Every arrow's from and to must match a node id.
- Use at most 20 nodes.
- Do not include coordinates or sizes. The client lays out the shapes.`

const GEMINI_MODEL = 'gemini-3.8-flash'
const MAX_ATTEMPTS = 3

async function callGemini(apiKey: string, body: string): Promise<Response> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
  const headers = {
    'x-goog-api-key': apiKey,
    'Content-Type': 'application/json',
  }

  let response: Response | null = null

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    response = await fetch(url, { method: 'POST', headers, body })

    if (response.ok || ![429, 503].includes(response.status)) break

    console.warn(`Gemini busy (${response.status}), attempt ${attempt} of ${MAX_ATTEMPTS}`)
    if (attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 2000))
    }
  }

  return response!
}

export async function POST(req: Request) {
  try {
    const raw = await req.text()
    if (!raw) {
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 })
    }

    const { prompt, toolType } = JSON.parse(raw)

    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 1000) {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 })
    }
    if (typeof toolType !== 'string' || !(toolType in TOOL_INSTRUCTIONS)) {
      return NextResponse.json({ error: 'Invalid tool type' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 })
    }

    const response = await callGemini(
      apiKey,
      JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          {
            role: 'user',
            parts: [{ text: `${TOOL_INSTRUCTIONS[toolType]}\n\nRequest: ${prompt}` }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 8000,
        },
      })
    )

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Gemini error:', response.status, errorBody)
      return NextResponse.json({ error: 'AI request failed' }, { status: 502 })
    }

    const data = await response.json()
    const text: string =
      data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? ''

    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.arrows)) {
      return NextResponse.json({ error: 'Unexpected AI response' }, { status: 502 })
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Route error:', err)
    return NextResponse.json({ error: 'Could not generate diagram' }, { status: 500 })
  }
}