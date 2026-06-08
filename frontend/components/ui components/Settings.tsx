import React, { useEffect, useState } from 'react';
import { User as UserIcon, Shield, Key, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Settings() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    cin: '',
    age: '',
    role: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  
  const [profileMessage, setProfileMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile({
          name: response.data.name || '',
          email: response.data.email || '',
          cin: response.data.cin || '',
          age: response.data.age ? String(response.data.age) : '',
          role: response.data.role || 'ROLE_USER'
        });
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8080/api/users/profile', {
        name: profile.name,
        cin: profile.cin,
        age: parseInt(profile.age) || 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileMessage({ text: 'Profil mis à jour avec succès.', type: 'success' });
    } catch (err: any) {
      console.error(err);
      setProfileMessage({ 
        text: err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour.', 
        type: 'error' 
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordMessage({ text: 'Les nouveaux mots de passe ne correspondent pas.', type: 'error' });
      return;
    }
    setIsSavingPassword(true);
    setPasswordMessage(null);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8080/api/users/profile/password', {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPasswordMessage({ text: 'Mot de passe modifié avec succès.', type: 'success' });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => setShowPasswordForm(false), 2000);
    } catch (err: any) {
      console.error(err);
      setPasswordMessage({ 
        text: err.response?.data?.message || 'L\'ancien mot de passe est incorrect.', 
        type: 'error' 
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const translateRole = (role: string) => {
    if (role === 'ROLE_ADMIN') return 'Administrateur';
    if (role === 'ROLE_AGENT') return 'Agent de la Commune';
    if (role === 'ROLE_DRIVER') return 'Chauffeur';
    return 'Citoyen';
  };

  if (isLoading) {
    return <div className="text-center py-10 font-bold text-gray-500">Chargement des paramètres...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto font-sans text-slate-900">
      <div>
        <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">Paramètres</h2>
        <p className="text-gray-500 font-medium mt-2">Gérez les préférences de votre compte et vos informations personnelles.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-[2.5rem] shadow-sm overflow-hidden mt-8">
        <div className="p-8 border-b border-gray-100 bg-emerald-50/30">
          <h3 className="text-xl font-black text-[#0f172a] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-emerald-600" />
            </div>
            Profil Utilisateur
          </h3>
          <p className="text-gray-500 text-sm mt-2 font-medium ml-13">Mettez à jour vos informations publiques et privées.</p>
        </div>
        <form onSubmit={saveProfile} className="p-8 space-y-6">
          {profileMessage && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 border text-sm font-semibold ${
              profileMessage.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              {profileMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {profileMessage.text}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nom Complet</label>
              <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[#0f172a] focus:bg-white focus:ring-2 focus:ring-emerald-400 transition-all font-medium outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Adresse Email</label>
              <input type="email" name="email" value={profile.email} disabled className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 cursor-not-allowed font-medium outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">CIN (Carte d'identité)</label>
              <input type="text" name="cin" value={profile.cin} onChange={handleProfileChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[#0f172a] focus:bg-white focus:ring-2 focus:ring-emerald-400 transition-all font-medium outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Âge</label>
              <input type="number" name="age" value={profile.age} onChange={handleProfileChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[#0f172a] focus:bg-white focus:ring-2 focus:ring-emerald-400 transition-all font-medium outline-none" required min="18" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Rôle Système</label>
              <input type="text" value={translateRole(profile.role)} disabled className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 cursor-not-allowed font-medium outline-none" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="submit" disabled={isSavingProfile} className="px-8 py-3.5 bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-sm shadow-emerald-500/20 transform hover:-translate-y-0.5 cursor-pointer">
              {isSavingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-[2.5rem] shadow-sm overflow-hidden mt-8">
        <div className="p-8 border-b border-gray-100 bg-red-50/30">
          <h3 className="text-xl font-black text-[#0f172a] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            Sécurité
          </h3>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[#0f172a]">Mot de passe</p>
              <p className="text-sm text-gray-500 font-medium">Sécurisez votre compte en mettant à jour votre mot de passe.</p>
            </div>
            <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-[#0f172a] rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer">
              <Key className="w-4 h-4" />
              {showPasswordForm ? 'Fermer' : 'Modifier'}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={savePassword} className="mt-8 pt-8 border-t border-gray-100 space-y-6 max-w-xl animate-in fade-in slide-in-from-top-4 duration-300">
              {passwordMessage && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 border text-sm font-semibold ${
                  passwordMessage.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  {passwordMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  {passwordMessage.text}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Ancien mot de passe</label>
                  <input type="password" name="oldPassword" value={passwordForm.oldPassword} onChange={handlePasswordChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[#0f172a] focus:bg-white focus:ring-2 focus:ring-emerald-400 transition-all font-medium outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Nouveau mot de passe</label>
                  <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[#0f172a] focus:bg-white focus:ring-2 focus:ring-emerald-400 transition-all font-medium outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Confirmer le nouveau mot de passe</label>
                  <input type="password" name="confirmNewPassword" value={passwordForm.confirmNewPassword} onChange={handlePasswordChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[#0f172a] focus:bg-white focus:ring-2 focus:ring-emerald-400 transition-all font-medium outline-none" required />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={isSavingPassword} className="px-8 py-3.5 bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-sm shadow-emerald-500/20 transform hover:-translate-y-0.5 cursor-pointer">
                  {isSavingPassword ? 'Modification...' : 'Modifier le mot de passe'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
