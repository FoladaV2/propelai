import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import { Plus, ArrowRight } from 'lucide-react'
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const recentListings = [
    {
      id: 1,
      address: '123 Main Street, Downtown',
      price: '$450,000',
      status: 'AI Optimized',
      statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      address: '456 Oak Avenue, Suburbs',
      price: '$325,000',
      status: 'Draft',
      statusColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      address: '789 Pine Road, Waterfront',
      price: '$750,000',
      status: 'AI Optimized',
      statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      address: '321 Elm Street, Historic',
      price: '$280,000',
      status: 'Draft',
      statusColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop',
    },
    {
      id: 5,
      address: '654 Maple Drive, Golf Course',
      price: '$890,000',
      status: 'AI Optimized',
      statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      image: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400&h=300&fit=crop',
    },
    {
      id: 6,
      address: '987 Cedar Lane, Mountain View',
      price: '$520,000',
      status: 'Processing',
      statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    },
  ];

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
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-600/20 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Create Your Next AI Listing</h2>
              <p className="text-white/80 max-w-md">
                Transform raw property photos into professional, market-ready listings in under 60 seconds with our AI-powered platform.
              </p>
            </div>
            <button 
              onClick={() => navigate('/new-listing')}
              className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all flex items-center gap-3 group"
            >
              <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              New AI Listing
            </button>
          </div>
        </div>

        {/* Recent Listings */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Recent Listings</h2>
            <button className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentListings.map((listing) => (
              <div key={listing.id} className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all group cursor-pointer">
                {/* Property Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={listing.image} 
                    alt={listing.address}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${listing.statusColor}`}>
                      {listing.status}
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <h3 className="text-white font-semibold mb-2 line-clamp-1">
                    {listing.address}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      {listing.price}
                    </span>
                    <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
