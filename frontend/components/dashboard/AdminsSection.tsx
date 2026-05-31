import { CheckCircle2, KeyRound, Search, ShieldCheck, UserCog, UserRound, XCircle } from 'lucide-react';
import { serviceNav } from './dashboardConfig';

type AdminsSectionProps = {
  adminEmail: string;
  adminEmailState: 'idle' | 'valid' | 'invalid';
  adminPermissions: string[];
  filteredUsers: any[];
  userSearch: string;
  userRoleFilter: string;
  validateAdminEmail: (email: string) => void;
  togglePermission: (permission: string) => void;
  grantAdminAccess: () => void;
  setUserSearch: (value: string) => void;
  setUserRoleFilter: (value: string) => void;
  loadAdminForEdit: (user: any) => void;
  grantDriverRole: (email: string) => void;
  removeAdminRole: (email: string) => void;
  removeDriverRole: (email: string) => void;
};

export default function AdminsSection(props: AdminsSectionProps) {
  const {
    adminEmail,
    adminEmailState,
    adminPermissions,
    filteredUsers,
    userSearch,
    userRoleFilter,
    validateAdminEmail,
    togglePermission,
    grantAdminAccess,
    setUserSearch,
    setUserRoleFilter,
    loadAdminForEdit,
    grantDriverRole,
    removeAdminRole,
    removeDriverRole
  } = props;

  const elevatedUsers = filteredUsers.filter((user) => user.role !== 'ROLE_USER');
  const manageablePermissions = serviceNav.filter((item) => ['VEH', 'AUT', 'LEG', 'ATT', 'EC', 'USERS', 'FLEET'].includes(item.id));

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 xl:grid-cols-[380px_1fr]">
          <div className="bg-[#064e3b] p-7 text-white">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#064e3b]"><UserCog className="h-7 w-7" /></div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-emerald-100">Access Control</p>
            <h1 className="mt-3 text-3xl font-black">Manage Admins</h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-emerald-50/80">Give staff access by email, edit rights, or remove admin and driver roles.</p>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-3 md:p-7">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5"><ShieldCheck className="h-5 w-5 text-[#064e3b]" /><p className="mt-3 text-2xl font-black text-slate-950">{elevatedUsers.length}</p><p className="text-xs font-black uppercase text-slate-400">Staff accounts</p></div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5"><KeyRound className="h-5 w-5 text-[#064e3b]" /><p className="mt-3 text-2xl font-black text-slate-950">{adminPermissions.length}</p><p className="text-xs font-black uppercase text-slate-400">Selected rights</p></div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5"><UserRound className="h-5 w-5 text-[#064e3b]" /><p className="mt-3 text-2xl font-black text-slate-950">{filteredUsers.length}</p><p className="text-xs font-black uppercase text-slate-400">Matched users</p></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-xl font-black text-slate-950">Grant or edit access</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">Enter an existing user email and choose visible services.</p>
          </div>
          <div className="p-5">
            <div className="relative">
              <input value={adminEmail} onChange={(e) => validateAdminEmail(e.target.value)} className={`h-12 w-full rounded-2xl border px-4 pr-12 font-semibold outline-none focus:ring-2 ${adminEmailState === 'invalid' ? 'border-rose-200 focus:ring-rose-100' : adminEmailState === 'valid' ? 'border-emerald-300 focus:ring-emerald-100' : 'border-slate-200 focus:ring-emerald-100'}`} placeholder="user@email.com" />
              {adminEmailState === 'valid' && <CheckCircle2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600" />}
              {adminEmailState === 'invalid' && <XCircle className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-rose-600" />}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {manageablePermissions.map((item) => (
                <button key={item.id} onClick={() => togglePermission(item.id)} className={`rounded-2xl border px-3 py-3 text-left text-sm font-black transition-all ${adminPermissions.includes(item.id) ? 'border-[#064e3b] bg-emerald-50 text-[#064e3b] shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>{item.label}</button>
              ))}
            </div>

            <button onClick={grantAdminAccess} disabled={adminEmailState !== 'valid'} className="mt-6 h-12 w-full rounded-2xl bg-[#064e3b] font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-[#065f46] disabled:opacity-50">Save Access</button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">Current staff</h2>
              <p className="text-sm font-semibold text-slate-500">Edit rights or remove special roles.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="h-11 rounded-2xl border border-slate-200 pl-11 pr-4 text-sm font-semibold outline-none focus:border-emerald-300" placeholder="Search staff..." />
              </div>
              <select value={userRoleFilter} onChange={(e) => setUserRoleFilter(e.target.value)} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm font-black text-slate-600">
                <option value="ALL">All roles</option>
                <option value="ROLE_AGENT">Agents</option>
                <option value="ROLE_ADMIN">Admins</option>
                <option value="ROLE_DRIVER">Drivers</option>
              </select>
            </div>
          </div>

          <div className="grid gap-3 p-4 xl:grid-cols-2">
            {elevatedUsers.map((user) => (
              <div key={user.id} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#064e3b]"><UserRound className="h-5 w-5" /></div>
                    <div className="min-w-0"><p className="truncate font-black text-slate-900">{user.name || 'Unnamed staff'}</p><p className="truncate text-sm font-semibold text-slate-500">{user.email}</p></div>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{user.role}</span>
                </div>
                <p className="mt-3 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-black text-[#064e3b]">{user.servicePermissions || 'Full access'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => loadAdminForEdit(user)} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">Edit rights</button>
                  {user.role !== 'ROLE_DRIVER' && <button onClick={() => grantDriverRole(user.email)} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-[#064e3b]">Make driver</button>}
                  {user.role === 'ROLE_AGENT' && <button onClick={() => removeAdminRole(user.email)} className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-700">Remove admin</button>}
                  {user.role === 'ROLE_DRIVER' && <button onClick={() => removeDriverRole(user.email)} className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-700">Remove driver</button>}
                </div>
              </div>
            ))}
            {elevatedUsers.length === 0 && <div className="rounded-3xl border border-dashed border-slate-200 p-10 text-center font-bold text-slate-400 xl:col-span-2">No staff accounts found.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
