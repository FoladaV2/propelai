import React, { useState } from 'react'
import { generateImage } from '../lib/openrouter'
import {
  Wand2,
  Loader2,
  Download,
  RotateCcw,
  ImageIcon,
  AlertCircle,
  Sparkles,
} from 'lucide-react'

const EXAMPLE_PROMPTS = [
  'Luxury modern living room with floor-to-ceiling windows, warm ambient lighting, and slate-gray furniture',
  'Aerial view of a contemporary suburban home with a manicured backyard and swimming pool at golden hour',
  'Minimalist kitchen with quartz countertops, stainless steel appliances, and natural wood accents',
]

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter an image prompt.')
      return
    }

    setLoading(true)
    setError('')
    setImageUrl('')

    try {
      const url = await generateImage(prompt)
      setImageUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPrompt('')
    setImageUrl('')
    setError('')
  }

  const handleDownload = () => {
    if (!imageUrl) return
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `propel-ai-image-${Date.now()}.png`
    link.click()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate()
  }

  return (
    <div className="space-y-6">
      {/* ── Prompt Input ────────────────────────────────────────────── */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <Wand2 size={20} className="text-violet-400" />
          AI Image Generator
        </h2>
        <p className="text-white/50 text-sm mb-6">
          Describe the property photo you need — Propel will create it for you.
        </p>

        <div className="space-y-4">
          <div className="relative">
            <textarea
              id="ig-prompt-input"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value)
                setError('')
              }}
              onKeyDown={handleKeyDown}
              rows={4}
              placeholder="e.g. Luxury penthouse living room with panoramic city views, warm lighting, modern furniture…"
              className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all text-sm resize-none"
            />
            <p className="absolute bottom-3 right-3 text-white/20 text-xs">
              ⌘↵ to generate
            </p>
          </div>

          {/* Example prompts */}
          <div>
            <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">
              Try an example
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((example, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(example)
                    setError('')
                  }}
                  className="text-xs px-3 py-1.5 bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/40 text-white/60 hover:text-violet-300 rounded-lg transition-all text-left truncate max-w-xs"
                >
                  {example.length > 60 ? example.slice(0, 60) + '…' : example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-rose-400 mt-0.5 shrink-0" />
          <p className="text-rose-300 text-sm">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          id="ig-generate-btn"
          onClick={handleGenerate}
          disabled={loading}
          className="flex-1 py-4 px-6 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Generating Image…
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Image
            </>
          )}
        </button>

        {(imageUrl || error) && (
          <button
            id="ig-reset-btn"
            onClick={handleReset}
            className="py-4 px-4 bg-white/10 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all"
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>
        )}

        {imageUrl && (
          <button
            id="ig-download-btn"
            onClick={handleDownload}
            className="py-4 px-4 bg-white/10 text-white/60 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all"
            title="Download image"
          >
            <Download size={18} />
          </button>
        )}
      </div>

      {/* ── Result ──────────────────────────────────────────────────── */}
      {loading && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          <div className="aspect-video flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
              <Wand2
                size={20}
                className="absolute inset-0 m-auto text-violet-400 animate-pulse"
              />
            </div>
            <div className="text-center">
              <p className="text-white/70 font-medium">Generating your image…</p>
              <p className="text-white/40 text-sm mt-1">This may take a few seconds</p>
            </div>
          </div>
        </div>
      )}

      {imageUrl && !loading && (
        <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/25 backdrop-blur-sm rounded-2xl overflow-hidden">
          {/* Badge bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-sm font-medium text-violet-300">
              <ImageIcon size={14} />
              AI Generated Image
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
            >
              <Download size={13} />
              Download
            </button>
          </div>

          {/* Image */}
          <div className="p-4">
            <img
              id="ig-result-image"
              src={imageUrl}
              alt="AI generated property image"
              className="w-full rounded-xl object-cover shadow-2xl shadow-black/50"
            />
          </div>

          {/* Regenerate hint */}
          <div className="px-5 pb-4 text-center">
            <p className="text-white/30 text-xs">
              Not quite right? Edit your prompt above and generate again.
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!imageUrl && !loading && !error && (
        <div className="bg-slate-800/30 border border-dashed border-white/10 rounded-2xl aspect-video flex items-center justify-center">
          <div className="text-center text-white/20">
            <ImageIcon size={56} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-white/40">Your generated image will appear here</p>
            <p className="text-sm mt-1 text-white/25">
              Describe any property scene and let AI bring it to life
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
