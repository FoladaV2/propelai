import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { aiService, type PropertyDetails } from '../services/aiService'
import { 
  Upload, 
  X, 
  Home, 
  DollarSign, 
  Square, 
  MapPin, 
  Bed, 
  Bath, 
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Loader2
} from 'lucide-react'

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  address: z.string().min(10, 'Please enter a full address'),
  price: z.string().min(1, 'Price is required'),
  bedrooms: z.string().min(0, 'Bedrooms must be 0 or more'),
  bathrooms: z.string().min(0, 'Bathrooms must be 0 or more'),
  squareFootage: z.string().min(1, 'Square footage is required'),
  propertyType: z.enum(['apartment', 'house', 'commercial', 'land', 'office']),
  description: z.string().optional(),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface UploadedImage {
  id: string
  file: File
  preview: string
  name: string
}

const NewListing: React.FC = () => {
  const navigate = useNavigate()
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [enhancedImagePrompt, setEnhancedImagePrompt] = useState('')
  const [instagramCaption, setInstagramCaption] = useState('')
  const [linkedInBlurb, setLinkedInBlurb] = useState('')
  const [enhancedImages, setEnhancedImages] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  })

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB limit
    )
    
    if (files.length > 0) {
      handleImageUpload(files)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleImageUpload(files)
  }, [])

  const handleImageUpload = (files: File[]) => {
    const newImages: UploadedImage[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }))
    
    setUploadedImages(prev => [...prev, ...newImages])
    toast.success(`${files.length} image(s) uploaded successfully`)
  }

  const removeImage = (id: string) => {
    setUploadedImages(prev => {
      const image = prev.find(img => img.id === id)
      if (image) {
        URL.revokeObjectURL(image.preview)
      }
      return prev.filter(img => img.id !== id)
    })
    toast.info('Image removed')
  }

  const simulateAIProcessing = async () => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image')
      return
    }

    setIsProcessing(true)
    
    try {
      // Get form data
      const formData = getValues()
      
      // Prepare property details for AI
      const propertyDetails: PropertyDetails = {
        title: formData.title,
        address: formData.address,
        price: formData.price,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        squareFootage: formData.squareFootage,
        propertyType: formData.propertyType,
        description: formData.description
      }

      // Process with AI service
      const aiResponse = await aiService.processPropertyListing(
        propertyDetails,
        uploadedImages.map(img => img.file)
      )

      // Set AI-generated content
      setEnhancedImagePrompt(aiResponse.enhancedImagePrompt)
      setInstagramCaption(aiResponse.instagramCaption)
      setLinkedInBlurb(aiResponse.linkedInBlurb)
      
      // For demo purposes, use original images as "enhanced"
      // In production, you'd apply the enhancement prompt to actually enhance the images
      setEnhancedImages(uploadedImages.map(img => img.preview))
      
      setShowPreview(true)
      toast.success('AI enhancement completed!')
    } catch (error) {
      console.error('AI Processing Error:', error)
      toast.error('Failed to process with AI. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const onSubmit = async (_data: PropertyFormData) => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image')
      return
    }

    try {
      // Here you would normally send data to your backend
      toast.success('Listing created successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Failed to create listing')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
          <div className="px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-white">Create New Listing</h1>
                <p className="text-white/60 text-sm mt-1">AI-powered property marketing in 60 seconds</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-8">
          <AnimatePresence mode="wait">
            {!showPreview ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Image Upload Section */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Upload size={20} className="text-indigo-400" />
                    Property Images
                  </h2>
                  
                  {/* Drag and Drop Area */}
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                      isDragging 
                        ? 'border-indigo-500 bg-indigo-500/10' 
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    <div className="flex flex-col items-center gap-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                        isDragging ? 'bg-indigo-500/20' : 'bg-white/10'
                      }`}>
                        <Upload size={32} className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium mb-2">
                          {isDragging ? 'Drop images here' : 'Drag & drop property images'}
                        </p>
                        <p className="text-white/60 text-sm">
                          or click to browse (max 10MB per file)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Images Grid */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-white font-medium mb-4">Uploaded Images ({uploadedImages.length})</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {uploadedImages.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.preview}
                              alt={image.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(image.id)}
                              className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Property Details Form */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Home size={20} className="text-indigo-400" />
                    Property Details
                  </h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Title */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Property Title *
                        </label>
                        <input
                          type="text"
                          {...register('title')}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                          placeholder="e.g., Modern Downtown Apartment with City Views"
                        />
                        {errors.title && (
                          <p className="mt-2 text-sm text-red-400">{errors.title.message}</p>
                        )}
                      </div>

                      {/* Address */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          <MapPin size={16} className="inline mr-2" />
                          Full Address *
                        </label>
                        <input
                          type="text"
                          {...register('address')}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                          placeholder="123 Main Street, City, State 12345"
                        />
                        {errors.address && (
                          <p className="mt-2 text-sm text-red-400">{errors.address.message}</p>
                        )}
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          <DollarSign size={16} className="inline mr-2" />
                          Price *
                        </label>
                        <input
                          type="text"
                          {...register('price')}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                          placeholder="450000"
                        />
                        {errors.price && (
                          <p className="mt-2 text-sm text-red-400">{errors.price.message}</p>
                        )}
                      </div>

                      {/* Property Type */}
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Property Type *
                        </label>
                        <select
                          {...register('propertyType')}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        >
                          <option value="">Select type</option>
                          <option value="apartment">Apartment</option>
                          <option value="house">House</option>
                          <option value="commercial">Commercial</option>
                          <option value="land">Land</option>
                          <option value="office">Office</option>
                        </select>
                        {errors.propertyType && (
                          <p className="mt-2 text-sm text-red-400">{errors.propertyType.message}</p>
                        )}
                      </div>

                      {/* Square Footage */}
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          <Square size={16} className="inline mr-2" />
                          Square Footage *
                        </label>
                        <input
                          type="text"
                          {...register('squareFootage')}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                          placeholder="1500"
                        />
                        {errors.squareFootage && (
                          <p className="mt-2 text-sm text-red-400">{errors.squareFootage.message}</p>
                        )}
                      </div>

                      {/* Bedrooms */}
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          <Bed size={16} className="inline mr-2" />
                          Bedrooms
                        </label>
                        <input
                          type="text"
                          {...register('bedrooms')}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                          placeholder="3"
                        />
                        {errors.bedrooms && (
                          <p className="mt-2 text-sm text-red-400">{errors.bedrooms.message}</p>
                        )}
                      </div>

                      {/* Bathrooms */}
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          <Bath size={16} className="inline mr-2" />
                          Bathrooms
                        </label>
                        <input
                          type="text"
                          {...register('bathrooms')}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                          placeholder="2"
                        />
                        {errors.bathrooms && (
                          <p className="mt-2 text-sm text-red-400">{errors.bathrooms.message}</p>
                        )}
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Description (Optional)
                        </label>
                        <textarea
                          {...register('description')}
                          rows={4}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
                          placeholder="Add any additional details about the property..."
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={simulateAIProcessing}
                        disabled={uploadedImages.length === 0 || isProcessing}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            Processing with AI...
                          </>
                        ) : (
                          <>
                            <Sparkles size={20} />
                            Generate AI Preview
                          </>
                        )}
                      </button>
                      
                      <button
                        type="submit"
                        className="py-3 px-6 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                      >
                        Save as Draft
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* AI Preview Section */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Sparkles size={20} className="text-indigo-400" />
                      AI-Enhanced Preview
                    </h2>
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle size={20} />
                      <span className="font-medium">AI Processing Complete</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Enhanced Images */}
                    <div>
                      <h3 className="text-white font-medium mb-4">Enhanced Images</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {enhancedImages.map((image, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group"
                          >
                            <img
                              src={image}
                              alt={`Enhanced ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2 w-8 h-8 bg-green-500/80 text-white rounded-full flex items-center justify-center">
                              <Sparkles size={16} />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Generated Content */}
                    <div className="space-y-6">
                      {/* Instagram Caption */}
                      <div>
                        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                          📱 Instagram Caption
                        </h3>
                        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-xl p-6">
                          <p className="text-white/80 leading-relaxed whitespace-pre-line">
                            {instagramCaption}
                          </p>
                        </div>
                      </div>

                      {/* LinkedIn Blurb */}
                      <div>
                        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                          💼 LinkedIn Post
                        </h3>
                        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-6">
                          <p className="text-white/80 leading-relaxed whitespace-pre-line">
                            {linkedInBlurb}
                          </p>
                        </div>
                      </div>

                      {/* Enhancement Prompt */}
                      <div>
                        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                          🎨 Image Enhancement Prompt
                        </h3>
                        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
                          <p className="text-white/80 leading-relaxed text-sm">
                            {enhancedImagePrompt}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(instagramCaption)
                            toast.success('Instagram caption copied!')
                          }}
                          className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors text-sm font-medium"
                        >
                          Copy Instagram
                        </button>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(linkedInBlurb)
                            toast.success('LinkedIn post copied!')
                          }}
                          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium"
                        >
                          Copy LinkedIn
                        </button>
                        <button className="px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium">
                          Regenerate All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="py-3 px-6 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  >
                    Back to Edit
                  </button>
                  <button className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all">
                    Publish Listing
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default NewListing
