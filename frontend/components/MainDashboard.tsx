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
import Sidebar from './Sidebar';
import StaffDashboard from './features/StaffDashboard';
import Settings from './features/Settings';
import VehicleRequest from './VehicleRequest';
import LegalisationRequest from './LegalisationRequest';
import AdministrativeAttestationRequest from './AdministrativeAttestationRequest';
import CivilStatusRequest from './CivilStatusRequest';
import DriverMissions from './DriverMissions';
import TrackRequests from './TrackRequests';
import AuthorizationServices from './AuthorizationServices';

interface MainDashboardProps {
  onLogout: () => void;
  userRole: string;
}

const services = [
  {
    id: 'request-vehicle',
    title: 'Request Vehicule',
    eyebrow: 'Ambulance / funeraire',
    text: 'Book an ambulance or funeral vehicle with mission tracking.',
    icon: Truck,
    tone: 'bg-emerald-600 text-white',
    soft: 'bg-emerald-50 text-emerald-700',
    accent: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'authorization',
    title: 'Raccordements',
    eyebrow: 'Water / electricity',
    text: 'Send water and electricity connection authorization requests.',
    icon: Zap,
    tone: 'bg-amber-500 text-slate-950',
    soft: 'bg-amber-50 text-amber-700',
    accent: 'from-amber-400 to-orange-600'
  },
  {
    id: 'legalisation',
    title: 'Legalisation',
    eyebrow: 'Signature / copy',
    text: 'Upload documents for signatures and certified copies.',
    icon: ShieldCheck,
    tone: 'bg-rose-600 text-white',
    soft: 'bg-rose-50 text-rose-700',
    accent: 'from-rose-500 to-red-700'
  },
  {
    id: 'administrative-attestation',
    title: 'Attestation administrative',
    eyebrow: 'Property documents',
    text: 'Submit the documents needed for administrative attestations.',
    icon: FileCheck2,
    tone: 'bg-cyan-600 text-white',
    soft: 'bg-cyan-50 text-cyan-700',
    accent: 'from-cyan-500 to-blue-700'
  },
  {
    id: 'civil-status',
    title: 'Etat civil',
    eyebrow: 'Birth / death / family',
    text: 'Handle civil status requests and family book documents.',
    icon: BookOpenCheck,
    tone: 'bg-slate-900 text-white',
    soft: 'bg-slate-100 text-slate-700',
    accent: 'from-slate-700 to-slate-950'
  },
  {
    id: 'track-requests',
    title: 'Suivi des demandes',
    eyebrow: 'Tracking',
    text: 'Check the status of the requests you already submitted.',
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
  const [activeFeature, setActiveFeature] = useState(isDriverOnly ? 'driver-missions' : 'lobby');
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
          <StaffDashboard />
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
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#063f35] text-lg font-black text-white shadow-lg shadow-emerald-900/20">JN</span>
            <span className="text-left">
              <span className="block text-base font-black leading-tight text-slate-950">Jama3a Nouirat</span>
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
        <aside className={`absolute right-0 top-0 h-full w-[24rem] max-w-full transform bg-slate-950 shadow-2xl transition duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex h-18 items-center justify-between border-b border-white/10 px-5">
            <div>
              <p className="text-lg font-black text-white">Navigation</p>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Services Nouirat</p>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/15">
              <X className="h-5 w-5" />
            </button>
          </div>
          <Sidebar activeFeature={activeFeature} setActiveFeature={goTo} onLogout={onLogout} userRole={userRole} />
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
  return (
    <div className="animate-fade-in-up">
      <section className="relative min-h-[calc(100vh-72px)] overflow-hidden">
        <img src="/commune-nouirat-hero-framed.jpg" alt="Commune de Nouirat" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/18 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-slate-950/72 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-end px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-xl text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-black backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Portail public de Nouirat
            </div>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
              Services communaux, simples et accessibles.
            </h1>
            <p className="mt-4 max-w-lg text-sm font-semibold leading-6 text-emerald-50">
              La photo reste visible, les demarches restent proches: demandes, suivi et services citoyens depuis un seul espace.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex h-13 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 text-sm font-black text-white shadow-xl shadow-emerald-950/30 transition hover:bg-emerald-400">
                Explorer les services
                <ArrowRight className="h-5 w-5" />
              </button>
              <button onClick={() => goTo('track-requests')} className="inline-flex h-13 items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/10 px-6 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/15">
                Suivre une demande
                <CalendarClock className="h-5 w-5" />
              </button>
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
                      <span className={`rounded-lg px-4 py-2 text-xs font-black ${service.tone}`}>Open service</span>
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

      <section className="bg-[#f5f7ef] py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-700">Pourquoi ce portail</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Une experience plus simple pour les citoyens et les agents.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric icon={BadgeCheck} value="100%" label="Demarches structurees" />
            <Metric icon={Stethoscope} value="0 DH" label="Cas urgents gratuits" />
            <Metric icon={LayoutDashboard} value="Live" label="Suivi administratif" />
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
              <ContactLine icon={Phone} text="+212 5 XX XX XX XX" />
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

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm font-bold text-slate-500">
        © 2026 Commune de Nouirat. Tous droits reserves.
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
