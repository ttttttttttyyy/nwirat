import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Ambulance,
  Bell,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Trash2,
  Users,
  X,
  XCircle,
  Zap
} from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const serviceNav = [
  { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'USERS', label: 'Users', icon: Users },
  { id: 'ADMINS', label: 'Manage Admin', icon: Settings },
  { id: 'FLEET', label: 'Drivers & Vehicles', icon: Ambulance },
  { id: 'VEH', label: 'Vehicules', icon: Ambulance },
  { id: 'AUT', label: 'Raccordements', icon: Zap },
  { id: 'LEG', label: 'Legalisation', icon: FileText },
  { id: 'ATT', label: 'Attestation', icon: Home },
  { id: 'EC', label: 'Etat Civil', icon: Users }
];

export default function StaffDashboard() {
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('DASHBOARD');
  const [sortTime, setSortTime] = useState('DESC');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [statsData, setStatsData] = useState({ total: 0, pending: 0, resolved: 0, rejected: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPermissions, setAdminPermissions] = useState<string[]>(['VEH']);
  const emptyDriverForm = { name: '', email: '', phone: '', cin: '', licenseNumber: '', available: true, status: 'AVAILABLE' };
  const emptyVehicleForm = { plateNumber: '', model: '', type: 'AMBULANCE', available: true, status: 'AVAILABLE', currentLocation: '' };
  const [driverForm, setDriverForm] = useState<any>(emptyDriverForm);
  const [vehicleForm, setVehicleForm] = useState<any>(emptyVehicleForm);
  const [adminEmailState, setAdminEmailState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [driverEmailState, setDriverEmailState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [fleetSearch, setFleetSearch] = useState('');
  const [fleetStatus, setFleetStatus] = useState('ALL');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState('ALL');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [assignModal, setAssignModal] = useState<any>({ open: false, request: null, driverId: '', vehicleId: '' });

  const tokenInfo = useMemo(() => {
    try {
      const token = localStorage.getItem('token');
      return token ? jwtDecode<any>(token) : {};
    } catch {
      return {};
    }
  }, []);
  const isMainAdmin = tokenInfo.role === 'ROLE_ADMIN';
  const allowedSections = isMainAdmin ? serviceNav.map((item) => item.id) : ['DASHBOARD', ...(tokenInfo.servicePermissions || '').split(',').filter(Boolean)];
  const visibleServiceNav = serviceNav.filter((item) => allowedSections.includes(item.id));

  const [rejectModal, setRejectModal] = useState({ open: false, requestId: '', type: 'VEH' });
  const [rejectReason, setRejectReason] = useState('');
  const [docModal, setDocModal] = useState({ open: false, url: '' });

  const fetchAllRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const [vehiclesRes, authsRes, legalsRes, attestationsRes, civilStatusRes] = await Promise.all([
        axios.get('http://localhost:8080/api/requests', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8080/api/authorizations', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8080/api/legalisation', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8080/api/administrative-attestations', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8080/api/civil-status', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const mappedVehicles = vehiclesRes.data.map((r: any) => ({
        id: `VEH-${r.id}`,
        realId: r.id,
        rawType: 'VEH',
        user: r.clientName,
        type: r.vehicleType === 'ambulance' ? 'Ambulance' : 'Vehicule Funeraire',
        serviceArea: r.serviceArea,
        medicalReason: r.medicalReason,
        feeAmount: r.feeAmount ?? 0,
        status: r.status || 'PENDING',
        time: r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A',
        timestamp: r.requestTime ? new Date(r.requestTime).getTime() : r.id,
        documentProof: r.documentProof
      }));

      const mappedAuths = authsRes.data.map((r: any) => ({
        id: `AUT-${r.id}`,
        realId: r.id,
        rawType: 'AUT',
        user: r.clientName,
        type: r.authorizationType === 'WATER' ? 'Eau Potable' : 'Electricite',
        status: r.status || 'PENDING',
        time: r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A',
        timestamp: r.requestTime ? new Date(r.requestTime).getTime() : r.id,
        documentProof: r.nationalIdCardProof || r.documentProof
      }));

      const mappedLegals = legalsRes.data.map((r: any) => ({
        id: `LEG-${r.id}`,
        realId: r.id,
        rawType: 'LEG',
        user: r.clientName,
        type: r.documentType === 'SIGNATURE' ? 'Legalisation de Signature' : 'Copie Conforme',
        status: r.status || 'PENDING',
        time: r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A',
        timestamp: r.requestTime ? new Date(r.requestTime).getTime() : r.id,
        documentProof: r.documentProof || r.originalDocumentProof || r.identityProof
      }));

      const mappedAttestations = attestationsRes.data.map((r: any) => ({
        id: `ATT-${r.id}`,
        realId: r.id,
        rawType: 'ATT',
        user: r.clientName,
        type: 'Attestation Administrative',
        status: r.status || 'PENDING',
        time: r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A',
        timestamp: r.requestTime ? new Date(r.requestTime).getTime() : r.id,
        documentProof: r.saleDonationSadaqaProof || r.ownershipCertificateProof,
        detail: r.propertyAddress
      }));

      const mappedCivilStatus = civilStatusRes.data.map((r: any) => ({
        id: `EC-${r.id}`,
        realId: r.id,
        rawType: 'EC',
        user: r.clientName,
        type: 'Etat Civil',
        status: r.status || 'PENDING',
        time: r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A',
        timestamp: r.requestTime ? new Date(r.requestTime).getTime() : r.id,
        documentProof: r.requiredDocumentsProof || r.medicalDeathCertificateProof || r.administrativeDeathCertificateProof || r.fullCopyOrBirthActProof || r.birthMedicalCertificateProof || r.marriageActProof || r.husbandCinProof || r.wifeCinProof || r.husbandFullCopyProof || r.wifeFullCopyProof || r.honorDeclarationProof || r.localAuthorityCertificateProof || r.divorceProof || r.previousPartnerDeathProof || r.judgeAuthorizationProof || r.photosProof,
        detail: `${r.requestType || 'Demande'} - ${r.feeAmount ?? 0} DH`
      }));

      const all = [...mappedVehicles, ...mappedAuths, ...mappedLegals, ...mappedAttestations, ...mappedCivilStatus];
      const pending = all.filter((r) => r.status === 'PENDING').length;
      const resolved = all.filter((r) => r.status === 'COMPLETED' || r.status === 'ACCEPTED').length;
      const rejected = all.filter((r) => r.status === 'REJECTED' || r.status === 'CANCELLED' || r.status === 'REFUSED').length;

      setStatsData({ total: all.length, pending, resolved, rejected });
      setRecentRequests(all);
    } catch (err) {
      console.error('Failed to fetch admin requests', err);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAdminData = async () => {
    const token = localStorage.getItem('token');
    if (['DASHBOARD', 'USERS', 'ADMINS'].includes(filterType)) {
      const usersRes = await axios.get('http://localhost:8080/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(usersRes.data);
    }
    if (filterType === 'DASHBOARD' || filterType === 'FLEET' || filterType === 'VEH') {
      const [driversRes, vehiclesRes] = await Promise.all([
        axios.get('http://localhost:8080/api/drivers', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8080/api/vehicles', { headers: { Authorization: `Bearer ${token}` } })
      ]);
    setDrivers(driversRes.data);
    setVehicles(vehiclesRes.data);
    }
  };

  useEffect(() => {
    if (['DASHBOARD', 'USERS', 'ADMINS', 'FLEET', 'VEH'].includes(filterType)) {
      fetchAdminData().catch((err) => console.error(err));
    }
  }, [filterType]);

  const handleAccept = async (id: number, type: string) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'VEH' ? `/api/requests/${id}/status` : type === 'AUT' ? `/api/authorizations/${id}/status` : type === 'ATT' ? `/api/administrative-attestations/${id}/status` : type === 'EC' ? `/api/civil-status/${id}/status` : `/api/legalisation/${id}/status`;
      await axios.patch(`http://localhost:8080${endpoint}?status=ACCEPTED`, null, { headers: { Authorization: `Bearer ${token}` }});
      fetchAllRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const submitReject = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = rejectModal.type === 'VEH' ? `/api/requests/${rejectModal.requestId}/status` : rejectModal.type === 'AUT' ? `/api/authorizations/${rejectModal.requestId}/status` : rejectModal.type === 'ATT' ? `/api/administrative-attestations/${rejectModal.requestId}/status` : rejectModal.type === 'EC' ? `/api/civil-status/${rejectModal.requestId}/status` : `/api/legalisation/${rejectModal.requestId}/status`;
      await axios.patch(`http://localhost:8080${endpoint}?status=REJECTED&reason=${encodeURIComponent(rejectReason)}`, null, { headers: { Authorization: `Bearer ${token}` }});
      setRejectModal({ open: false, requestId: '', type: 'VEH' });
      setRejectReason('');
      fetchAllRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number, type: string) => {
    if (!window.confirm('Etes-vous sur de vouloir supprimer cette demande ?')) return;
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'VEH' ? `/api/requests/${id}` : type === 'AUT' ? `/api/authorizations/${id}` : type === 'ATT' ? `/api/administrative-attestations/${id}` : type === 'EC' ? `/api/civil-status/${id}` : `/api/legalisation/${id}`;
      await axios.delete(`http://localhost:8080${endpoint}`, { headers: { Authorization: `Bearer ${token}` }});
      fetchAllRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBan = async (user: any) => {
    const token = localStorage.getItem('token');
    await axios.patch(`http://localhost:8080/api/admin/users/${user.id}/ban?banned=${!user.banned}`, null, { headers: { Authorization: `Bearer ${token}` } });
    fetchAdminData();
  };

  const togglePermission = (permission: string) => {
    setAdminPermissions((current) => current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission]);
  };

  const grantAdminAccess = async () => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:8080/api/admin/users/admin-access', { email: adminEmail, permissions: adminPermissions }, { headers: { Authorization: `Bearer ${token}` } });
    setAdminEmail('');
    fetchAdminData();
  };

  const loadAdminForEdit = (user: any) => {
    setAdminEmail(user.email);
    setAdminEmailState('valid');
    setAdminPermissions((user.servicePermissions || '').split(',').filter(Boolean));
  };

  const validateAdminEmail = (email: string) => {
    setAdminEmail(email);
    if (!email.trim()) {
      setAdminEmailState('idle');
      return;
    }
    setAdminEmailState(users.some((user) => user.email.toLowerCase() === email.toLowerCase()) ? 'valid' : 'invalid');
  };

  const grantDriverRole = async (email: string) => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:8080/api/admin/users/driver-role', { email, permissions: ['DRIVER'] }, { headers: { Authorization: `Bearer ${token}` } });
    fetchAdminData();
  };

  const removeAdminRole = async (email: string) => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:8080/api/admin/users/remove-admin', { email }, { headers: { Authorization: `Bearer ${token}` } });
    fetchAdminData();
  };

  const removeDriverRole = async (email: string) => {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:8080/api/admin/users/remove-driver', { email }, { headers: { Authorization: `Bearer ${token}` } });
    fetchAdminData();
  };

  const validateDriverEmail = (email: string) => {
    setDriverForm({ ...driverForm, email });
    if (!email.trim()) {
      setDriverEmailState('idle');
      return;
    }
    setDriverEmailState(users.some((user) => user.email.toLowerCase() === email.toLowerCase()) ? 'valid' : 'invalid');
  };

  const assignMission = async () => {
    const token = localStorage.getItem('token');
    await axios.patch(`http://localhost:8080/api/requests/${assignModal.request.realId}/assign?driverId=${assignModal.driverId}&vehicleId=${assignModal.vehicleId}`, null, { headers: { Authorization: `Bearer ${token}` } });
    setAssignModal({ open: false, request: null, driverId: '', vehicleId: '' });
    fetchAllRequests();
    fetchAdminData().catch(() => {});
  };

  const saveDriver = async () => {
    const token = localStorage.getItem('token');
    if (driverForm.id) {
      await axios.put(`http://localhost:8080/api/drivers/${driverForm.id}`, driverForm, { headers: { Authorization: `Bearer ${token}` } });
    } else {
      await axios.post('http://localhost:8080/api/drivers', driverForm, { headers: { Authorization: `Bearer ${token}` } });
    }
    setDriverForm(emptyDriverForm);
    fetchAdminData();
  };

  const saveVehicle = async () => {
    const token = localStorage.getItem('token');
    if (vehicleForm.id) {
      await axios.put(`http://localhost:8080/api/vehicles/${vehicleForm.id}`, vehicleForm, { headers: { Authorization: `Bearer ${token}` } });
    } else {
      await axios.post('http://localhost:8080/api/vehicles', vehicleForm, { headers: { Authorization: `Bearer ${token}` } });
    }
    setVehicleForm(emptyVehicleForm);
    fetchAdminData();
  };

  const translateStatus = (status: string) => {
    if (status === 'PENDING') return 'En attente';
    if (status === 'ACCEPTED') return 'Acceptee';
    if (status === 'REJECTED' || status === 'REFUSED') return 'Rejetee';
    if (status === 'COMPLETED') return 'Terminee';
    if (status === 'CANCELLED') return 'Annulee';
    if (status === 'IN_PROGRESS') return 'En cours';
    return status;
  };

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const rows = recentRequests.filter((req) => {
      if (!['DASHBOARD', 'USERS', 'ADMINS', 'FLEET'].includes(filterType) && req.rawType !== filterType) return false;
      if (filterStatus !== 'ALL') {
        if (filterStatus === 'REJECTED') {
          if (!['REJECTED', 'CANCELLED', 'REFUSED'].includes(req.status)) return false;
        } else if (req.status !== filterStatus) return false;
      }
      if (!query) return true;
      return [req.id, req.user, req.type, req.detail, req.status].filter(Boolean).join(' ').toLowerCase().includes(query);
    });
    rows.sort((a, b) => sortTime === 'DESC' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
    return rows;
  }, [filterStatus, filterType, recentRequests, searchQuery, sortTime]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRequests = filteredRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long' });
  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'ALL' || user.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = [
    { label: 'Total', value: statsData.total, percent: '+12%', band: 'bg-[#10b981]', badge: 'bg-emerald-50 text-emerald-700' },
    { label: 'En attente', value: statsData.pending, percent: '+8%', band: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700' },
    { label: 'Traitees', value: statsData.resolved, percent: '+24%', band: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700' },
    { label: 'Rejetees', value: statsData.rejected, percent: '-3%', band: 'bg-rose-500', badge: 'bg-rose-50 text-rose-700' }
  ];

  const serviceBreakdown = serviceNav
    .filter((item) => ['VEH', 'AUT', 'LEG', 'ATT', 'EC'].includes(item.id))
    .map((item) => ({
      ...item,
      count: recentRequests.filter((request) => request.rawType === item.id).length
    }));
  const maxServiceCount = Math.max(1, ...serviceBreakdown.map((item) => item.count));
  const acceptanceRate = statsData.total ? Math.round((statsData.resolved / statsData.total) * 100) : 0;
  const pendingRate = statsData.total ? Math.round((statsData.pending / statsData.total) * 100) : 0;
  const rejectedRate = statsData.total ? Math.round((statsData.rejected / statsData.total) * 100) : 0;
  const recentActivity = [...recentRequests].sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);
  const driverAvailability = {
    available: drivers.filter((driver) => driver.status === 'AVAILABLE' || driver.available).length,
    busy: drivers.filter((driver) => driver.status === 'ON_MISSION').length,
    unavailable: drivers.filter((driver) => driver.status === 'UNAVAILABLE').length
  };
  const vehicleAvailability = {
    available: vehicles.filter((vehicle) => vehicle.status === 'AVAILABLE' || vehicle.available).length,
    busy: vehicles.filter((vehicle) => vehicle.status === 'ON_MISSION').length,
    unavailable: vehicles.filter((vehicle) => ['UNAVAILABLE', 'BROKEN'].includes(vehicle.status)).length
  };
  const topService = serviceBreakdown.reduce((top, item) => item.count > top.count ? item : top, serviceBreakdown[0] || { label: 'No service', count: 0 });
  const activeStaff = users.filter((user) => !user.banned).length;
  const blockedUsers = users.filter((user) => user.banned).length;

  const activeFilters = [
    !['DASHBOARD', 'USERS', 'ADMINS', 'FLEET'].includes(filterType) ? { key: 'type', label: serviceNav.find((item) => item.id === filterType)?.label || filterType, clear: () => setFilterType('DASHBOARD') } : null,
    filterStatus !== 'ALL' ? { key: 'status', label: translateStatus(filterStatus), clear: () => setFilterStatus('ALL') } : null,
    searchQuery ? { key: 'search', label: searchQuery, clear: () => setSearchQuery('') } : null
  ].filter(Boolean) as Array<{ key: string; label: string; clear: () => void }>;

  const getStatusClasses = (status: string) => {
    if (status === 'ACCEPTED' || status === 'COMPLETED') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'REJECTED' || status === 'CANCELLED' || status === 'REFUSED') return 'bg-rose-50 text-rose-700 border-rose-200';
    if (status === 'IN_PROGRESS') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-[#064e3b] via-[#10b981] to-[#d1fae5] p-0 font-sans">
      <div className="flex min-h-[calc(100vh-72px)] overflow-hidden bg-white">
        <aside className={`hidden shrink-0 border-r border-emerald-100 bg-white px-3 py-5 transition-all duration-300 md:flex md:flex-col ${isSidebarExpanded ? 'w-72' : 'w-20'}`}>
          <div className={`mb-7 flex items-center gap-3 ${isSidebarExpanded ? 'justify-between' : 'justify-center'}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#064e3b] text-lg font-black text-white">JN</div>
              {isSidebarExpanded && <span className="text-lg font-black text-slate-950">Admin</span>}
            </div>
            {isSidebarExpanded && (
              <button onClick={() => setIsSidebarExpanded(false)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#064e3b] hover:bg-emerald-100" title="Fermer">
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
          </div>
          {!isSidebarExpanded && (
            <button onClick={() => setIsSidebarExpanded(true)} className="mb-5 flex h-9 w-full items-center justify-center rounded-xl bg-emerald-50 text-[#064e3b] hover:bg-emerald-100" title="Ouvrir">
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
          <nav className="flex flex-1 flex-col gap-2">
            {visibleServiceNav.map((item) => {
              const Icon = item.icon;
              const isActive = filterType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setFilterType(item.id); setPage(1); }}
                  className={`flex h-11 items-center rounded-2xl transition-colors ${isSidebarExpanded ? 'w-full justify-start gap-3 px-3' : 'w-11 justify-center'} ${isActive ? 'bg-[#064e3b] text-white shadow-lg shadow-emerald-900/15' : 'text-slate-500 hover:bg-emerald-50 hover:text-[#064e3b]'}`}
                  title={item.label}
                >
                  <Icon className="h-5 w-5" />
                  {isSidebarExpanded && <span className="text-sm font-black">{item.label}</span>}
                </button>
              );
            })}
          </nav>
          <button className={`flex h-11 items-center rounded-2xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 ${isSidebarExpanded ? 'w-full justify-start gap-3 px-3' : 'w-11 justify-center'}`} title="Logout">
            <LogOut className="h-5 w-5" />
            {isSidebarExpanded && <span className="text-sm font-black">Logout</span>}
          </button>
        </aside>

        <section className="min-w-0 flex-1 bg-[#f8f4e6]">
          <header className="flex flex-col gap-4 border-b border-slate-100 bg-white px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                placeholder="Search requests..."
              />
            </div>
            <p className="text-center text-sm font-black capitalize text-[#064e3b]">{today}</p>
            <div className="flex items-center justify-end gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50" title="Settings">
                <Settings className="h-5 w-5" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50" title="Notifications">
                <Bell className="h-5 w-5" />
              </button>
              <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-[#064e3b] to-[#10b981] p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-black text-[#064e3b]">AD</div>
              </div>
            </div>
          </header>

          <main className="space-y-6 p-5 lg:p-7">
            {filterType === 'DASHBOARD' ? (
              <div className="space-y-6">
                <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-[#064e3b] text-white shadow-xl shadow-emerald-950/10">
                  <div className="grid gap-6 p-6 lg:grid-cols-[1.45fr_0.8fr] lg:p-8">
                    <div className="flex min-h-[220px] flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-50">
                          <Activity className="h-4 w-4" />
                          Live command center
                        </div>
                        <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                          Commune operations dashboard
                        </h1>
                        <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-emerald-50/85">
                          Requests, citizens, drivers, and vehicles in one clean view so the team can see what needs action first.
                        </p>
                      </div>
                      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-3xl bg-white/10 p-4">
                          <p className="text-xs font-black uppercase text-emerald-100">Requests</p>
                          <p className="mt-2 text-3xl font-black">{statsData.total}</p>
                        </div>
                        <div className="rounded-3xl bg-white/10 p-4">
                          <p className="text-xs font-black uppercase text-emerald-100">Citizens</p>
                          <p className="mt-2 text-3xl font-black">{users.length}</p>
                        </div>
                        <div className="rounded-3xl bg-white/10 p-4">
                          <p className="text-xs font-black uppercase text-emerald-100">Drivers</p>
                          <p className="mt-2 text-3xl font-black">{drivers.length}</p>
                        </div>
                        <div className="rounded-3xl bg-white/10 p-4">
                          <p className="text-xs font-black uppercase text-emerald-100">Vehicles</p>
                          <p className="mt-2 text-3xl font-black">{vehicles.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] bg-white p-5 text-slate-950">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Resolution rate</p>
                          <p className="mt-2 text-5xl font-black text-[#064e3b]">{acceptanceRate}%</p>
                        </div>
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-[#064e3b]">
                          <CheckCircle2 className="h-8 w-8" />
                        </div>
                      </div>
                      <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-[#10b981]" style={{ width: `${acceptanceRate}%` }} />
                      </div>
                      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-2xl bg-emerald-50 p-3">
                          <p className="text-xl font-black text-emerald-700">{acceptanceRate}%</p>
                          <p className="text-[11px] font-black uppercase text-emerald-600">Done</p>
                        </div>
                        <div className="rounded-2xl bg-amber-50 p-3">
                          <p className="text-xl font-black text-amber-700">{pendingRate}%</p>
                          <p className="text-[11px] font-black uppercase text-amber-600">Pending</p>
                        </div>
                        <div className="rounded-2xl bg-rose-50 p-3">
                          <p className="text-xl font-black text-rose-700">{rejectedRate}%</p>
                          <p className="text-[11px] font-black uppercase text-rose-600">Rejected</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                      <div className={`h-2 ${stat.band}`} />
                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black uppercase tracking-wider text-slate-400">{stat.label}</p>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-black ${stat.badge}`}>{stat.percent}</span>
                        </div>
                        <p className="mt-4 text-4xl font-black text-slate-950">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-black text-slate-950">Service demand</h2>
                        <p className="mt-1 text-sm font-semibold text-slate-500">Requests by component.</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-[#064e3b]">Top: {topService.label}</span>
                    </div>
                    <div className="mt-6 space-y-5">
                      {serviceBreakdown.map((item) => {
                        const Icon = item.icon;
                        const width = Math.max(8, Math.round((item.count / maxServiceCount) * 100));
                        return (
                          <div key={item.id}>
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-[#064e3b]">
                                  <Icon className="h-5 w-5" />
                                </span>
                                <p className="font-black text-slate-800">{item.label}</p>
                              </div>
                              <p className="text-sm font-black text-slate-500">{item.count}</p>
                            </div>
                            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                              <div className="h-full rounded-full bg-[#10b981]" style={{ width: `${width}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-950">Operational focus</h2>
                    <div className="mt-5 grid gap-3">
                      <div className="rounded-3xl bg-amber-50 p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black uppercase text-amber-700">Needs review</p>
                            <p className="mt-2 text-3xl font-black text-slate-950">{statsData.pending}</p>
                          </div>
                          <Clock className="h-9 w-9 text-amber-600" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-3xl bg-emerald-50 p-5">
                          <p className="text-xs font-black uppercase text-emerald-700">Active users</p>
                          <p className="mt-2 text-3xl font-black text-slate-950">{activeStaff}</p>
                        </div>
                        <div className="rounded-3xl bg-rose-50 p-5">
                          <p className="text-xs font-black uppercase text-rose-700">Banned</p>
                          <p className="mt-2 text-3xl font-black text-slate-950">{blockedUsers}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setFilterType('VEH')} className="mt-2 flex h-12 items-center justify-center rounded-2xl bg-[#064e3b] text-sm font-black text-white">
                        Review vehicle requests
                      </button>
                    </div>
                  </section>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-950">Fleet readiness</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                      <div className="rounded-3xl border border-slate-100 p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="font-black text-slate-900">Drivers</p>
                          <Users className="h-5 w-5 text-[#064e3b]" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <span className="rounded-2xl bg-emerald-50 p-3 text-sm font-black text-emerald-700">{driverAvailability.available}<br />Ready</span>
                          <span className="rounded-2xl bg-sky-50 p-3 text-sm font-black text-sky-700">{driverAvailability.busy}<br />Mission</span>
                          <span className="rounded-2xl bg-rose-50 p-3 text-sm font-black text-rose-700">{driverAvailability.unavailable}<br />Off</span>
                        </div>
                      </div>
                      <div className="rounded-3xl border border-slate-100 p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="font-black text-slate-900">Vehicles</p>
                          <Ambulance className="h-5 w-5 text-[#064e3b]" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <span className="rounded-2xl bg-emerald-50 p-3 text-sm font-black text-emerald-700">{vehicleAvailability.available}<br />Ready</span>
                          <span className="rounded-2xl bg-sky-50 p-3 text-sm font-black text-sky-700">{vehicleAvailability.busy}<br />Mission</span>
                          <span className="rounded-2xl bg-rose-50 p-3 text-sm font-black text-rose-700">{vehicleAvailability.unavailable}<br />Off</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-black text-slate-950">Recent activity</h2>
                        <p className="mt-1 text-sm font-semibold text-slate-500">Latest submitted requests.</p>
                      </div>
                      <button type="button" onClick={() => setFilterType('VEH')} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-[#064e3b]">Open list</button>
                    </div>
                    <div className="mt-5 space-y-3">
                      {recentActivity.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm font-bold text-slate-400">No requests yet.</div>
                      ) : recentActivity.map((request) => (
                        <div key={request.id} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 p-4">
                          <div className="min-w-0">
                            <p className="truncate font-black text-slate-900">{request.type}</p>
                            <p className="truncate text-sm font-semibold text-slate-500">{request.user || 'Unknown citizen'} - {request.time}</p>
                          </div>
                          <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black ${getStatusClasses(request.status)}`}>{translateStatus(request.status)}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            ) : filterType === 'USERS' ? (
              <div className="space-y-5 rounded-[2rem] border border-emerald-100 bg-white p-6">
                <h1 className="text-3xl font-black text-slate-950">Users</h1>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="h-11 flex-1 rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-emerald-300" placeholder="Search users..." />
                  <select value={userRoleFilter} onChange={(e) => setUserRoleFilter(e.target.value)} className="h-11 rounded-2xl border border-slate-200 px-4 font-bold text-slate-600">
                    <option value="ALL">All roles</option>
                    <option value="ROLE_USER">Users</option>
                    <option value="ROLE_AGENT">Agents</option>
                    <option value="ROLE_ADMIN">Admins</option>
                    <option value="ROLE_DRIVER">Drivers</option>
                  </select>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-emerald-50 text-xs font-black uppercase text-[#064e3b]">
                      <tr><th className="px-5 py-4">Name</th><th className="px-5 py-4">Email</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-5 py-4 font-bold text-slate-900">{user.name}</td>
                          <td className="px-5 py-4 font-semibold text-slate-500">{user.email}</td>
                          <td className="px-5 py-4 font-semibold text-slate-500">{user.role}</td>
                          <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-black ${user.banned ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>{user.banned ? 'Banned' : 'Active'}</span></td>
                          <td className="px-5 py-4 text-right"><button onClick={() => toggleBan(user)} className={`rounded-xl px-4 py-2 text-sm font-black text-white ${user.banned ? 'bg-emerald-600' : 'bg-rose-600'}`}>{user.banned ? 'Unban' : 'Ban'}</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : filterType === 'ADMINS' ? (
              <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
                <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
                  <h1 className="text-3xl font-black text-slate-950">Manage Admin</h1>
                  <p className="mt-2 text-sm font-semibold text-slate-500">Add an admin by user email and choose what services they can manage.</p>
                  <div className="relative mt-6">
                    <input value={adminEmail} onChange={(e) => validateAdminEmail(e.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 px-4 pr-12 font-semibold outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100" placeholder="user@email.com" />
                    {adminEmailState === 'valid' && <CheckCircle2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600" />}
                    {adminEmailState === 'invalid' && <XCircle className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-rose-600" />}
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {serviceNav.filter((item) => ['VEH', 'AUT', 'LEG', 'ATT', 'EC', 'USERS', 'FLEET'].includes(item.id)).map((item) => (
                      <button key={item.id} onClick={() => togglePermission(item.id)} className={`rounded-2xl border px-3 py-3 text-sm font-black ${adminPermissions.includes(item.id) ? 'border-[#064e3b] bg-emerald-50 text-[#064e3b]' : 'border-slate-200 text-slate-500'}`}>{item.label}</button>
                    ))}
                  </div>
                  <button onClick={grantAdminAccess} disabled={adminEmailState !== 'valid'} className="mt-6 h-12 w-full rounded-2xl bg-[#064e3b] font-black text-white disabled:opacity-50">Save Access</button>
                </div>
                <div className="rounded-[2rem] border border-emerald-100 bg-white p-6">
                  <h2 className="text-xl font-black text-slate-950">Current Admins</h2>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="h-11 flex-1 rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-emerald-300" placeholder="Search admins..." />
                    <select value={userRoleFilter} onChange={(e) => setUserRoleFilter(e.target.value)} className="h-11 rounded-2xl border border-slate-200 px-4 font-bold text-slate-600">
                      <option value="ALL">All roles</option>
                      <option value="ROLE_AGENT">Agents</option>
                      <option value="ROLE_ADMIN">Admins</option>
                      <option value="ROLE_DRIVER">Drivers</option>
                    </select>
                  </div>
                  <div className="mt-4 space-y-3">
                    {filteredUsers.filter((user) => user.role !== 'ROLE_USER').map((user) => (
                      <div key={user.id} className="rounded-2xl border border-slate-100 p-4">
                        <p className="font-black text-slate-900">{user.name}</p>
                        <p className="text-sm font-semibold text-slate-500">{user.email}</p>
                        <p className="mt-2 text-xs font-black text-[#064e3b]">{user.servicePermissions || 'Full access'}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button onClick={() => loadAdminForEdit(user)} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">Edit rights</button>
                          {user.role !== 'ROLE_DRIVER' && <button onClick={() => grantDriverRole(user.email)} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#064e3b]">Make driver</button>}
                          {user.role === 'ROLE_AGENT' && <button onClick={() => removeAdminRole(user.email)} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">Remove admin</button>}
                          {user.role === 'ROLE_DRIVER' && <button onClick={() => removeDriverRole(user.email)} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">Remove driver</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : filterType === 'FLEET' ? (
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-[2rem] border border-emerald-100 bg-white p-6">
                  <h1 className="text-3xl font-black text-slate-950">Drivers</h1>
                  <div className="mt-4 flex gap-3">
                    <input value={fleetSearch} onChange={(e) => setFleetSearch(e.target.value)} className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="Search fleet..." />
                    <select value={fleetStatus} onChange={(e) => setFleetStatus(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold"><option value="ALL">All</option><option value="AVAILABLE">Available</option><option value="ON_MISSION">On mission</option><option value="UNAVAILABLE">Unavailable</option></select>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <input value={driverForm.name} onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="Driver name" />
                    <div className="relative">
                      <input value={driverForm.email || ''} onChange={(e) => validateDriverEmail(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-11 font-semibold" placeholder="Driver email" />
                      {driverEmailState === 'valid' && <CheckCircle2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600" />}
                      {driverEmailState === 'invalid' && <XCircle className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-rose-600" />}
                    </div>
                    <input value={driverForm.phone} onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="Phone" />
                    <input value={driverForm.cin} onChange={(e) => setDriverForm({ ...driverForm, cin: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="CIN" />
                    <input value={driverForm.licenseNumber} onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="License" />
                    <select value={driverForm.status || 'AVAILABLE'} onChange={(e) => setDriverForm({ ...driverForm, status: e.target.value, available: e.target.value === 'AVAILABLE' })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold"><option value="AVAILABLE">Available</option><option value="ON_MISSION">On mission</option><option value="UNAVAILABLE">Unavailable</option></select>
                  </div>
                  <button onClick={saveDriver} disabled={driverEmailState === 'invalid'} className="mt-4 rounded-2xl bg-[#064e3b] px-5 py-3 font-black text-white disabled:opacity-50">{driverForm.id ? 'Save Driver' : 'Add Driver'}</button>
                  <div className="mt-5 space-y-3">{drivers.filter((driver) => (fleetStatus === 'ALL' || driver.status === fleetStatus) && `${driver.name} ${driver.email} ${driver.phone}`.toLowerCase().includes(fleetSearch.toLowerCase())).map((driver) => <div key={driver.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"><div><p className="font-black">{driver.name}</p><p className="text-sm text-slate-500">{driver.phone} - {driver.licenseNumber}</p><span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-[#064e3b]">{driver.status}</span></div><button onClick={() => setDriverForm(driver)} className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-black text-[#064e3b]">Edit</button></div>)}</div>
                </div>
                <div className="rounded-[2rem] border border-emerald-100 bg-white p-6">
                  <h1 className="text-3xl font-black text-slate-950">Vehicles</h1>
                  <div className="mt-4 flex gap-3">
                    <input value={vehicleSearch} onChange={(e) => setVehicleSearch(e.target.value)} className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="Search vehicles..." />
                    <select value={vehicleStatusFilter} onChange={(e) => setVehicleStatusFilter(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold">
                      <option value="ALL">All</option>
                      <option value="AVAILABLE">Available</option>
                      <option value="ON_MISSION">On mission</option>
                      <option value="UNAVAILABLE">Unavailable</option>
                      <option value="BROKEN">Broken</option>
                    </select>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <input value={vehicleForm.plateNumber} onChange={(e) => setVehicleForm({ ...vehicleForm, plateNumber: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="Plate number" />
                    <input value={vehicleForm.model} onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="Model" />
                    <select value={vehicleForm.type} onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold"><option value="AMBULANCE">Ambulance</option><option value="FUNERAL_CAR">Funeral car</option></select>
                    <input value={vehicleForm.currentLocation} onChange={(e) => setVehicleForm({ ...vehicleForm, currentLocation: e.target.value })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold" placeholder="Location" />
                    <select value={vehicleForm.status || 'AVAILABLE'} onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value, available: e.target.value === 'AVAILABLE' })} className="rounded-2xl border border-slate-200 px-4 py-3 font-semibold"><option value="AVAILABLE">Available</option><option value="ON_MISSION">On mission</option><option value="UNAVAILABLE">Unavailable</option><option value="BROKEN">Broken</option></select>
                  </div>
                  <button onClick={saveVehicle} className="mt-4 rounded-2xl bg-[#064e3b] px-5 py-3 font-black text-white">{vehicleForm.id ? 'Save Vehicle' : 'Add Vehicle'}</button>
                  <div className="mt-5 space-y-3">{vehicles.filter((vehicle) => (vehicleStatusFilter === 'ALL' || vehicle.status === vehicleStatusFilter) && `${vehicle.plateNumber} ${vehicle.model} ${vehicle.type}`.toLowerCase().includes(vehicleSearch.toLowerCase())).map((vehicle) => <div key={vehicle.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"><div><p className="font-black">{vehicle.plateNumber}</p><p className="text-sm text-slate-500">{vehicle.model} - {vehicle.type}</p><span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-[#064e3b]">{vehicle.status}</span></div><button onClick={() => setVehicleForm(vehicle)} className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-black text-[#064e3b]">Edit</button></div>)}</div>
                </div>
              </div>
            ) : (
            <>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950">Request Management</h1>
                <p className="mt-1 text-sm font-semibold text-slate-500">Manage citizen requests by component and status.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                  <div className={`h-2 ${stat.band}`} />
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400">{stat.label}</p>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-black ${stat.badge}`}>{stat.percent}</span>
                    </div>
                    <p className="mt-4 text-4xl font-black text-slate-950">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Search table..."
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 hover:bg-slate-50">
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                  <select
                    value={sortTime}
                    onChange={(e) => setSortTime(e.target.value)}
                    className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 outline-none"
                  >
                    <option value="DESC">Newest</option>
                    <option value="ASC">Oldest</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                    className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 outline-none"
                  >
                    <option value="ALL">All status</option>
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  <button className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 hover:bg-slate-50">
                    <SlidersHorizontal className="h-4 w-4" />
                    Sort
                  </button>
                  <button className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#064e3b] px-5 text-sm font-black text-white shadow-lg shadow-emerald-900/20 hover:bg-[#065f46]">
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {activeFilters.length === 0 && <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500">No active filters</span>}
                  {activeFilters.map((filter) => (
                    <button key={filter.key} onClick={filter.clear} className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-[#064e3b]">
                      {filter.label}
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                  <button onClick={() => setPage(Math.max(1, currentPage - 1))} className="rounded-full border border-slate-200 px-3 py-1.5 hover:bg-slate-50">Prev</button>
                  <span>Page {currentPage} / {totalPages}</span>
                  <button onClick={() => setPage(Math.min(totalPages, currentPage + 1))} className="rounded-full border border-slate-200 px-3 py-1.5 hover:bg-slate-50">Next</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-4">Citizen</th>
                      <th className="px-5 py-4">Component</th>
                      <th className="px-5 py-4">Date</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {visibleRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-4 font-semibold text-slate-600">{req.user || 'N/A'}</td>
                        <td className="px-5 py-4">
                          <p className="font-black text-slate-800">{req.type}</p>
                          {(req.detail || req.serviceArea) && (
                            <p className="mt-1 text-xs font-semibold text-slate-400">{req.detail || `${req.serviceArea} - ${req.medicalReason} - ${req.feeAmount} DH`}</p>
                          )}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-500">{req.time}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${getStatusClasses(req.status)}`}>
                            {translateStatus(req.status)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => req.documentProof ? setDocModal({ open: true, url: req.documentProof }) : alert('Aucun document fourni')} className={`rounded-xl border p-2 ${req.documentProof ? 'border-slate-200 text-slate-600 hover:bg-slate-50' : 'border-transparent bg-slate-100 text-slate-300'}`} title="Voir le document">
                              <Eye className="h-4 w-4" />
                            </button>
                            {req.status === 'PENDING' && (
                              <>
                                <button onClick={() => req.rawType === 'VEH' ? setAssignModal({ open: true, request: req, driverId: '', vehicleId: '' }) : handleAccept(req.realId, req.rawType)} className="rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-100" title="Accepter">
                                  <Check className="h-4 w-4" />
                                </button>
                                <button onClick={() => setRejectModal({ open: true, requestId: req.realId, type: req.rawType })} className="rounded-xl border border-amber-200 bg-amber-50 p-2 text-amber-600 hover:bg-amber-100" title="Rejeter">
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button onClick={() => handleDelete(req.realId, req.rawType)} className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100" title="Supprimer">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {visibleRequests.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-14 text-center font-bold text-slate-400">No requests found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            </>
            )}
          </main>
        </section>
      </div>

      {rejectModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setRejectModal({ open: false, requestId: '', type: 'VEH' })}></div>
          <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-gray-100 bg-white p-8 shadow-2xl">
            <h3 className="mb-4 text-2xl font-black text-slate-950">Motif du rejet</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mb-6 h-32 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-medium text-slate-950 transition-all focus:bg-white focus:ring-2 focus:ring-rose-400"
              placeholder="Raison du refus..."
            />
            <div className="flex gap-4">
              <button onClick={() => setRejectModal({ open: false, requestId: '', type: 'VEH' })} className="flex-1 rounded-xl bg-gray-100 px-6 py-3 font-bold text-gray-700 hover:bg-gray-200">Annuler</button>
              <button onClick={submitReject} disabled={!rejectReason.trim()} className="flex-1 rounded-xl bg-rose-500 px-6 py-3 font-bold text-white shadow-sm shadow-rose-500/20 hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {assignModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setAssignModal({ open: false, request: null, driverId: '', vehicleId: '' })}></div>
          <div className="relative z-10 w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-2xl">
            <h3 className="text-2xl font-black text-slate-950">Assign mission</h3>
            <p className="mt-2 text-sm font-semibold text-slate-500">Choose an available driver and vehicle before accepting.</p>
            <select value={assignModal.driverId} onChange={(e) => setAssignModal({ ...assignModal, driverId: e.target.value })} className="mt-5 h-12 w-full rounded-2xl border border-slate-200 px-4 font-bold">
              <option value="">Select driver</option>
              {drivers.filter((driver) => driver.status === 'AVAILABLE' || driver.available).map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}
            </select>
            <select value={assignModal.vehicleId} onChange={(e) => setAssignModal({ ...assignModal, vehicleId: e.target.value })} className="mt-3 h-12 w-full rounded-2xl border border-slate-200 px-4 font-bold">
              <option value="">Select vehicle</option>
              {vehicles.filter((vehicle) => vehicle.status === 'AVAILABLE' || vehicle.available).map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.plateNumber} - {vehicle.model}</option>)}
            </select>
            <button onClick={assignMission} disabled={!assignModal.driverId || !assignModal.vehicleId} className="mt-6 h-12 w-full rounded-2xl bg-[#064e3b] font-black text-white disabled:opacity-50">Accept and assign</button>
          </div>
        </div>
      )}

      {docModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setDocModal({ open: false, url: '' })}></div>
          <div className="relative z-10 flex h-full max-h-[90vh] w-full max-w-5xl flex-col rounded-[2rem] bg-white p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between px-4 pt-4">
              <h3 className="text-xl font-black text-slate-950">Document justificatif</h3>
              <button onClick={() => setDocModal({ open: false, url: '' })} className="rounded-xl bg-gray-100 p-2 text-gray-700 hover:bg-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="w-full flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              <object data={docModal.url} className="h-full w-full object-contain">
                <div className="flex h-full items-center justify-center font-medium text-gray-500">Apercu non disponible.</div>
              </object>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
