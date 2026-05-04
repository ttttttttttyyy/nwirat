import React, { useState } from 'react';
import { Truck, MapPin, Navigation, Calendar, Upload, CheckCircle, HeartPulse, ShieldAlert, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function VehicleRequest() {
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    pickupLocation: '',
    destination: '',
    vehicleType: '',
    gpsLocation: '',
    scheduledDate: '',
    documentProof: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    setIsSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/api/requests', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setStep(1);
      }, 3000);
      setFormData({
        clientName: '', clientPhone: '', pickupLocation: '',
        destination: '', vehicleType: '', gpsLocation: '',
        scheduledDate: '', documentProof: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectVehicleType = (type: string) => {
    setFormData({ ...formData, vehicleType: type });
    setStep(2);
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
        (error) => {
          setError("Impossible de récupérer la position GPS. Assurez-vous d'avoir autorisé l'accès à la localisation.");
        }
      );
    } else {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  // Theme based on selection (transparent glass colors)
  const isAmbulance = formData.vehicleType === 'ambulance';
  const themeColor = isAmbulance ? 'red' : 'slate';
  const primaryBg = isAmbulance ? 'bg-red-500/10 border-red-200' : 'bg-slate-500/10 border-slate-200';
  const primaryHover = isAmbulance ? 'hover:bg-red-500/20' : 'hover:bg-slate-500/20';
  const focusRing = isAmbulance ? 'focus:ring-red-400' : 'focus:ring-slate-400';
  const textColor = isAmbulance ? 'text-red-600' : 'text-slate-600';
  const headerText = isAmbulance ? 'text-red-700' : 'text-slate-800';
  const lightBg = isAmbulance ? 'bg-red-50/50' : 'bg-slate-50/50';

  if (step === 1) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 font-sans animate-fade-in-up">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-[#064e3b] font-bold text-xs tracking-widest uppercase mb-4">
            Assistance Commune
          </span>
          <h2 className="text-4xl font-black text-[#0f172a] mb-4">Demande de Véhicule</h2>
          <p className="text-gray-500 text-lg">Sélectionnez le type de véhicule nécessaire pour votre situation. Nous sommes là pour vous accompagner.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ambulance Card */}
          <div 
            onClick={() => selectVehicleType('ambulance')}
            className="group cursor-pointer relative overflow-hidden bg-white/70 backdrop-blur-xl border border-gray-200 rounded-[2.5rem] p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-red-50/50 hover:border-red-200"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-red-500/20 transition-colors duration-500 shadow-sm border border-red-100">
              <HeartPulse className="w-10 h-10 text-red-600 group-hover:text-red-700 transition-colors duration-500" />
            </div>
            <h3 className="text-3xl font-black text-[#0f172a] mb-4 group-hover:text-red-700 transition-colors">Ambulance</h3>
            <p className="text-gray-600 text-lg mb-6 line-clamp-3">
              Transport médicalisé d'urgence ou programmé vers les centres de soins et hôpitaux régionaux.
            </p>
            <div className="flex items-center text-sm font-bold text-red-600 bg-red-500/10 border border-red-100 w-fit px-4 py-2 rounded-full">
              <ShieldAlert className="w-4 h-4 mr-2" />
              Certificat Médical Requis
            </div>
          </div>

          {/* Funeral Car Card */}
          <div 
            onClick={() => selectVehicleType('funeral')}
            className="group cursor-pointer relative overflow-hidden bg-white/70 backdrop-blur-xl border border-gray-200 rounded-[2.5rem] p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-slate-50/50 hover:border-slate-200"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-20 h-20 bg-slate-500/10 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-slate-500/20 transition-colors duration-500 shadow-sm border border-slate-100">
              <MapPin className="w-10 h-10 text-slate-600 group-hover:text-slate-700 transition-colors duration-500" />
            </div>
            <h3 className="text-3xl font-black text-[#0f172a] mb-4 group-hover:text-slate-700 transition-colors">Véhicule Funéraire</h3>
            <p className="text-gray-600 text-lg mb-6 line-clamp-3">
              Transport respectueux et digne pour les services funéraires vers les cimetières de la commune.
            </p>
            <div className="flex items-center text-sm font-bold text-slate-600 bg-slate-500/10 border border-slate-100 w-fit px-4 py-2 rounded-full">
              <ShieldAlert className="w-4 h-4 mr-2" />
              Certificat de Décès Requis
            </div>
          </div>
        </div>
      </div>
    );
  }

  const documentLabel = isAmbulance ? 'Certificat Médical' : 'Certificat de Décès';

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans animate-fade-in-up">
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
            {isAmbulance ? <HeartPulse className="w-8 h-8" /> : <MapPin className="w-8 h-8" />}
            Demande de {isAmbulance ? 'Ambulance' : 'Véhicule Funéraire'}
          </h2>
          <p className={`${textColor} opacity-90 text-lg font-medium`}>Veuillez remplir les informations du patient/défunt et les détails du transport.</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-700 shadow-sm animate-fade-in-up">
          <CheckCircle className="w-6 h-6" />
          <span className="font-bold">Demande de véhicule soumise avec succès !</span>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 shadow-sm animate-fade-in-up">
          <span className="font-bold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`bg-white/70 backdrop-blur-xl border border-gray-200 p-8 md:p-10 rounded-[2.5rem] shadow-sm space-y-8 relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-2 h-full ${isAmbulance ? 'bg-red-400' : 'bg-slate-400'}`}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nom du Client</label>
            <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required
              className={`w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 ${focusRing} transition-all shadow-sm`} placeholder="Nom Complet" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Numéro de Téléphone</label>
            <input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} required
              className={`w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 ${focusRing} transition-all shadow-sm`} placeholder="+212 6..." />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Date et Heure Prévue</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className={`w-5 h-5 ${textColor}`} />
              </div>
              <input type="datetime-local" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} required
                className={`w-full pl-12 pr-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 ${focusRing} transition-all shadow-sm`} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Lieu de Départ</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className={`w-5 h-5 ${textColor}`} />
              </div>
              <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required
                className={`w-full pl-12 pr-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 ${focusRing} transition-all shadow-sm`} placeholder="Adresse de départ" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Destination</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Navigation className={`w-5 h-5 ${textColor}`} />
              </div>
              <input type="text" name="destination" value={formData.destination} onChange={handleChange} required
                className={`w-full pl-12 pr-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 ${focusRing} transition-all shadow-sm`} placeholder={isAmbulance ? "Hôpital / Clinique" : "Cimetière"} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Coordonnées GPS (Optionnel)</label>
            <div className="flex gap-2">
              <input type="text" name="gpsLocation" value={formData.gpsLocation} onChange={handleChange}
                className={`flex-1 px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0f172a] focus:ring-2 ${focusRing} transition-all shadow-sm`} placeholder="36.8065, 10.1815" />
              <button 
                type="button" 
                onClick={getLocation}
                className={`px-4 py-3.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-2xl font-bold transition-colors flex items-center justify-center shrink-0 group shadow-sm`}
                title="Obtenir ma position"
              >
                <MapPin className={`w-5 h-5 group-hover:${textColor} transition-colors`} />
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Document Requis : {documentLabel} <span className="text-red-500">*</span></label>
            <div className={`mt-2 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-200 border-dashed rounded-3xl hover:border-gray-300 transition-colors ${lightBg}`}>
              <div className="space-y-2 text-center">
                <Upload className={`mx-auto h-12 w-12 ${textColor}`} />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className={`relative cursor-pointer rounded-md font-bold ${textColor} hover:underline focus-within:outline-none`}>
                    <span>Télécharger le fichier</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                  </label>
                  <p className="pl-1">ou glisser-déposer</p>
                </div>
                <p className="text-xs text-gray-500 font-medium">PDF, JPG, PNG (Max 10MB)</p>
                {formData.documentProof && <div className={`inline-flex items-center gap-2 text-sm ${textColor} mt-4 font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100`}><CheckCircle className="w-4 h-4"/> Document attaché</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button type="submit" disabled={isSubmitting}
            className={`w-full flex justify-center py-4 px-4 rounded-2xl shadow-sm text-base font-bold ${headerText} ${primaryBg} ${primaryHover} backdrop-blur-md border focus:outline-none focus:ring-2 focus:ring-offset-2 ${focusRing} transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed`}>
            {isSubmitting ? 'Envoi en cours...' : 'Confirmer la Demande'}
          </button>
        </div>
      </form>
    </div>
  );
}
