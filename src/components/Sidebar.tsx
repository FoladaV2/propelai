import { useState } from 'react';
import { LayoutDashboard, Home, Settings, Menu, X, LogOut, Sliders } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard, id: 'Dashboard' },
    { name: 'My Listings', icon: Home, id: 'Listings' },
    { name: 'AI Lab', icon: Sliders, id: 'AI Lab' },
    { name: 'Settings', icon: Settings, id: 'Settings' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className={`
      fixed left-0 top-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-white/10
      transition-all duration-300 ease-in-out z-50
      ${isCollapsed ? 'w-20' : 'w-64'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-white font-semibold text-lg">Propel</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="text-white/60 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
            const isActive = activeItem === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  // Navigate to the respective page
                  if (item.id === 'Dashboard') navigate('/dashboard');
                  if (item.id === 'Listings') navigate('/listings');
                  if (item.id === 'AI Lab') navigate('/ai-lab');
                  if (item.id === 'Settings') navigate('/settings');
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <Icon size={20} />
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
                {isActive && !isCollapsed && (
                  <div className="w-1 h-6 bg-indigo-500 rounded-full ml-auto" />
                )}
              </button>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        {!isCollapsed && user && (
          <div className="space-y-3">
            <div className="text-white/60 text-xs">
              <p>Signed in as:</p>
              <p className="text-white/80 font-medium truncate">
                {user.user_metadata?.full_name || user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
        {isCollapsed && user && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
