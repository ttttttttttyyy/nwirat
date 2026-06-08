import React, { useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CalendarClock,
  FileCheck2,
  FileText,
  LayoutDashboard,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Truck,
  X,
  Zap
} from 'lucide-react';
import Sidebar from '../ui components/Sidebar';
import StaffDashboard from '../ui components/StaffDashboard';
import Settings from '../ui components/Settings';
import VehicleRequest from './VehicleRequuest/VehicleRequest';
import LegalisationRequest from './Legalisation/LegalisationRequest';
import AdministrativeAttestationRequest from './AdministrativeAttestationRequest/AdministrativeAttestationRequest';
import CivilStatusRequest from './CivilStatusRequest/CivilStatusRequest';
import DriverMissions from './DriverMissions/DriverMissions';
import TrackRequests from './trackRequests/TrackRequests';
import AuthorizationServices from './Raccordments/AuthorizationServices';

interface MainDashboardProps {
  onLogout: () => void;
  userRole: string;
}

const services = [
  {
    id: 'request-vehicle',
    title: 'Demande de Véhicule',
    eyebrow: 'Ambulance / funéraire',
    text: 'Réservez une ambulance ou un véhicule funéraire avec suivi de mission.',
    icon: Truck,
    tone: 'bg-emerald-600 text-white',
    soft: 'bg-emerald-50 text-emerald-700',
    accent: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'authorization',
    title: 'Raccordements',
    eyebrow: 'Eau / électricité',
    text: 'Soumettez vos demandes d\'autorisation de raccordement en eau et électricité.',
    icon: Zap,
    tone: 'bg-amber-500 text-slate-950',
    soft: 'bg-amber-50 text-amber-700',
    accent: 'from-amber-400 to-orange-600'
  },
  {
    id: 'legalisation',
    title: 'Légalisation',
    eyebrow: 'Signature / copie certifiée',
    text: 'Déposez vos documents pour légalisation de signature ou copie certifiée conforme.',
    icon: ShieldCheck,
    tone: 'bg-rose-600 text-white',
    soft: 'bg-rose-50 text-rose-700',
    accent: 'from-rose-500 to-red-700'
  },
  {
    id: 'administrative-attestation',
    title: 'Attestation administrative',
    eyebrow: 'Documents de propriété',
    text: 'Soumettez les pièces requises pour l\'obtention d\'attestations administratives.',
    icon: FileCheck2,
    tone: 'bg-cyan-600 text-white',
    soft: 'bg-cyan-50 text-cyan-700',
    accent: 'from-cyan-500 to-blue-700'
  },
  {
    id: 'civil-status',
    title: 'État civil',
    eyebrow: 'Naissance / décès / famille',
    text: 'Gérez vos demandes de fiches individuelles et documents de livret de famille.',
    icon: BookOpenCheck,
    tone: 'bg-slate-900 text-white',
    soft: 'bg-slate-100 text-slate-700',
    accent: 'from-slate-700 to-slate-950'
  },
  {
    id: 'track-requests',
    title: 'Suivi des demandes',
    eyebrow: 'Suivi en direct',
    text: 'Consultez en temps réel le statut des demandes que vous avez déjà soumises.',
    icon: CalendarClock,
    tone: 'bg-teal-600 text-white',
    soft: 'bg-teal-50 text-teal-700',
    accent: 'from-teal-500 to-emerald-800'
  }
];

export default function MainDashboard({ onLogout, userRole }: MainDashboardProps) {
  const tokenInfo = useMemo(() => {
    try {
      const token = localStorage.getItem('token');
      return token ? jwtDecode<any>(token) : {};
    } catch {
      return {};
    }
  }, []);

  const normalizedRole = (userRole || tokenInfo.role || '').replace('ROLE_', '');
  const isDriverOnly = normalizedRole === 'DRIVER' || tokenInfo.servicePermissions === 'DRIVER';
  const [activeFeature, setActiveFeature] = useState('lobby');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const goTo = (feature: string) => {
    setActiveFeature(feature);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderFeature = () => {
    switch (activeFeature) {
      case 'lobby':
        return <HomeLobby goTo={goTo} />;
      case 'dashboard':
        return normalizedRole === 'ADMIN' || normalizedRole === 'AGENT' ? (
          <StaffDashboard onLogout={onLogout} />
        ) : (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-8 text-center font-bold text-rose-700">
            Acces refuse. Vous n'avez pas l'autorisation de voir ce tableau de bord.
          </div>
        );
      case 'request-vehicle':
        return <VehicleRequest />;
      case 'legalisation':
        return <LegalisationRequest />;
      case 'administrative-attestation':
        return <AdministrativeAttestationRequest />;
      case 'civil-status':
        return <CivilStatusRequest />;
      case 'track-requests':
        return <TrackRequests />;
      case 'driver-missions':
        return <DriverMissions />;
      case 'authorization':
        return <AuthorizationServices />;
      case 'settings':
        return <Settings />;
      default:
        return <HomeLobby goTo={goTo} />;
    }
  };

  const isLobby = activeFeature === 'lobby';
  const isDashboard = activeFeature === 'dashboard';

  return (
    <div className="min-h-screen bg-[#f5f7ef] font-sans text-slate-950">
      <header className="fixed top-0 z-40 w-full border-b border-white/30 bg-white/85 px-4 backdrop-blur-xl">
        <div className="relative flex h-18 w-full items-center gap-4">
          <button onClick={() => goTo('lobby')} className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-11 w-11 object-contain" />
            <span className="text-left">
              <span className="block text-base font-black leading-tight text-slate-950">Commune de Nouirat</span>
              <span className="block text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Portail citoyen</span>
            </span>
          </button>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-sm font-black text-slate-600 shadow-sm md:flex">
            <button onClick={() => goTo('lobby')} className={`rounded-md px-4 py-2 transition ${isLobby ? 'bg-[#063f35] text-white' : 'hover:bg-slate-100'}`}>Accueil</button>
            <button onClick={() => isLobby ? document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }) : goTo('lobby')} className="rounded-md px-4 py-2 transition hover:bg-slate-100">Services</button>
            <button onClick={() => isLobby ? document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) : goTo('lobby')} className="rounded-md px-4 py-2 transition hover:bg-slate-100">Contact</button>
          </nav>

          <button onClick={() => setIsSidebarOpen(true)} className="ml-auto inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-950/15 transition hover:bg-emerald-800">
            <span className="hidden sm:inline">Mon espace</span>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 z-50 transition ${isSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        <aside className={`absolute right-0 top-0 h-full w-[24rem] max-w-full transform bg-slate-950 shadow-2xl transition duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col overflow-hidden`}>
          <div className="flex h-18 shrink-0 items-center justify-between border-b border-white/10 px-5">
            <div>
              <p className="text-lg font-black text-white">Navigation</p>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Services Nouirat</p>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/15">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <Sidebar activeFeature={activeFeature} setActiveFeature={goTo} onLogout={onLogout} userRole={userRole} />
          </div>
        </aside>
      </div>

      <main className="pt-18">
        {isDashboard ? (
          <div>{renderFeature()}</div>
        ) : isLobby ? (
          renderFeature()
        ) : (
          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-slate-950/5 sm:p-6 lg:p-8">
              {renderFeature()}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function HomeLobby({ goTo }: { goTo: (feature: string) => void }) {
  const [quickTrackId, setQuickTrackId] = useState('');

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      localStorage.setItem('search_request_id', quickTrackId.trim());
      goTo('track-requests');
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Dynamic Creative Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#021814] via-[#05322a] to-[#0c1a17] py-16 sm:py-24 lg:py-28 text-white border-b border-emerald-950/30">
        
        {/* Ambient background glow points */}
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#053a31_1px,transparent_1px),linear-gradient(to_bottom,#053a31_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Column: Creative Title, Action Hub */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Premium Eyebrow Badge */}
              <div className="inline-flex self-start items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-1.5 text-xs font-bold text-emerald-300 backdrop-blur-md mb-6 shadow-inner shadow-emerald-500/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Portail Public de la Commune
              </div>
              
              {/* Creative Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight">
                L'Administration Locale <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent drop-shadow-sm">
                  Simplifiée & Digitale
                </span>
              </h1>
              
              {/* Paragraph Description */}
              <p className="mt-6 max-w-xl text-base sm:text-lg font-medium leading-relaxed text-emerald-100/80">
                Fini les files d'attente. Soumettez vos documents d'état civil, demandez un raccordement, ou suivez vos requêtes en temps réel de chez vous.
              </p>
              
              {/* Interactive Quick-Track Hub */}
              <div className="mt-8 max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl shadow-black/20">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-3">
                  Suivi instantané de votre dossier
                </h3>
                <form onSubmit={handleQuickTrack} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="Entrez le code de votre demande (ex: NOU-3482)..." 
                      value={quickTrackId}
                      onChange={(e) => setQuickTrackId(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-white/20 bg-black/20 text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="h-12 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-black transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Rechercher</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
                
                {/* Popular Services Quick-launch tags */}
                <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs text-slate-300">
                  <span className="font-bold text-slate-400">Services rapides :</span>
                  <button onClick={() => goTo('request-vehicle')} className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 transition font-semibold text-emerald-200 cursor-pointer">
                    🚑 Ambulance
                  </button>
                  <button onClick={() => goTo('legalisation')} className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 transition font-semibold text-rose-200 cursor-pointer">
                    ✍️ Légalisation
                  </button>
                  <button onClick={() => goTo('authorization')} className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 transition font-semibold text-amber-200 cursor-pointer">
                    ⚡ Raccordement
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Column: Creative Multi-layered Collage */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none">
                
                {/* Floating blur backdrops */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
                
                {/* Main photograph card */}
                <div className="relative z-10 overflow-hidden rounded-3xl border border-white/20 bg-slate-900 shadow-2xl p-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm group transition-all duration-500 hover:-translate-y-1">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/5">
                    <img 
                      src="/commune-nouirat-hero-framed.png" 
                      alt="Commune de Nouirat" 
                      className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
                    />
                  </div>
                  {/* Title card overlay inside photo card */}
                  <div className="p-4 flex items-center justify-between text-white">
                    <div>
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Commune de Nouirat</p>
                      <h4 className="text-lg font-black mt-0.5">Hôtel de Ville & Territoire</h4>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white shadow-md">
                      <MapPin className="h-5 w-5 text-emerald-300" />
                    </span>
                  </div>
                </div>
                
                {/* Creative Floating Glass Badge 1: Top Left - Connection status */}
                <div className="absolute -top-6 -left-6 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/80 p-4 shadow-xl backdrop-blur-lg animate-bounce" style={{ animationDuration: '6s' }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 leading-none">Guichet Unique</p>
                    <p className="text-sm font-black text-white mt-1 leading-none">100% Sécurisé</p>
                  </div>
                </div>
                
                {/* Creative Floating Glass Badge 2: Bottom Right - Stat badge */}
                <div className="absolute -bottom-6 -right-6 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/80 p-4 shadow-xl backdrop-blur-lg animate-bounce" style={{ animationDuration: '8s' }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 leading-none">Traitement</p>
                    <p className="text-sm font-black text-white mt-1 leading-none">24h - 48h Moyenne</p>
                  </div>
                </div>
                
              </div>
            </div>
            
          </div>
        </div>
      </section>

      <section id="services" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Services essentiels</p>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Choisissez votre demarche</h2>
            </div>
            <p className="max-w-xl text-sm font-semibold leading-6 text-slate-500">
              Chaque service garde son formulaire, ses documents et son suivi. L'accueil sert juste de hub clair et beau.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <button key={service.id} onClick={() => goTo(service.id)} className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-slate-950/10">
                  <div className={`h-2 bg-gradient-to-r ${service.accent}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <span className={`flex h-13 w-13 items-center justify-center rounded-xl ${service.soft}`}>
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-400">0{index + 1}</span>
                    </div>
                    <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{service.eyebrow}</p>
                    <h3 className="mt-2 text-2xl font-black text-slate-950">{service.title}</h3>
                    <p className="mt-3 min-h-12 text-sm font-semibold leading-6 text-slate-500">{service.text}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className={`rounded-lg px-4 py-2 text-xs font-black ${service.tone}`}>Accéder au service</span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition group-hover:bg-emerald-600 group-hover:text-white">
                        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-[#f2f4ec] to-[#f8faf5] py-20 sm:py-24 border-y border-slate-200/50">
        {/* Decorative background blobs */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Column: Expanded Details & Vision */}
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-800 tracking-wide uppercase">
                Pourquoi ce portail ?
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-950 leading-tight">
                Une administration moderne, transparente & proche de vous.
              </h2>
              <p className="mt-6 text-base font-semibold leading-relaxed text-slate-600">
                Le Portail Citoyen de la Commune de Nouirat a été conçu pour simplifier vos relations avec l'administration locale. En numérisant nos services clés, nous éliminons le besoin de déplacements physiques et accélérons les délais de traitement.
              </p>
              
              {/* Feature Points list */}
              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-none flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-md">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-950">Disponibilité continue (24/7)</h4>
                    <p className="mt-1 text-sm font-semibold text-slate-500 leading-normal">
                      Soumettez vos demandes d'état civil ou vos requêtes administratives à tout moment, depuis votre ordinateur ou votre smartphone.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-none flex h-10 w-10 items-center justify-center rounded-lg bg-rose-600 text-white shadow-md">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-950">Prise en charge sociale garantie</h4>
                    <p className="mt-1 text-sm font-semibold text-slate-500 leading-normal">
                      Le transport d'urgence en ambulance ou le service funéraire pour les cas critiques est garanti à titre entièrement gratuit.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-none flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-slate-950 shadow-md">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-950">Zéro intermédiaire, transparence totale</h4>
                    <p className="mt-1 text-sm font-semibold text-slate-500 leading-normal">
                      Suivez l'état d'avancement de votre dossier en direct et communiquez directement avec les agents responsables.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Premium Metric Cards */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              
              {/* Card 1: Formulaires Structurés */}
              <div className="group rounded-2xl border-l-4 border-emerald-500 border-y border-r border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-emerald-700">Démarches en ligne</p>
                    <h3 className="text-xl font-black text-slate-950 mt-1">100% Numérisé</h3>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <BadgeCheck className="h-6 w-6" />
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-500">
                  Des formulaires dynamiques conçus pour guider l'utilisateur. Nous vérifions les pièces obligatoires pour éliminer les retours de dossiers incomplets.
                </p>
              </div>

              {/* Card 2: Social Solidarity */}
              <div className="group rounded-2xl border-l-4 border-rose-500 border-y border-r border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-rose-700">Solidarité communale</p>
                    <h3 className="text-xl font-black text-slate-950 mt-1">Frais d'urgence à 0 DH</h3>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
                    <Stethoscope className="h-6 w-6" />
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-500">
                  La santé et l'accompagnement des familles en difficulté restent notre priorité. Toutes les demandes urgentes de logistique médicale sont traitées gratuitement.
                </p>
              </div>

              {/* Card 3: Suivi en Direct */}
              <div className="group rounded-2xl border-l-4 border-amber-500 border-y border-r border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-amber-700">Traçabilité</p>
                    <h3 className="text-xl font-black text-slate-950 mt-1">Suivi en direct ("Live")</h3>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <LayoutDashboard className="h-6 w-6" />
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-500">
                  Suivez votre demande depuis son dépôt, sa validation par le secrétariat, l'attribution aux chauffeurs ou agents, jusqu'à la signature finale.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Contact</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight">Commune de Nouirat</h2>
            <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-slate-300">
              Un point d'entree clair pour vos services publics. Le portail reste connecte aux agents pour le traitement et le suivi.
            </p>
            <div className="mt-8 space-y-4 text-sm font-bold text-slate-200">
              <ContactLine icon={MapPin} text="Siege de la Commune de Nouirat" />
              <ContactLine icon={Phone} text="+212 5 90 59 05 90" />
              <ContactLine icon={Mail} text="contact@nouirat.ma" />
            </div>
          </div>
          <div className="min-h-80 overflow-hidden rounded-lg border border-white/10 bg-white/5">
            <iframe
              src="https://maps.google.com/maps?q=34.597955,-5.962378&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 320 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-sm font-bold text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Commune de Nouirat. Tous droits reserves.</p>
          <div className="flex items-center gap-2 text-slate-600 hover:text-emerald-700 transition-colors">
            <Phone className="h-4.5 w-4.5" />
            <a href="tel:+212590590590" className="hover:underline text-sm font-black">+212 5 90 59 05 90</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
function Metric({ icon: Icon, value, label }: any) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="h-6 w-6 text-emerald-700" />
      <p className="mt-5 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-bold text-slate-500">{label}</p>
    </div>
  );
}

function ContactLine({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
        <Icon className="h-5 w-5" />
      </span>
      <span>{text}</span>
    </div>
  );
}
