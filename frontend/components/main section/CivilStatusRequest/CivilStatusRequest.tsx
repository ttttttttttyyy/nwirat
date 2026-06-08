import React, { useState } from 'react';
import { AlertCircle, Baby, BookOpen, CalendarDays, Check, CheckCircle, FileBadge2, FileCheck2, HeartHandshake, IdCard, Phone, ScrollText, Upload, UserRound } from 'lucide-react';
import axios from 'axios';

type CivilStatusFormData = {
  requestType: string;
  clientName: string;
  clientPhone: string;
  cin: string;
  appointmentDate: string;
  requiredDocumentsProof: string;
  medicalDeathCertificateProof: string;
  administrativeDeathCertificateProof: string;
  fullCopyOrBirthActProof: string;
  birthMedicalCertificateProof: string;
  marriageActProof: string;
  husbandCinProof: string;
  wifeCinProof: string;
  husbandFullCopyProof: string;
  wifeFullCopyProof: string;
  honorDeclarationProof: string;
  localAuthorityCertificateProof: string;
  divorceProof: string;
  previousPartnerDeathProof: string;
  judgeAuthorizationProof: string;
  photosProof: string;
  notes: string;
  feeAmount: number;
  isFirstChild: boolean;
  isDivorced: boolean;
  isWidowed: boolean;
  hasMultipleWives: boolean;
};

type DocumentField = {
  field: keyof CivilStatusFormData;
  label: string;
  hint?: string;
  condition?: keyof CivilStatusFormData;
};

type CivilStatusType = {
  value: string;
  label: string;
  icon: typeof ScrollText;
  fee: number;
  documents: DocumentField[];
};

const emptyFormData: CivilStatusFormData = {
  requestType: '',
  clientName: '',
  clientPhone: '',
  cin: '',
  appointmentDate: '',
  requiredDocumentsProof: '',
  medicalDeathCertificateProof: '',
  administrativeDeathCertificateProof: '',
  fullCopyOrBirthActProof: '',
  birthMedicalCertificateProof: '',
  marriageActProof: '',
  husbandCinProof: '',
  wifeCinProof: '',
  husbandFullCopyProof: '',
  wifeFullCopyProof: '',
  honorDeclarationProof: '',
  localAuthorityCertificateProof: '',
  divorceProof: '',
  previousPartnerDeathProof: '',
  judgeAuthorizationProof: '',
  photosProof: '',
  notes: '',
  feeAmount: 0,
  isFirstChild: false,
  isDivorced: false,
  isWidowed: false,
  hasMultipleWives: false
};

const CIVIL_STATUS_TYPES: CivilStatusType[] = [
  {
    value: 'death_declaration',
    label: 'Declaration de deces',
    icon: ScrollText,
    fee: 0,
    documents: [
      { field: 'medicalDeathCertificateProof', label: 'Certificat medical de deces', hint: 'Ou ajoutez une attestation administrative.' },
      { field: 'administrativeDeathCertificateProof', label: 'Attestation administrative', hint: 'Alternative au certificat medical.' },
      { field: 'fullCopyOrBirthActProof', label: 'Copie integrale ou acte de naissance' }
    ]
  },
  {
    value: 'birth_declaration',
    label: 'Declaration de naissance',
    icon: Baby,
    fee: 0,
    documents: [
      { field: 'birthMedicalCertificateProof', label: 'Certificat du medecin, de la sage-femme ou de l autorite locale' },
      { field: 'marriageActProof', label: 'Acte de mariage', condition: 'isFirstChild' },
      { field: 'husbandCinProof', label: 'CIN du mari' },
      { field: 'wifeCinProof', label: 'CIN de l epouse' },
      { field: 'husbandFullCopyProof', label: 'Copie integrale du mari' },
      { field: 'wifeFullCopyProof', label: 'Copie integrale de l epouse' }
    ]
  },
  {
    value: 'engagement_certificate',
    label: 'Certificat de fiancailles',
    icon: HeartHandshake,
    fee: 0,
    documents: [
      { field: 'honorDeclarationProof', label: 'Declaration sur l honneur' },
      { field: 'localAuthorityCertificateProof', label: 'Attestation administrative de l autorite locale' },
      { field: 'divorceProof', label: 'Preuve du divorce', condition: 'isDivorced' },
      { field: 'previousPartnerDeathProof', label: 'Acte de deces de l ancien conjoint', condition: 'isWidowed' },
      { field: 'judgeAuthorizationProof', label: 'Autorisation du juge en cas de polygamie', condition: 'hasMultipleWives' },
      { field: 'photosProof', label: 'Photos' },
      { field: 'fullCopyOrBirthActProof', label: 'Acte de naissance' }
    ]
  },
  {
    value: 'family_booklet',
    label: 'Livret de famille',
    icon: BookOpen,
    fee: 50,
    documents: [
      { field: 'husbandCinProof', label: 'CIN du mari' },
      { field: 'wifeCinProof', label: 'CIN de l epouse' },
      { field: 'husbandFullCopyProof', label: 'Copie integrale du mari' },
      { field: 'wifeFullCopyProof', label: 'Copie integrale de l epouse' }
    ]
  }
];

export default function CivilStatusRequest() {
  const [formData, setFormData] = useState<CivilStatusFormData>(emptyFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const selectedType = CIVIL_STATUS_TYPES.find((type) => type.value === formData.requestType);
  const requiredDocuments = selectedType?.documents.filter((document) => !document.condition || Boolean(formData[document.condition])) || [];
  const hasDeathCertificateAlternative = formData.requestType !== 'death_declaration' || Boolean(formData.medicalDeathCertificateProof || formData.administrativeDeathCertificateProof);
  const missingDocuments = requiredDocuments.filter((document) => {
    if (formData.requestType === 'death_declaration' && (document.field === 'medicalDeathCertificateProof' || document.field === 'administrativeDeathCertificateProof')) {
      return false;
    }
    return !formData[document.field];
  });
  const completedDocuments = requiredDocuments.length - missingDocuments.length;
  const progressPercent = requiredDocuments.length ? Math.round((completedDocuments / requiredDocuments.length) * 100) : 0;
  const isReadyToSubmit = Boolean(selectedType) && hasDeathCertificateAlternative && missingDocuments.length === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  const selectType = (requestType: string) => {
    const nextType = CIVIL_STATUS_TYPES.find((type) => type.value === requestType) || CIVIL_STATUS_TYPES[0];
    setFormData({ ...emptyFormData, requestType, feeAmount: nextType.fee });
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof CivilStatusFormData) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, [field]: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isReadyToSubmit) {
      setError('Veuillez joindre tous les documents requis avant de soumettre la demande.');
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/civil-status', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData(emptyFormData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission. Veuillez reessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderUpload = (document: DocumentField) => {
    const isAttached = Boolean(formData[document.field]);
    return (
      <label key={document.field} htmlFor={document.field} className={`group block cursor-pointer rounded-2xl border p-5 transition-all ${isAttached ? 'border-[#4f46e5] bg-[#4f46e5] text-white shadow-lg shadow-indigo-950/10' : 'border-gray-200 bg-white text-[#0f172a] shadow-sm hover:-translate-y-0.5 hover:border-[#4f46e5] hover:shadow-lg'}`}>
        <input id={document.field} name={document.field} type="file" className="sr-only" onChange={(e) => handleFileChange(e, document.field)} />
        <div className="flex items-start gap-5">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isAttached ? 'bg-white/15' : 'bg-indigo-50 text-[#4f46e5]'}`}>
            {isAttached ? <Check className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-black">{document.label}</p>
            {document.hint && <p className={`mt-1 text-sm font-semibold ${isAttached ? 'text-white/75' : 'text-gray-500'}`}>{document.hint}</p>}
            <p className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${isAttached ? 'bg-white/15 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-[#4f46e5]'}`}>
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
        <aside className="overflow-hidden rounded-[2rem] border border-[#4f46e5]/10 bg-[#f8fafc] shadow-xl shadow-slate-900/5">
          <div className="relative min-h-full bg-[#3730a3] p-7 text-white">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#4f46e5] shadow-lg">
                <ScrollText className="h-8 w-8" />
              </div>
              <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-indigo-100">Etat civil</p>
              <h2 className="mt-3 text-4xl font-black leading-tight">Etat Civil</h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-indigo-50/80">
                Choisissez le service souhaite, puis completez les informations et les documents demandes.
              </p>
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-5">
                <div className="flex items-center justify-between"><span className="text-sm font-black text-indigo-50">Documents</span><span className="text-sm font-black">{completedDocuments}/{requiredDocuments.length || 1}</span></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-white transition-all" style={{ width: `${progressPercent}%` }} /></div>
                <p className="mt-3 text-xs font-bold text-indigo-50/75">{selectedType ? `${progressPercent}% du dossier complete` : 'Choisissez un service pour commencer'}</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="space-y-5">
          {success && <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700 shadow-sm"><CheckCircle className="h-6 w-6" /><span className="font-bold">Demande d etat civil soumise avec succes !</span></div>}
          {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm"><span className="font-bold">{error}</span></div>}

          <form onSubmit={handleSubmit} className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-xl shadow-slate-900/5">
            <div className="border-b border-gray-100 bg-white p-5 md:p-7">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-widest text-[#4f46e5]">Type de service</p>
                  <p className="mt-1 text-sm font-semibold text-gray-500">Le formulaire apparaitra apres votre choix.</p>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {CIVIL_STATUS_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isActive = formData.requestType === type.value;
                    return (
                      <button key={type.value} type="button" onClick={() => selectType(type.value)} className={`text-left rounded-2xl border p-4 transition-all ${isActive ? 'border-[#4f46e5] bg-indigo-50 text-[#3730a3] ring-2 ring-indigo-100' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${isActive ? 'bg-[#4f46e5] text-white' : 'bg-gray-100 text-gray-500'}`}><Icon className="h-5 w-5" /></div>
                          <div><p className="font-black">{type.label}</p><p className="text-xs font-bold opacity-70">{type.fee} DH</p></div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {!selectedType ? (
              <div className="p-6 md:p-10">
                <div className="rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/60 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#4f46e5] shadow-sm"><ScrollText className="h-7 w-7" /></div>
                  <p className="text-xl font-black text-[#0f172a]">Choisissez d'abord le service souhaite</p>
                  <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-gray-500">Le formulaire et les documents requis apparaitront automatiquement apres votre selection.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-0 xl:grid-cols-[1fr_300px]">
                <div className="space-y-8 p-5 md:p-7">
                  {(formData.requestType === 'birth_declaration' || formData.requestType === 'engagement_certificate') && (
                    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 md:grid-cols-2">
                      {formData.requestType === 'birth_declaration' && <label className="flex items-center gap-3 text-sm font-bold text-gray-700"><input type="checkbox" name="isFirstChild" checked={formData.isFirstChild} onChange={handleChange} className="h-4 w-4 rounded border-gray-300" />Le nouveau-ne est le premier enfant</label>}
                      {formData.requestType === 'engagement_certificate' && (
                        <>
                          <label className="flex items-center gap-3 text-sm font-bold text-gray-700"><input type="checkbox" name="isDivorced" checked={formData.isDivorced} onChange={handleChange} className="h-4 w-4 rounded border-gray-300" />La personne est divorcee</label>
                          <label className="flex items-center gap-3 text-sm font-bold text-gray-700"><input type="checkbox" name="isWidowed" checked={formData.isWidowed} onChange={handleChange} className="h-4 w-4 rounded border-gray-300" />L ancien conjoint est decede</label>
                          <label className="flex items-center gap-3 text-sm font-bold text-gray-700"><input type="checkbox" name="hasMultipleWives" checked={formData.hasMultipleWives} onChange={handleChange} className="h-4 w-4 rounded border-gray-300" />Cas de polygamie</label>
                        </>
                      )}
                    </div>
                  )}

                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#4f46e5]"><UserRound className="h-5 w-5" /></div>
                      <div><h3 className="text-xl font-black text-[#0f172a]">Informations du demandeur</h3><p className="text-sm font-semibold text-gray-500">Identite et date du rendez-vous.</p></div>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div><label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Nom complet</label><input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-[#0f172a] shadow-sm transition-all focus:ring-2 focus:ring-indigo-500" placeholder="Nom complet" /></div>
                      <div><label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Telephone</label><div className="relative"><Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4f46e5]" /><input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} required className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-5 text-[#0f172a] shadow-sm transition-all focus:ring-2 focus:ring-indigo-500" placeholder="+212 6..." /></div></div>
                      <div><label className="mb-2 ml-1 block text-sm font-bold text-gray-700">CIN</label><div className="relative"><IdCard className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4f46e5]" /><input type="text" name="cin" value={formData.cin} onChange={handleChange} required className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-5 text-[#0f172a] shadow-sm transition-all focus:ring-2 focus:ring-indigo-500" placeholder="AB123456" /></div></div>
                      <div><label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Date de rendez-vous</label><div className="relative"><CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4f46e5]" /><input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-5 text-[#0f172a] shadow-sm transition-all focus:ring-2 focus:ring-indigo-500" /></div></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4f46e5] text-white"><FileCheck2 className="h-5 w-5" /></div>
                      <div><h3 className="text-xl font-black text-[#0f172a]">Documents requis</h3><p className="text-sm font-semibold text-gray-500">Importez chaque document dans son propre bloc.</p></div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">{requiredDocuments.map(renderUpload)}</div>
                    {formData.requestType === 'death_declaration' && !hasDeathCertificateAlternative && <p className="mt-3 text-sm font-bold text-red-600">Ajoutez soit le certificat medical de deces, soit l attestation administrative.</p>}
                  </div>

                  <div>
                    <label className="mb-2 ml-1 block text-sm font-bold text-gray-700">Notes supplementaires</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} className="h-28 w-full resize-none rounded-2xl border border-gray-200 bg-white px-5 py-4 text-[#0f172a] shadow-sm transition-all focus:ring-2 focus:ring-indigo-500" placeholder="Ajoutez des informations utiles pour le dossier..." />
                  </div>

                  <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800"><AlertCircle className="h-5 w-5 shrink-0 mt-0.5" /><p className="text-sm font-bold leading-relaxed">L administration peut demander d autres documents selon la situation du dossier.</p></div>
                </div>

                <div className="border-t border-gray-100 bg-gray-50 p-5 md:p-7 xl:border-l xl:border-t-0">
                  <div className="sticky top-5 space-y-5">
                    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#4f46e5]"><FileBadge2 className="h-6 w-6" /></div>
                      <p className="mt-4 text-sm font-black uppercase tracking-widest text-gray-400">Dossier</p>
                      <h3 className="mt-1 text-2xl font-black text-[#0f172a]">{selectedType.label}</h3>
                      <div className="mt-5 space-y-3">
                        <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3"><span className="text-sm font-bold text-gray-500">Pieces</span><span className="font-black text-[#4f46e5]">{completedDocuments}/{requiredDocuments.length}</span></div>
                        <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3"><span className="text-sm font-bold text-gray-500">Frais</span><span className="font-black text-[#4f46e5]">{selectedType.fee} DH</span></div>
                      </div>
                    </div>
                    <button type="submit" disabled={isSubmitting || !isReadyToSubmit} className="w-full rounded-2xl border border-[#4f46e5] bg-[#4f46e5] px-4 py-4 text-base font-black text-white shadow-lg shadow-indigo-950/15 transition-all hover:-translate-y-0.5 hover:bg-[#3730a3] disabled:cursor-not-allowed disabled:opacity-60">
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
