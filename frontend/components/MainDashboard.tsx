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
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderFeature = () => {
    switch (activeFeature) {
      case 'lobby':
        return (
          <div className="flex flex-col min-h-full font-sans animate-fade-in-up">
            {/* Extremely Spacious & Creative Hero Section */}
            <div className="relative mb-24 mt-8 max-w-7xl mx-auto w-full">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[120%] bg-gradient-to-br from-emerald-100/40 via-transparent to-teal-50/40 blur-[100px] rounded-[100%] pointer-events-none -z-10"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                
                {/* Left Column (Text & Stats) */}
                <div className="lg:col-span-7 space-y-8 text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-emerald-500/20 text-emerald-700 font-bold text-sm shadow-sm animate-fade-in-up">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    Portail Digital Actif 24/7
                  </div>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#0f172a] leading-[1.05] tracking-tight">
                    L'administration de <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#064e3b]">
                      Nouirat
                    </span> simplifiée.
                  </h1>

                  <p className="text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
                    Découvrez une nouvelle ère de services publics. Rapide, transparent, et entièrement conçu pour faciliter votre quotidien citoyen.
                  </p>

                  {/* Decorative floating stats */}
                  <div className="flex flex-wrap justify-start gap-6 mt-8 pt-4">
                    <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 transform hover:-translate-y-1 transition-transform">
                      <div className="w-12 h-12 bg-emerald-100 text-[#10b981] rounded-2xl flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-black text-[#0f172a]">+10k</p>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Citoyens</p>
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 transform hover:-translate-y-1 transition-transform">
                      <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-black text-[#0f172a]">-50%</p>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">D'attente</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (Hot Activities Cards) */}
                <div className="lg:col-span-5 relative lg:pl-12 flex flex-col justify-center gap-6 mt-8 lg:mt-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/0 rounded-[3rem] blur-xl -z-10"></div>
                  
                  {/* Title Section */}
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1 text-[#10b981] font-black text-xs uppercase tracking-widest">
                      <Activity className="w-4 h-4" /> Activités Récentes
                    </div>
                    <h3 className="text-2xl font-black text-[#0f172a]">Services Populaires</h3>
                  </div>

                  {/* Legalisation Card */}
                  <div 
                    onClick={() => { setActiveFeature('legalisation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="group flex items-center gap-5 bg-white/90 backdrop-blur-xl p-5 rounded-[2rem] border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer hover:shadow-2xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 w-[85%] transform -rotate-2 hover:rotate-0 relative z-10"
                  >
                    <div className="w-14 h-14 bg-[#f8f4e6] group-hover:bg-emerald-50 text-[#064e3b] group-hover:text-[#10b981] rounded-2xl flex items-center justify-center transition-colors shadow-sm">
                      <Shield className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-lg text-[#0f172a] group-hover:text-[#10b981] transition-colors">Légalisation</h4>
                      <p className="text-sm font-medium text-gray-500">Signature et copie conforme</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-[#10b981] group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Request Vehicle Card (Offset to the right) */}
                  <div 
                    onClick={() => { setActiveFeature('request-vehicle'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="group flex items-center gap-5 bg-white/90 backdrop-blur-xl p-5 rounded-[2rem] border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer hover:shadow-2xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 w-[85%] self-end transform rotate-2 hover:rotate-0 relative z-20"
                  >
                    <div className="w-14 h-14 bg-[#f8f4e6] group-hover:bg-emerald-50 text-[#064e3b] group-hover:text-[#10b981] rounded-2xl flex items-center justify-center transition-colors shadow-sm">
                      <Truck className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-lg text-[#0f172a] group-hover:text-[#10b981] transition-colors">Véhicules</h4>
                      <p className="text-sm font-medium text-gray-500">Ambulance et funéraire</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-[#10b981] group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Raccordement Card */}
                  <div 
                    onClick={() => { setActiveFeature('authorization'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="group flex items-center gap-5 bg-gradient-to-r from-[#0f172a] to-[#064e3b] p-5 rounded-[2rem] border border-[#0f172a] shadow-[0_20px_40px_-15px_rgba(6,78,59,0.3)] cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-[85%] transform -rotate-1 hover:rotate-0 relative z-30"
                  >
                    <div className="w-14 h-14 bg-white/10 text-emerald-400 rounded-2xl flex items-center justify-center shadow-inner">
                      <Zap className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-lg text-white group-hover:text-emerald-300 transition-colors">Raccordements</h4>
                      <p className="text-sm font-medium text-emerald-100/70">Eau et électricité</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-white/50 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Common Services - Beautiful Masonry-like Grid */}
            <div id="services" className="max-w-6xl mx-auto w-full mb-32 pt-24 -mt-20">
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

            {/* About Us Section */}
            <div id="about" className="max-w-6xl mx-auto w-full mb-32 pt-24 -mt-20">
              <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-[3rem] p-10 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#10b981]/10 rounded-full blur-[80px]"></div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl font-black text-[#0f172a] mb-6 flex items-center gap-4">
                      <span className="w-3 h-10 bg-gradient-to-b from-[#10b981] to-[#064e3b] rounded-full inline-block"></span>
                      À Propos de Nouirat
                    </h2>
                    <p className="text-gray-500 font-medium leading-relaxed mb-6 text-lg">
                      La Commune de Nouirat s'engage à offrir à ses citoyens un service public moderne, efficace et transparent. Notre portail digital est conçu pour vous faire gagner du temps et vous rapprocher de votre administration.
                    </p>
                    <p className="text-gray-500 font-medium leading-relaxed text-lg">
                      Nous travaillons constamment à l'amélioration de notre infrastructure numérique pour répondre à l'ensemble de vos besoins administratifs depuis le confort de votre foyer.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#f8f4e6] p-6 rounded-3xl text-center">
                      <h4 className="text-3xl font-black text-[#0f172a] mb-2">100%</h4>
                      <p className="font-bold text-[#10b981]">Digital</p>
                    </div>
                    <div className="bg-[#f8f4e6] p-6 rounded-3xl text-center">
                      <h4 className="text-3xl font-black text-[#0f172a] mb-2">24/7</h4>
                      <p className="font-bold text-[#10b981]">Disponibilité</p>
                    </div>
                    <div className="bg-[#f8f4e6] p-6 rounded-3xl text-center col-span-2">
                      <h4 className="text-3xl font-black text-[#0f172a] mb-2">Sécurité</h4>
                      <p className="font-bold text-[#10b981]">Données Protégées</p>
                    </div>
                  </div>
                </div>

                {/* Media & Location */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  {/* Image Area */}
                  <div className="bg-gray-50 rounded-3xl h-64 md:h-80 w-full overflow-hidden border border-gray-200 shadow-inner group relative">
                    <img 
                      src="/commune.jpg" 
                      alt="Commune Nouirat" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Google Map */}
                  <div className="bg-gray-100 rounded-3xl h-64 md:h-80 w-full overflow-hidden border border-gray-200 shadow-inner relative group">
                    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm text-sm font-bold text-[#0f172a] flex items-center gap-2 pointer-events-none">
                      <MapPinIcon className="w-4 h-4 text-[#10b981]" /> Localisation
                    </div>
                    <iframe 
                      src="https://maps.google.com/maps?q=34.597955,-5.962378&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 w-full h-full grayscale-[0.2] contrast-[1.1] group-hover:grayscale-0 transition-all duration-500"
                    ></iframe>
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
    <div className="min-h-screen bg-[#f8f4e6] flex flex-col font-sans relative overflow-x-hidden">
      {/* Background ambient blobs */}
      <div className="fixed top-[-10%] left-[20%] w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-teal-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Top Navbar */}
      <header className={`fixed top-0 w-full h-[72px] flex justify-between items-center px-4 md:px-8 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 shadow-lg' 
          : 'bg-white/80 backdrop-blur-xl border-b border-white shadow-sm'
      }`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveFeature('lobby')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#064e3b] to-[#10b981] flex items-center justify-center shadow-lg shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-[#fdfbf7] font-black text-xl font-serif tracking-tighter">JN</span>
          </div>
          <span className={`text-xl font-black tracking-tight transition-colors ${
            isScrolled ? 'text-white group-hover:text-[#10b981]' : 'text-[#0f172a] group-hover:text-[#10b981]'
          }`}>
            Jama3a Nouirat
          </span>
        </div>

        {/* Centered Navigation Links */}
        <nav className={`hidden md:flex items-center gap-6 font-bold px-6 py-2 rounded-full border shadow-sm text-sm transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/10 border-white/10 text-gray-300' 
            : 'bg-[#fdfbf7] border-gray-200/50 text-gray-500'
        }`}>
          <button onClick={() => {
            setActiveFeature('lobby');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} className={`hover:text-[#10b981] transition-colors ${activeFeature === 'lobby' ? 'text-[#10b981]' : ''}`}>Accueil</button>
          <a href="#services" onClick={(e) => {
            e.preventDefault();
            if (activeFeature !== 'lobby') {
              setActiveFeature('lobby');
              setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 100);
            } else {
              document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
            }
          }} className="hover:text-[#10b981] transition-colors">Services</a>
          <a href="#about" onClick={(e) => {
            e.preventDefault();
            if (activeFeature !== 'lobby') {
              setActiveFeature('lobby');
              setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100);
            } else {
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }
          }} className="hover:text-[#10b981] transition-colors">À Propos</a>
        </nav>

        {/* Sidebar Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className={`px-4 py-2.5 rounded-xl shadow-sm transition-all z-50 flex items-center gap-2 font-bold group text-sm ${
            isScrolled
              ? 'bg-white text-[#0f172a] hover:bg-gray-100'
              : 'bg-[#0f172a] text-white hover:bg-[#1e293b]'
          }`}
        >
          <span className="hidden sm:block">Mon Espace</span>
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            isScrolled
              ? 'bg-[#0f172a]/10 group-hover:bg-[#10b981] group-hover:text-white'
              : 'bg-white/10 group-hover:bg-[#10b981]'
          }`}>
             <Menu className="w-4 h-4" />
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
      <main className="flex-1 w-full relative z-10 transition-all duration-300 pt-[72px]">
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
