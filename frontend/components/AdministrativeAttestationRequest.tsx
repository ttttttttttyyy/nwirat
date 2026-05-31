import React, { useState } from 'react';
import { AlertCircle, Calendar, CheckCircle, FileText, Home, Upload } from 'lucide-react';
import axios from 'axios';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const uploadBox = (
    fieldName: 'saleDonationSadaqaProof' | 'ownershipCertificateProof',
    inputId: string,
    title: string,
    hint: string
  ) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{title}</label>
      <div className="mt-1 flex justify-center px-6 pt-6 pb-6 border-2 border-gray-200 border-dashed rounded-2xl hover:border-[#064e3b] transition-colors bg-emerald-50/30 min-h-36 items-center">
        <div className="space-y-2 text-center">
          <Upload className="mx-auto h-9 w-9 text-[#064e3b]" />
          <div className="flex text-sm text-gray-600 justify-center">
            <label htmlFor={inputId} className="relative cursor-pointer rounded-md font-bold text-[#064e3b] hover:underline">
              <span>Telecharger le fichier</span>
              <input id={inputId} name={inputId} type="file" className="sr-only" onChange={(e) => handleFileChange(e, fieldName)} required />
            </label>
          </div>
          <p className="text-xs text-gray-500 font-medium">{hint}</p>
          {formData[fieldName] && (
            <div className="inline-flex items-center gap-2 text-xs text-[#064e3b] font-bold bg-white px-3 py-1.5 rounded-xl border border-emerald-100">
              <CheckCircle className="w-4 h-4" />
              Document attache
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans animate-fade-in-up">
      <div className="p-8 rounded-[2rem] border border-emerald-200 bg-emerald-50/70 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-3 flex items-center gap-4 text-[#064e3b]">
            <FileText className="w-8 h-8" />
            Attestation Administrative
          </h2>
          <p className="text-[#064e3b] opacity-90 text-lg font-medium leading-relaxed">
            Attestation administrative indiquant que l&apos;operation relative au bien immobilier n&apos;est pas soumise a la loi 25-90.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-700 shadow-sm">
          <CheckCircle className="w-6 h-6" />
          <span className="font-bold">Demande d&apos;attestation administrative soumise avec succes !</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 shadow-sm">
          <span className="font-bold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl border border-gray-200 p-8 md:p-10 rounded-[2.5rem] shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nom Complet</label>
            <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required
              className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 focus:ring-[#064e3b] transition-all shadow-sm" placeholder="Nom Complet" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Numero de Telephone</label>
            <input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} required
              className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 focus:ring-[#064e3b] transition-all shadow-sm" placeholder="+212 6..." />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">CIN</label>
            <input type="text" name="cin" value={formData.cin} onChange={handleChange} required
              className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 focus:ring-[#064e3b] transition-all shadow-sm" placeholder="AB123456" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Date de Rendez-vous</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="w-5 h-5 text-[#064e3b]" />
              </div>
              <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required
                className="w-full pl-12 pr-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 focus:ring-[#064e3b] transition-all shadow-sm" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Adresse du Bien Immobilier</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Home className="w-5 h-5 text-[#064e3b]" />
              </div>
              <input type="text" name="propertyAddress" value={formData.propertyAddress} onChange={handleChange} required
                className="w-full pl-12 pr-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 focus:ring-[#064e3b] transition-all shadow-sm" placeholder="Adresse du terrain ou du bien" />
            </div>
          </div>

          {uploadBox('saleDonationSadaqaProof', 'saleDonationSadaqaProof', 'Acte de vente, donation ou sadaqa', 'A9d al bay3, lhiba ou sadaqa')}
          {uploadBox('ownershipCertificateProof', 'ownershipCertificateProof', 'Certificat de propriete', 'Shahadat al milkia')}
        </div>

        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-bold leading-relaxed">
            L&apos;administration peut demander d&apos;autres documents selon la situation du dossier.
          </p>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button type="submit" disabled={isSubmitting}
            className="w-full flex justify-center py-4 px-4 rounded-2xl shadow-sm text-base font-bold text-white bg-[#064e3b] hover:bg-[#065f46] border border-[#064e3b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#064e3b] transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
          </button>
        </div>
      </form>
    </div>
  );
}
