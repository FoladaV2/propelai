import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import { Plus, ArrowRight, Loader2, Home } from 'lucide-react'
import { listingService } from '../services/listingService'
import type { Listing } from '../services/listingService'

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  useEffect(() => {
    const fetchRecentListings = async () => {
      try {
        setLoading(true);
        const data = await listingService.getListings();
        setRecentListings(data.slice(0, 3));
      } catch (error) {
        console.error('Fetch dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecentListings();
    }
  }, [user]);

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
  };

  return (
    <Layout
      title={`Welcome back, ${user?.user_metadata?.full_name || 'Agent'}`}
      subtitle={currentDate}
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
      <div className="space-y-8">

        {/* Quick Action Card */}
        <div className="bg-indigo-500/10 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Create Your Next Listing</h2>
              <p className="text-white/80 max-w-md">
                Transform property photos into professional, market-ready listings in under 60 seconds.
              </p>
            </div>
            <button 
              onClick={() => navigate('/new-listing')}
              className="px-6 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all flex items-center gap-3 group"
            >
              <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              New Listing
            </button>
          </div>
        </div>

        {/* Studio Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/ai-lab" 
            className="flex items-center gap-4 p-6 bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-indigo-500/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <Plus size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Image Editor</h3>
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Enhance Visuals</p>
            </div>
          </Link>
          <Link 
            to="/ai-lab" 
            className="flex items-center gap-4 p-6 bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-indigo-500/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <Plus size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Marketing Copy</h3>
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Descriptions & Social</p>
            </div>
          </Link>
          <Link 
            to="/ai-lab" 
            className="flex items-center gap-4 p-6 bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-indigo-500/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <Plus size={24} />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Property Video</h3>
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Video Generation</p>
            </div>
          </Link>
        </div>

        {/* Recent Listings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Recent Listings</h2>
            <Link to="/listings" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : recentListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentListings.map((listing) => (
                <div key={listing.id} className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all group cursor-pointer">
                  {/* Property Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={listing.image_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'} 
                      alt={listing.address}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-lg ${getStatusStyles(listing.status)}`}>
                        {listing.status}
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <h3 className="text-white font-semibold mb-2 line-clamp-1">
                      {listing.title}
                    </h3>
                    <p className="text-white/40 text-xs mb-3 line-clamp-1">{listing.address}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">
                        ${Number(listing.price).toLocaleString()}
                      </span>
                      <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-slate-800/30 border border-white/5 rounded-2xl text-center">
              <Home className="w-10 h-10 text-white/20 mb-3" />
              <p className="text-white/40 font-medium">No listings yet</p>
              <Link to="/new-listing" className="mt-4 text-indigo-400 text-sm font-semibold hover:underline">
                Create your first listing
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
