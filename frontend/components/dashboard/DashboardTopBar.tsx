import { Bell, Search, Settings } from 'lucide-react';

type DashboardTopBarProps = {
  searchQuery: string;
  today: string;
  onSearchChange: (value: string) => void;
};

export default function DashboardTopBar({ searchQuery, today, onSearchChange }: DashboardTopBarProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-100 bg-white px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          placeholder="Search requests..."
        />
      </div>
      <p className="text-center text-sm font-black capitalize text-[#064e3b]">{today}</p>
      <div className="flex items-center justify-end gap-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50" title="Settings">
          <Settings className="h-5 w-5" />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50" title="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-[#064e3b] to-[#10b981] p-0.5">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-black text-[#064e3b]">AD</div>
        </div>
      </div>
    </header>
  );
}
