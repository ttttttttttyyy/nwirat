import React from 'react';
import {
  BookOpenCheck,
  FileCheck2,
  FileText,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MapPinned,
  Settings as SettingsIcon,
  Truck,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeFeature: string;
  setActiveFeature: (feature: string) => void;
  onLogout: () => void;
  userRole: string;
}

const menuSections = [
  {
    title: 'Demandes citoyennes',
    items: [
      { id: 'request-vehicle', label: 'Request Vehicule', detail: 'Ambulance and funeral car', icon: Truck, roles: ['USER', 'AGENT', 'ADMIN'] },
      { id: 'authorization', label: 'Raccordements', detail: 'Water and electricity', icon: Zap, roles: ['USER', 'AGENT', 'ADMIN'] },
      { id: 'legalisation', label: 'Legalisation', detail: 'Signature and copy', icon: FileText, roles: ['USER', 'AGENT', 'ADMIN'] },
      { id: 'administrative-attestation', label: 'Attestation administrative', detail: 'Property attestation', icon: FileCheck2, roles: ['USER', 'AGENT', 'ADMIN'] },
      { id: 'civil-status', label: 'Etat civil', detail: 'Birth, death, family book', icon: BookOpenCheck, roles: ['USER', 'AGENT', 'ADMIN'] }
    ]
  },
  {
    title: 'Suivi',
    items: [
      { id: 'track-requests', label: 'Suivi des demandes', detail: 'Track request status', icon: ListChecks, roles: ['USER', 'AGENT', 'ADMIN'] },
      { id: 'driver-missions', label: 'Mes missions', detail: 'Assigned driver trips', icon: MapPinned, roles: ['DRIVER'] }
    ]
  },
  {
    title: 'Administration',
    items: [
      { id: 'dashboard', label: 'Dashboard staff', detail: 'Manage requests', icon: LayoutDashboard, roles: ['AGENT', 'ADMIN'] },
      { id: 'settings', label: 'Parametres', detail: 'Account settings', icon: SettingsIcon, roles: ['USER', 'AGENT', 'ADMIN'] }
    ]
  }
];

export default function Sidebar({ activeFeature, setActiveFeature, onLogout, userRole }: SidebarProps) {
  const normalizedRole = userRole?.replace('ROLE_', '') || 'USER';

  return (
    <div className="flex h-full flex-col bg-slate-950 text-white">
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {menuSections.map((section) => {
          const visibleItems = section.items.filter((item) => item.roles.includes(normalizedRole));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="mb-7">
              <p className="mb-3 px-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300/80">{section.title}</p>
              <div className="space-y-2">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeFeature === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveFeature(item.id)}
                    className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                        isActive
                          ? 'border-emerald-400/40 bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-950/30'
                          : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      <span className={`flex h-10 w-10 items-center justify-center rounded-md ${isActive ? 'bg-slate-950/10' : 'bg-white/5'}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-black">{item.label}</span>
                        <span className={`mt-0.5 block truncate text-xs font-bold ${isActive ? 'text-slate-800/70' : 'text-slate-500 group-hover:text-slate-300'}`}>{item.detail}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto border-t border-white/10 bg-slate-950 p-4 shadow-[0_-20px_40px_rgba(2,6,23,0.35)]">
        <div className="mb-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <p className="text-sm font-black">Utilisateur</p>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">{normalizedRole}</p>
        </div>
        <button onClick={onLogout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-300/20 bg-rose-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-rose-950/30 transition hover:bg-rose-600">
          <LogOut className="h-5 w-5" />
          Deconnexion
        </button>
      </div>
    </div>
  );
}
