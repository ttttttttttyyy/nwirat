import React, { useState } from 'react';
import { AlertCircle, Baby, BookOpen, Calendar, CheckCircle, HeartHandshake, ScrollText, Upload } from 'lucide-react';
import axios from 'axios';

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

const emptyFormData: CivilStatusFormData = {
  requestType: 'death_declaration',
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
      { field: 'medicalDeathCertificateProof', label: 'Certificat medical de deces', hint: 'Ou ajoutez une attestation administrative dans le champ suivant.' },
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

  const selectedType = CIVIL_STATUS_TYPES.find((type) => type.value === formData.requestType) || CIVIL_STATUS_TYPES[0];
  const requiredDocuments = selectedType.documents.filter((document) => !document.condition || Boolean(formData[document.condition]));
  const hasDeathCertificateAlternative = formData.requestType !== 'death_declaration' || Boolean(formData.medicalDeathCertificateProof || formData.administrativeDeathCertificateProof);
  const missingDocuments = requiredDocuments.filter((document) => {
    if (formData.requestType === 'death_declaration' && (document.field === 'medicalDeathCertificateProof' || document.field === 'administrativeDeathCertificateProof')) {
      return false;
    }
    return !formData[document.field];
  });
  const isReadyToSubmit = hasDeathCertificateAlternative && missingDocuments.length === 0;

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
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result as string });
      };
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
      <div key={document.field} className={`rounded-2xl border p-5 ${isAttached ? 'border-blue-200 bg-blue-50/60' : 'border-gray-200 bg-white'}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-[#0f172a]">{document.label}</p>
            {document.hint && <p className="mt-1 text-xs font-semibold text-gray-500">{document.hint}</p>}
          </div>
          <label htmlFor={document.field} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100">
            {isAttached ? <CheckCircle className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
            {isAttached ? 'Document ajoute' : 'Importer'}
            <input id={document.field} name={document.field} type="file" className="sr-only" onChange={(e) => handleFileChange(e, document.field)} />
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans animate-fade-in-up">
      <div className="p-8 rounded-[2rem] border border-blue-200 bg-blue-50/70 backdrop-blur-xl shadow-sm">
        <h2 className="text-3xl font-black mb-3 flex items-center gap-4 text-blue-800">
          <ScrollText className="w-8 h-8" />
          Etat Civil
        </h2>
        <p className="text-blue-800/80 text-lg font-medium leading-relaxed">
          Choisissez le service d etat civil souhaite et importez chaque document requis separement.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-700 shadow-sm">
          <CheckCircle className="w-6 h-6" />
          <span className="font-bold">Demande d etat civil soumise avec succes !</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 shadow-sm">
          <span className="font-bold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl border border-gray-200 p-8 md:p-10 rounded-[2.5rem] shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CIVIL_STATUS_TYPES.map((type) => {
            const Icon = type.icon;
            const isActive = formData.requestType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => selectType(type.value)}
                className={`text-left p-5 rounded-2xl border transition-all ${isActive ? 'bg-blue-50 border-blue-300 text-blue-800 ring-2 ring-blue-100' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black">{type.label}</p>
                    <p className="text-xs font-bold opacity-70">{type.fee} DH</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black text-blue-800 uppercase tracking-wider">Pieces a importer</p>
              <p className="mt-1 text-sm font-semibold text-blue-900">
                {isReadyToSubmit ? 'Tous les documents requis sont ajoutes.' : 'Completez les documents requis pour continuer.'}
              </p>
            </div>
            <div className="text-3xl font-black text-blue-800">{selectedType.fee} DH</div>
          </div>
        </div>

        {(formData.requestType === 'birth_declaration' || formData.requestType === 'engagement_certificate') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            {formData.requestType === 'birth_declaration' && (
              <label className="flex items-center gap-3 text-sm font-bold text-gray-700">
                <input type="checkbox" name="isFirstChild" checked={formData.isFirstChild} onChange={handleChange} className="h-4 w-4 rounded border-gray-300" />
                Le nouveau-ne est le premier enfant
              </label>
            )}
            {formData.requestType === 'engagement_certificate' && (
              <>
                <label className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <input type="checkbox" name="isDivorced" checked={formData.isDivorced} onChange={handleChange} className="h-4 w-4 rounded border-gray-300" />
                  La personne est divorcee
                </label>
                <label className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <input type="checkbox" name="isWidowed" checked={formData.isWidowed} onChange={handleChange} className="h-4 w-4 rounded border-gray-300" />
                  L ancien conjoint est decede
                </label>
                <label className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <input type="checkbox" name="hasMultipleWives" checked={formData.hasMultipleWives} onChange={handleChange} className="h-4 w-4 rounded border-gray-300" />
                  Cas de polygamie
                </label>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nom Complet</label>
            <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required
              className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" placeholder="Nom Complet" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Numero de Telephone</label>
            <input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} required
              className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" placeholder="+212 6..." />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">CIN</label>
            <input type="text" name="cin" value={formData.cin} onChange={handleChange} required
              className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" placeholder="AB123456" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Date de Rendez-vous</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="w-5 h-5 text-blue-700" />
              </div>
              <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required
                className="w-full pl-12 pr-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <label className="block text-sm font-bold text-gray-700 ml-1">Documents requis</label>
            <div className="grid grid-cols-1 gap-4">
              {requiredDocuments.map(renderUpload)}
            </div>
            {formData.requestType === 'death_declaration' && !hasDeathCertificateAlternative && (
              <p className="text-sm font-bold text-red-600">Ajoutez soit le certificat medical de deces, soit l attestation administrative.</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Notes supplementaires</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange}
              className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 focus:ring-blue-400 transition-all shadow-sm resize-none h-28"
              placeholder="Ajoutez des informations utiles pour le dossier..." />
          </div>
        </div>

        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-bold leading-relaxed">
            L administration peut demander d autres documents selon la situation du dossier.
          </p>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button type="submit" disabled={isSubmitting || !isReadyToSubmit}
            className="w-full flex justify-center py-4 px-4 rounded-2xl shadow-sm text-base font-bold text-white bg-blue-700 hover:bg-blue-800 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
            {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
          </button>
        </div>
      </form>
    </div>
  );
}
