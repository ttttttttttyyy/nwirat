import React, { useState } from 'react';
import Sidebar from './Sidebar';
import StaffDashboard from './features/StaffDashboard';
import Settings from './features/Settings';
import VehicleRequest from './VehicleRequest';
import LegalisationRequest from './LegalisationRequest';
import TrackRequests from './TrackRequests';
import AuthorizationServices from './AuthorizationServices';
import { Menu, X, Mail, Phone, MapPin as MapPinIcon, Shield, Truck, Zap, Info, Globe, MessageCircle, ArrowRight, Activity, Users } from 'lucide-react';

interface MainDashboardProps {
  onLogout: () => void;
  userRole: string;
}

export default function MainDashboard({ onLogout, userRole }: MainDashboardProps) {
  const [activeFeature, setActiveFeature] = useState('lobby');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderFeature = () => {
    switch (activeFeature) {
      case 'lobby':
        return (
          <div className="flex flex-col min-h-full font-sans animate-fade-in-up">
            {/* Extremely Spacious & Creative Hero Section */}
            <div className="relative mb-24 mt-8">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[120%] bg-gradient-to-br from-emerald-100/40 via-transparent to-teal-50/40 blur-[100px] rounded-[100%] pointer-events-none -z-10"></div>
              
              <div className="text-center max-w-4xl mx-auto space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-emerald-500/20 text-emerald-700 font-bold text-sm shadow-sm animate-fade-in-up">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  Portail Digital Actif 24/7
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-[#0f172a] leading-[1.1] tracking-tight">
                  L'administration de <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#064e3b]">
                    Nouirat
                  </span> simplifiée.
                </h1>

                <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
                  Découvrez une nouvelle ère de services publics. Rapide, transparent, et entièrement conçu pour faciliter votre quotidien citoyen.
                </p>

                {/* Decorative floating stats */}
                <div className="flex flex-wrap justify-center gap-6 mt-12 pt-8">
                  <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 transform hover:-translate-y-1 transition-transform">
                    <div className="w-12 h-12 bg-emerald-100 text-[#10b981] rounded-2xl flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-black text-[#0f172a]">+10k</p>
                      <p className="text-sm font-bold text-gray-500">Citoyens connectés</p>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 transform hover:-translate-y-1 transition-transform">
                    <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-black text-[#0f172a]">-50%</p>
                      <p className="text-sm font-bold text-gray-500">Temps d'attente</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Services - Beautiful Masonry-like Grid */}
            <div className="max-w-6xl mx-auto w-full mb-32">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-[#0f172a] flex items-center gap-4">
                  <span className="w-3 h-10 bg-gradient-to-b from-[#10b981] to-[#064e3b] rounded-full inline-block"></span>
                  Accès Rapide aux Services
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {/* Service Card 1 */}
                <div 
                  onClick={() => { setActiveFeature('legalisation'); setIsSidebarOpen(false); }}
                  className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-full -z-10 group-hover:scale-[2] transition-transform duration-700"></div>
                  <div className="w-16 h-16 bg-[#f8f4e6] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#10b981] group-hover:rotate-12 transition-all duration-300 shadow-sm">
                    <Shield className="w-8 h-8 text-[#064e3b] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-black text-[#0f172a] mb-3 text-2xl group-hover:text-[#10b981] transition-colors">Légalisation</h3>
                  <p className="text-gray-500 font-medium leading-relaxed mb-6">Authentification de signatures et copies conformes en un clic.</p>
                  <div className="flex items-center text-sm font-bold text-[#10b981] opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    Commencer <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>

                {/* Service Card 2 */}
                <div 
                  onClick={() => { setActiveFeature('request-vehicle'); setIsSidebarOpen(false); }}
                  className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-full -z-10 group-hover:scale-[2] transition-transform duration-700"></div>
                  <div className="w-16 h-16 bg-[#f8f4e6] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#10b981] group-hover:rotate-12 transition-all duration-300 shadow-sm">
                    <Truck className="w-8 h-8 text-[#064e3b] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-black text-[#0f172a] mb-3 text-2xl group-hover:text-[#10b981] transition-colors">Véhicules</h3>
                  <p className="text-gray-500 font-medium leading-relaxed mb-6">Demande d'ambulance et réservation de véhicules funéraires.</p>
                  <div className="flex items-center text-sm font-bold text-[#10b981] opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    Commencer <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>

                {/* Service Card 3 - Large */}
                <div 
                  onClick={() => { setActiveFeature('authorization'); setIsSidebarOpen(false); }}
                  className="bg-gradient-to-br from-[#0f172a] to-[#064e3b] text-white p-8 rounded-[2.5rem] shadow-xl cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden lg:col-span-1 md:col-span-2"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:rotate-12 transition-all duration-300 shadow-md border border-white/20 group-hover:border-white">
                    <Zap className="w-8 h-8 text-emerald-400 group-hover:text-[#064e3b] transition-colors" />
                  </div>
                  <h3 className="font-black text-white mb-3 text-2xl group-hover:text-emerald-300 transition-colors">Raccordements</h3>
                  <p className="text-emerald-100/80 font-medium leading-relaxed mb-6">Demande d'autorisation de raccordement aux réseaux d'eau potable et d'électricité pour votre domicile.</p>
                  <div className="flex items-center text-sm font-bold text-emerald-300 group-hover:text-white transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                    Accéder au service <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Contact Card Footer */}
            <footer className="mt-auto max-w-6xl mx-auto w-full mb-10">
              <div className="bg-white/60 backdrop-blur-2xl border border-white p-10 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px]"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                  <div>
                    <h3 className="font-black text-[#0f172a] text-2xl mb-8">Informations de Contact</h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-5 text-gray-600 group">
                        <div className="w-12 h-12 rounded-2xl bg-[#f8f4e6] flex items-center justify-center group-hover:bg-[#10b981] group-hover:shadow-lg transition-all duration-300">
                          <MapPinIcon className="w-6 h-6 text-[#064e3b] group-hover:text-white transition-colors" />
                        </div>
                        <span className="font-bold text-lg">Siège de la Commune de Nouirat</span>
                      </div>
                      <div className="flex items-center gap-5 text-gray-600 group">
                        <div className="w-12 h-12 rounded-2xl bg-[#f8f4e6] flex items-center justify-center group-hover:bg-[#10b981] group-hover:shadow-lg transition-all duration-300">
                          <Phone className="w-6 h-6 text-[#064e3b] group-hover:text-white transition-colors" />
                        </div>
                        <span className="font-bold text-lg">+212 5 XX XX XX XX</span>
                      </div>
                      <div className="flex items-center gap-5 text-gray-600 group">
                        <div className="w-12 h-12 rounded-2xl bg-[#f8f4e6] flex items-center justify-center group-hover:bg-[#10b981] group-hover:shadow-lg transition-all duration-300">
                          <Mail className="w-6 h-6 text-[#064e3b] group-hover:text-white transition-colors" />
                        </div>
                        <span className="font-bold text-lg">contact@nouirat.ma</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center items-start md:items-end md:text-right border-t md:border-t-0 md:border-l border-gray-200/60 pt-8 md:pt-0 md:pl-12">
                    <h3 className="font-black text-[#0f172a] text-2xl mb-6">Restez Connecté</h3>
                    <p className="text-gray-500 font-medium mb-8 max-w-sm">Suivez nos actualités et mises à jour sur nos réseaux sociaux officiels.</p>
                    <div className="flex items-center gap-4">
                      <a href="#" className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-[#0f172a] hover:bg-[#10b981] hover:text-white hover:border-[#10b981] hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl">
                        <Globe className="w-6 h-6" />
                      </a>
                      <a href="#" className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-[#0f172a] hover:bg-[#10b981] hover:text-white hover:border-[#10b981] hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl">
                        <MessageCircle className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center text-sm font-bold text-gray-400 mt-8">
                &copy; 2026 Commune de Nouirat. Tous droits réservés.
              </div>
            </footer>
          </div>
        );
      case 'dashboard': {
        const normalizedRole = userRole?.replace('ROLE_', '') || 'USER';
        return (normalizedRole === 'ADMIN' || normalizedRole === 'AGENT') ? <StaffDashboard /> : (
          <div className="p-8 text-center text-red-600 font-bold bg-red-50 rounded-2xl border border-red-200 shadow-sm animate-fade-in-up">
            Accès Refusé. Vous n'avez pas l'autorisation de voir ce tableau de bord.
          </div>
        );
      }
      case 'request-vehicle':
        return <div className="animate-fade-in-up"><VehicleRequest /></div>;
      case 'legalisation':
        return <div className="animate-fade-in-up"><LegalisationRequest /></div>;
      case 'track-requests':
        return <div className="animate-fade-in-up"><TrackRequests /></div>;
      case 'authorization':
        return <div className="animate-fade-in-up"><AuthorizationServices /></div>;
      case 'settings':
        return <div className="animate-fade-in-up"><Settings /></div>;
      default:
        return <div className="p-8 font-bold text-gray-500 text-center mt-20">Sélectionnez une fonctionnalité du menu.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4e6] flex flex-col font-sans relative overflow-hidden">
      {/* Background ambient blobs */}
      <div className="fixed top-[-10%] left-[20%] w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-teal-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Top Navbar */}
      <header className="sticky top-0 w-full h-24 flex justify-between items-center px-6 md:px-12 z-30 bg-white/70 backdrop-blur-xl border-b border-white shadow-sm transition-all">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setActiveFeature('lobby')}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#064e3b] to-[#10b981] flex items-center justify-center shadow-lg shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-[#fdfbf7] font-black text-2xl font-serif tracking-tighter">JN</span>
          </div>
          <span className="text-2xl font-black text-[#0f172a] tracking-tight group-hover:text-[#10b981] transition-colors">
            Jama3a Nouirat
          </span>
        </div>

        {/* Sidebar Toggle Button (Always visible now) */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="px-5 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-[#0f172a] hover:bg-gray-50 hover:border-gray-300 transition-all z-50 flex items-center gap-3 font-bold group"
        >
          <span className="hidden sm:block">Menu</span>
          <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-[#10b981] group-hover:text-white transition-colors">
             <Menu className="w-5 h-5" />
          </div>
        </button>
      </header>

      {/* Drawer Overlay */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-md" onClick={() => setIsSidebarOpen(false)}></div>
        
        {/* Drawer Panel */}
        <div className={`absolute top-0 right-0 w-[22rem] max-w-full h-full bg-gradient-to-b from-[#0f172a] to-[#064e3b] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-black text-white">Menu Navigation</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
             <Sidebar 
               activeFeature={activeFeature} 
               setActiveFeature={(feature) => { setActiveFeature(feature); setIsSidebarOpen(false); }} 
               onLogout={onLogout} 
               userRole={userRole}
             />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10">
          {activeFeature !== 'lobby' && (
             <div className="bg-white/60 backdrop-blur-3xl border border-white rounded-[3rem] p-6 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] min-h-[80vh]">
               {renderFeature()}
             </div>
          )}
          {activeFeature === 'lobby' && (
             <div className="min-h-[80vh]">
               {renderFeature()}
             </div>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}
