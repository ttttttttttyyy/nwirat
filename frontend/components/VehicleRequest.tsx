import React, { useMemo, useState } from 'react';
import { Ambulance, CalendarDays, Check, CheckCircle, FileBadge2, FileCheck2, HeartPulse, IdCard, MapPin, Navigation, Phone, Route, ShieldAlert, Upload, UserRound } from 'lucide-react';
import axios from 'axios';

const SERVICE_AREAS = [
  { value: 'rabat', label: 'Rabat', fee: 180 },
  { value: 'sale', label: 'Sale', fee: 180 },
  { value: 'kenitra', label: 'Kenitra', fee: 120 },
  { value: 'sidi_kacem', label: 'Sidi Kacem', fee: 90 },
  { value: 'outside_region', label: 'Outside the region', fee: 300 },
];

const MEDICAL_REASONS = [
  { value: 'accident', label: 'Accident' },
  { value: 'giving_birth', label: 'Giving birth' },
  { value: 'mental_issues', label: 'Mental issues' },
  { value: 'long_term_sickness', label: 'Long-term sickness' },
  { value: 'other', label: 'Other' },
];

const FREE_MEDICAL_REASONS = new Set(['accident', 'giving_birth', 'mental_issues', 'long_term_sickness']);

export default function VehicleRequest() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientCin: '',
    pickupLocation: '',
    destination: '',
    vehicleType: '',
    serviceArea: '',
    medicalReason: '',
    feeAmount: 0,
    feeReason: '',
    gpsLocation: '',
    scheduledDate: '',
    documentProof: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isAmbulance = formData.vehicleType === 'ambulance';
  const isFuneral = formData.vehicleType === 'funeral';
  const selectedArea = SERVICE_AREAS.find((area) => area.value === formData.serviceArea);
  const selectedReason = MEDICAL_REASONS.find((reason) => reason.value === formData.medicalReason);
  const documentLabel = isAmbulance ? 'Certificat medical' : 'Certificat de deces';
  const accent = isAmbulance ? '#b91c1c' : '#334155';
  const softAccent = isAmbulance ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-700';

  const requiredDocuments = useMemo(() => {
    if (!formData.vehicleType) return [];
    return [
      {
        fieldName: 'documentProof',
        inputId: 'vehicleDocumentProof',
        title: documentLabel,
        hint: isAmbulance ? 'Document medical obligatoire pour confirmer la demande.' : 'Document obligatoire pour le transport funeraire.'
      }
    ];
  }, [documentLabel, formData.vehicleType, isAmbulance]);

  const completedDocuments = formData.documentProof ? 1 : 0;
  const progressPercent = requiredDocuments.length ? Math.round((completedDocuments / requiredDocuments.length) * 100) : 0;

  const calculateFee = (serviceArea: string, medicalReason: string) => {
    if (FREE_MEDICAL_REASONS.has(medicalReason)) {
      return { feeAmount: 0, feeReason: 'Medical exemption' };
    }

    const area = SERVICE_AREAS.find((item) => item.value === serviceArea);
    return {
      feeAmount: area?.fee ?? 0,
      feeReason: serviceArea === 'outside_region'
        ? 'Outside the region fee, available only within 300 km of the requested hospital'
        : 'Destination fee'
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const nextFormData = { ...formData, [e.target.name]: e.target.value };

    if (e.target.name === 'serviceArea' || e.target.name === 'medicalReason') {
      setFormData({ ...nextFormData, ...calculateFee(nextFormData.serviceArea, nextFormData.medicalReason) });
      return;
    }

    setFormData(nextFormData);
  };

  const handleVehicleTypeChange = (type: string) => {
    setFormData({
      ...formData,
      vehicleType: type,
      serviceArea: type === 'ambulance' ? formData.serviceArea : '',
      medicalReason: type === 'ambulance' ? formData.medicalReason : '',
      feeAmount: type === 'ambulance' ? formData.feeAmount : 0,
      feeReason: type === 'ambulance' ? formData.feeReason : '',
      documentProof: ''
    });
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, documentProof: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.vehicleType) {
      setError('Veuillez choisir le type de vehicule avant de continuer.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/requests', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({
        clientName: '', clientPhone: '', clientCin: '', pickupLocation: '',
        destination: '', vehicleType: '', serviceArea: '', medicalReason: '',
        feeAmount: 0, feeReason: '', gpsLocation: '',
        scheduledDate: '', documentProof: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission. Veuillez reessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            gpsLocation: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          });
        },
        () => {
          setError("Impossible de recuperer la position GPS. Assurez-vous d'avoir autorise l'acces a la localisation.");
        }
      );
    } else {
      setError("La geolocalisation n'est pas supportee par votre navigateur.");
    }
  };

  const uploadBox = ({ fieldName, inputId, title, hint }: { fieldName: string; inputId: string; title: string; hint: string }) => {
    const isAttached = Boolean((formData as any)[fieldName]);

    return (
      <label
        key={fieldName}
        htmlFor={inputId}
        className={`group relative block cursor-pointer overflow-hidden rounded-2xl border p-5 transition-all ${
          isAttached
            ? 'border-[#991b1b] bg-[#991b1b] text-white shadow-lg shadow-red-950/10'
            : 'border-gray-200 bg-white text-[#0f172a] shadow-sm hover:-translate-y-0.5 hover:border-[#991b1b] hover:shadow-lg'
        }`}
      >
        <input id={inputId} name={inputId} type="file" className="sr-only" onChange={handleFileChange} required />
        <div className="flex items-start justify-between gap-5">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isAttached ? 'bg-white/15' : 'bg-red-50 text-[#991b1b]'}`}>
            {isAttached ? <Check className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-black">{title}</p>
            <p className={`mt-1 text-sm font-semibold leading-6 ${isAttached ? 'text-white/75' : 'text-gray-500'}`}>{hint}</p>
            <p className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${isAttached ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-[#991b1b]'}`}>
              {isAttached ? 'Document ajoute' : 'Choisir un fichier'}
            </p>
          </div>
        </div>
      </label>
    );
  };

  return (
    <div className="mx-auto max-w-7xl animate-fade-in-up font-sans">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="overflow-hidden rounded-[2rem] border border-[#991b1b]/10 bg-[#f8fafc] shadow-xl shadow-slate-900/5">
          <div className="relative min-h-full bg-[#7f1d1d] p-7 text-white">
            <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.08))]" />
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#991b1b] shadow-lg">
                <Ambulance className="h-8 w-8" />
              </div>
              <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-red-100">Assistance commune</p>
              <h2 className="mt-3 text-4xl font-black leading-tight">Demande de Vehicule</h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-red-50/80">
                Un dossier clair pour demander une ambulance ou un vehicule funeraire, avec trajet, date et document obligatoire.
              </p>

              <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-red-50">Document</span>
                  <span className="text-sm font-black text-white">{completedDocuments}/{requiredDocuments.length || 1}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="mt-3 text-xs font-bold text-red-50/75">
                  {formData.vehicleType ? `${progressPercent}% du dossier complete` : 'Choisissez un type pour commencer'}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {['Choisir le vehicule', 'Preciser le trajet', 'Importer le document'].map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-black text-[#991b1b]">{index + 1}</span>
                    <span className="text-sm font-bold text-red-50">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-5">
          {success && (
            <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700 shadow-sm">
              <CheckCircle className="h-6 w-6" />
              <span className="font-bold">Demande de vehicule soumise avec succes !</span>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
              <span className="font-bold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-xl shadow-slate-900/5">
            <div className="border-b border-gray-100 bg-white p-5 md:p-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-widest text-[#991b1b]">Type de service</p>
                  <p className="mt-1 text-sm font-semibold text-gray-500">Selectionnez le vehicule necessaire pour votre demande.</p>
                </div>
                <div className="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1">
                  {[
                    { value: 'ambulance', label: 'Ambulance', icon: HeartPulse },
                    { value: 'funeral', label: 'Funeraire', icon: ShieldAlert }
                  ].map((option) => {
                    const Icon = option.icon;
                    const active = formData.vehicleType === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition-all ${
                          active ? 'bg-[#991b1b] text-white shadow-sm' : 'text-gray-500 hover:text-[#991b1b]'
                        }`}
                      >
                        <input type="radio" name="vehicleType" value={option.value} className="sr-only" onChange={() => handleVehicleTypeChange(option.value)} checked={active} />
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {!formData.vehicleType ? (
              <div className="p-6 md:p-10">
                <div className="rounded-3xl border border-dashed border-[#991b1b]/20 bg-slate-50 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#991b1b] shadow-sm">
                    <Route className="h-7 w-7" />
                  </div>
                  <p className="text-xl font-black text-[#0f172a]">Choisissez d'abord le type de vehicule</p>
                  <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-gray-500">
                    Le formulaire de trajet et les documents requis apparaitront automatiquement apres votre selection.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-0 xl:grid-cols-[1fr_300px]">
                <div className="space-y-8 p-5 md:p-7">
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${softAccent}`}>
                        <UserRound className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[#0f172a]">Informations du demandeur</h3>
                        <p className="text-sm font-semibold text-gray-500">Ces informations aideront l'equipe a traiter la mission.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Nom complet</label>
                        <div className="relative">
                          <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: accent }} />
                          <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required
                            className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-5 text-[#0f172a] shadow-sm transition-all focus:ring-2" style={{ '--tw-ring-color': accent } as React.CSSProperties} placeholder="Nom complet" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Telephone</label>
                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: accent }} />
                          <input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} required
                            className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-5 text-[#0f172a] shadow-sm transition-all focus:ring-2" style={{ '--tw-ring-color': accent } as React.CSSProperties} placeholder="+212 6..." />
                        </div>
                      </div>
                      {isAmbulance && (
                        <div className="md:col-span-2">
                          <label className="mb-2 ml-1 block text-sm font-bold text-gray-700">CIN du patient</label>
                          <div className="relative">
                            <IdCard className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-red-700" />
                            <input type="text" name="clientCin" value={formData.clientCin} onChange={handleChange} required
                              className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-5 text-[#0f172a] shadow-sm transition-all focus:ring-2 focus:ring-red-400" placeholder="AB123456" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${softAccent}`}>
                        <Route className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[#0f172a]">Trajet et mission</h3>
                        <p className="text-sm font-semibold text-gray-500">Ajoutez le lieu de depart, la destination et la date prevue.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Date et heure prevue</label>
                        <div className="relative">
                          <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: accent }} />
                          <input type="datetime-local" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} required
                            className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-5 text-[#0f172a] shadow-sm transition-all focus:ring-2" style={{ '--tw-ring-color': accent } as React.CSSProperties} />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Lieu de depart</label>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: accent }} />
                          <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required
                            className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-5 text-[#0f172a] shadow-sm transition-all focus:ring-2" style={{ '--tw-ring-color': accent } as React.CSSProperties} placeholder="Adresse de depart" />
                        </div>
                      </div>

                      {isAmbulance && (
                        <>
                          <div>
                            <label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Destination autorisee</label>
                            <select name="serviceArea" value={formData.serviceArea} onChange={handleChange} required
                              className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-[#0f172a] shadow-sm transition-all focus:ring-2 focus:ring-red-400">
                              <option value="">Choisir une destination</option>
                              {SERVICE_AREAS.map((area) => (
                                <option key={area.value} value={area.value}>{area.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Situation medicale</label>
                            <select name="medicalReason" value={formData.medicalReason} onChange={handleChange} required
                              className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-[#0f172a] shadow-sm transition-all focus:ring-2 focus:ring-red-400">
                              <option value="">Choisir une situation</option>
                              {MEDICAL_REASONS.map((reason) => (
                                <option key={reason.value} value={reason.value}>{reason.label}</option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}

                      <div>
                        <label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Destination</label>
                        <div className="relative">
                          <Navigation className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: accent }} />
                          <input type="text" name="destination" value={formData.destination} onChange={handleChange} required
                            className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-5 text-[#0f172a] shadow-sm transition-all focus:ring-2" style={{ '--tw-ring-color': accent } as React.CSSProperties} placeholder={isAmbulance ? 'Hopital / Clinique' : 'Cimetiere'} />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Coordonnees GPS</label>
                        <div className="flex gap-2">
                          <input type="text" name="gpsLocation" value={formData.gpsLocation} onChange={handleChange}
                            className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-[#0f172a] shadow-sm transition-all focus:ring-2" style={{ '--tw-ring-color': accent } as React.CSSProperties} placeholder="36.8065, 10.1815" />
                          <button type="button" onClick={getLocation} className="flex shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 text-gray-600 shadow-sm transition-colors hover:bg-gray-50" title="Obtenir ma position">
                            <MapPin className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#991b1b] text-white">
                        <FileCheck2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[#0f172a]">Piece obligatoire</h3>
                        <p className="text-sm font-semibold text-gray-500">Importez le document correspondant au type de vehicule.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {requiredDocuments.map(uploadBox)}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 bg-gray-50 p-5 md:p-7 xl:border-l xl:border-t-0">
                  <div className="sticky top-5 space-y-5">
                    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${softAccent}`}>
                        <FileBadge2 className="h-6 w-6" />
                      </div>
                      <p className="mt-4 text-sm font-black uppercase tracking-widest text-gray-400">Mission</p>
                      <h3 className="mt-1 text-2xl font-black text-[#0f172a]">
                        {isAmbulance ? 'Ambulance' : 'Vehicule funeraire'}
                      </h3>
                      <div className="mt-5 space-y-3">
                        <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                          <span className="text-sm font-bold text-gray-500">Document</span>
                          <span className="font-black" style={{ color: accent }}>{completedDocuments}/{requiredDocuments.length}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                          <span className="text-sm font-bold text-gray-500">Frais</span>
                          <span className="font-black" style={{ color: accent }}>{formData.feeAmount} DH</span>
                        </div>
                      </div>
                      {isAmbulance && (
                        <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
                          <p className="text-sm font-black text-red-700">Frais estimes</p>
                          <p className="mt-1 text-xs font-bold leading-5 text-red-700">
                            {formData.serviceArea && formData.medicalReason
                              ? `${selectedReason?.label} vers ${selectedArea?.label}`
                              : 'Choisissez la destination et la situation medicale.'}
                          </p>
                          {formData.serviceArea === 'outside_region' && (
                            <p className="mt-2 text-xs font-bold text-red-600">Disponible seulement si l'hopital demande est dans un rayon de 300 km.</p>
                          )}
                        </div>
                      )}
                    </div>

                    <button type="submit" disabled={isSubmitting}
                      className="w-full rounded-2xl border border-[#991b1b] bg-[#991b1b] px-4 py-4 text-base font-black text-white shadow-lg shadow-red-950/15 transition-all hover:-translate-y-0.5 hover:bg-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-70">
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}

