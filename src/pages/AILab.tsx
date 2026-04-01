import React, { Suspense, lazy, memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sliders, FileText, Video } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import Layout from '../components/Layout'

const ImageTransformer = lazy(() => import('../components/AILab/ImageTransformer'))
const CopyGenerator = lazy(() => import('../components/AILab/CopyGenerator'))
const VideoGenerator = lazy(() => import('../components/AILab/VideoGenerator'))

type Tab = 'transform' | 'copy' | 'video'

const AILab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('transform')

  return (
    <>
      <Helmet>
        <title>AI Lab | Professional Real Estate Marketing Studio | Propel</title>
        <meta name="description" content="Access our full suite of AI-powered real estate marketing tools. Photo editing, description generation, and video creation in one place." />
      </Helmet>
      <Layout
        title="Marketing Studio"
        subtitle="Professional Property Tools"
      >

      <div className="max-w-6xl mx-auto space-y-6">
            {/* Tab Navigation */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-2 mb-8 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                <TabButton
                  active={activeTab === 'transform'}
                  onClick={() => setActiveTab('transform')}
                  icon={<Sliders size={18} />}
                  label="Image Editor"
                />
                <TabButton
                  active={activeTab === 'copy'}
                  onClick={() => setActiveTab('copy')}
                  icon={<FileText size={18} />}
                  label="Marketing Copy"
                />
                <TabButton
                  active={activeTab === 'video'}
                  onClick={() => setActiveTab('video')}
                  icon={<Video size={18} />}
                  label="Property Video"
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
                <Suspense
                  fallback={
                    <div className="h-[420px] rounded-2xl border border-white/10 bg-slate-800/30 animate-pulse" />
                  }
                >
                  {activeTab === 'transform' && <ImageTransformer />}
                  {activeTab === 'copy' && <CopyGenerator />}
                  {activeTab === 'video' && <VideoGenerator />}
                </Suspense>
              </motion.div>
            </AnimatePresence>
      </div>
    </Layout>
    </>
  )
}


// ── Small local UI-only sub-component (no logic, fine to keep here) ──────────
interface TabButtonProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}

const TabButton: React.FC<TabButtonProps> = memo(({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition-all w-full ${
      active
        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
        : 'text-white/60 hover:text-white hover:bg-white/10'
    }`}
  >
    {icon}
    {label}
  </button>
))

export default AILab