import { Ambulance, CalendarDays, CheckCircle2, Car, Search, Truck, XCircle } from 'lucide-react';

type FleetSectionProps = {
  drivers: any[];
  vehicles: any[];
  driverForm: any;
  vehicleForm: any;
  driverEmailState: 'idle' | 'valid' | 'invalid';
  fleetSearch: string;
  fleetStatus: string;
  vehicleSearch: string;
  vehicleStatusFilter: string;
  scheduleDays: any[];
  setDriverForm: (value: any) => void;
  setVehicleForm: (value: any) => void;
  validateDriverEmail: (email: string) => void;
  saveDriver: () => void;
  saveVehicle: () => void;
  setFleetSearch: (value: string) => void;
  setFleetStatus: (value: string) => void;
  setVehicleSearch: (value: string) => void;
  setVehicleStatusFilter: (value: string) => void;
};

const statusClass = (status: string) => {
  if (status === 'AVAILABLE') return 'bg-emerald-50 text-emerald-700';
  if (status === 'ON_MISSION') return 'bg-amber-50 text-amber-700';
  if (status === 'BROKEN') return 'bg-rose-50 text-rose-700';
  return 'bg-slate-100 text-slate-600';
};

export default function FleetSection(props: FleetSectionProps) {
  const {
    drivers,
    vehicles,
    driverForm,
    vehicleForm,
    driverEmailState,
    fleetSearch,
    fleetStatus,
    vehicleSearch,
    vehicleStatusFilter,
    scheduleDays,
    setDriverForm,
    setVehicleForm,
    validateDriverEmail,
    saveDriver,
    saveVehicle,
    setFleetSearch,
    setFleetStatus,
    setVehicleSearch,
    setVehicleStatusFilter
  } = props;

  const visibleDrivers = drivers.filter((driver) => (fleetStatus === 'ALL' || driver.status === fleetStatus) && `${driver.name} ${driver.email} ${driver.phone}`.toLowerCase().includes(fleetSearch.toLowerCase()));
  const visibleVehicles = vehicles.filter((vehicle) => (vehicleStatusFilter === 'ALL' || vehicle.status === vehicleStatusFilter) && `${vehicle.plateNumber} ${vehicle.model} ${vehicle.type}`.toLowerCase().includes(vehicleSearch.toLowerCase()));
  const availableDrivers = drivers.filter((driver) => driver.status === 'AVAILABLE').length;
  const availableVehicles = vehicles.filter((vehicle) => vehicle.status === 'AVAILABLE').length;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-0 xl:grid-cols-[1fr_420px]">
          <div className="p-6 md:p-8">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#064e3b]">Opérations de la Flotte</span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Chauffeurs & Véhicules</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">Gérez les rôles des chauffeurs, la disponibilité des véhicules, la préparation des missions et le planning mensuel.</p>
          </div>
          <div className="grid grid-cols-2 border-t border-slate-100 bg-slate-50 md:grid-cols-4 xl:border-l xl:border-t-0">
            <div className="p-5"><Truck className="h-5 w-5 text-[#064e3b]" /><p className="mt-3 text-2xl font-black text-slate-950">{drivers.length}</p><p className="text-xs font-black uppercase text-slate-400">Chauffeurs</p></div>
            <div className="border-l border-slate-100 p-5"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><p className="mt-3 text-2xl font-black text-slate-950">{availableDrivers}</p><p className="text-xs font-black uppercase text-slate-400">Libres</p></div>
            <div className="border-l border-slate-100 p-5"><Ambulance className="h-5 w-5 text-[#064e3b]" /><p className="mt-3 text-2xl font-black text-slate-950">{vehicles.length}</p><p className="text-xs font-black uppercase text-slate-400">Véhicules</p></div>
            <div className="border-l border-slate-100 p-5"><Car className="h-5 w-5 text-emerald-600" /><p className="mt-3 text-2xl font-black text-slate-950">{availableVehicles}</p><p className="text-xs font-black uppercase text-slate-400">Prêts</p></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[#064e3b]"><Truck className="h-5 w-5" /></div><div><h2 className="text-xl font-black text-slate-950">Chauffeurs</h2><p className="text-sm font-semibold text-slate-500">Ajouter, modifier, rechercher et gérer les disponibilités.</p></div></div>
          </div>
          <div className="space-y-5 p-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={fleetSearch} onChange={(e) => setFleetSearch(e.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 pl-11 pr-4 text-sm font-semibold outline-none focus:border-emerald-300" placeholder="Rechercher des chauffeurs..." /></div>
              <select value={fleetStatus} onChange={(e) => setFleetStatus(e.target.value)} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm font-black text-slate-600">
                <option value="ALL">Tous</option>
                <option value="AVAILABLE">Disponible</option>
                <option value="ON_MISSION">En mission</option>
                <option value="UNAVAILABLE">Indisponible</option>
              </select>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-3 text-sm font-black uppercase tracking-widest text-slate-400">{driverForm.id ? 'Modifier le chauffeur' : 'Nouveau chauffeur'}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={driverForm.name} onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="Nom complet" />
                <div className="relative"><input value={driverForm.email || ''} onChange={(e) => validateDriverEmail(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-11 font-semibold" placeholder="Adresse email" />{driverEmailState === 'valid' && <CheckCircle2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600" />}{driverEmailState === 'invalid' && <XCircle className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-rose-600" />}</div>
                <input value={driverForm.phone} onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="Téléphone" />
                <input value={driverForm.cin} onChange={(e) => setDriverForm({ ...driverForm, cin: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="CIN" />
                <input value={driverForm.licenseNumber} onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="Numéro de permis" />
                <select value={driverForm.status || 'AVAILABLE'} onChange={(e) => setDriverForm({ ...driverForm, status: e.target.value, available: e.target.value === 'AVAILABLE' })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold">
                  <option value="AVAILABLE">Disponible</option>
                  <option value="ON_MISSION">En mission</option>
                  <option value="UNAVAILABLE">Indisponible</option>
                </select>
              </div>
              <button onClick={saveDriver} disabled={driverEmailState === 'invalid'} className="mt-4 rounded-2xl bg-[#064e3b] px-5 py-3 font-black text-white shadow-lg shadow-emerald-900/20 disabled:opacity-50">{driverForm.id ? 'Enregistrer' : 'Ajouter le Chauffeur'}</button>
            </div>

            <div className="grid gap-3">
              {visibleDrivers.map((driver) => (
                <div key={driver.id} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-950">{driver.name}</p>
                    <p className="truncate text-sm font-semibold text-slate-500">{driver.phone} - Permis: {driver.licenseNumber}</p>
                    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-black ${statusClass(driver.status)}`}>
                      {driver.status === 'AVAILABLE' ? 'Disponible' : driver.status === 'ON_MISSION' ? 'En mission' : driver.status === 'UNAVAILABLE' ? 'Indisponible' : driver.status}
                    </span>
                  </div>
                  <button onClick={() => setDriverForm(driver)} className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-black text-[#064e3b]">Modifier</button>
                </div>
              ))}
              {visibleDrivers.length === 0 && <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center font-bold text-slate-400">Aucun chauffeur trouvé.</div>}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[#064e3b]"><Ambulance className="h-5 w-5" /></div><div><h2 className="text-xl font-black text-slate-950">Véhicules</h2><p className="text-sm font-semibold text-slate-500">Ajouter, modifier, rechercher et gérer l'état.</p></div></div>
          </div>
          <div className="space-y-5 p-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={vehicleSearch} onChange={(e) => setVehicleSearch(e.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 pl-11 pr-4 text-sm font-semibold outline-none focus:border-emerald-300" placeholder="Rechercher des véhicules..." /></div>
              <select value={vehicleStatusFilter} onChange={(e) => setVehicleStatusFilter(e.target.value)} className="h-11 rounded-2xl border border-slate-200 px-4 text-sm font-black text-slate-600">
                <option value="ALL">Tous</option>
                <option value="AVAILABLE">Disponible</option>
                <option value="ON_MISSION">En mission</option>
                <option value="UNAVAILABLE">Indisponible</option>
                <option value="BROKEN">En panne</option>
              </select>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-3 text-sm font-black uppercase tracking-widest text-slate-400">{vehicleForm.id ? 'Modifier le véhicule' : 'Nouveau véhicule'}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={vehicleForm.plateNumber} onChange={(e) => setVehicleForm({ ...vehicleForm, plateNumber: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="Plaque d'immatriculation" />
                <input value={vehicleForm.model} onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="Modèle" />
                <select value={vehicleForm.type} onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold">
                  <option value="AMBULANCE">Ambulance</option>
                  <option value="FUNERAL_CAR">Véhicule funéraire</option>
                </select>
                <input value={vehicleForm.currentLocation} onChange={(e) => setVehicleForm({ ...vehicleForm, currentLocation: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="Localisation" />
                <select value={vehicleForm.status || 'AVAILABLE'} onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value, available: e.target.value === 'AVAILABLE' })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold">
                  <option value="AVAILABLE">Disponible</option>
                  <option value="ON_MISSION">En mission</option>
                  <option value="UNAVAILABLE">Indisponible</option>
                  <option value="BROKEN">En panne</option>
                </select>
              </div>
              <button onClick={saveVehicle} className="mt-4 rounded-2xl bg-[#064e3b] px-5 py-3 font-black text-white shadow-lg shadow-emerald-900/20">{vehicleForm.id ? 'Enregistrer' : 'Ajouter le Véhicule'}</button>
            </div>
            <div className="grid gap-3">
              {visibleVehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-950">{vehicle.plateNumber}</p>
                    <p className="truncate text-sm font-semibold text-slate-500">{vehicle.model} - {vehicle.type === 'AMBULANCE' ? 'Ambulance' : 'Véhicule funéraire'}</p>
                    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-black ${statusClass(vehicle.status)}`}>
                      {vehicle.status === 'AVAILABLE' ? 'Disponible' : vehicle.status === 'ON_MISSION' ? 'En mission' : vehicle.status === 'UNAVAILABLE' ? 'Indisponible' : vehicle.status === 'BROKEN' ? 'En panne' : vehicle.status}
                    </span>
                  </div>
                  <button onClick={() => setVehicleForm(vehicle)} className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-black text-[#064e3b]">Modifier</button>
                </div>
              ))}
              {visibleVehicles.length === 0 && <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center font-bold text-slate-400">Aucun véhicule trouvé.</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><h1 className="text-2xl font-black text-slate-950">Planning des missions</h1><p className="mt-1 text-sm font-semibold text-slate-500">Vue d'ensemble simplifiée sur les 30 prochains jours.</p></div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[#064e3b]"><CalendarDays className="h-4 w-4" /> Planning</span>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10">
          {scheduleDays.map((day) => (
            <div key={day.key} className={`relative overflow-hidden rounded-2xl border p-3 ${day.missions.length ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
              <div className={`absolute inset-x-0 top-0 h-1 ${day.missions.length ? 'bg-[#064e3b]' : 'bg-slate-200'}`} />
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">{day.weekday}</p>
                  <p className="text-sm font-black text-slate-950">{day.label}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-black ${day.missions.length ? 'bg-white text-[#064e3b]' : 'bg-white text-slate-400'}`}>{day.missions.length}</span>
              </div>
              <div className="mt-3">
                {day.missions.length ? (
                  <div className="rounded-xl bg-white px-2.5 py-2 shadow-sm">
                    <p className="truncate text-[11px] font-black text-slate-800">{day.missions[0].assignedDriverName || day.missions[0].user || 'Mission'}</p>
                    <p className="truncate text-[10px] font-semibold text-slate-500">{day.missions[0].assignedVehiclePlate || 'Aucun véhicule'}{day.missions.length > 1 ? ` +${day.missions.length - 1}` : ''}</p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-2.5 py-2 text-center text-[11px] font-black text-slate-400">Libre</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

