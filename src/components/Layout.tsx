import { useState } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

const Layout = ({ children, title, subtitle, actions }: LayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 relative flex overflow-hidden">
      {/* Background gradients */}
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
      />

      {/* Main Content Area */}
      <div className={`
        flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out relative z-10
        ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}
      `}>
        {/* Top Header */}
        <header className="bg-slate-900/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 shrink-0 shadow-sm">
          <div className="max-w-7xl mx-auto px-8 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
                {subtitle && <p className="text-white/50 text-sm mt-1 font-medium">{subtitle}</p>}
              </div>
              
              {actions && (
                <div className="flex items-center gap-4">
                  {actions}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content scrollable area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
