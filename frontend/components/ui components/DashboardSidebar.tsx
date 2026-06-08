import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

type DashboardSidebarProps = {
  items: any[];
  activeId: string;
  expanded: boolean;
  onToggle: (expanded: boolean) => void;
  onSelect: (id: string) => void;
  onLogout?: () => void;
};

export default function DashboardSidebar({ items, activeId, expanded, onToggle, onSelect, onLogout }: DashboardSidebarProps) {
  return (
    <aside className={`hidden shrink-0 border-r border-emerald-100 bg-white px-3 py-5 transition-all duration-300 md:flex md:flex-col ${expanded ? 'w-72' : 'w-20'}`}>
      <div className={`mb-7 flex items-center gap-3 ${expanded ? 'justify-between' : 'justify-center'}`}>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-11 w-11 shrink-0 object-contain" />
          {expanded && <span className="text-lg font-black text-slate-950">Admin</span>}
        </div>
        {expanded && (
          <button onClick={() => onToggle(false)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#064e3b] hover:bg-emerald-100" title="Fermer">
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>
      {!expanded && (
        <button onClick={() => onToggle(true)} className="mb-5 flex h-9 w-full items-center justify-center rounded-xl bg-emerald-50 text-[#064e3b] hover:bg-emerald-100" title="Ouvrir">
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
      <nav className="flex flex-1 flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex h-11 items-center rounded-2xl transition-colors ${expanded ? 'w-full justify-start gap-3 px-3' : 'w-11 justify-center'} ${isActive ? 'bg-[#064e3b] text-white shadow-lg shadow-emerald-900/15' : 'text-slate-500 hover:bg-emerald-50 hover:text-[#064e3b]'}`}
              title={item.label}
            >
              <Icon className="h-5 w-5" />
              {expanded && <span className="text-sm font-black">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <button onClick={onLogout} className={`flex h-11 items-center rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 ${expanded ? 'w-full justify-start gap-3 px-3' : 'w-11 justify-center'}`} title="Déconnexion">
        <LogOut className="h-5 w-5" />
        {expanded && <span className="text-sm font-black">Déconnexion</span>}
      </button>
    </aside>
  );
}
