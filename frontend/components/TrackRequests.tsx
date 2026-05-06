import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function TrackRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch vehicle requests, authorizations, and legalisations
        const [vehiclesRes, authsRes, legalisationsRes] = await Promise.all([
          axios.get('http://localhost:8080/api/requests/my', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8080/api/authorizations/my', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8080/api/legalisation/my', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const mappedVehicles = vehiclesRes.data.map((r: any) => ({
          id: `VEH-${r.id}`,
          type: r.vehicleType === 'ambulance' ? 'Véhicule (Ambulance)' : 'Véhicule (Funéraire)',
          date: r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A',
          status: r.status || 'PENDING'
        }));

        const mappedAuths = authsRes.data.map((r: any) => ({
          id: `AUT-${r.id}`,
          type: r.authorizationType === 'WATER' ? 'Raccordement (Eau)' : 'Raccordement (Électricité)',
          date: r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A',
          status: r.status || 'PENDING'
        }));

        const mappedLegalisations = legalisationsRes.data.map((r: any) => ({
          id: `LEG-${r.id}`,
          type: r.documentType === 'SIGNATURE' ? 'Légalisation de Signature' : 'Copie Conforme',
          date: r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A',
          status: r.status || 'PENDING'
        }));

        const allRequests = [...mappedVehicles, ...mappedAuths, ...mappedLegalisations];
        // Sort newest first roughly based on ID since we don't have perfect timestamps easily comparable here
        allRequests.sort((a, b) => b.id.localeCompare(a.id));

        setRequests(allRequests);
      } catch (err: any) {
        console.error('Failed to fetch requests', err);
        // We will just show an empty list or keep the error state, no more fake data.
        if (err.response?.status === 403) {
          console.error("403 Forbidden - Token might be invalid or endpoint restricted.");
        }
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'ACCEPTED': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'COMPLETED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'CANCELLED': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'REJECTED': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'REFUSED': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-semibold">En Attente</span>;
      case 'ACCEPTED': return <span className="px-3 py-1 bg-emerald-50 text-[#064e3b] border border-emerald-200 rounded-full text-xs font-semibold">Acceptée</span>;
      case 'COMPLETED': return <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">Terminée</span>;
      case 'CANCELLED': return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-semibold">Annulée</span>;
      case 'REJECTED': return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-semibold">Rejetée</span>;
      case 'REFUSED': return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-semibold">Refusée</span>;
      default: return <span className="px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-xs font-semibold">Inconnu</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#0f172a] mb-2">Suivi des Demandes</h2>
        <p className="text-gray-500">Consultez l'état d'avancement de vos demandes soumises.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden p-2">
        <div className="min-w-full divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Détails de la Demande</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</span>
          </div>
          <div className="divide-y divide-gray-100 bg-white">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">Chargement...</div>
            ) : requests.map((req) => (
              <div key={req.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#fdfbf7] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    {getStatusIcon(req.status)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0f172a]">{req.type}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-gray-500">{req.id}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{req.date}</span>
                    </div>
                  </div>
                </div>
                <div>
                  {getStatusBadge(req.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
        {!isLoading && requests.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Aucune demande trouvée.
          </div>
        )}
      </div>
    </div>
  );
}
