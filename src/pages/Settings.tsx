import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Bell, Shield, Paintbrush, CreditCard, HelpCircle, Save } from 'lucide-react'
import Layout from '../components/Layout'

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Paintbrush },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ]

  return (
    <Layout
      title="Settings"
      subtitle="Manage your account preferences and integrations"
      actions={
        <Link
          to="/dashboard"
          className="px-3 md:px-5 py-2 md:py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-all font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 text-sm md:text-base shrink-0"
        >
          <Save size={18} />
          <span className="hidden sm:inline">Save Changes</span>
          <span className="sm:hidden">Save</span>
        </Link>
      }
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 shrink-0 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium whitespace-nowrap md:whitespace-normal ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                } ${isActive ? 'flex-1 md:flex-none' : 'flex-none md:flex-none'}`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
          
          <div className="hidden md:block pt-6 mt-6 border-t border-white/10">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-white/50 hover:text-white hover:bg-white/5">
              <HelpCircle size={18} />
              Help & Support
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-8">
          <div className="max-w-2xl">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">Profile Information</h2>
                  <p className="text-white/50 text-sm mb-6">Update your personal data and public information.</p>
                </div>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                    P
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all mb-2">
                      Upload New Photo
                    </button>
                    <p className="text-white/40 text-xs">JPG or PNG, max 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">First Name</label>
                    <input type="text" defaultValue="Propel" className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Last Name</label>
                    <input type="text" defaultValue="Agent" className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
                    <input type="email" defaultValue="agent@propel.ai" className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-white/80 mb-2">Agency Name</label>
                    <input type="text" defaultValue="Propel Real Estate" className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-white/80 mb-2">Bio</label>
                    <textarea rows={4} defaultValue="Luxury real estate specialist focused on high-end properties and modern marketing strategies." className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none" />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab !== 'profile' && (
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                  <Paintbrush size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Coming Soon</h3>
                <p className="text-white/50 max-w-sm">This settings pane is currently under construction and will be available in the next update.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Settings
