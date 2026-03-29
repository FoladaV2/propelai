import React from 'react'
import { Plus, Search, Filter, MoreHorizontal, ArrowRight, Eye, Edit2, Share2, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

const recentListings = [
  {
    id: 1,
    address: '123 Main Street, Downtown',
    price: '$450,000',
    status: 'AI Optimized',
    statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    views: 1254,
    inquiries: 12
  },
  {
    id: 2,
    address: '456 Oak Avenue, Suburbs',
    price: '$325,000',
    status: 'Draft',
    statusColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
    views: 0,
    inquiries: 0
  },
  {
    id: 3,
    address: '789 Pine Road, Waterfront',
    price: '$750,000',
    status: 'AI Optimized',
    statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    views: 342,
    inquiries: 5
  },
  {
    id: 4,
    address: '321 Elm Street, Historic',
    price: '$280,000',
    status: 'Draft',
    statusColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop',
    views: 0,
    inquiries: 0
  },
];

const MyListings: React.FC = () => {
  return (
    <Layout
      title="My Listings"
      subtitle="Manage and track your property portfolio"
      actions={
        <Link
          to="/new-listing"
          className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-all font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} />
          Create Listing
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
              placeholder="Search by address, city, or ID..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <button className="px-5 py-3 bg-slate-800/50 backdrop-blur-sm border border-white/10 text-white rounded-xl hover:bg-white/5 transition-all flex items-center gap-2 font-medium">
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {recentListings.map((listing) => (
            <div key={listing.id} className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all group flex flex-col">
              {/* Property Image */}
              <div className="relative h-56 overflow-hidden shrink-0">
                <img 
                  src={listing.image} 
                  alt={listing.address}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-lg ${listing.statusColor}`}>
                    {listing.status}
                  </span>
                </div>
                
                {/* Actions Overlay */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <Share2 size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-rose-500/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-rose-600 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6 flex-1 flex flex-col justify-between group-hover:bg-slate-800/80 transition-colors">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                    {listing.address}
                  </h3>
                  <div className="text-2xl font-bold text-white mb-4">
                    {listing.price}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4 text-sm text-white/50 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Eye size={16} />
                      {listing.views}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MoreHorizontal size={16} />
                      {listing.inquiries} inquiries
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
      </div>
    </Layout>
  )
}

export default MyListings
