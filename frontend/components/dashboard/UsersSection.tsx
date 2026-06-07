import { Ban, CheckCircle2, Search, ShieldCheck, UserRound, Users } from 'lucide-react';

type UsersSectionProps = {
  filteredUsers: any[];
  userSearch: string;
  userRoleFilter: string;
  setUserSearch: (value: string) => void;
  setUserRoleFilter: (value: string) => void;
  toggleBan: (user: any) => void;
};

export default function UsersSection({ filteredUsers, userSearch, userRoleFilter, setUserSearch, setUserRoleFilter, toggleBan }: UsersSectionProps) {
  const activeCount = filteredUsers.filter((user) => !user.banned).length;
  const bannedCount = filteredUsers.filter((user) => user.banned).length;
  const elevatedCount = filteredUsers.filter((user) => user.role !== 'ROLE_USER').length;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
          <div className="p-6 md:p-8">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#064e3b]">Citoyens</span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Gestion des Utilisateurs</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
              Recherchez des citoyens, vérifiez les rôles des comptes et bannissez ou réactivez les comptes depuis une table unique.
            </p>
          </div>
          <div className="grid grid-cols-3 border-t border-slate-100 bg-slate-50 lg:border-l lg:border-t-0">
            <div className="p-5">
              <Users className="h-5 w-5 text-[#064e3b]" />
              <p className="mt-3 text-2xl font-black text-slate-950">{filteredUsers.length}</p>
              <p className="text-xs font-black uppercase text-slate-400">Total</p>
            </div>
            <div className="border-x border-slate-100 p-5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <p className="mt-3 text-2xl font-black text-slate-950">{activeCount}</p>
              <p className="text-xs font-black uppercase text-slate-400">Actifs</p>
            </div>
            <div className="p-5">
              <Ban className="h-5 w-5 text-rose-600" />
              <p className="mt-3 text-2xl font-black text-slate-950">{bannedCount}</p>
              <p className="text-xs font-black uppercase text-slate-400">Bannis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100" placeholder="Rechercher des utilisateurs..." />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-50 px-4 text-sm font-black text-[#064e3b]"><ShieldCheck className="h-4 w-4" /> {elevatedCount} rôles spéciaux</span>
            <select value={userRoleFilter} onChange={(e) => setUserRoleFilter(e.target.value)} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 outline-none">
              <option value="ALL">Tous les rôles</option>
              <option value="ROLE_USER">Citoyens</option>
              <option value="ROLE_AGENT">Agents</option>
              <option value="ROLE_ADMIN">Admins</option>
              <option value="ROLE_DRIVER">Chauffeurs</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-4">Utilisateur</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Rôle</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-[#064e3b]"><UserRound className="h-5 w-5" /></div>
                      <div><p className="font-black text-slate-900">{user.name || 'Utilisateur sans nom'}</p><p className="text-xs font-semibold text-slate-400">Compte citoyen</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-500">{user.email}</td>
                  <td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{user.role === 'ROLE_ADMIN' ? 'Admin' : user.role === 'ROLE_AGENT' ? 'Agent' : user.role === 'ROLE_DRIVER' ? 'Chauffeur' : user.role === 'ROLE_USER' ? 'Citoyen' : user.role}</span></td>
                  <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-black ${user.banned ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>{user.banned ? 'Banni' : 'Actif'}</span></td>
                  <td className="px-5 py-4 text-right"><button onClick={() => toggleBan(user)} className={`rounded-xl px-4 py-2 text-sm font-black text-white shadow-sm ${user.banned ? 'bg-[#064e3b] hover:bg-[#065f46]' : 'bg-rose-600 hover:bg-rose-700'}`}>{user.banned ? 'Débannir' : 'Bannir'}</button></td>
                </tr>
              ))}
              {filteredUsers.length === 0 && <tr><td colSpan={5} className="px-5 py-14 text-center font-bold text-slate-400">Aucun utilisateur trouvé.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
