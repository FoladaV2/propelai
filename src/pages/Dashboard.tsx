import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import { Plus, ArrowRight, Copy, Edit3, MessageSquare, FileText } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Copy generation state
  const [propertyData, setPropertyData] = useState<{
    price: string;
    district: string;
    sqm: string;
    rooms: string;
    special_features: string[];
  }>({
    price: '',
    district: '',
    sqm: '',
    rooms: '',
    special_features: []
  });
  const [generatedCopy, setGeneratedCopy] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editedCopy, setEditedCopy] = useState({
    instagram: '',
    facebook: '',
    zillow_style: ''
  });

  // Copy generation functions
  const generateCopy = async () => {
    if (!propertyData.price || !propertyData.district || !propertyData.sqm || !propertyData.rooms) {
      toast.error('Please fill in all property details');
      return;
    }

    setIsGenerating(true);
    
    try {
      const { generatePropelCopy } = await import('../lib/gemini');
      const copy = await generatePropelCopy(propertyData);
      
      setGeneratedCopy(copy);
      setEditedCopy({
        instagram: copy.instagram,
        facebook: copy.facebook,
        zillow_style: copy.zillow_style
      });
      
      toast.success('Marketing copy generated successfully!');
    } catch (error) {
      console.error('Copy generation error:', error);
      toast.error('Failed to generate marketing copy');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${platform} copy copied to clipboard!`);
  };

  const resetForm = () => {
    setPropertyData({
      price: '',
      district: '',
      sqm: '',
      rooms: '',
      special_features: []
    });
    setGeneratedCopy(null);
    setEditedCopy({
      instagram: '',
      facebook: '',
      zillow_style: ''
    });
  };

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
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.user_metadata?.full_name || 'Agent'}
            </h1>
            <p className="text-white/60">{currentDate}</p>
          </div>
        </div>

        {/* Propel Copy Generator */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <FileText size={24} className="text-indigo-400" />
            Propel Copy Generator
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Property Input Form */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Property Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Price (AZN)</label>
                  <input
                    type="text"
                    value={propertyData.price}
                    onChange={(e) => setPropertyData({...propertyData, price: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    placeholder="250000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">District</label>
                  <select
                    value={propertyData.district}
                    onChange={(e) => setPropertyData({...propertyData, district: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  >
                    <option value="">Select district</option>
                    <option value="Vake">Vake</option>
                    <option value="Saburtalo">Saburtalo</option>
                    <option value="Vera">Vera</option>
                    <option value="Mtatsminda">Mtatsminda</option>
                    <option value="Didube">Didube</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Size (sqm)</label>
                    <input
                      type="text"
                      value={propertyData.sqm}
                      onChange={(e) => setPropertyData({...propertyData, sqm: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      placeholder="120"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Rooms</label>
                    <input
                      type="text"
                      value={propertyData.rooms}
                      onChange={(e) => setPropertyData({...propertyData, rooms: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      placeholder="3"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Special Features</label>
                  <div className="space-y-2">
                    {['balcony', 'new renovation', 'parking', 'sea view'].map(feature => (
                      <label key={feature} className="flex items-center gap-2 text-white/80 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={propertyData.special_features.includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPropertyData({...propertyData, special_features: [...propertyData.special_features, feature]});
                            } else {
                              setPropertyData({...propertyData, special_features: propertyData.special_features.filter(f => f !== feature)});
                            }
                          }}
                          className="rounded border-white/10 bg-white/10 text-indigo-400 focus:ring-2 focus:ring-indigo-500/50"
                        />
                        <span className="text-sm">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={generateCopy}
                    disabled={isGenerating}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white border-t-transparent rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <MessageSquare size={20} />
                        Generate Copy
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={resetForm}
                    className="py-3 px-6 bg-white/10 text-white/80 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Copy Display */}
            <div className="space-y-6">
              {generatedCopy && (
                <>
                  <div className="flex items-center gap-2 text-green-400 mb-4">
                    <Copy size={20} />
                    <span className="font-medium">Copy Generated Successfully!</span>
                  </div>
                  
                  {/* Instagram Copy */}
                  <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-xl p-6">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      📱 Instagram Caption
                    </h4>
                    <textarea
                      value={editedCopy.instagram}
                      onChange={(e) => setEditedCopy({...editedCopy, instagram: e.target.value})}
                      className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all resize-none"
                      placeholder="Instagram caption will appear here..."
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => copyToClipboard(editedCopy.instagram, 'Instagram')}
                        className="flex-1 py-2 px-4 bg-pink-500/20 text-pink-400 rounded-lg hover:bg-pink-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Copy size={16} />
                        Copy
                      </button>
                      <button className="py-2 px-4 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium">
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Facebook Copy */}
                  <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-6">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      📘 Facebook Post
                    </h4>
                    <textarea
                      value={editedCopy.facebook}
                      onChange={(e) => setEditedCopy({...editedCopy, facebook: e.target.value})}
                      className="w-full h-32 px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                      placeholder="Facebook post will appear here..."
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => copyToClipboard(editedCopy.facebook, 'Facebook')}
                        className="flex-1 py-2 px-4 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Copy size={16} />
                        Copy
                      </button>
                      <button className="py-2 px-4 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium">
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Zillow-Style Copy */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      🏠 Zillow-Style Description
                    </h4>
                    <textarea
                      value={editedCopy.zillow_style}
                      onChange={(e) => setEditedCopy({...editedCopy, zillow_style: e.target.value})}
                      className="w-full h-40 px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all resize-none"
                      placeholder="Professional description will appear here..."
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => copyToClipboard(editedCopy.zillow_style, 'Zillow')}
                        className="flex-1 py-2 px-4 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Copy size={16} />
                        Copy
                      </button>
                      <button className="py-2 px-4 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium">
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

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
