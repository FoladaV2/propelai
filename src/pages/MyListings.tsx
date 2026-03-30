import React, { useEffect, useState, useMemo } from 'react'
import { Plus, Search, MoreHorizontal, ArrowRight, Eye, Edit2, Share2, Trash2, Loader2, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { listingService } from '../services/listingService'
import type { Listing } from '../services/listingService'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'

const MyListings: React.FC = () => {
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'All' | 'Draft' | 'AI Optimized' | 'Published'>('All')

  const fetchListings = async () => {
    try {
      setLoading(true)
      const data = await listingService.getListings()
      setListings(data)
    } catch (error) {
      console.error('Fetch listings error:', error)
      toast.error('Failed to load your listings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchListings()
    }
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    try {
      await listingService.deleteListing(id)
      setListings(prev => prev.filter(l => l.id !== id))
      toast.success('Listing deleted successfully')
    } catch (error) {
      toast.error('Failed to delete listing')
    }
  }

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const matchesSearch = listing.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            listing.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterStatus === 'All' || listing.status === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [listings, searchQuery, filterStatus])

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'AI Optimized':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Published':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  return (
    <Layout
      title="My Listings"
      subtitle="Manage and track your property portfolio"
      actions={
        <Link
          to="/new-listing"
          className="px-3 md:px-5 py-2 md:py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-all font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 text-sm md:text-base"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Create Listing</span>
          <span className="sm:hidden">New</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" 
              placeholder="Search by address, city, or title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-5 py-3 bg-slate-800/50 backdrop-blur-sm border border-white/10 text-white rounded-xl hover:bg-white/5 transition-all outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="AI Optimized">AI Optimized</option>
            <option value="Published">Published</option>
          </select>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/40 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="font-medium">Loading your portfolio...</p>
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all group flex flex-col">
                {/* Property Image */}
                <div className="relative h-56 overflow-hidden shrink-0">
                  <img 
                    src={listing.image_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'} 
                    alt={listing.address}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-lg ${getStatusStyles(listing.status)}`}>
                      {listing.status}
                    </span>
                  </div>
                  
                  {/* Actions Overlay */}
                  <div className="absolute top-4 right-4 flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg shadow-black/20 border border-white/10">
                      <Edit2 size={16} />
                    </button>
                    <button className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors shadow-lg shadow-black/20 border border-white/10">
                      <Share2 size={16} />
                    </button>
                    <button 
                      onClick={() => listing.id && handleDelete(listing.id)}
                      className="w-9 h-9 rounded-full bg-rose-500/90 backdrop-blur-md flex items-center justify-center text-white hover:bg-rose-600 transition-colors shadow-lg shadow-black/20 border border-rose-500/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6 flex-1 flex flex-col justify-between group-hover:bg-slate-800/80 transition-colors">
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-white/40 text-sm mb-3 line-clamp-1">{listing.address}</p>
                    <div className="text-2xl font-bold text-white mb-4">
                      ${Number(listing.price).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-4 text-sm text-white/50 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Eye size={16} />
                        0
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MoreHorizontal size={16} />
                        0 inquiries
                      </div>
                    </div>
                    <button className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 text-sm font-semibold">
                      Manage <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-slate-800/30 border border-white/5 rounded-3xl backdrop-blur-sm">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
              <Home className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No listings found</h3>
            <p className="text-white/40 max-w-sm mb-8">
              {searchQuery || filterStatus !== 'All' 
                ? "We couldn't find any listings matching your search criteria."
                : "Your portfolio is currently empty. Start by creating your first AI-optimized listing."}
            </p>
            {!searchQuery && filterStatus === 'All' && (
              <Link
                to="/new-listing"
                className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-all font-bold shadow-xl shadow-indigo-500/20"
              >
                Create First Listing
              </Link>
            )}
            {(searchQuery || filterStatus !== 'All') && (
              <button 
                onClick={() => { setSearchQuery(''); setFilterStatus('All'); }}
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default MyListings
