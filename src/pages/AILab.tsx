import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sliders, FileText } from 'lucide-react'
import Layout from '../components/Layout'
import { ImageTransformer, CopyGenerator } from '../components/AILab'

type Tab = 'transform' | 'copy'

const AILab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('transform')

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950" />

        <div className="relative z-10">
          {/* Header */}
          <div className="bg-slate-900/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
            <div className="px-8 py-4 flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-white">AI Lab</h1>
                <p className="text-white/60 text-sm mt-1">Architectural Photography Enhancement</p>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-8 py-8">
            {/* Tab Navigation */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-2 mb-8">
              <div className="flex gap-2">
                <TabButton
                  active={activeTab === 'transform'}
                  onClick={() => setActiveTab('transform')}
                  icon={<Sliders size={18} />}
                  label="Image Transform"
                />
                <TabButton
                  active={activeTab === 'copy'}
                  onClick={() => setActiveTab('copy')}
                  icon={<FileText size={18} />}
                  label="Copy Generator"
                />
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === 'transform' ? <ImageTransformer /> : <CopyGenerator />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// ── Small local UI-only sub-component (no logic, fine to keep here) ──────────
interface TabButtonProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
      active
        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
        : 'text-white/60 hover:text-white hover:bg-white/10'
    }`}
  >
    {icon}
    {label}
  </button>
)

export default AILab