import React from 'react';
import { User, Shield, Key } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">Paramètres</h2>
        <p className="text-gray-500 font-medium mt-2">Gérez les préférences de votre compte et vos informations personnelles.</p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-[2.5rem] shadow-sm overflow-hidden mt-8">
        <div className="p-8 border-b border-gray-100 bg-emerald-50/30">
          <h3 className="text-xl font-black text-[#0f172a] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            Profil Utilisateur
          </h3>
          <p className="text-gray-500 text-sm mt-2 font-medium ml-13">Mettez à jour vos informations publiques et privées.</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nom Complet</label>
              <input type="text" defaultValue="Admin User" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[#0f172a] focus:bg-white focus:ring-2 focus:ring-emerald-400 transition-all font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Adresse Email</label>
              <input type="email" defaultValue="admin@nouirat.ma" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[#0f172a] focus:bg-white focus:ring-2 focus:ring-emerald-400 transition-all font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Numéro de Téléphone</label>
              <input type="tel" defaultValue="+212 600 000 000" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[#0f172a] focus:bg-white focus:ring-2 focus:ring-emerald-400 transition-all font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Rôle Système</label>
              <input type="text" defaultValue="Administrateur" disabled className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 cursor-not-allowed font-medium" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button className="px-8 py-3.5 bg-[#10b981] hover:bg-[#059669] text-white rounded-2xl font-bold transition-colors shadow-sm shadow-emerald-500/20 transform hover:-translate-y-0.5">
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-[2.5rem] shadow-sm overflow-hidden mt-8">
        <div className="p-8 border-b border-gray-100 bg-red-50/30">
          <h3 className="text-xl font-black text-[#0f172a] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            Sécurité
          </h3>
        </div>
        <div className="p-8 flex items-center justify-between">
          <div>
            <p className="font-bold text-[#0f172a]">Mot de passe</p>
            <p className="text-sm text-gray-500 font-medium">Dernière modification il y a 3 mois</p>
          </div>
          <button className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-[#0f172a] rounded-xl font-bold transition-colors flex items-center gap-2">
            <Key className="w-4 h-4" />
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}
