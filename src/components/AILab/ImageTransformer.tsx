import React, { useState, useCallback, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Upload,
  Download,
  Sparkles,
  Loader2,
  Sliders,
  Image as ImageIcon,
  Sun,
  Home,
  Eraser,
  Wand2,
  History,
  Info,
} from 'lucide-react'
import { imageTransformationService, type TransformationResponse } from '../../services/imageTransformationService'
import { type TransformationType } from '../../lib/openrouter'

const TRANSFORMATION_MODES: { id: TransformationType; label: string; icon: any; description: string }[] = [
  {
    id: 'staging',
    label: 'Virtual Staging',
    icon: Home,
    description: 'Add modern furniture to empty rooms',
  },
  {
    id: 'twilight',
    label: 'Day to Dusk',
    icon: Sun,
    description: 'Convert day photos to twilight shots',
  },
  {
    id: 'enhance',
    label: 'HDR Enhance',
    icon: Wand2,
    description: 'Professional color & lens correction',
  },
  {
    id: 'declutter',
    label: 'Object Removal',
    icon: Eraser,
    description: 'Clean mess and personlized items',
  },
]

const ImageTransformer: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [transformation, setTransformation] = useState<TransformationResponse | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mode, setMode] = useState<TransformationType>('enhance')
  const [customPrompt, setCustomPrompt] = useState('')
  const [sliderPosition, setSliderPosition] = useState(50)

  const [isDownloading, setIsDownloading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
      }
    }
  }, [])

  const handleImageUpload = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
      }
      const nextPreviewUrl = URL.createObjectURL(file)
      previewUrlRef.current = nextPreviewUrl
      setUploadedImage(file)
      setImagePreview(nextPreviewUrl)
      setTransformation(null)
      setSliderPosition(50)
      toast.success('Image uploaded successfully')
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    handleImageUpload(file ?? null)
  }, [handleImageUpload])

  const transformImageAction = async () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first')
      return
    }
    setIsProcessing(true)
    try {
      const result = await imageTransformationService.transformPropertyPhoto({
        imageFile: uploadedImage,
        type: mode,
        prompt: customPrompt,
      })
      setTransformation(result)
      setSliderPosition(50)
      toast.success('Image transformed successfully!')
    } catch (error) {
      console.error('Transformation error:', error)
      toast.error('Failed to transform image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadEnhanced = async () => {
    if (transformation && uploadedImage) {
      try {
        setIsDownloading(true)
        await imageTransformationService.downloadEnhancedImage(
          transformation.enhancedImageUrl,
          uploadedImage.name
        )
      } catch (error) {
        toast.error('Failed to download image')
      } finally {
        setIsDownloading(false)
      }
    }
  }

  const resetImage = () => {
    setUploadedImage(null)
    setImagePreview('')
    setTransformation(null)
    setSliderPosition(50)
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ── Left Column: Controls ────────────────────────────────────────── */}
      <div className="space-y-6">
        {/* Step 1: Upload */}
        <div className={`bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 ${!imagePreview ? 'min-h-[500px] flex flex-col' : ''}`}>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold">1</span>
            Upload Property Photo
          </h2>

          <div
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
              imagePreview
                ? 'border-indigo-500/50 bg-indigo-500/5'
                : 'border-white/10 hover:border-white/30 bg-slate-900/50 hover:bg-slate-900/80'
            } ${!imagePreview ? 'flex-1 flex items-center justify-center' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
              className="hidden"
            />

            {!imagePreview ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-indigo-500/10 text-indigo-400">
                  <Upload size={32} />
                </div>
                <div>
                  <p className="text-white font-medium mb-1.5 text-lg">Drop your photo here</p>
                  <p className="text-white/40 text-sm">PNG, JPG or WebP (Max 10MB)</p>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Uploaded property"
                  className="w-full h-56 object-cover rounded-xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <p className="text-white font-medium flex items-center gap-2"><History size={18} /> Click to change</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); resetImage() }}
                  className="absolute -top-3 -right-3 w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors shadow-lg z-10"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Transformation Mode */}
        {imagePreview && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-sm font-bold">2</span>
              Choose Transformation
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {TRANSFORMATION_MODES.map((m) => {
                const Icon = m.icon
                const isActive = mode === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex flex-col items-start p-4 rounded-xl border transition-all text-left group ${
                      isActive
                        ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                        : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={20} className={`mb-2 ${isActive ? 'text-violet-400' : 'text-white/40 group-hover:text-white/60'}`} />
                    <span className="font-semibold text-sm mb-1">{m.label}</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-60 leading-tight">{m.description}</span>
                  </button>
                )
              })}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/40 mb-2 uppercase tracking-widest">
                  Custom Instructions (Optional)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. Add luxury furniture, white oak floors, black accents..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                  rows={2}
                />
              </div>

              <button
                onClick={transformImageAction}
                disabled={isProcessing}
                className="w-full py-4 px-6 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Transforming Photo...
                  </>
                ) : (
                  <>
                    <ImageIcon size={24} />
                    Transform Property Photo
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Right Column: Preview ─────────────────────────────────────────── */}
      <div className="h-full min-h-[500px]">
        {!imagePreview ? (
          <div className="h-full bg-slate-800/30 border border-dashed border-white/10 rounded-2xl flex items-center justify-center p-12">
            <div className="text-center max-w-xs">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <ImageIcon size={40} className="text-white/10" />
              </div>
              <p className="text-white/40 font-medium text-lg leading-relaxed">
                Upload a property photo to begin transformation
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-white/20 justify-center">
                  <Info size={14} />
                  <span>High Resolution Support</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-1 h-full flex flex-col shadow-2xl relative">
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 text-sm">
                <Sliders size={18} className="text-indigo-400" />
                Comparison Preview
              </h3>
              {transformation && (
                <button
                  onClick={downloadEnhanced}
                  disabled={isDownloading}
                  className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all flex items-center gap-2 text-xs font-bold disabled:opacity-50"
                >
                  {isDownloading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Download size={14} />
                  )}
                  {isDownloading ? 'Preparing...' : 'Export High-Res'}
                </button>
              )}
            </div>

            {/* Slider Container */}
            <div className="flex-1 relative m-4 overflow-hidden rounded-xl bg-slate-900 ring-1 ring-white/10 group">
              {/* After Image */}
              <div className="absolute inset-0">
                {transformation ? (
                  <img
                    src={transformation.enhancedImageUrl}
                    alt="After transformation"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/20 animate-pulse">
                    <Sparkles size={64} className="mb-4 opacity-10" />
                    <p className="font-medium text-lg">Waiting for transformation...</p>
                  </div>
                )}
                {transformation && (
                  <div className="absolute top-6 right-6 px-4 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-black shadow-xl ring-2 ring-emerald-400/50">
                    TRANSFORMED
                  </div>
                )}
              </div>

              {/* Before Image (Top Layer, clipped) */}
              <div
                className="absolute inset-0 z-10"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img
                  src={imagePreview}
                  alt="Original property"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-slate-900 border border-white/10 text-white rounded-full text-xs font-black shadow-xl">
                  ORIGINAL
                </div>
              </div>

              {/* Slider Handle */}
              <div
                className="absolute inset-y-0 z-20 w-1 bg-white select-none cursor-ew-resize flex items-center justify-center"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  const container = e.currentTarget.parentElement as HTMLElement
                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    const rect = container.getBoundingClientRect()
                    const x = moveEvent.clientX - rect.left
                    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100))
                    setSliderPosition(pct)
                  }
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove)
                    document.removeEventListener('mouseup', handleMouseUp)
                    document.body.style.cursor = ''
                  }
                  document.body.style.cursor = 'ew-resize'
                  document.addEventListener('mousemove', handleMouseMove)
                  document.addEventListener('mouseup', handleMouseUp)
                }}
              >
                <div className="absolute w-12 h-12 bg-white rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] border-4 border-slate-900 flex items-center justify-center -translate-x-1/2">
                   <div className="flex gap-1">
                      <div className="w-1 h-3 bg-indigo-500 rounded-full" />
                      <div className="w-1 h-3 bg-indigo-500 rounded-full" />
                   </div>
                </div>
              </div>
            </div>

            <div className="px-8 pb-6 text-center">
              <div className="flex items-center gap-4 justify-center text-xs text-white/30 font-medium">
                <span className="flex items-center gap-1.5"><Sliders size={12} /> Drag to compare</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1.5 text-indigo-400"><History size={12} /> Real-time preview</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageTransformer