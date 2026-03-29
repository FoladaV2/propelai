import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  FileText,
  Loader2,
  Copy,
  RotateCcw,
  Instagram,
  Linkedin,
  Search,
  Hash,
  MapPin,
  DollarSign,
  Square,
  TrendingUp,
  Layout as LayoutIcon,
} from 'lucide-react'
import { aiService } from '../../services/aiService'

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type Platform = 'instagram' | 'linkedin' | 'zillow'

interface GeneratedContent {
  instagram: string
  linkedin: string
  zillow: string
}

// â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const PLATFORMS = [
  { id: 'instagram' as Platform, label: 'Instagram', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20' },
  { id: 'linkedin' as Platform, label: 'LinkedIn', icon: Linkedin, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  { id: 'zillow' as Platform, label: 'Facebook/Zillow', icon: LayoutIcon, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
]

const inputClass =
  'w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm'

// â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const CopyGenerator: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<Platform>('instagram')
  const [isGenerating, setIsGenerating] = useState(false)
  const [content, setContent] = useState<GeneratedContent | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    price: '',
    location: '',
    sqm: '',
    beds: '',
    baths: '',
    title: '',
    description: '',
  })

  // â”€â”€ Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const generate = async () => {
    if (!formData.price || !formData.location || !formData.sqm) {
      toast.error('Please fill in price, location, and sqm')
      return
    }

    setIsGenerating(true)
    try {
      const propertyDetails = {
        title: formData.title || `${formData.beds}BR in ${formData.location}`,
        address: formData.location,
        price: formData.price,
        bedrooms: formData.beds,
        bathrooms: formData.baths,
        squareFootage: formData.sqm,
        propertyType: 'Residential',
        description: formData.description
      }

      const [insta, link, zil] = await Promise.all([
        aiService.generateInstagramContent(propertyDetails),
        aiService.generateLinkedInContent(propertyDetails),
        aiService.generateZillowContent(propertyDetails)
      ])

      setContent({
        instagram: insta,
        linkedin: link,
        zillow: zil
      })

      toast.success('Smart Copy blocks generated!')
    } catch (err) {
      toast.error('Failed to generate copy. Please check your API key.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const reset = () => {
    setFormData({
      price: '',
      location: '',
      sqm: '',
      beds: '',
      baths: '',
      title: '',
      description: '',
    })
    setContent(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* â”€â”€ Left Column: Property Intelligence Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="space-y-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={120} />
          </div>

          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <TrendingUp size={24} />
            </div>
            Property Essentials
          </h2>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">
                  <DollarSign size={14} className="inline mr-1" />
                  Price (e.g. $450,000)
                </label>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="Market Price"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">
                  <Square size={14} className="inline mr-1" />
                  Space (SQM)
                </label>
                <input
                  name="sqm"
                  value={formData.sqm}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="e.g. 120"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">
                <MapPin size={14} className="inline mr-1" />
                Location / Neighborhood
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="City, District, Specific Neighborhood"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">
                  Bedrooms
                </label>
                <input
                  name="beds"
                  value={formData.beds}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="e.g. 3"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">
                  Bathrooms
                </label>
                <input
                  name="baths"
                  value={formData.baths}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="e.g. 2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">
                Raw Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Paste rough details or listing URL..."
                className={inputClass + ' resize-none'}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={generate}
            disabled={isGenerating}
            className="flex-1 py-4 px-6 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl"
          >
            {isGenerating ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Generating Copy...
              </>
            ) : (
              <>
                <FileText size={24} />
                Generate Copy
              </>
            )}
          </button>
          {content && (
            <button
              onClick={reset}
              className="p-4 bg-white/10 text-white/40 hover:text-white hover:bg-white/20 rounded-2xl transition-all"
            >
              <RotateCcw size={24} />
            </button>
          )}
        </div>
      </div>

      {/* â”€â”€ Right Column: Platform-Specific Output â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="space-y-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl p-1 flex flex-col h-full overflow-hidden shadow-2xl">
          {/* Platform Tabs */}
          <div className="flex border-b border-white/5 bg-slate-900/40">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative ${activePlatform === p.id ? p.color : 'text-white/30 hover:text-white/60'
                  }`}
              >
                <p.icon size={18} />
                {p.label}
                {activePlatform === p.id && (
                  <div className={`absolute bottom-0 inset-x-0 h-0.5 ${p.bg.replace('/10', '/50')}`} />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 p-8 flex flex-col">
            {!content ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <FileText size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Waiting for Details</h3>
                  <p className="text-white/30 text-sm max-w-[240px]">Fill in your property data to generate multi-platform content.</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-6">
                {/* Meta Highlights */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-2 shrink-0">
                    <Search size={14} className="text-indigo-400" />
                    <span className="text-[10px] uppercase font-black text-indigo-400">SEO Optimized</span>
                  </div>
                  <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 shrink-0">
                    <Hash size={14} className="text-emerald-400" />
                    <span className="text-[10px] uppercase font-black text-emerald-400">Hashtags Added</span>
                  </div>
                </div>

                <div className="flex-1 relative group">
                  <textarea
                    readOnly
                    value={activePlatform === 'instagram' ? content.instagram : activePlatform === 'linkedin' ? content.linkedin : content.zillow}
                    className="w-full h-full bg-slate-900/50 border border-white/5 rounded-2xl p-6 text-white/90 text-sm leading-relaxed resize-none focus:outline-none"
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyToClipboard(activePlatform === 'instagram' ? content.instagram : activePlatform === 'linkedin' ? content.linkedin : content.zillow)}
                      className="p-3 bg-indigo-500 text-white rounded-xl shadow-lg hover:scale-105 transition-all"
                      title="Copy Content"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                {/* Automation Footer */}
                <div className="flex items-center gap-2 p-4 bg-slate-900/80 rounded-2xl border border-white/5">
                  <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Optimization</p>
                    <p className="text-xs text-indigo-300 font-medium">This content is formatted for maximum engagement.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CopyGenerator
