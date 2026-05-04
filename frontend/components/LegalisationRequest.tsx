import React, { useState } from 'react';
import { FileText, Calendar, Upload, CheckCircle, Shield } from 'lucide-react';
import axios from 'axios';

export default function LegalisationRequest() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    cin: '',
    documentType: 'SIGNATURE',
    appointmentDate: '',
    documentProof: '',
    originalDocumentProof: '',
    identityProof: ''
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
      await axios.post('http://localhost:8080/api/legalisation', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({
        clientName: '', clientPhone: '', cin: '', documentType: 'SIGNATURE',
        appointmentDate: '', documentProof: '', originalDocumentProof: '', identityProof: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#0f172a] mb-2">Service de Légalisation</h2>
        <p className="text-gray-500">Demandez l'authentification de vos signatures ou la copie conforme de vos documents.</p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Demande de légalisation soumise avec succès !</span>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 md:p-8 rounded-[2rem] shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Type de Service</label>
            <div className="flex gap-4 flex-col sm:flex-row">
              <label className={`flex-1 flex items-center justify-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.documentType === 'SIGNATURE' ? 'bg-[#fdfbf7] border-[#064e3b] text-[#064e3b] ring-1 ring-[#064e3b]' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                <input type="radio" name="documentType" value="SIGNATURE" className="sr-only" onChange={handleChange} checked={formData.documentType === 'SIGNATURE'} />
                <FileText className="w-5 h-5" />
                <span className="font-medium">Légalisation de Signature</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.documentType === 'TRUE_COPY' ? 'bg-[#fdfbf7] border-[#064e3b] text-[#064e3b] ring-1 ring-[#064e3b]' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                <input type="radio" name="documentType" value="TRUE_COPY" className="sr-only" onChange={handleChange} checked={formData.documentType === 'TRUE_COPY'} />
                <Shield className="w-5 h-5" />
                <span className="font-medium">Copie Conforme</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom Complet</label>
            <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-[#0f172a] focus:ring-2 focus:ring-[#064e3b] transition-all" placeholder="Nom Complet" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Numéro de Téléphone</label>
            <input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} required
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-[#0f172a] focus:ring-2 focus:ring-[#064e3b] transition-all" placeholder="+212 6..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">CIN (ID)</label>
            <input type="text" name="cin" value={formData.cin} onChange={handleChange} required
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-[#0f172a] focus:ring-2 focus:ring-[#064e3b] transition-all" placeholder="AB123456" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date de Rendez-vous</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-[#0f172a] focus:ring-2 focus:ring-[#064e3b] transition-all" />
            </div>
          </div>

          {/* Upload Identity Proof */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Preuve d'Identité (CIN / Passeport)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-[#064e3b] transition-colors bg-gray-50">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="identityProof" className="relative cursor-pointer rounded-md font-medium text-[#064e3b] hover:text-[#065f46]">
                    <span>Télécharger le fichier</span>
                    <input id="identityProof" name="identityProof" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'identityProof')} />
                  </label>
                </div>
                {formData.identityProof && <p className="text-xs text-[#064e3b] mt-2 font-medium">Document attaché</p>}
              </div>
            </div>
          </div>

          {/* Upload Document Proof */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Document à Légaliser</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-[#064e3b] transition-colors bg-gray-50 h-32 items-center">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="documentProof" className="relative cursor-pointer rounded-md font-medium text-[#064e3b] hover:text-[#065f46]">
                    <span>Télécharger document</span>
                    <input id="documentProof" name="documentProof" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'documentProof')} />
                  </label>
                </div>
                {formData.documentProof && <p className="text-xs text-[#064e3b] mt-2 font-medium">Document attaché</p>}
              </div>
            </div>
          </div>

          {/* Upload Original Document Proof (Only for TRUE_COPY) */}
          {formData.documentType === 'TRUE_COPY' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Document Original</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-[#064e3b] transition-colors bg-gray-50 h-32 items-center">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="originalDocumentProof" className="relative cursor-pointer rounded-md font-medium text-[#064e3b] hover:text-[#065f46]">
                      <span>Télécharger original</span>
                      <input id="originalDocumentProof" name="originalDocumentProof" type="file" className="sr-only" onChange={(e) => handleFileChange(e, 'originalDocumentProof')} />
                    </label>
                  </div>
                  {formData.originalDocumentProof && <p className="text-xs text-[#064e3b] mt-2 font-medium">Document attaché</p>}
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="pt-4 border-t border-gray-100 mt-6">
          <button type="submit" disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#064e3b] hover:bg-[#065f46] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#064e3b] transition-all disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
          </button>
        </div>
      </form>
    </div>
  );
}
