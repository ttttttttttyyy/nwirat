import React, { useMemo, useState } from 'react';
import { AlertCircle, CalendarDays, Check, CheckCircle, FileBadge2, FileCheck2, FileText, Home, IdCard, Phone, Upload, UserRound } from 'lucide-react';
import axios from 'axios';

const DOCUMENTS = [
  { fieldName: 'saleDonationSadaqaProof', title: 'Acte de vente, donation ou sadaqa', hint: 'A9d al bay3, lhiba ou sadaqa.' },
  { fieldName: 'ownershipCertificateProof', title: 'Certificat de propriete', hint: 'Shahadat al milkia.' }
] as const;

export default function AdministrativeAttestationRequest() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    cin: '',
    propertyAddress: '',
    appointmentDate: '',
    saleDonationSadaqaProof: '',
    ownershipCertificateProof: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const completedDocuments = DOCUMENTS.filter((document) => Boolean((formData as any)[document.fieldName])).length;
  const progressPercent = Math.round((completedDocuments / DOCUMENTS.length) * 100);
  const requiredDocuments = useMemo(() => DOCUMENTS, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, [fieldName]: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/administrative-attestations', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({
        clientName: '',
        clientPhone: '',
        cin: '',
        propertyAddress: '',
        appointmentDate: '',
        saleDonationSadaqaProof: '',
        ownershipCertificateProof: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission. Veuillez reessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadBox = ({ fieldName, title, hint }: { fieldName: string; title: string; hint: string }) => {
    const isAttached = Boolean((formData as any)[fieldName]);
    return (
      <label key={fieldName} htmlFor={fieldName} className={`group block cursor-pointer rounded-2xl border p-5 transition-all ${isAttached ? 'border-[#6d4c1c] bg-[#6d4c1c] text-white shadow-lg shadow-yellow-950/10' : 'border-gray-200 bg-white text-[#0f172a] shadow-sm hover:-translate-y-0.5 hover:border-[#6d4c1c] hover:shadow-lg'}`}>
        <input id={fieldName} name={fieldName} type="file" className="sr-only" onChange={(e) => handleFileChange(e, fieldName)} required />
        <div className="flex items-start gap-5">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isAttached ? 'bg-white/15' : 'bg-yellow-50 text-[#6d4c1c]'}`}>
            {isAttached ? <Check className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-black">{title}</p>
            <p className={`mt-1 text-sm font-semibold ${isAttached ? 'text-white/75' : 'text-gray-500'}`}>{hint}</p>
            <p className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${isAttached ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-yellow-50 group-hover:text-[#6d4c1c]'}`}>
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
        <aside className="overflow-hidden rounded-[2rem] border border-[#6d4c1c]/10 bg-[#f8fafc] shadow-xl shadow-slate-900/5">
          <div className="relative min-h-full bg-[#4a3416] p-7 text-white">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#6d4c1c] shadow-lg">
                <FileText className="h-8 w-8" />
              </div>
              <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-yellow-100">Dossier foncier</p>
              <h2 className="mt-3 text-4xl font-black leading-tight">Attestation Administrative</h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-yellow-50/80">
                Attestation indiquant que l'operation relative au bien immobilier n'est pas soumise a la loi 25-90.
              </p>
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-5">
                <div className="flex items-center justify-between"><span className="text-sm font-black text-yellow-50">Documents</span><span className="text-sm font-black">{completedDocuments}/{DOCUMENTS.length}</span></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-white transition-all" style={{ width: `${progressPercent}%` }} /></div>
                <p className="mt-3 text-xs font-bold text-yellow-50/75">{progressPercent}% du dossier complete</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-5">
          {success && <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700 shadow-sm"><CheckCircle className="h-6 w-6" /><span className="font-bold">Demande d&apos;attestation administrative soumise avec succes !</span></div>}
          {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm"><span className="font-bold">{error}</span></div>}

          <form onSubmit={handleSubmit} className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-xl shadow-slate-900/5">
            <div className="border-b border-gray-100 bg-white p-5 md:p-7">
              <p className="text-sm font-black uppercase tracking-widest text-[#6d4c1c]">Attestation administrative</p>
              <p className="mt-1 text-sm font-semibold text-gray-500">Remplissez les informations du proprietaire et du bien immobilier.</p>
            </div>

            <div className="grid gap-0 xl:grid-cols-[1fr_300px]">
              <div className="space-y-8 p-5 md:p-7">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-[#6d4c1c]"><UserRound className="h-5 w-5" /></div>
                    <div><h3 className="text-xl font-black text-[#0f172a]">Informations du demandeur</h3><p className="text-sm font-semibold text-gray-500">Identite et rendez-vous.</p></div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div><label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Nom complet</label><input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-[#0f172a] shadow-sm transition-all focus:ring-2 focus:ring-yellow-700" placeholder="Nom complet" /></div>
                    <div><label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Telephone</label><div className="relative"><Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6d4c1c]" /><input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} required className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-5 text-[#0f172a] shadow-sm transition-all focus:ring-2 focus:ring-yellow-700" placeholder="+212 6..." /></div></div>
                    <div><label className="mb-2 ml-1 block text-sm font-bold text-gray-700">CIN</label><div className="relative"><IdCard className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6d4c1c]" /><input type="text" name="cin" value={formData.cin} onChange={handleChange} required className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-5 text-[#0f172a] shadow-sm transition-all focus:ring-2 focus:ring-yellow-700" placeholder="AB123456" /></div></div>
                    <div><label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Date de rendez-vous</label><div className="relative"><CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6d4c1c]" /><input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-5 text-[#0f172a] shadow-sm transition-all focus:ring-2 focus:ring-yellow-700" /></div></div>
                    <div className="md:col-span-2"><label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Adresse du bien immobilier</label><div className="relative"><Home className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6d4c1c]" /><input type="text" name="propertyAddress" value={formData.propertyAddress} onChange={handleChange} required className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-5 text-[#0f172a] shadow-sm transition-all focus:ring-2 focus:ring-yellow-700" placeholder="Adresse du terrain ou du bien" /></div></div>
                  </div>
                </div>

                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6d4c1c] text-white"><FileCheck2 className="h-5 w-5" /></div>
                    <div><h3 className="text-xl font-black text-[#0f172a]">Documents requis</h3><p className="text-sm font-semibold text-gray-500">Chaque document est importe dans son propre bloc.</p></div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">{requiredDocuments.map(uploadBox)}</div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-bold leading-relaxed">L&apos;administration peut demander d&apos;autres documents selon la situation du dossier.</p>
                </div>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 p-5 md:p-7 xl:border-l xl:border-t-0">
                <div className="sticky top-5 space-y-5">
                  <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-[#6d4c1c]"><FileBadge2 className="h-6 w-6" /></div>
                    <p className="mt-4 text-sm font-black uppercase tracking-widest text-gray-400">Dossier</p>
                    <h3 className="mt-1 text-2xl font-black text-[#0f172a]">Attestation</h3>
                    <div className="mt-5 space-y-3">
                      <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3"><span className="text-sm font-bold text-gray-500">Pieces</span><span className="font-black text-[#6d4c1c]">{completedDocuments}/{DOCUMENTS.length}</span></div>
                      <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3"><span className="text-sm font-bold text-gray-500">Frais</span><span className="font-black text-[#6d4c1c]">0 DH</span></div>
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl border border-[#6d4c1c] bg-[#6d4c1c] px-4 py-4 text-base font-black text-white shadow-lg shadow-yellow-950/15 transition-all hover:-translate-y-0.5 hover:bg-[#4a3416] disabled:cursor-not-allowed disabled:opacity-70">
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
