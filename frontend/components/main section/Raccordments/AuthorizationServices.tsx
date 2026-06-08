import React, { useMemo, useState } from 'react';
import { Check, CheckCircle, Droplet, FileBadge2, FileCheck2, IdCard, Phone, PlugZap, Upload, UserRound, Zap } from 'lucide-react';
import axios from 'axios';

const DOCUMENTS = [
  { fieldName: 'nationalIdCardProof', title: "Carte d'identite nationale", hint: 'CIN du demandeur.' },
  { fieldName: 'constructionPermitProof', title: 'Permis de construire', hint: 'Autorisation de construction.' },
  { fieldName: 'habitationPermitProof', title: "Permis d'habiter", hint: "Document d'habitation." },
  { fieldName: 'stabilityCertificateProof', title: 'Certificat de stabilite', hint: 'Certificat technique du bien.' },
  { fieldName: 'commissionNoticeProof', title: 'Avis de la commission', hint: 'Avis administratif requis.' }
];

export default function AuthorizationServices() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    cin: '',
    authorizationType: '',
    nationalIdCardProof: '',
    constructionPermitProof: '',
    habitationPermitProof: '',
    stabilityCertificateProof: '',
    commissionNoticeProof: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isWater = formData.authorizationType === 'WATER';
  const currentLabel = isWater ? 'Eau potable' : formData.authorizationType ? 'Electricite' : 'A choisir';
  const completedDocuments = DOCUMENTS.filter((document) => Boolean((formData as any)[document.fieldName])).length;
  const progressPercent = Math.round((completedDocuments / DOCUMENTS.length) * 100);
  const accentClasses = isWater ? {
    side: 'bg-[#0f766e]',
    text: 'text-[#0f766e]',
    soft: 'bg-teal-50 text-teal-700',
    button: 'bg-[#0f766e] hover:bg-[#115e59] border-[#0f766e]',
    ring: 'focus:ring-teal-500',
    shadow: 'shadow-teal-950/15'
  } : {
    side: 'bg-[#92400e]',
    text: 'text-[#92400e]',
    soft: 'bg-amber-50 text-amber-700',
    button: 'bg-[#92400e] hover:bg-[#78350f] border-[#92400e]',
    ring: 'focus:ring-amber-500',
    shadow: 'shadow-amber-950/15'
  };

  const requiredDocuments = useMemo(() => DOCUMENTS, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (type: string) => {
    setFormData({ ...formData, authorizationType: type });
    setError('');
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
    setError('');

    if (!formData.authorizationType) {
      setError('Veuillez choisir le type de raccordement.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/authorizations', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({
        clientName: '', clientPhone: '', cin: '', authorizationType: '',
        nationalIdCardProof: '', constructionPermitProof: '', habitationPermitProof: '',
        stabilityCertificateProof: '', commissionNoticeProof: ''
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
      <label key={fieldName} htmlFor={fieldName} className={`group block cursor-pointer rounded-2xl border p-5 transition-all ${isAttached ? `${accentClasses.side} border-transparent text-white shadow-lg` : 'border-gray-200 bg-white text-[#0f172a] shadow-sm hover:-translate-y-0.5 hover:shadow-lg'}`}>
        <input id={fieldName} name={fieldName} type="file" className="sr-only" onChange={(e) => handleFileChange(e, fieldName)} required />
        <div className="flex items-start gap-5">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isAttached ? 'bg-white/15' : accentClasses.soft}`}>
            {isAttached ? <Check className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-black">{title}</p>
            <p className={`mt-1 text-sm font-semibold ${isAttached ? 'text-white/75' : 'text-gray-500'}`}>{hint}</p>
            <p className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${isAttached ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-500'}`}>
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
        <aside className="overflow-hidden rounded-[2rem] border border-gray-200 bg-[#f8fafc] shadow-xl shadow-slate-900/5">
          <div className={`relative min-h-full ${formData.authorizationType ? accentClasses.side : 'bg-[#334155]'} p-7 text-white`}>
            <div className="relative">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white ${formData.authorizationType ? accentClasses.text : 'text-slate-700'} shadow-lg`}>
                <PlugZap className="h-8 w-8" />
              </div>
              <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-white/70">Infrastructures</p>
              <h2 className="mt-3 text-4xl font-black leading-tight">Raccordement</h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-white/75">
                Dossier pour demander le raccordement a l'eau potable ou a l'electricite avec toutes les pieces separees.
              </p>
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-white/80">Documents</span>
                  <span className="text-sm font-black text-white">{completedDocuments}/{DOCUMENTS.length}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="mt-3 text-xs font-bold text-white/70">{formData.authorizationType ? `${progressPercent}% du dossier complete` : 'Choisissez un reseau pour commencer'}</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-5">
          {success && <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700 shadow-sm"><CheckCircle className="h-6 w-6" /><span className="font-bold">Demande de raccordement soumise avec succes !</span></div>}
          {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm"><span className="font-bold">{error}</span></div>}

          <form onSubmit={handleSubmit} className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-xl shadow-slate-900/5">
            <div className="border-b border-gray-100 bg-white p-5 md:p-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className={`text-sm font-black uppercase tracking-widest ${formData.authorizationType ? accentClasses.text : 'text-slate-600'}`}>Type de raccordement</p>
                  <p className="mt-1 text-sm font-semibold text-gray-500">Selectionnez le reseau demande.</p>
                </div>
                <div className="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1">
                  {[{ value: 'WATER', label: 'Eau', icon: Droplet }, { value: 'ELECTRICITY', label: 'Electricite', icon: Zap }].map((option) => {
                    const Icon = option.icon;
                    const active = formData.authorizationType === option.value;
                    return (
                      <label key={option.value} className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition-all ${active ? `${accentClasses.side} text-white shadow-sm` : 'text-gray-500 hover:text-slate-900'}`}>
                        <input type="radio" name="authorizationType" value={option.value} className="sr-only" onChange={() => handleTypeChange(option.value)} checked={active} />
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {!formData.authorizationType ? (
              <div className="p-6 md:p-10">
                <div className="rounded-3xl border border-dashed border-gray-300 bg-slate-50 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm"><PlugZap className="h-7 w-7" /></div>
                  <p className="text-xl font-black text-[#0f172a]">Choisissez d'abord le type de raccordement</p>
                  <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-gray-500">Le formulaire et les documents requis apparaitront apres votre selection.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-0 xl:grid-cols-[1fr_300px]">
                <div className="space-y-8 p-5 md:p-7">
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClasses.soft}`}><UserRound className="h-5 w-5" /></div>
                      <div><h3 className="text-xl font-black text-[#0f172a]">Informations du demandeur</h3><p className="text-sm font-semibold text-gray-500">Identite du citoyen qui depose la demande.</p></div>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div><label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Nom complet</label><input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required className={`w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-[#0f172a] shadow-sm transition-all focus:ring-2 ${accentClasses.ring}`} placeholder="Nom complet" /></div>
                      <div><label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Telephone</label><input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} required className={`w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-[#0f172a] shadow-sm transition-all focus:ring-2 ${accentClasses.ring}`} placeholder="+212 6..." /></div>
                      <div className="md:col-span-2"><label className="mb-2 ml-1 block text-sm font-bold text-gray-700">CIN</label><div className="relative"><IdCard className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${accentClasses.text}`} /><input type="text" name="cin" value={formData.cin} onChange={handleChange} required className={`w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-5 text-[#0f172a] shadow-sm transition-all focus:ring-2 ${accentClasses.ring}`} placeholder="AB123456" /></div></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentClasses.side} text-white`}><FileCheck2 className="h-5 w-5" /></div>
                      <div><h3 className="text-xl font-black text-[#0f172a]">Documents requis</h3><p className="text-sm font-semibold text-gray-500">Importez les pieces une par une.</p></div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">{requiredDocuments.map(uploadBox)}</div>
                  </div>
                </div>

                <div className="border-t border-gray-100 bg-gray-50 p-5 md:p-7 xl:border-l xl:border-t-0">
                  <div className="sticky top-5 space-y-5">
                    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentClasses.soft}`}><FileBadge2 className="h-6 w-6" /></div>
                      <p className="mt-4 text-sm font-black uppercase tracking-widest text-gray-400">Dossier</p>
                      <h3 className="mt-1 text-2xl font-black text-[#0f172a]">{currentLabel}</h3>
                      <div className="mt-5 space-y-3">
                        <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3"><span className="text-sm font-bold text-gray-500">Pieces</span><span className={`font-black ${accentClasses.text}`}>{completedDocuments}/{DOCUMENTS.length}</span></div>
                        <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3"><span className="text-sm font-bold text-gray-500">Frais</span><span className={`font-black ${accentClasses.text}`}>0 DH</span></div>
                      </div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className={`w-full rounded-2xl border px-4 py-4 text-base font-black text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 ${accentClasses.button} ${accentClasses.shadow}`}>
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
