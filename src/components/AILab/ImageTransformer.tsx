import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Upload,
  Download,
  Loader2,
  Sliders,
  Image as ImageIcon,
  Sun,
  Home,
  Eraser,
  Camera,
  Info,
  Maximize2,
  Eye,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { imageTransformationService, type TransformationResponse } from '../../services/imageTransformationService'
import { type TransformationType } from '../../lib/openrouter'

const TRANSFORMATION_MODES: { id: TransformationType; label: string; icon: any; description: string; color: string }[] = [
  {
    id: 'staging',
    label: 'Virtual Staging',
    icon: Home,
    description: 'Designer furnishing',
    color: 'from-slate-700 to-slate-900',
  },
  {
    id: 'twilight',
    label: 'Day to Dusk',
    icon: Sun,
    description: 'Golden hour lighting',
    color: 'from-slate-700 to-slate-900',
  },
  {
    id: 'enhance',
    label: 'HDR Enhance',
    icon: Camera,
    description: 'Tone & lens correction',
    color: 'from-slate-700 to-slate-900',
  },
  {
    id: 'declutter',
    label: 'Object Removal',
    icon: Eraser,
    description: 'Minimalist editing',
    color: 'from-slate-700 to-slate-900',
  },
]

const ImageTransformer: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [transformation, setTransformation] = useState<TransformationResponse | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mode, setMode] = useState<TransformationType>('enhance')
  const [customPrompt, setCustomPrompt] = useState('')
  const [showOriginal, setShowOriginal] = useState(false)
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
      toast.success('File imported successfully')
    }
  }, [])

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
      toast.success('Processing complete')
    } catch (error) {
      console.error('Transformation error:', error)
      toast.error('Processing error. Please try again.')
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
        toast.error('Export failed')
      } finally {
        setIsDownloading(false)
      }
    }
  }

  const resetImage = () => {
    setUploadedImage(null)
    setImagePreview('')
    setTransformation(null)
    setCustomPrompt('')
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* ── Sidebar Controls (L:4 Clms) ─────────────────────────────────── */}
        <div className="xl:col-span-4 space-y-6">
          <section className="bg-slate-900 border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
            <header className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Sliders size={20} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Studio Settings</h2>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Professional Photo Labs</p>
              </div>
            </header>

            {!imagePreview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => fileInputRef.current?.click()}
                className="border border-white/10 bg-white/5 rounded-3xl p-12 text-center cursor-pointer hover:bg-white/10 transition-all group/upload"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover/upload:bg-indigo-500/20 transition-all duration-300">
                  <Upload size={28} className="text-white/40 group-hover/upload:text-indigo-400 text-transition-all" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Import Photo</h3>
                <p className="text-white/30 text-sm max-w-[180px] mx-auto leading-relaxed">
                  Select a high-resolution property exterior or interior
                </p>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)} />
              </motion.div>
            ) : (
              <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                {/* Mode Selection */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Service Type</label>
                  <div className="grid grid-cols-1 gap-3">
                    {TRANSFORMATION_MODES.map((m) => {
                      const Icon = m.icon
                      const isActive = mode === m.id
                      return (
                        <button
                          key={m.id}
                          onClick={() => setMode(m.id)}
                          className={`relative flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group/btn ${
                            isActive 
                              ? 'bg-indigo-500/10 border-indigo-500/30' 
                              : 'bg-white/5 border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            isActive ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-white/40'
                          }`}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <p className={`font-bold text-sm ${isActive ? 'text-white' : 'text-white/70'}`}>{m.label}</p>
                            <p className="text-[10px] text-white/30 font-medium tracking-wide leading-none mt-1">{m.description}</p>
                          </div>
                          {isActive && (
                            <div className="ml-auto">
                              <CheckCircle2 size={18} className="text-indigo-400" />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Custom Prompt */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1 flex items-center justify-between">
                    Specific Instructions
                    <span className="text-[9px] font-bold text-white/20 uppercase">Internal use only</span>
                  </label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g. Enhance window clarity, match wall colors..."
                    className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white text-sm focus:outline-none focus:border-indigo-500/30 transition-all resize-none min-h-[100px] placeholder:text-white/10"
                  />
                </div>

                {/* Primary Action */}
                <button
                  onClick={transformImageAction}
                  disabled={isProcessing}
                  className="w-full relative group/process h-16 rounded-2xl bg-indigo-600 text-white font-bold uppercase tracking-[0.1em] shadow-2xl active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isProcessing ? <Loader2 size={22} className="animate-spin" /> : <ChevronRight size={22} />}
                    {isProcessing ? 'Processing Image...' : 'Apply Transformation'}
                  </span>
                </button>

                <button onClick={resetImage} className="w-full text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors">
                  Reset Editor
                </button>
              </div>
            )}
          </section>

          {/* Quick Info Card */}
          <section className="bg-slate-900 border border-white/5 rounded-3xl p-6 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5">
              <Info size={18} />
            </div>
            <div>
              <p className="text-xs text-white/40 font-medium leading-relaxed">
                All transformations are processed at high-resolution to ensure print-quality results for marketing materials.
              </p>
            </div>
          </section>
        </div>

        {/* ── Main Canvas Area (R:8 Clms) ──────────────────────────────────── */}
        <div className="xl:col-span-8 h-full min-h-[600px] xl:min-h-0 flex flex-col">
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] flex-1 flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Top Toolbar */}
            <div className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-slate-950/20">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mb-0.5" />
                  <span className="text-[10px] font-bold uppercase text-white/60 tracking-widest">Workspace</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <AnimatePresence>
                  {transformation && (
                    <motion.button
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={downloadEnhanced}
                      disabled={isDownloading}
                      className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-950 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all disabled:opacity-50"
                    >
                      {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                      Export Photo
                    </motion.button>
                  )}
                </AnimatePresence>
                
                {imagePreview && (
                  <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 transition-all">
                    <Maximize2 size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Quality Viewport */}
            <div className="flex-1 relative p-6 group/canvas">
              <div className="w-full h-full rounded-[2rem] overflow-hidden bg-slate-950 shadow-inner ring-1 ring-white/5 relative">
                {!imagePreview ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                      <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                        <ImageIcon size={48} className="text-white/10" />
                      </div>
                      <h3 className="text-xl font-semibold text-white/20 lowercase tracking-tight">no photo selected</h3>
                  </div>
                ) : (
                  <div className="w-full h-full relative group/preview">
                    {/* Background: Either the result or the original */}
                    <img
                      src={transformation ? (showOriginal ? imagePreview : transformation.enhancedImageUrl) : imagePreview}
                      alt="Property Viewport"
                      className="w-full h-full object-cover transition-all duration-500"
                    />

                    {/* Processing State */}
                    <AnimatePresence>
                      {isProcessing && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-slate-950/90 z-30 flex flex-col items-center justify-center text-center"
                        >
                          <div className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6" />
                          <h4 className="text-lg font-bold text-white mb-1 uppercase tracking-widest">Optimizing Photo</h4>
                          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Applying professional edits</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Interaction Badge */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40">
                      {transformation && (
                        <div
                          onMouseEnter={() => setShowOriginal(true)}
                          onMouseLeave={() => setShowOriginal(false)}
                          className={`flex items-center gap-3 px-8 py-4 rounded-full border transition-all select-none cursor-help font-bold text-xs uppercase tracking-widest ${
                            showOriginal ? 'bg-white text-slate-950 border-white shadow-2xl' : 'bg-slate-900/90 text-white border-white/10'
                          }`}
                        >
                          <Eye size={16} />
                          {showOriginal ? 'Showing Before' : 'View Before'}
                        </div>
                      )}
                    </div>

                    {/* Results Overlay */}
                    <AnimatePresence>
                      {transformation && !showOriginal && !isProcessing && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute top-10 right-10 z-20 px-5 py-2 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                        >
                          Optimized Result
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Content Labels */}
            <div className="h-14 border-t border-white/5 bg-slate-950/20 px-8 flex items-center justify-between text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
               <span>Propel Photo Labs v3.0</span>
               <div className="flex items-center gap-6">
                  {imagePreview && <span className="flex items-center gap-2 italic"><div className="w-1 h-1 rounded-full bg-white/20" /> Lossless Preview</span>}
                  <span>Ready for Export</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageTransformer
