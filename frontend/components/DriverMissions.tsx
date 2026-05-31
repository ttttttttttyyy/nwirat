import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Navigation, UserRound, Wallet } from 'lucide-react';
import axios from 'axios';

export default function DriverMissions() {
  const [missions, setMissions] = useState<any[]>([]);

  const fetchMissions = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:8080/api/requests/driver/my', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMissions(res.data);
  };

  useEffect(() => {
    fetchMissions().catch(console.error);
  }, []);

  const finishMission = async (missionId: number) => {
    const token = localStorage.getItem('token');
    await axios.patch(`http://localhost:8080/api/requests/driver/${missionId}/complete`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchMissions().catch(console.error);
  };

  return (
    <div className="min-h-screen bg-[#f8f4e6] p-6 font-sans">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#064e3b] to-[#10b981] p-8 text-white shadow-xl">
          <h1 className="text-4xl font-black">My Missions</h1>
          <p className="mt-2 font-semibold text-emerald-50">Assigned transport missions and patient details.</p>
        </div>

        <div className="mt-6 grid gap-5">
          {missions.map((mission) => (
            <div key={mission.id} className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">{mission.clientName}</h2>
                  <p className="mt-1 text-sm font-bold text-slate-500">{mission.clientPhone}</p>
                </div>
                <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-[#064e3b]">{mission.status}</span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Info icon={UserRound} label="Patient CIN" value={mission.clientCin || 'N/A'} />
                <Info icon={MapPin} label="Patient location" value={mission.gpsLocation || mission.pickupLocation} />
                <Info icon={Navigation} label="Drop off" value={mission.destination} />
                <Info icon={Calendar} label="Time" value={mission.scheduledDate || 'N/A'} />
                <Info icon={Wallet} label="Fee" value={`${mission.feeAmount ?? 0} DH`} />
                <Info icon={MapPin} label="Pick up" value={mission.pickupLocation} />
              </div>
              {['ACCEPTED', 'IN_PROGRESS'].includes(mission.status) && (
                <button onClick={() => finishMission(mission.id)} className="mt-5 h-12 w-full rounded-2xl bg-[#064e3b] font-black text-white shadow-lg shadow-emerald-900/15 hover:bg-[#065f46]">
                  Announce mission finished
                </button>
              )}
            </div>
          ))}
          {missions.length === 0 && <div className="rounded-[2rem] bg-white p-10 text-center font-bold text-slate-500">No missions assigned yet.</div>}
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-2xl bg-emerald-50/50 p-4">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-[#064e3b]" />
        <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      </div>
      <p className="mt-2 font-bold text-slate-800">{value}</p>
    </div>
  );
}
