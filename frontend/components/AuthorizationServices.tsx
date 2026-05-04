import React, { useState } from 'react';
import { Zap, Droplet, Upload, CheckCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function AuthorizationServices() {
  const [step, setStep] = useState<1 | 2>(1);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [fieldName]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/authorizations', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setStep(1);
      }, 3000);
      setFormData({
        clientName: '', clientPhone: '', cin: '', authorizationType: '',
        nationalIdCardProof: '', constructionPermitProof: '', habitationPermitProof: '',
        stabilityCertificateProof: '', commissionNoticeProof: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectAuthType = (type: string) => {
    setFormData({ ...formData, authorizationType: type });
    setStep(2);
  };

  // Theme generation (transparent glass colors)
  const isWater = formData.authorizationType === 'WATER';
  const themeColor = isWater ? 'blue' : 'yellow';
  
  const primaryBg = isWater ? 'bg-blue-500/10 border-blue-200' : 'bg-amber-500/10 border-amber-200';
  const primaryHover = isWater ? 'hover:bg-blue-500/20' : 'hover:bg-amber-500/20';
  const focusRing = isWater ? 'focus:ring-blue-400' : 'focus:ring-amber-400';
  const textColor = isWater ? 'text-blue-600' : 'text-amber-600';
  const headerText = isWater ? 'text-blue-700' : 'text-amber-700';
  const lightBg = isWater ? 'bg-blue-50/50' : 'bg-amber-50/50';

  if (step === 1) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 font-sans animate-fade-in-up">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-[#064e3b] font-bold text-xs tracking-widest uppercase mb-4">
            Infrastructures
          </span>
          <h2 className="text-4xl font-black text-[#0f172a] mb-4">Services de Raccordement</h2>
          <p className="text-gray-500 text-lg">Sélectionnez le réseau auquel vous souhaitez raccorder votre domicile ou établissement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Water Card */}
          <div 
            onClick={() => selectAuthType('WATER')}
            className="group cursor-pointer relative overflow-hidden bg-white/70 backdrop-blur-xl border border-gray-200 rounded-[2.5rem] p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-blue-50/50 hover:border-blue-200"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-blue-500/20 transition-colors duration-500 shadow-sm border border-blue-100">
              <Droplet className="w-10 h-10 text-blue-600 group-hover:text-blue-700 transition-colors duration-500" />
            </div>
            <h3 className="text-3xl font-black text-[#0f172a] mb-4 group-hover:text-blue-700 transition-colors">Eau Potable</h3>
            <p className="text-gray-600 text-lg mb-6 line-clamp-3">
              Demande d'autorisation pour le raccordement au réseau public de distribution d'eau potable de la commune.
            </p>
          </div>

          {/* Electricity Card */}
          <div 
            onClick={() => selectAuthType('ELECTRICITY')}
            className="group cursor-pointer relative overflow-hidden bg-white/70 backdrop-blur-xl border border-gray-200 rounded-[2.5rem] p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-amber-50/50 hover:border-amber-200"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-amber-500/20 transition-colors duration-500 shadow-sm border border-amber-100">
              <Zap className="w-10 h-10 text-amber-600 group-hover:text-amber-700 transition-colors duration-500" />
            </div>
            <h3 className="text-3xl font-black text-[#0f172a] mb-4 group-hover:text-amber-700 transition-colors">Électricité</h3>
            <p className="text-gray-600 text-lg mb-6 line-clamp-3">
              Demande d'autorisation pour l'installation d'un compteur et le raccordement au réseau électrique basse tension.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const FileUploadInput = ({ label, fieldName }: { label: string, fieldName: string }) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{label} <span className="text-red-500">*</span></label>
      <div className={`mt-1 flex justify-center px-6 pt-6 pb-6 border-2 border-gray-200 border-dashed rounded-2xl hover:border-gray-300 transition-colors ${lightBg} h-36 items-center`}>
        <div className="space-y-2 text-center w-full">
          <div className="flex text-sm text-gray-600 justify-center">
            <label htmlFor={fieldName} className={`relative cursor-pointer rounded-md font-bold ${textColor} hover:underline focus-within:outline-none`}>
              <span>Télécharger le fichier</span>
              <input id={fieldName} name={fieldName} type="file" className="sr-only" onChange={(e) => handleFileChange(e, fieldName)} required />
            </label>
          </div>
          {(formData as any)[fieldName] ? (
            <div className={`inline-flex items-center gap-2 text-sm ${textColor} mt-2 font-bold bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100`}><CheckCircle className="w-4 h-4"/> Envoyé</div>
          ) : (
            <p className="text-xs text-gray-500 font-medium">Format PDF/JPG requis</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans animate-fade-in-up">
      <button 
        onClick={() => setStep(1)}
        className="flex items-center text-gray-500 hover:text-[#0f172a] font-bold transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Retour à la sélection
      </button>

      <div className={`p-8 rounded-[2rem] border ${primaryBg} backdrop-blur-xl shadow-sm relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h2 className={`text-3xl font-black mb-2 flex items-center gap-4 ${headerText}`}>
            {isWater ? <Droplet className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
            Raccordement à {isWater ? 'l\'Eau Potable' : 'l\'Électricité'}
          </h2>
          <p className={`${textColor} opacity-90 text-lg font-medium`}>Remplissez les informations et téléchargez les documents requis.</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-700 shadow-sm animate-fade-in-up">
          <CheckCircle className="w-6 h-6" />
          <span className="font-bold">Demande de raccordement soumise avec succès !</span>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 shadow-sm animate-fade-in-up">
          <span className="font-bold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`bg-white/70 backdrop-blur-xl border border-gray-200 p-8 md:p-10 rounded-[2.5rem] shadow-sm space-y-8 relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-2 h-full ${isWater ? 'bg-blue-400' : 'bg-amber-400'}`}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nom Complet</label>
            <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required
              className={`w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 ${focusRing} transition-all shadow-sm`} placeholder="Nom Complet" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Numéro de Téléphone</label>
            <input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} required
              className={`w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 ${focusRing} transition-all shadow-sm`} placeholder="+212 6..." />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">CIN (ID)</label>
            <input type="text" name="cin" value={formData.cin} onChange={handleChange} required
              className={`w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 ${focusRing} transition-all shadow-sm`} placeholder="AB123456" />
          </div>

          <div className="md:col-span-2 mt-4">
            <h3 className="text-xl font-black text-[#0f172a] border-b pb-2">Documents Requis</h3>
          </div>

          <FileUploadInput label="Carte d'Identité (CIN)" fieldName="nationalIdCardProof" />
          <FileUploadInput label="Permis de Construire" fieldName="constructionPermitProof" />
          <FileUploadInput label="Permis d'Habiter" fieldName="habitationPermitProof" />
          <FileUploadInput label="Certificat de Stabilité" fieldName="stabilityCertificateProof" />
          <div className="md:col-span-2">
            <FileUploadInput label="Avis de la Commission" fieldName="commissionNoticeProof" />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 mt-8">
          <button type="submit" disabled={isSubmitting}
            className={`w-full flex justify-center py-4 px-4 rounded-2xl shadow-sm text-base font-bold ${headerText} ${primaryBg} ${primaryHover} backdrop-blur-md border focus:outline-none focus:ring-2 focus:ring-offset-2 ${focusRing} transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed`}>
            {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande d\'autorisation'}
          </button>
        </div>
      </form>
    </div>
  );
}
