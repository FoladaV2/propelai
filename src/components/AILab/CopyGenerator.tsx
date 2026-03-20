import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  FileText,
  Loader2,
  Sparkles,
  Copy,
  Edit3,
  MessageSquare,
  RotateCcw,
} from 'lucide-react'
import { generatePropelCopy } from '../../lib/gemini'

interface PropertyData {
  price: string
  district: string
  sqm: string
  rooms: string
  special_features: string[]
}

interface GeneratedCopy {
  instagram: string
  facebook: string
  zillow_style: string
}

const FEATURE_OPTIONS = [
  'Swimming Pool',
  'Garden',
  'Garage',
  'Sea View',
  'Mountain View',
  'Renovated Kitchen',
  'Smart Home',
  'Fireplace',
  'Terrace',
  'Basement',
]

const CopyGenerator: React.FC = () => {
  const [propertyData, setPropertyData] = useState<PropertyData>({
    price: '',
    district: '',
    sqm: '',
    rooms: '',
    special_features: [],
  })
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedCopy | null>(null)
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false)
  const [editedCopy, setEditedCopy] = useState<GeneratedCopy>({
    instagram: '',
    facebook: '',
    zillow_style: '',
  })

  const toggleFeature = (feature: string) => {
    setPropertyData((prev) => ({
      ...prev,
      special_features: prev.special_features.includes(feature)
        ? prev.special_features.filter((f) => f !== feature)
        : [...prev.special_features, feature],
    }))
  }

  const generateCopy = async () => {
    if (!propertyData.price || !propertyData.district || !propertyData.sqm || !propertyData.rooms) {
      toast.error('Please fill in all required property details')
      return
    }
    setIsGeneratingCopy(true)
    try {
      const copy = await generatePropelCopy(propertyData)
      setGeneratedCopy(copy)
      setEditedCopy({
        instagram: copy.instagram,
        facebook: copy.facebook,
        zillow_style: copy.zillow_style,
      })
      toast.success('Marketing copy generated successfully!')
    } catch (error) {
      console.error('Copy generation error:', error)
      toast.error('Failed to generate marketing copy')
    } finally {
      setIsGeneratingCopy(false)
    }
  }

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${platform} copy copied to clipboard!`)
  }

  const resetForm = () => {
    setPropertyData({ price: '', district: '', sqm: '', rooms: '', special_features: [] })
    setGeneratedCopy(null)
    setEditedCopy({ instagram: '', facebook: '', zillow_style: '' })
  }

  const inputClass =
    'w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Property Details Form */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <FileText size={20} className="text-indigo-400" />
          Property Details
        </h2>

        <div className="space-y-4">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Listing Price
            </label>
            <input
              type="text"
              value={propertyData.price}
              onChange={(e) => setPropertyData((p) => ({ ...p, price: e.target.value }))}
              className={inputClass}
              placeholder="e.g. $450,000"
            />
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              District / Area
            </label>
            <input
              type="text"
              value={propertyData.district}
              onChange={(e) => setPropertyData((p) => ({ ...p, district: e.target.value }))}
              className={inputClass}
              placeholder="e.g. Downtown Manhattan"
            />
          </div>

          {/* Sqm & Rooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Size (sqm)
              </label>
              <input
                type="text"
                value={propertyData.sqm}
                onChange={(e) => setPropertyData((p) => ({ ...p, sqm: e.target.value }))}
                className={inputClass}
                placeholder="e.g. 120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Rooms
              </label>
              <input
                type="text"
                value={propertyData.rooms}
                onChange={(e) => setPropertyData((p) => ({ ...p, rooms: e.target.value }))}
                className={inputClass}
                placeholder="e.g. 3"
              />
            </div>
          </div>

          {/* Special Features */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              Special Features
            </label>
            <div className="flex flex-wrap gap-2">
              {FEATURE_OPTIONS.map((feature) => (
                <button
                  key={feature}
                  onClick={() => toggleFeature(feature)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${propertyData.special_features.includes(feature)
                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={generateCopy}
              disabled={isGeneratingCopy}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGeneratingCopy ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Copy
                </>
              )}
            </button>
            {generatedCopy && (
              <button
                onClick={resetForm}
                className="py-3 px-4 bg-white/10 text-white/60 hover:text-white hover:bg-white/20 rounded-xl transition-all"
              >
                <RotateCcw size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Generated Copy */}
      <div className="space-y-4">
        {!generatedCopy ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full flex items-center justify-center">
            <div className="text-center text-white/40">
              <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
              <p className="font-medium">Fill in property details</p>
              <p className="text-sm mt-1">Generated copy will appear here</p>
            </div>
          </div>
        ) : (
          <>
            {/* Instagram */}
            <CopyCard
              platform="Instagram"
              icon={<Edit3 size={16} />}
              accentColor="from-pink-500/20 to-orange-500/20 border-pink-500/30"
              badgeColor="bg-pink-500/20 text-pink-400"
              value={editedCopy.instagram}
              onChange={(val) => setEditedCopy((p) => ({ ...p, instagram: val }))}
              onCopy={() => copyToClipboard(editedCopy.instagram, 'Instagram')}
            />

            {/* Facebook */}
            <CopyCard
              platform="Facebook"
              icon={<MessageSquare size={16} />}
              accentColor="from-blue-500/20 to-indigo-500/20 border-blue-500/30"
              badgeColor="bg-blue-500/20 text-blue-400"
              value={editedCopy.facebook}
              onChange={(val) => setEditedCopy((p) => ({ ...p, facebook: val }))}
              onCopy={() => copyToClipboard(editedCopy.facebook, 'Facebook')}
            />

            {/* Zillow Style */}
            <CopyCard
              platform="Zillow Style"
              icon={<FileText size={16} />}
              accentColor="from-green-500/20 to-teal-500/20 border-green-500/30"
              badgeColor="bg-green-500/20 text-green-400"
              value={editedCopy.zillow_style}
              onChange={(val) => setEditedCopy((p) => ({ ...p, zillow_style: val }))}
              onCopy={() => copyToClipboard(editedCopy.zillow_style, 'Zillow')}
            />
          </>
        )}
      </div>
    </div>
  )
}

// ── Sub-component: individual copy card ──────────────────────────────────────
interface CopyCardProps {
  platform: string
  icon: React.ReactNode
  accentColor: string
  badgeColor: string
  value: string
  onChange: (val: string) => void
  onCopy: () => void
}

const CopyCard: React.FC<CopyCardProps> = ({
  platform, icon, accentColor, badgeColor, value, onChange, onCopy,
}) => (
  <div className={`bg-gradient-to-br ${accentColor} backdrop-blur-sm border rounded-2xl p-6`}>
    <div className="flex items-center justify-between mb-3">
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${badgeColor}`}>
        {icon}
        {platform}
      </div>
      <button
        onClick={onCopy}
        className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        title="Copy to clipboard"
      >
        <Copy size={16} />
      </button>
    </div>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full bg-slate-900/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
    />
  </div>
)

export default CopyGenerator