import React from 'react';
import { LayoutDashboard, Settings as SettingsIcon, LogOut, Truck, FileText, Zap, ListChecks } from 'lucide-react';

interface SidebarProps {
  activeFeature: string;
  setActiveFeature: (feature: string) => void;
  onLogout: () => void;
  userRole: string;
}

export default function Sidebar({ activeFeature, setActiveFeature, onLogout, userRole }: SidebarProps) {
  const menuSections = [
    {
      title: 'Transport',
      items: [
        { id: 'request-vehicle', label: 'Véhicules', icon: Truck, roles: ['USER', 'AGENT', 'ADMIN'] }
      ]
    },
    {
      title: 'Administratif',
      items: [
        { id: 'authorization', label: 'Raccordements', icon: Zap, roles: ['USER', 'AGENT', 'ADMIN'] },
        { id: 'legalisation', label: 'Légalisation', icon: FileText, roles: ['USER', 'AGENT', 'ADMIN'] }
      ]
    },
    {
      title: 'Suivi',
      items: [
        { id: 'track-requests', label: 'Suivi des Demandes', icon: ListChecks, roles: ['USER', 'AGENT', 'ADMIN'] }
      ]
    },
    {
      title: 'Administration',
      items: [
        { id: 'dashboard', label: 'Staff Dashboard', icon: LayoutDashboard, roles: ['AGENT', 'ADMIN'] },
        { id: 'settings', label: 'Paramètres', icon: SettingsIcon, roles: ['USER', 'AGENT', 'ADMIN'] }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full font-sans text-white bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#064e3b]">
      {/* Brand area (Visible in sidebar mode) */}
      <div className="px-6 py-8 mb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#064e3b] to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-900/50">
            <span className="text-[#fdfbf7] font-bold text-xl font-serif">JN</span>
          </div>
          <span className="text-xl font-serif font-black text-white tracking-wide">
            Nouirat
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-6 px-4 pt-2 overflow-y-auto">
        {menuSections.map((section, sectionIdx) => {
          const normalizedRole = userRole?.replace('ROLE_', '') || 'USER';
          // Check if any items in this section are available for this role
          const visibleItems = section.items.filter(item => item.roles.includes(normalizedRole));
          
          if (visibleItems.length === 0) return null;

          return (
            <div key={sectionIdx} className="space-y-2">
              <p className="px-3 text-xs font-black text-emerald-400/70 uppercase tracking-[0.2em] mb-3 drop-shadow-sm">
                {section.title}
              </p>
              {visibleItems.map((item) => {
                const isActive = activeFeature === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveFeature(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                        ? 'bg-white/10 text-white font-bold shadow-[0_0_20px_rgba(6,78,59,0.5)] border border-white/20'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                  >
                    {/* Active Background Glow */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent" />
                    )}
                    
                    <div className={`relative z-10 p-2 rounded-xl transition-colors duration-300 ${isActive ? 'bg-emerald-500 text-white shadow-md' : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-emerald-400'}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    
                    <span className="relative z-10 text-base">{item.label}</span>
                    
                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-emerald-400 rounded-l-full shadow-[0_0_10px_#34d399]" />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* User Profile & Logout */}
      <div className="p-4 m-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4 p-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#064e3b] to-emerald-400 p-0.5 shadow-lg">
            <div className="w-full h-full bg-[#0f172a] rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-emerald-300">{userRole ? userRole.substring(0, 2).toUpperCase() : 'US'}</span>
            </div>
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-sm font-bold text-white truncate">Utilisateur</p>
            <p className="text-xs text-emerald-400 font-medium truncate">{userRole || 'CITOYEN'}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 transition-all duration-300 font-bold shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
