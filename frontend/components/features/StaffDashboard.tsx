import React, { useState, useEffect } from 'react';
import { Users, FileText, Activity, AlertCircle, CheckCircle2, Clock, Trash2, XCircle, Check, Eye, X } from 'lucide-react';
import axios from 'axios';

export default function StaffDashboard() {
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [sortTime, setSortTime] = useState('DESC');
  const [statsData, setStatsData] = useState({ total: 0, pending: 0, resolved: 0, activeStaff: 5 });

  // Modals state
  const [rejectModal, setRejectModal] = useState({ open: false, requestId: '', type: 'VEH' });
  const [rejectReason, setRejectReason] = useState('');
  const [docModal, setDocModal] = useState({ open: false, url: '' });

  const fetchAllRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const [vehiclesRes, authsRes, legalsRes] = await Promise.all([
        axios.get('http://localhost:8080/api/requests', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8080/api/authorizations', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8080/api/legalisation', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const mappedVehicles = vehiclesRes.data.map((r: any) => ({
        id: `VEH-${r.id}`,
        realId: r.id,
        rawType: 'VEH',
        user: r.clientName,
        type: r.vehicleType === 'ambulance' ? 'Ambulance' : 'Véhicule Funéraire',
        status: r.status || 'PENDING',
        time: r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A',
        timestamp: r.requestTime ? new Date(r.requestTime).getTime() : r.id,
        documentProof: r.documentProof
      }));

      const mappedAuths = authsRes.data.map((r: any) => ({
        id: `AUT-${r.id}`,
        realId: r.id,
        rawType: 'AUT',
        user: r.clientName,
        type: r.authorizationType === 'WATER' ? 'Eau Potable' : 'Électricité',
        status: r.status || 'PENDING',
        time: r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A',
        timestamp: r.requestTime ? new Date(r.requestTime).getTime() : r.id,
        // Assuming authorization proof could be one of the files, we'll just take nationalId for demo if not unified
        documentProof: r.nationalIdCardProof || r.documentProof
      }));

      const mappedLegals = legalsRes.data.map((r: any) => ({
        id: `LEG-${r.id}`,
        realId: r.id,
        rawType: 'LEG',
        user: r.clientName,
        type: r.documentType === 'SIGNATURE' ? 'Légalisation de Signature' : 'Copie Conforme',
        status: r.status || 'PENDING',
        time: r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A',
        timestamp: r.requestTime ? new Date(r.requestTime).getTime() : r.id,
        documentProof: r.documentProof || r.originalDocumentProof || r.identityProof
      }));

      const all = [...mappedVehicles, ...mappedAuths, ...mappedLegals];
      
      const pending = all.filter(r => r.status === 'PENDING').length;
      const resolved = all.filter(r => r.status === 'COMPLETED' || r.status === 'ACCEPTED').length;

      setStatsData({ total: all.length, pending, resolved, activeStaff: 5 });
      setRecentRequests(all);
    } catch (err) {
      console.error('Failed to fetch admin requests', err);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const handleAccept = async (id: number, type: string) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'VEH' ? `/api/requests/${id}/status` : type === 'AUT' ? `/api/authorizations/${id}/status` : `/api/legalisation/${id}/status`;
      await axios.patch(`http://localhost:8080${endpoint}?status=ACCEPTED`, null, { headers: { Authorization: `Bearer ${token}` }});
      fetchAllRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const submitReject = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = rejectModal.type === 'VEH' ? `/api/requests/${rejectModal.requestId}/status` : rejectModal.type === 'AUT' ? `/api/authorizations/${rejectModal.requestId}/status` : `/api/legalisation/${rejectModal.requestId}/status`;
      await axios.patch(`http://localhost:8080${endpoint}?status=REJECTED&reason=${encodeURIComponent(rejectReason)}`, null, { headers: { Authorization: `Bearer ${token}` }});
      setRejectModal({ open: false, requestId: '', type: 'VEH' });
      setRejectReason('');
      fetchAllRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number, type: string) => {
    if(!window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) return;
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'VEH' ? `/api/requests/${id}` : type === 'AUT' ? `/api/authorizations/${id}` : `/api/legalisation/${id}`;
      await axios.delete(`http://localhost:8080${endpoint}`, { headers: { Authorization: `Bearer ${token}` }});
      fetchAllRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { label: 'Total Demandes', value: statsData.total.toString(), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
    { label: 'Agents Actifs', value: statsData.activeStaff.toString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200' },
    { label: 'Demandes Traitées', value: statsData.resolved.toString(), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
    { label: 'En Attente', value: statsData.pending.toString(), icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' },
  ];

  let filteredRequests = recentRequests.filter(req => {
    if (filterStatus !== 'ALL') {
      if (filterStatus === 'REJECTED') {
        if (req.status !== 'REJECTED' && req.status !== 'CANCELLED' && req.status !== 'REFUSED') return false;
      } else if (req.status !== filterStatus) return false;
    }
    if (filterType !== 'ALL') {
      if (req.type !== filterType) return false;
    }
    return true;
  });

  filteredRequests.sort((a, b) => {
    if (sortTime === 'DESC') return b.timestamp - a.timestamp;
    return a.timestamp - b.timestamp;
  });

  const translateStatus = (status: string) => {
    if (status === 'PENDING') return 'En Attente';
    if (status === 'ACCEPTED') return 'Acceptée';
    if (status === 'REJECTED' || status === 'REFUSED') return 'Rejetée';
    if (status === 'COMPLETED') return 'Terminée';
    if (status === 'CANCELLED') return 'Annulée';
    if (status === 'IN_PROGRESS') return 'En Cours';
    return status;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">Tableau de Bord Administratif</h2>
          <p className="text-gray-500 font-medium mt-2">Vue d'ensemble des performances de l'équipe et des demandes actives.</p>
        </div>
        <button className="px-6 py-3 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-slate-500/20 transform hover:-translate-y-0.5">
          Générer le Rapport
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/70 backdrop-blur-xl border border-gray-200 p-6 rounded-[2rem] transition-all hover:shadow-xl hover:-translate-y-1 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.border} border`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">{stat.label}</h3>
            <p className="text-4xl font-black text-[#0f172a] mt-2 group-hover:scale-105 transform origin-left transition-transform">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-black text-[#0f172a]">Demandes Citoyennes Récentes</h3>
          <div className="flex gap-4">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm font-bold text-[#0f172a] focus:ring-2 focus:ring-[#0f172a] outline-none"
            >
              <option value="ALL">Tous les types</option>
              <option value="Ambulance">Ambulance</option>
              <option value="Véhicule Funéraire">Véhicule Funéraire</option>
              <option value="Eau Potable">Eau Potable</option>
              <option value="Électricité">Électricité</option>
              <option value="Légalisation de Signature">Légalisation de Signature</option>
              <option value="Copie Conforme">Copie Conforme</option>
            </select>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm font-bold text-[#0f172a] focus:ring-2 focus:ring-[#0f172a] outline-none"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING">En Attente</option>
              <option value="ACCEPTED">Acceptée</option>
              <option value="REJECTED">Rejetée / Annulée</option>
              <option value="COMPLETED">Terminée</option>
            </select>
            <select 
              value={sortTime}
              onChange={(e) => setSortTime(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm font-bold text-[#0f172a] focus:ring-2 focus:ring-[#0f172a] outline-none"
            >
              <option value="DESC">Plus récents</option>
              <option value="ASC">Plus anciens</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase font-black bg-gray-50/50">
              <tr>
                <th className="px-8 py-5">ID Demande</th>
                <th className="px-8 py-5">Citoyen</th>
                <th className="px-8 py-5">Type</th>
                <th className="px-8 py-5">Statut</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.map((req, idx) => (
                <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-8 py-5 font-bold text-[#0f172a]">{req.id}</td>
                  <td className="px-8 py-5 text-gray-600 font-medium">{req.user}</td>
                  <td className="px-8 py-5 text-gray-600 font-medium">{req.type}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border
                      ${req.status === 'ACCEPTED' || req.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        req.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                        req.status === 'REJECTED' || req.status === 'CANCELLED' || req.status === 'REFUSED' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {req.status === 'ACCEPTED' || req.status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4 mr-1.5" /> : 
                        req.status === 'REJECTED' || req.status === 'CANCELLED' || req.status === 'REFUSED' ? <XCircle className="w-4 h-4 mr-1.5" /> : 
                        req.status === 'IN_PROGRESS' ? <Activity className="w-4 h-4 mr-1.5" /> : 
                        <Clock className="w-4 h-4 mr-1.5" />}
                      {translateStatus(req.status)}
                    </span>
                  </td>
                  <td className="px-8 py-5 flex items-center justify-center gap-2">
                    <button 
                      onClick={() => req.documentProof ? setDocModal({ open: true, url: req.documentProof }) : alert("Aucun document fourni")}
                      className={`p-2 rounded-xl transition-colors shadow-sm border ${req.documentProof ? 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200' : 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed'}`}
                      title="Voir le Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {req.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => handleAccept(req.realId, req.rawType)}
                          className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-xl transition-colors shadow-sm"
                          title="Accepter"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setRejectModal({ open: true, requestId: req.realId, type: req.rawType })}
                          className="p-2 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-xl transition-colors shadow-sm"
                          title="Rejeter"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleDelete(req.realId, req.rawType)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition-colors shadow-sm"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-500 font-medium">Aucune demande trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setRejectModal({ open: false, requestId: '', type: 'VEH' })}></div>
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md relative z-10 shadow-2xl border border-gray-100 transform transition-all">
            <h3 className="text-2xl font-black text-[#0f172a] mb-4">Motif du Rejet</h3>
            <p className="text-gray-500 mb-6 font-medium">Veuillez indiquer la raison du rejet de cette demande. Ce message sera visible par le citoyen.</p>
            <textarea 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[#0f172a] focus:bg-white focus:ring-2 focus:ring-red-400 transition-all font-medium mb-6 resize-none h-32"
              placeholder="Raison du refus..."
            ></textarea>
            <div className="flex gap-4">
              <button 
                onClick={() => setRejectModal({ open: false, requestId: '', type: 'VEH' })}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={submitReject}
                disabled={!rejectReason.trim()}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors shadow-sm shadow-red-500/20"
              >
                Confirmer le Rejet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document View Modal */}
      {docModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setDocModal({ open: false, url: '' })}></div>
          <div className="bg-white rounded-[2rem] p-4 w-full max-w-5xl h-full max-h-[90vh] relative z-10 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-4 px-4 pt-4">
              <h3 className="text-xl font-black text-[#0f172a]">Document Justificatif</h3>
              <button onClick={() => setDocModal({ open: false, url: '' })} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
              <object data={docModal.url} className="w-full h-full object-contain">
                <div className="flex items-center justify-center h-full text-gray-500 font-medium">Aperçu non disponible. Veuillez télécharger le document.</div>
              </object>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
