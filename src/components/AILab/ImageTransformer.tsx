import React, { useState, useCallback } from 'react'
import { toast } from 'sonner'
import {
  Upload,
  Download,
  Sparkles,
  Settings,
  Loader2,
  CheckCircle,
  Sliders,
  Image as ImageIcon,
} from 'lucide-react'
import { imageTransformationService, type TransformationResponse } from '../../services/imageTransformationService'

const ImageTransformer: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [transformation, setTransformation] = useState<TransformationResponse | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<'original' | '4:5' | '16:9'>('original')
  const [sliderPosition, setSliderPosition] = useState(50)

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file)
      setImagePreview(URL.createObjectURL(file))
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
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file)
      setImagePreview(URL.createObjectURL(file))
      setTransformation(null)
      setSliderPosition(50)
      toast.success('Image uploaded successfully')
    }
  }, [])

  const transformImage = async () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first')
      return
    }
    setIsProcessing(true)
    try {
      const result = await imageTransformationService.transformPropertyPhoto({
        imageFile: uploadedImage,
        aspectRatio,
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

  const downloadEnhanced = () => {
    if (transformation && uploadedImage) {
      imageTransformationService.downloadEnhancedImage(
        transformation.enhancedImageUrl,
        uploadedImage.name
      )
      toast.success('Enhanced image downloaded!')
    }
  }

  const resetImage = () => {
    setUploadedImage(null)
    setImagePreview('')
    setTransformation(null)
    setSliderPosition(50)
    URL.revokeObjectURL(imagePreview)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Upload & Controls */}
      <div className="space-y-6">
        {/* Upload Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Upload size={20} className="text-indigo-400" />
            Upload Property Photo
          </h2>

          {/* Drag & Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              imagePreview
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-white/20 hover:border-white/40 bg-white/5'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {!imagePreview ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10">
                  <ImageIcon size={32} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-medium mb-2">Drag & drop property photo</p>
                  <p className="text-white/60 text-sm">or click to browse</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Uploaded property"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); resetImage() }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Settings */}
          {imagePreview && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <Settings size={16} className="inline mr-2" />
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as 'original' | '4:5' | '16:9')}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                >
                  <option value="original">Original</option>
                  <option value="4:5">4:5 (Instagram)</option>
                  <option value="16:9">16:9 (YouTube)</option>
                </select>
              </div>

              <button
                onClick={transformImage}
                disabled={isProcessing}
                className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Transform Photo
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Transformation Info */}
        {transformation && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              Transformation Complete
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Processing Time:</span>
                <span className="text-white font-medium">
                  {(transformation.processingTime / 1000).toFixed(1)}s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Enhancement:</span>
                <span className="text-green-400 font-medium">Architectural Photography</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Resolution:</span>
                <span className="text-white font-medium">2K JPEG</span>
              </div>
            </div>
            <button
              onClick={downloadEnhanced}
              className="w-full mt-4 py-2 px-4 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Download Enhanced
            </button>
          </div>
        )}
      </div>

      {/* Right Column - Before/After Slider */}
      {imagePreview && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Sliders size={20} className="text-indigo-400" />
            Before / After Comparison
          </h2>

          <div className="relative">
            <div className="relative h-96 bg-slate-700/30 rounded-xl overflow-hidden">
              {/* Before Image */}
              <div
                className="absolute inset-0"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
              >
                <img
                  src={imagePreview}
                  alt="Before transformation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                  BEFORE
                </div>
              </div>

              {/* After Image */}
              <div
                className="absolute inset-0"
                style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
              >
                {transformation ? (
                  <img
                    src={transformation.enhancedImageUrl}
                    alt="After transformation"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/60 bg-slate-700/50">
                    <div className="text-center">
                      <Sparkles size={48} className="mx-auto mb-2 opacity-50" />
                      <p>Transform to see result</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-green-500/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                  AFTER
                </div>
              </div>

              {/* Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-lg"
                style={{ left: `${sliderPosition}%` }}
              />

              {/* Slider Handle */}
              <div
                className="absolute top-1/2 w-10 h-10 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  const container = e.currentTarget.closest('.relative') as HTMLElement
                  const rect = container?.getBoundingClientRect()
                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    if (!rect) return
                    const x = moveEvent.clientX - rect.left
                    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100))
                    setSliderPosition(pct)
                  }
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove)
                    document.removeEventListener('mouseup', handleMouseUp)
                    document.body.style.cursor = ''
                  }
                  document.body.style.cursor = 'grabbing'
                  document.addEventListener('mousemove', handleMouseMove)
                  document.addEventListener('mouseup', handleMouseUp)
                }}
              >
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-5 bg-indigo-500 rounded-full" />
                  <div className="w-0.5 h-5 bg-indigo-500 rounded-full" />
                </div>
              </div>
            </div>

            <div className="mt-4 text-center text-white/60 text-sm">
              Drag slider to compare before / after • Click "Transform Photo" to enhance
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageTransformer