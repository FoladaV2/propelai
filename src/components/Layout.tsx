import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

const Layout = ({ children, title, subtitle, actions }: LayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 relative flex overflow-hidden">
      {/* Keep visual depth cheap for smoother scrolling */}
      <div className="fixed inset-0 bg-slate-900 opacity-80 pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className={`
        flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out relative z-10 w-full
        ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}
      `}>
        {/* Top Header */}
        <header className="bg-slate-900/70 border-b border-white/5 sticky top-0 z-40 shrink-0 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="md:hidden p-2 -ml-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
                >
                  <Menu size={24} />
                </button>
                <div className="overflow-hidden">
                  <h1 className="text-lg md:text-2xl font-bold text-white tracking-tight truncate">{title}</h1>
                  {subtitle && <p className="text-white/50 text-xs md:text-sm mt-0.5 md:mt-1 font-medium truncate">{subtitle}</p>}
                </div>
              </div>
              
              {actions && (
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content scrollable area */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
