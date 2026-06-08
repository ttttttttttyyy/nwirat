import { Check, Download, Eye, Plus, Search, SlidersHorizontal, Trash2, X } from 'lucide-react';
import DashboardStatsCards from '../../ui components/DashboardStatsCards';

export type RequestsSectionProps = {
  filterType: string;
  title?: string;
  description?: string;
  stats: any[];
  searchQuery: string;
  sortTime: string;
  filterStatus: string;
  missionDateFilter: string;
  createdDateFilter: string;
  activeFilters: Array<{ key: string; label: string; clear: () => void }>;
  currentPage: number;
  totalPages: number;
  visibleRequests: any[];
  isMainAdmin: boolean;
  filteredRequests?: any[];
  setSearchQuery: (value: string) => void;
  setSortTime: (value: string) => void;
  setFilterStatus: (value: string) => void;
  setMissionDateFilter: (value: string) => void;
  setCreatedDateFilter: (value: string) => void;
  setPage: (value: number) => void;
  setDocModal: (value: any) => void;
  setAssignModal: (value: any) => void;
  setRejectModal: (value: any) => void;
  handleAccept: (id: number, type: string) => void;
  handleDelete: (id: number, type: string) => void;
  translateStatus: (status: string) => string;
  getStatusClasses: (status: string) => string;
};

export default function RequestsSection(props: RequestsSectionProps) {
  const {
    filterType,
    title,
    description,
    stats,
    searchQuery,
    sortTime,
    filterStatus,
    missionDateFilter,
    createdDateFilter,
    activeFilters,
    currentPage,
    totalPages,
    visibleRequests,
    isMainAdmin,
    filteredRequests = [],
    setSearchQuery,
    setSortTime,
    setFilterStatus,
    setMissionDateFilter,
    setCreatedDateFilter,
    setPage,
    setDocModal,
    setAssignModal,
    setRejectModal,
    handleAccept,
    handleDelete,
    translateStatus,
    getStatusClasses
  } = props;

  const handleExportCSV = () => {
    if (!filteredRequests || filteredRequests.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    const headers = [
      "Citoyen",
      "Service",
      "Date de Mission",
      "Date de Demande",
      "Statut",
      "Détails"
    ];

    const rows = filteredRequests.map((req) => {
      const detailStr = req.detail || (req.serviceArea ? `${req.serviceArea} - ${req.medicalReason} - ${req.feeAmount} DH` : "");
      return [
        req.user || "N/A",
        req.type || "N/A",
        req.missionTime || "N/A",
        req.createdTime || req.time || "N/A",
        translateStatus(req.status),
        detailStr
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => 
        row.map(value => 
          `"${String(value).replace(/"/g, '""')}"`
        ).join(",")
      )
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `demandes_nouirat_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">{title || (filterType === 'ALL' ? 'Gérer toutes les demandes' : 'Gestion des demandes')}</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">{description || (filterType === 'ALL' ? 'Supervisez chaque demande citoyenne depuis un espace unique.' : 'Gérez les demandes des citoyens par composant et statut.')}</p>
        </div>
      </div>

      <DashboardStatsCards stats={stats} />

      <div className="rounded-[2rem] border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100" placeholder="Rechercher..." />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleExportCSV} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-black text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all border border-transparent cursor-pointer"><Download className="h-4 w-4" />Exporter</button>
            <select value={sortTime} onChange={(e) => setSortTime(e.target.value)} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 outline-none">
              <option value="DESC">Plus récent</option>
              <option value="ASC">Plus ancien</option>
            </select>
            <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 outline-none">
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="ACCEPTED">Accepté</option>
              <option value="REJECTED">Rejeté</option>
              <option value="COMPLETED">Terminé</option>
            </select>
            <label className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black uppercase text-slate-400">Mission<input type="date" value={missionDateFilter} onChange={(e) => { setMissionDateFilter(e.target.value); setPage(1); }} className="min-w-36 bg-transparent text-sm font-black normal-case text-slate-600 outline-none" /></label>
            <label className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black uppercase text-slate-400">Créé le<input type="date" value={createdDateFilter} onChange={(e) => { setCreatedDateFilter(e.target.value); setPage(1); }} className="min-w-36 bg-transparent text-sm font-black normal-case text-slate-600 outline-none" /></label>
            <button className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 hover:bg-slate-50"><SlidersHorizontal className="h-4 w-4" />Filtrer</button>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {activeFilters.length === 0 && <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500">Aucun filtre actif</span>}
            {activeFilters.map((filter) => (
              <button key={filter.key} onClick={filter.clear} className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-[#064e3b]">{filter.label}<X className="h-3.5 w-3.5" /></button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs font-black text-slate-500">
            <button onClick={() => setPage(Math.max(1, currentPage - 1))} className="rounded-full border border-slate-200 px-3 py-1.5 hover:bg-slate-50">Précédent</button>
            <span>Page {currentPage} / {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, currentPage + 1))} className="rounded-full border border-slate-200 px-3 py-1.5 hover:bg-slate-50">Suivant</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-400">
              <tr><th className="px-5 py-4">Citoyen</th><th className="px-5 py-4">Service</th><th className="px-5 py-4">Date de Mission</th><th className="px-5 py-4">Date de Demande</th><th className="px-5 py-4">Statut</th><th className="px-5 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {visibleRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4 font-semibold text-slate-600">{req.user || 'N/A'}</td>
                  <td className="px-5 py-4"><p className="font-black text-slate-800">{req.type}</p>{(req.detail || req.serviceArea) && <p className="mt-1 text-xs font-semibold text-slate-400">{req.detail || `${req.serviceArea} - ${req.medicalReason} - ${req.feeAmount} DH`}</p>}</td>
                  <td className="px-5 py-4 font-semibold text-slate-500">{req.missionTime || 'N/A'}</td>
                  <td className="px-5 py-4 font-semibold text-slate-500">{req.createdTime || req.time}</td>
                  <td className="px-5 py-4"><span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${getStatusClasses(req.status)}`}>{translateStatus(req.status)}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => (req.documents && req.documents.length > 0) ? setDocModal({ open: true, docs: req.documents, activeIndex: 0 }) : (req.documentProof ? setDocModal({ open: true, docs: [{ name: 'Document', url: req.documentProof }], activeIndex: 0 }) : alert('Aucun document fourni'))} className={`rounded-xl border p-2 ${(req.documents && req.documents.length > 0) || req.documentProof ? 'border-slate-200 text-slate-600 hover:bg-slate-50' : 'border-transparent bg-slate-100 text-slate-300'}`} title="Voir le document"><Eye className="h-4 w-4" /></button>
                      {req.status === 'PENDING' && <><button onClick={() => req.rawType === 'VEH' ? setAssignModal({ open: true, request: req, driverId: '', vehicleId: '' }) : handleAccept(req.realId, req.rawType)} className="rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-100" title="Accepter"><Check className="h-4 w-4" /></button><button onClick={() => setRejectModal({ open: true, requestId: req.realId, type: req.rawType })} className="rounded-xl border border-amber-200 bg-amber-50 p-2 text-amber-600 hover:bg-amber-100" title="Rejeter"><X className="h-4 w-4" /></button></>}
                      {isMainAdmin && <button onClick={() => handleDelete(req.realId, req.rawType)} className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100" title="Supprimer"><Trash2 className="h-4 w-4" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
              {visibleRequests.length === 0 && <tr><td colSpan={6} className="px-5 py-14 text-center font-bold text-slate-400">Aucune demande trouvée.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
