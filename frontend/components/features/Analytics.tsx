import React from 'react';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Analytics Overview</h2>
        <p className="text-slate-400 mt-1">Monitor your system traffic and user engagement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-purple-400/10">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total Visits</p>
              <p className="text-2xl font-bold text-white">124.5K</p>
            </div>
          </div>
          <div className="h-24 bg-slate-900/50 rounded-lg border border-slate-700/50 flex items-end p-2 gap-1">
            {/* Fake chart bars */}
            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-purple-500/50 rounded-t-sm transition-all hover:bg-purple-400" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-blue-400/10">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Active Users</p>
              <p className="text-2xl font-bold text-white">8,234</p>
            </div>
          </div>
          <div className="h-24 bg-slate-900/50 rounded-lg border border-slate-700/50 flex items-end p-2 gap-1">
            {[60, 50, 80, 40, 70, 90, 75].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-500/50 rounded-t-sm transition-all hover:bg-blue-400" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-emerald-400/10">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-white">3.4%</p>
            </div>
          </div>
          <div className="h-24 bg-slate-900/50 rounded-lg border border-slate-700/50 flex items-end p-2 gap-1">
            {[30, 45, 20, 60, 55, 75, 40].map((h, i) => (
              <div key={i} className="flex-1 bg-emerald-500/50 rounded-t-sm transition-all hover:bg-emerald-400" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
