import React, { useState, useRef } from 'react'
import { toast } from 'sonner'
import {
  FileText,
  Loader2,
  Sparkles,
  Copy,
  RotateCcw,
  Globe,
  Image as ImageIcon,
  X,
  Facebook,
  Instagram,
  BookOpen,
  CheckCircle2,
} from 'lucide-react'
import {
  generateRealEstateCopy,
  analyzeAndDescribeImage,
  type RealEstateCopyOutput,
  type ImageAnalysisOutput,
} from '../../lib/gemini'

// ── Constants ─────────────────────────────────────────────────────────────────

const LANGUAGES = [
  { value: 'Georgian', label: '🇬🇪 Georgian' },
  { value: 'English', label: '🇬🇧 English' },
  { value: 'Russian', label: '🇷🇺 Russian' },
]

const inputClass =
  'w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm'

// ── Main Component ────────────────────────────────────────────────────────────

const CopyGenerator: React.FC = () => {
  const [description, setDescription] = useState('')
  const [language, setLanguage] = useState('Georgian')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const [generatedCopy, setGeneratedCopy] = useState<RealEstateCopyOutput | null>(null)
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysisOutput | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleImageChange = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG / PNG / WebP)')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setImageAnalysis(null)
  }

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview('')
    setImageAnalysis(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const generate = async () => {
    if (!description.trim()) {
      toast.error('Please enter a property description')
      return
    }
    setIsGenerating(true)
    setGeneratedCopy(null)
    setImageAnalysis(null)

    try {
      // Run copy generation and optional image analysis in parallel
      const tasks: [
        Promise<RealEstateCopyOutput>,
        Promise<ImageAnalysisOutput> | null,
      ] = [
        generateRealEstateCopy({ description, language }),
        imageFile ? analyzeAndDescribeImage(imageFile) : null,
      ]

      const [copy, analysis] = await Promise.all(tasks)
      setGeneratedCopy(copy)
      if (analysis) setImageAnalysis(analysis)
      toast.success('Marketing pack generated!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      toast.error(msg)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const reset = () => {
    setDescription('')
    setGeneratedCopy(null)
    setImageAnalysis(null)
    removeImage()
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ── Left Column: Input Form ─────────────────────────────────────────── */}
      <div className="space-y-6">
        {/* Property Description */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <FileText size={20} className="text-indigo-400" />
            Property Description
          </h2>

          <div className="space-y-5">
            {/* Description textarea */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Describe the property or paste a listing link
              </label>
              <textarea
                id="property-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder={`e.g. 3-bedroom apartment in Vake, 120 sqm, sunny, renovated kitchen, mountain view, $250,000`}
                className={inputClass + ' resize-none'}
              />
            </div>

            {/* Language selector */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-1">
                <Globe size={14} />
                Output Language
              </label>
              <select
                id="output-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={inputClass}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <ImageIcon size={20} className="text-violet-400" />
            Property Image
            <span className="ml-auto text-xs text-white/40 font-normal">Optional</span>
          </h2>

          {!imagePreview ? (
            <div
              id="image-upload-zone"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                handleImageChange(e.dataTransfer.files?.[0] ?? null)
              }}
              className="border-2 border-dashed border-white/20 hover:border-indigo-500/60 rounded-xl p-8 text-center cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-500/20 transition-colors">
                <ImageIcon size={24} className="text-white/60 group-hover:text-indigo-400 transition-colors" />
              </div>
              <p className="text-white/70 text-sm font-medium mb-1">Drop an image or click to browse</p>
              <p className="text-white/40 text-xs">JPEG · PNG · WebP</p>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={imagePreview}
                alt="Property photo"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white text-xs truncate">{imageFile?.name}</p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Generate button */}
        <div className="flex gap-3">
          <button
            id="generate-marketing-pack"
            onClick={generate}
            disabled={isGenerating}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generating Marketing Pack…
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Marketing Pack
              </>
            )}
          </button>
          {(generatedCopy || imageAnalysis) && (
            <button
              onClick={reset}
              className="py-4 px-4 bg-white/10 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all"
              title="Reset"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ── Right Column: Results ────────────────────────────────────────────── */}
      <div className="space-y-5">
        {!generatedCopy && !imageAnalysis && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-10 h-full flex items-center justify-center">
            <div className="text-center text-white/30">
              <Sparkles size={48} className="mx-auto mb-4 opacity-40" />
              <p className="font-medium text-white/50">Your Marketing Pack will appear here</p>
              <p className="text-sm mt-1 text-white/30">Fill in the form and click "Generate"</p>
            </div>
          </div>
        )}

        {/* Facebook */}
        {generatedCopy && (
          <CopyCard
            id="facebook-copy"
            label="Facebook"
            icon={<Facebook size={16} />}
            accentClass="from-blue-500/15 to-indigo-500/15 border-blue-500/30"
            badgeClass="bg-blue-500/20 text-blue-400"
            value={generatedCopy.facebook}
            onCopy={() => copyToClipboard(generatedCopy.facebook, 'Facebook copy')}
          />
        )}

        {/* Instagram */}
        {generatedCopy && (
          <CopyCard
            id="instagram-copy"
            label="Instagram"
            icon={<Instagram size={16} />}
            accentClass="from-pink-500/15 to-orange-500/15 border-pink-500/30"
            badgeClass="bg-pink-500/20 text-pink-400"
            value={generatedCopy.instagram}
            onCopy={() => copyToClipboard(generatedCopy.instagram, 'Instagram copy')}
          />
        )}

        {/* Listing Description */}
        {generatedCopy && (
          <CopyCard
            id="listing-description"
            label="Listing Description"
            icon={<BookOpen size={16} />}
            accentClass="from-emerald-500/15 to-teal-500/15 border-emerald-500/30"
            badgeClass="bg-emerald-500/20 text-emerald-400"
            value={generatedCopy.listingDescription}
            rows={6}
            onCopy={() => copyToClipboard(generatedCopy.listingDescription, 'Listing description')}
          />
        )}

        {/* Image Analysis Results */}
        {imageAnalysis && <ImageAnalysisCard analysis={imageAnalysis} onCopy={copyToClipboard} />}
      </div>
    </div>
  )
}

// ── Sub-component: generic copy card ─────────────────────────────────────────

interface CopyCardProps {
  id: string
  label: string
  icon: React.ReactNode
  accentClass: string
  badgeClass: string
  value: string
  rows?: number
  onCopy: () => void
}

const CopyCard: React.FC<CopyCardProps> = ({
  id, label, icon, accentClass, badgeClass, value, rows = 4, onCopy,
}) => {
  const [text, setText] = useState(value)

  // sync when value changes (new generation)
  React.useEffect(() => { setText(value) }, [value])

  return (
    <div className={`bg-gradient-to-br ${accentClass} backdrop-blur-sm border rounded-2xl p-6`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}>
          {icon}
          {label}
        </div>
        <button
          id={`copy-${id}`}
          onClick={onCopy}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          title="Copy to clipboard"
        >
          <Copy size={15} />
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={rows}
        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
      />
    </div>
  )
}

// ── Sub-component: image analysis card ───────────────────────────────────────

interface ImageAnalysisCardProps {
  analysis: ImageAnalysisOutput
  onCopy: (text: string, label: string) => void
}

const ImageAnalysisCard: React.FC<ImageAnalysisCardProps> = ({ analysis, onCopy }) => (
  <div className="bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 border border-violet-500/30 backdrop-blur-sm rounded-2xl p-6 space-y-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-violet-500/20 text-violet-400">
        <CheckCircle2 size={16} />
        AI Image Analysis
      </div>
      <button
        id="copy-image-description"
        onClick={() => onCopy(analysis.listingDescription, 'Image description')}
        className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        title="Copy listing description"
      >
        <Copy size={15} />
      </button>
    </div>

    {/* Headline */}
    <p className="text-white/90 text-sm font-medium leading-relaxed">{analysis.headline}</p>

    {/* Lighting + Features */}
    <div className="grid grid-cols-2 gap-3 text-xs">
      <div className="bg-slate-900/40 rounded-xl p-3">
        <p className="text-white/50 mb-1">Lighting</p>
        <p className="text-amber-400 font-semibold">{analysis.lighting}</p>
      </div>
      <div className="bg-slate-900/40 rounded-xl p-3">
        <p className="text-white/50 mb-1">Features detected</p>
        <p className="text-white font-semibold">{analysis.features.length} items</p>
      </div>
    </div>

    {/* Features list */}
    <div className="flex flex-wrap gap-2">
      {analysis.features.map((f, i) => (
        <span key={i} className="px-2 py-1 bg-white/10 text-white/70 rounded-lg text-xs">{f}</span>
      ))}
    </div>

    {/* Suggestions */}
    {analysis.suggestions.length > 0 && (
      <div className="bg-slate-900/30 rounded-xl p-3 space-y-1">
        <p className="text-white/50 text-xs mb-2">📸 Photography Tips</p>
        {analysis.suggestions.map((s, i) => (
          <p key={i} className="text-white/70 text-xs flex gap-2">
            <span className="text-indigo-400 shrink-0">→</span>{s}
          </p>
        ))}
      </div>
    )}

    {/* Generated Listing Description */}
    <div>
      <p className="text-white/50 text-xs mb-2">AI Generated Description (from image)</p>
      <textarea
        defaultValue={analysis.listingDescription}
        rows={5}
        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none transition-all"
      />
    </div>
  </div>
)

export default CopyGenerator