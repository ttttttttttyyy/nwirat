type DashboardStatsCardsProps = {
  stats: Array<{
    label: string;
    value: number;
    percent: string;
    band: string;
    badge: string;
  }>;
};

export default function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className={`h-2 ${stat.band}`} />
          <div className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">{stat.label}</p>
              <span className={`rounded-full px-2.5 py-1 text-xs font-black ${stat.badge}`}>{stat.percent}</span>
            </div>
            <p className="mt-4 text-4xl font-black text-slate-950">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
