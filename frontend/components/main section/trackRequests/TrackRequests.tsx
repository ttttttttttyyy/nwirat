import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, BadgeCheck, CalendarDays, CheckCircle, CircleDot, Clock, FileCheck2, FileText, ListChecks, Search, ShieldCheck, Truck, XCircle, Zap } from 'lucide-react';
import axios from 'axios';

const statusLabels: Record<string, string> = {
  PENDING: 'En attente',
  ACCEPTED: 'Acceptee',
  COMPLETED: 'Terminee',
  CANCELLED: 'Annulee',
  REJECTED: 'Rejetee',
  REFUSED: 'Refusee'
};

const statusStyles: Record<string, string> = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  ACCEPTED: 'border-emerald-200 bg-emerald-50 text-[#064e3b]',
  COMPLETED: 'border-green-200 bg-green-50 text-green-700',
  CANCELLED: 'border-rose-200 bg-rose-50 text-rose-700',
  REJECTED: 'border-rose-200 bg-rose-50 text-rose-700',
  REFUSED: 'border-rose-200 bg-rose-50 text-rose-700'
};

const serviceMeta: Record<string, { label: string; icon: any; color: string; soft: string }> = {
  VEH: { label: 'Vehicule', icon: Truck, color: 'text-rose-700', soft: 'bg-rose-50' },
  AUT: { label: 'Raccordement', icon: Zap, color: 'text-amber-700', soft: 'bg-amber-50' },
  LEG: { label: 'Legalisation', icon: ShieldCheck, color: 'text-blue-800', soft: 'bg-blue-50' },
  ATT: { label: 'Attestation', icon: FileCheck2, color: 'text-yellow-800', soft: 'bg-yellow-50' },
  EC: { label: 'Etat civil', icon: FileText, color: 'text-indigo-700', soft: 'bg-indigo-50' }
};

export default function TrackRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
        const [vehiclesRes, authsRes, legalisationsRes, attestationsRes, civilStatusRes] = await Promise.allSettled([
          axios.get('http://localhost:8080/api/requests/my', authHeaders),
          axios.get('http://localhost:8080/api/authorizations/my', authHeaders),
          axios.get('http://localhost:8080/api/legalisation/my', authHeaders),
          axios.get('http://localhost:8080/api/administrative-attestations/my', authHeaders),
          axios.get('http://localhost:8080/api/civil-status/my', authHeaders)
        ]);

        const getData = (result: PromiseSettledResult<any>) => result.status === 'fulfilled' ? result.value.data : [];

        const areaLabels: Record<string, string> = {
          rabat: 'Rabat',
          sale: 'Sale',
          kenitra: 'Kenitra',
          sidi_kacem: 'Sidi Kacem',
          outside_region: 'Hors region'
        };

        const reasonLabels: Record<string, string> = {
          accident: 'Accident',
          giving_birth: 'Accouchement',
          mental_issues: 'Troubles mentaux',
          long_term_sickness: 'Maladie de longue duree',
          other: 'Autre'
        };

        const mapDate = (value: string) => value ? new Date(value).toLocaleDateString('fr-FR') : 'N/A';
        const mapTime = (value: string) => value ? new Date(value).getTime() : 0;

        const mappedVehicles = getData(vehiclesRes).map((r: any) => {
          const area = areaLabels[r.serviceArea] || r.serviceArea || 'Destination';
          const reason = reasonLabels[r.medicalReason] || r.medicalReason || 'Situation';
          return {
            id: `VEH-${r.id}`,
            service: 'VEH',
            type: r.vehicleType === 'ambulance' ? 'Vehicule - Ambulance' : 'Vehicule - Funeraire',
            date: mapDate(r.requestTime),
            timestamp: mapTime(r.requestTime),
            status: r.status || 'PENDING',
            details: r.vehicleType === 'ambulance' ? `${area} - ${reason} - ${r.feeAmount ?? 0} DH` : 'Transport funeraire',
            reference: `#${r.id}`
          };
        });

        const mappedAuths = getData(authsRes).map((r: any) => ({
          id: `AUT-${r.id}`,
          service: 'AUT',
          type: r.authorizationType === 'WATER' ? 'Raccordement - Eau' : 'Raccordement - Electricite',
          date: mapDate(r.requestTime),
          timestamp: mapTime(r.requestTime),
          status: r.status || 'PENDING',
          details: 'Demande de raccordement',
          reference: `#${r.id}`
        }));

        const mappedLegalisations = getData(legalisationsRes).map((r: any) => ({
          id: `LEG-${r.id}`,
          service: 'LEG',
          type: r.documentType === 'SIGNATURE' ? 'Legalisation de signature' : 'Copie conforme',
          date: mapDate(r.requestTime),
          timestamp: mapTime(r.requestTime),
          status: r.status || 'PENDING',
          details: 'Dossier de legalisation',
          reference: `#${r.id}`
        }));

        const mappedAttestations = getData(attestationsRes).map((r: any) => ({
          id: `ATT-${r.id}`,
          service: 'ATT',
          type: 'Attestation administrative',
          date: mapDate(r.requestTime),
          timestamp: mapTime(r.requestTime),
          status: r.status || 'PENDING',
          details: r.propertyAddress || 'Bien immobilier',
          reference: `#${r.id}`
        }));

        const mappedCivilStatus = getData(civilStatusRes).map((r: any) => {
          let requestTypeFr = r.requestType || 'Demande';
          if (r.requestType === 'death_declaration') requestTypeFr = 'Declaration de deces';
          else if (r.requestType === 'birth_declaration') requestTypeFr = 'Declaration de naissance';
          else if (r.requestType === 'engagement_certificate') requestTypeFr = 'Certificat de fiancailles';
          else if (r.requestType === 'family_booklet') requestTypeFr = 'Livret de famille';

          return {
            id: `EC-${r.id}`,
            service: 'EC',
            type: `Etat civil - ${requestTypeFr}`,
            date: mapDate(r.requestTime),
            timestamp: mapTime(r.requestTime),
            status: r.status || 'PENDING',
            details: `${r.feeAmount ?? 0} DH`,
            reference: `#${r.id}`
          };
        });

        const allRequests = [...mappedVehicles, ...mappedAuths, ...mappedLegalisations, ...mappedAttestations, ...mappedCivilStatus];
        allRequests.sort((a, b) => b.timestamp - a.timestamp || b.id.localeCompare(a.id));
        setRequests(allRequests);
      } catch {
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesSearch = !query || `${request.id} ${request.type} ${request.details}`.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'ALL' || request.status === statusFilter;
      const matchesService = serviceFilter === 'ALL' || request.service === serviceFilter;
      return matchesSearch && matchesStatus && matchesService;
    });
  }, [requests, search, statusFilter, serviceFilter]);

  const stats = {
    total: requests.length,
    pending: requests.filter((request) => request.status === 'PENDING').length,
    accepted: requests.filter((request) => request.status === 'ACCEPTED').length,
    completed: requests.filter((request) => request.status === 'COMPLETED').length
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-5 w-5" />;
      case 'ACCEPTED': return <BadgeCheck className="h-5 w-5" />;
      case 'COMPLETED': return <CheckCircle className="h-5 w-5" />;
      case 'CANCELLED':
      case 'REJECTED':
      case 'REFUSED': return <XCircle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 font-sans">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-950/5">
        <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
          <div className="bg-[#064e3b] p-7 text-white md:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#064e3b] shadow-lg">
              <ListChecks className="h-7 w-7" />
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-emerald-100">Espace citoyen</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Suivi des demandes</h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-emerald-50/85">
              Consultez l'avancement de vos dossiers, filtrez par service ou statut, et retrouvez rapidement chaque reference.
            </p>
          </div>
          <div className="grid grid-cols-2 bg-slate-50">
            <div className="border-b border-r border-slate-100 p-5">
              <p className="text-2xl font-black text-slate-950">{stats.total}</p>
              <p className="text-xs font-black uppercase text-slate-400">Total</p>
            </div>
            <div className="border-b border-slate-100 p-5">
              <p className="text-2xl font-black text-amber-700">{stats.pending}</p>
              <p className="text-xs font-black uppercase text-slate-400">En attente</p>
            </div>
            <div className="border-r border-slate-100 p-5">
              <p className="text-2xl font-black text-[#064e3b]">{stats.accepted}</p>
              <p className="text-xs font-black uppercase text-slate-400">Acceptees</p>
            </div>
            <div className="p-5">
              <p className="text-2xl font-black text-green-700">{stats.completed}</p>
              <p className="text-xs font-black uppercase text-slate-400">Terminees</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              placeholder="Rechercher une demande..."
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 outline-none">
              <option value="ALL">Tous les services</option>
              {Object.entries(serviceMeta).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 outline-none">
              <option value="ALL">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="ACCEPTED">Acceptee</option>
              <option value="COMPLETED">Terminee</option>
              <option value="REJECTED">Rejetee</option>
            </select>
          </div>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="grid gap-3">
              {[1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse rounded-3xl bg-slate-100" />)}
            </div>
          ) : filteredRequests.length ? (
            <div className="grid gap-3">
              {filteredRequests.map((request) => {
                const meta = serviceMeta[request.service] || serviceMeta.VEH;
                const Icon = meta.icon;
                const statusClass = statusStyles[request.status] || 'border-slate-200 bg-slate-50 text-slate-600';
                return (
                  <div key={request.id} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${meta.soft} ${meta.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-black text-slate-950">{request.type}</p>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500">{request.id}</span>
                          </div>
                          <p className="mt-1 text-sm font-semibold text-slate-500">{request.details}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-black text-slate-400">
                            <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {request.date}</span>
                            <span className="inline-flex items-center gap-1"><CircleDot className="h-3.5 w-3.5" /> Reference {request.reference}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-black ${statusClass}`}>
                        {getStatusIcon(request.status)}
                        {statusLabels[request.status] || 'Inconnu'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                <Search className="h-7 w-7" />
              </div>
              <p className="mt-4 text-lg font-black text-slate-900">Aucune demande trouvee</p>
              <p className="mt-2 text-sm font-semibold text-slate-500">Essayez de changer le filtre ou la recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
