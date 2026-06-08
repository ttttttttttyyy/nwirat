import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Ambulance,
  CheckCircle2,
  Clock,
  Users,
  X
} from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import DashboardSidebar from '../ui components/DashboardSidebar';
import DashboardStatsCards from '../ui components/DashboardStatsCards';
import DashboardTopBar from '../ui components/DashboardTopBar';
import AdminsSection from './manage admins/AdminsSection';
import AttestationRequestsSection from './manage the attestations/AttestationRequestsSection';
import AuthorizationRequestsSection from './manage the raccordments/AuthorizationRequestsSection';
import CivilStatusRequestsSection from './manage the civil status/CivilStatusRequestsSection';
import FleetSection from './manage drivers and vehicules/vehiculeDrivers';
import LegalisationRequestsSection from './manage legalisation/LegalisationRequestsSection';
import ManageAllRequestsSection from './manage all requests/ManageAllRequestsSection';
import RequestsSection from './manage all requests/RequestsSection';
import UsersSection from './manage users/UsersSection';
import VehicleRequestsSection from './manage vehicule requests/VehicleRequestsSection';
import { serviceNav } from '../ui components/dashboardConfig';

export default function StaffDashboard({ onLogout }: { onLogout?: () => void }) {
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('DASHBOARD');
  const [sortTime, setSortTime] = useState('DESC');
  const [missionDateFilter, setMissionDateFilter] = useState('');
  const [createdDateFilter, setCreatedDateFilter] = useState('');
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
  const visibleServiceNav = serviceNav.filter((item) => allowedSections.includes(item.id) && (item.id !== 'ALL' || isMainAdmin));

  const [rejectModal, setRejectModal] = useState({ open: false, requestId: '', type: 'VEH' });
  const [rejectReason, setRejectReason] = useState('');
  const [docModal, setDocModal] = useState<{ open: boolean; docs: any[]; activeIndex: number }>({ open: false, docs: [], activeIndex: 0 });

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

      const mappedVehicles = vehiclesRes.data.map((r: any) => {
        const docs = [
          { name: 'Document de mission', url: r.documentProof }
        ].filter(d => d.url);
        return {
          id: `VEH-${r.id}`,
          realId: r.id,
          rawType: 'VEH',
          user: r.clientName,
          type: r.vehicleType === 'ambulance' ? 'Ambulance' : 'Vehicule Funeraire',
          serviceArea: r.serviceArea,
          medicalReason: r.medicalReason,
          feeAmount: r.feeAmount ?? 0,
          status: r.status || 'PENDING',
          time: r.scheduledDate ? new Date(r.scheduledDate).toLocaleString('fr-FR') : (r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A'),
          timestamp: r.requestTime ? new Date(r.requestTime).getTime() : r.id,
          scheduledDate: r.scheduledDate,
          createdDate: r.requestTime,
          missionTime: r.scheduledDate ? new Date(r.scheduledDate).toLocaleString('fr-FR') : 'N/A',
          createdTime: r.requestTime ? new Date(r.requestTime).toLocaleString('fr-FR') : 'N/A',
          assignedDriverId: r.assignedDriverId,
          assignedDriverName: r.assignedDriverName,
          assignedVehicleId: r.assignedVehicleId,
          assignedVehiclePlate: r.assignedVehiclePlate,
          documentProof: r.documentProof,
          documents: docs
        };
      });

      const mappedAuths = authsRes.data.map((r: any) => {
        const docs = [
          { name: 'Carte d\'identité nationale (CIN)', url: r.nationalIdCardProof },
          { name: 'Permis de construire', url: r.constructionPermitProof },
          { name: 'Permis d\'habiter', url: r.habitationPermitProof },
          { name: 'Certificat de stabilité', url: r.stabilityCertificateProof },
          { name: 'Avis de la commission', url: r.commissionNoticeProof },
          { name: 'Document justificatif', url: r.documentProof }
        ].filter(d => d.url);
        return {
          id: `AUT-${r.id}`,
          realId: r.id,
          rawType: 'AUT',
          user: r.clientName,
          type: r.authorizationType === 'WATER' ? 'Eau Potable' : 'Electricite',
          status: r.status || 'PENDING',
          time: r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A',
          timestamp: r.requestTime ? new Date(r.requestTime).getTime() : r.id,
          scheduledDate: null,
          createdDate: r.requestTime,
          missionTime: 'N/A',
          createdTime: r.requestTime ? new Date(r.requestTime).toLocaleString('fr-FR') : 'N/A',
          documentProof: r.nationalIdCardProof || r.documentProof,
          documents: docs
        };
      });

      const mappedLegals = legalsRes.data.map((r: any) => {
        const docs = [
          { name: 'Document à légaliser', url: r.documentProof },
          { name: 'Document original', url: r.originalDocumentProof },
          { name: 'Pièce d\'identité', url: r.identityProof }
        ].filter(d => d.url);
        return {
          id: `LEG-${r.id}`,
          realId: r.id,
          rawType: 'LEG',
          user: r.clientName,
          type: r.documentType === 'SIGNATURE' ? 'Legalisation de Signature' : 'Copie Conforme',
          status: r.status || 'PENDING',
          time: r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A',
          timestamp: r.requestTime ? new Date(r.requestTime).getTime() : r.id,
          scheduledDate: null,
          createdDate: r.requestTime,
          missionTime: 'N/A',
          createdTime: r.requestTime ? new Date(r.requestTime).toLocaleString('fr-FR') : 'N/A',
          documentProof: r.documentProof || r.originalDocumentProof || r.identityProof,
          documents: docs
        };
      });

      const mappedAttestations = attestationsRes.data.map((r: any) => {
        const docs = [
          { name: 'Acte de vente / donation / Sadaqa', url: r.saleDonationSadaqaProof },
          { name: 'Certificat de propriété (Moulkia)', url: r.ownershipCertificateProof }
        ].filter(d => d.url);
        return {
          id: `ATT-${r.id}`,
          realId: r.id,
          rawType: 'ATT',
          user: r.clientName,
          type: 'Attestation Administrative',
          status: r.status || 'PENDING',
          time: r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A',
          timestamp: r.requestTime ? new Date(r.requestTime).getTime() : r.id,
          scheduledDate: null,
          createdDate: r.requestTime,
          missionTime: 'N/A',
          createdTime: r.requestTime ? new Date(r.requestTime).toLocaleString('fr-FR') : 'N/A',
          documentProof: r.saleDonationSadaqaProof || r.ownershipCertificateProof,
          detail: r.propertyAddress,
          documents: docs
        };
      });

      const mappedCivilStatus = civilStatusRes.data.map((r: any) => {
        const docs = [
          { name: 'Documents requis généraux', url: r.requiredDocumentsProof },
          { name: 'Certificat médical de décès', url: r.medicalDeathCertificateProof },
          { name: 'Attestation administrative de décès', url: r.administrativeDeathCertificateProof },
          { name: 'Copie intégrale / Acte de naissance', url: r.fullCopyOrBirthActProof },
          { name: 'Certificat médical de naissance', url: r.birthMedicalCertificateProof },
          { name: 'Acte de mariage', url: r.marriageActProof },
          { name: 'CIN du mari', url: r.husbandCinProof },
          { name: 'CIN de l\'épouse', url: r.wifeCinProof },
          { name: 'Copie intégrale du mari', url: r.husbandFullCopyProof },
          { name: 'Copie intégrale de l\'épouse', url: r.wifeFullCopyProof },
          { name: 'Déclaration sur l\'honneur', url: r.honorDeclarationProof },
          { name: 'Attestation de l\'autorité locale', url: r.localAuthorityCertificateProof },
          { name: 'Preuve de divorce', url: r.divorceProof },
          { name: 'Acte de décès de l\'ancien conjoint', url: r.previousPartnerDeathProof },
          { name: 'Autorisation du juge', url: r.judgeAuthorizationProof },
          { name: 'Photos', url: r.photosProof }
        ].filter(d => d.url);
        return {
          id: `EC-${r.id}`,
          realId: r.id,
          rawType: 'EC',
          user: r.clientName,
          type: 'Etat Civil',
          status: r.status || 'PENDING',
          time: r.requestTime ? new Date(r.requestTime).toLocaleDateString('fr-FR') : 'N/A',
          timestamp: r.requestTime ? new Date(r.requestTime).getTime() : r.id,
          scheduledDate: null,
          createdDate: r.requestTime,
          missionTime: 'N/A',
          createdTime: r.requestTime ? new Date(r.requestTime).toLocaleString('fr-FR') : 'N/A',
          documentProof: r.requiredDocumentsProof || r.medicalDeathCertificateProof || r.administrativeDeathCertificateProof || r.fullCopyOrBirthActProof || r.birthMedicalCertificateProof || r.marriageActProof || r.husbandCinProof || r.wifeCinProof || r.husbandFullCopyProof || r.wifeFullCopyProof || r.honorDeclarationProof || r.localAuthorityCertificateProof || r.divorceProof || r.previousPartnerDeathProof || r.judgeAuthorizationProof || r.photosProof,
          detail: `${r.requestType || 'Demande'} - ${r.feeAmount ?? 0} DH`,
          documents: docs
        };
      });

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
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:8080/api/requests/${assignModal.request.realId}/assign?driverId=${assignModal.driverId}&vehicleId=${assignModal.vehicleId}`, null, { headers: { Authorization: `Bearer ${token}` } });
      setAssignModal({ open: false, request: null, driverId: '', vehicleId: '' });
      await fetchAllRequests();
      await fetchAdminData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ce chauffeur ou véhicule n\'est pas libre pour la date sélectionnée.');
    }
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

  const formatDateKey = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  };

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const rows = recentRequests.filter((req) => {
      if (!['DASHBOARD', 'ALL', 'USERS', 'ADMINS', 'FLEET'].includes(filterType) && req.rawType !== filterType) return false;
      if (missionDateFilter && formatDateKey(req.scheduledDate) !== missionDateFilter) return false;
      if (createdDateFilter && formatDateKey(req.createdDate) !== createdDateFilter) return false;
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
  }, [createdDateFilter, filterStatus, filterType, missionDateFilter, recentRequests, searchQuery, sortTime]);

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
  const activeMissionStatuses = ['ACCEPTED', 'IN_PROGRESS'];
  const formatMissionDay = (value?: string) => {
    return formatDateKey(value) || formatDateKey(new Date().toISOString());
  };
  const assignmentDay = assignModal.request?.scheduledDate ? formatMissionDay(assignModal.request.scheduledDate) : formatMissionDay();
  const isDriverBookedForAssignmentDay = (driverId: number) => recentRequests.some((request) =>
    request.rawType === 'VEH' &&
    request.realId !== assignModal.request?.realId &&
    request.assignedDriverId === driverId &&
    formatMissionDay(request.scheduledDate) === assignmentDay &&
    activeMissionStatuses.includes(request.status)
  );
  const isVehicleBookedForAssignmentDay = (vehicleId: number) => recentRequests.some((request) =>
    request.rawType === 'VEH' &&
    request.realId !== assignModal.request?.realId &&
    request.assignedVehicleId === vehicleId &&
    formatMissionDay(request.scheduledDate) === assignmentDay &&
    activeMissionStatuses.includes(request.status)
  );
  const assignableDrivers = drivers.filter((driver) => !['UNAVAILABLE'].includes(driver.status) && !isDriverBookedForAssignmentDay(driver.id));
  const assignableVehicles = vehicles.filter((vehicle) => !['UNAVAILABLE', 'BROKEN'].includes(vehicle.status) && !isVehicleBookedForAssignmentDay(vehicle.id));
  const scheduleDays = Array.from({ length: 30 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() + index);
    const key = formatMissionDay(day.toISOString());
    return {
      key,
      label: day.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      weekday: day.toLocaleDateString('fr-FR', { weekday: 'short' }),
      missions: recentRequests.filter((request) => request.rawType === 'VEH' && activeMissionStatuses.includes(request.status) && formatMissionDay(request.scheduledDate) === key)
    };
  });

  const activeFilters = [
    !['DASHBOARD', 'ALL', 'USERS', 'ADMINS', 'FLEET'].includes(filterType) ? { key: 'type', label: serviceNav.find((item) => item.id === filterType)?.label || filterType, clear: () => setFilterType('ALL') } : null,
    filterStatus !== 'ALL' ? { key: 'status', label: translateStatus(filterStatus), clear: () => setFilterStatus('ALL') } : null,
    missionDateFilter ? { key: 'missionDate', label: `Mission: ${missionDateFilter}`, clear: () => setMissionDateFilter('') } : null,
    createdDateFilter ? { key: 'createdDate', label: `Creee: ${createdDateFilter}`, clear: () => setCreatedDateFilter('') } : null,
    searchQuery ? { key: 'search', label: searchQuery, clear: () => setSearchQuery('') } : null
  ].filter(Boolean) as Array<{ key: string; label: string; clear: () => void }>;

  const getStatusClasses = (status: string) => {
    if (status === 'ACCEPTED' || status === 'COMPLETED') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'REJECTED' || status === 'CANCELLED' || status === 'REFUSED') return 'bg-rose-50 text-rose-700 border-rose-200';
    if (status === 'IN_PROGRESS') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  const requestSectionProps = {
    filterType,
    stats,
    searchQuery,
    sortTime,
    filterStatus,
    missionDateFilter,
    createdDateFilter,
    activeFilters,
    currentPage,
    totalPages,
    visibleRequests,
    isMainAdmin,
    filteredRequests,
    setSearchQuery,
    setSortTime,
    setFilterStatus,
    setMissionDateFilter,
    setCreatedDateFilter,
    setPage,
    setDocModal,
    setAssignModal,
    setRejectModal,
    handleAccept,
    handleDelete,
    translateStatus,
    getStatusClasses
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-[#064e3b] via-[#10b981] to-[#d1fae5] p-0 font-sans">
      <div className="flex min-h-[calc(100vh-72px)] overflow-hidden bg-white">
        <DashboardSidebar
          items={visibleServiceNav}
          activeId={filterType}
          expanded={isSidebarExpanded}
          onToggle={setIsSidebarExpanded}
          onSelect={(id) => { setFilterType(id); setPage(1); }}
          onLogout={onLogout}
        />

        <section className="min-w-0 flex-1 bg-[#f8f4e6]">
          <DashboardTopBar
            searchQuery={searchQuery}
            today={today}
            onSearchChange={(value) => { setSearchQuery(value); setPage(1); }}
          />

          <main className="space-y-6 p-5 lg:p-7">
            {filterType === 'DASHBOARD' ? (
              <div className="space-y-6">
                <section className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-[#064e3b] text-white shadow-xl shadow-emerald-950/10">
                  <div className="grid gap-6 p-6 lg:grid-cols-[1.45fr_0.8fr] lg:p-8">
                    <div className="flex min-h-[220px] flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-50">
                          <Activity className="h-4 w-4" />
                          Centre de contrôle en direct
                        </div>
                        <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                          Tableau de bord opérationnel
                        </h1>
                        <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-emerald-50/85">
                          Demandes, citoyens, chauffeurs et véhicules regroupés pour prioriser les actions de l'équipe.
                        </p>
                      </div>
                      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-3xl bg-white/10 p-4">
                          <p className="text-xs font-black uppercase text-emerald-100">Demandes</p>
                          <p className="mt-2 text-3xl font-black">{statsData.total}</p>
                        </div>
                        <div className="rounded-3xl bg-white/10 p-4">
                          <p className="text-xs font-black uppercase text-emerald-100">Citoyens</p>
                          <p className="mt-2 text-3xl font-black">{users.length}</p>
                        </div>
                        <div className="rounded-3xl bg-white/10 p-4">
                          <p className="text-xs font-black uppercase text-emerald-100">Chauffeurs</p>
                          <p className="mt-2 text-3xl font-black">{drivers.length}</p>
                        </div>
                        <div className="rounded-3xl bg-white/10 p-4">
                          <p className="text-xs font-black uppercase text-emerald-100">Véhicules</p>
                          <p className="mt-2 text-3xl font-black">{vehicles.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] bg-white p-5 text-slate-950">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Taux de résolution</p>
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
                          <p className="text-[11px] font-black uppercase text-emerald-600">Traitées</p>
                        </div>
                        <div className="rounded-2xl bg-amber-50 p-3">
                          <p className="text-xl font-black text-amber-700">{pendingRate}%</p>
                          <p className="text-[11px] font-black uppercase text-amber-600">En attente</p>
                        </div>
                        <div className="rounded-2xl bg-rose-50 p-3">
                          <p className="text-xl font-black text-rose-700">{rejectedRate}%</p>
                          <p className="text-[11px] font-black uppercase text-rose-600">Rejetées</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <DashboardStatsCards stats={stats} />

                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-black text-slate-950">Demande de services</h2>
                        <p className="mt-1 text-sm font-semibold text-slate-500">Demandes par type de service.</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-[#064e3b]">Principal : {topService.label}</span>
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
                    <h2 className="text-2xl font-black text-slate-950">Focus opérationnel</h2>
                    <div className="mt-5 grid gap-3">
                      <div className="rounded-3xl bg-amber-50 p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black uppercase text-amber-700">À valider</p>
                            <p className="mt-2 text-3xl font-black text-slate-950">{statsData.pending}</p>
                          </div>
                          <Clock className="h-9 w-9 text-amber-600" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-3xl bg-emerald-50 p-5">
                          <p className="text-xs font-black uppercase text-emerald-700">Utilisateurs actifs</p>
                          <p className="mt-2 text-3xl font-black text-slate-950">{activeStaff}</p>
                        </div>
                        <div className="rounded-3xl bg-rose-50 p-5">
                          <p className="text-xs font-black uppercase text-rose-700">Bannis</p>
                          <p className="mt-2 text-3xl font-black text-slate-950">{blockedUsers}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setFilterType('VEH')} className="mt-2 flex h-12 items-center justify-center rounded-2xl bg-[#064e3b] text-sm font-black text-white">
                        Voir les demandes de véhicules
                      </button>
                    </div>
                  </section>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-950">État de la flotte</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                      <div className="rounded-3xl border border-slate-100 p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="font-black text-slate-900">Chauffeurs</p>
                          <Users className="h-5 w-5 text-[#064e3b]" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <span className="rounded-2xl bg-emerald-50 p-3 text-sm font-black text-emerald-700">{driverAvailability.available}<br />Libre</span>
                          <span className="rounded-2xl bg-sky-50 p-3 text-sm font-black text-sky-700">{driverAvailability.busy}<br />Mission</span>
                          <span className="rounded-2xl bg-rose-50 p-3 text-sm font-black text-rose-700">{driverAvailability.unavailable}<br />Indisp.</span>
                        </div>
                      </div>
                      <div className="rounded-3xl border border-slate-100 p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="font-black text-slate-900">Véhicules</p>
                          <Ambulance className="h-5 w-5 text-[#064e3b]" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <span className="rounded-2xl bg-emerald-50 p-3 text-sm font-black text-emerald-700">{vehicleAvailability.available}<br />Prêt</span>
                          <span className="rounded-2xl bg-sky-50 p-3 text-sm font-black text-sky-700">{vehicleAvailability.busy}<br />Mission</span>
                          <span className="rounded-2xl bg-rose-50 p-3 text-sm font-black text-rose-700">{vehicleAvailability.unavailable}<br />Hors serv.</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-black text-slate-950">Activité récente</h2>
                        <p className="mt-1 text-sm font-semibold text-slate-500">Dernières demandes reçues.</p>
                      </div>
                      <button type="button" onClick={() => setFilterType('VEH')} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-[#064e3b]">Ouvrir la liste</button>
                    </div>
                    <div className="mt-5 space-y-3">
                      {recentActivity.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm font-bold text-slate-400">Aucune demande pour le moment.</div>
                      ) : recentActivity.map((request) => (
                        <div key={request.id} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 p-4">
                          <div className="min-w-0">
                            <p className="truncate font-black text-slate-900">{request.type}</p>
                            <p className="truncate text-sm font-semibold text-slate-500">{request.user || 'Citoyen anonyme'} - {request.time}</p>
                          </div>
                          <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black ${getStatusClasses(request.status)}`}>{translateStatus(request.status)}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            ) : filterType === 'USERS' ? (
              <UsersSection
                filteredUsers={filteredUsers}
                userSearch={userSearch}
                userRoleFilter={userRoleFilter}
                setUserSearch={setUserSearch}
                setUserRoleFilter={setUserRoleFilter}
                toggleBan={toggleBan}
              />
            ) : filterType === 'ADMINS' ? (
              <AdminsSection
                adminEmail={adminEmail}
                adminEmailState={adminEmailState}
                adminPermissions={adminPermissions}
                filteredUsers={filteredUsers}
                userSearch={userSearch}
                userRoleFilter={userRoleFilter}
                validateAdminEmail={validateAdminEmail}
                togglePermission={togglePermission}
                grantAdminAccess={grantAdminAccess}
                setUserSearch={setUserSearch}
                setUserRoleFilter={setUserRoleFilter}
                loadAdminForEdit={loadAdminForEdit}
                grantDriverRole={grantDriverRole}
                removeAdminRole={removeAdminRole}
                removeDriverRole={removeDriverRole}
              />
            ) : filterType === 'FLEET' ? (
              <FleetSection
                drivers={drivers}
                vehicles={vehicles}
                driverForm={driverForm}
                vehicleForm={vehicleForm}
                driverEmailState={driverEmailState}
                fleetSearch={fleetSearch}
                fleetStatus={fleetStatus}
                vehicleSearch={vehicleSearch}
                vehicleStatusFilter={vehicleStatusFilter}
                scheduleDays={scheduleDays}
                setDriverForm={setDriverForm}
                setVehicleForm={setVehicleForm}
                validateDriverEmail={validateDriverEmail}
                saveDriver={saveDriver}
                saveVehicle={saveVehicle}
                setFleetSearch={setFleetSearch}
                setFleetStatus={setFleetStatus}
                setVehicleSearch={setVehicleSearch}
                setVehicleStatusFilter={setVehicleStatusFilter}
              />
            ) : filterType === 'ALL' ? (
              <ManageAllRequestsSection {...requestSectionProps} />
            ) : filterType === 'VEH' ? (
              <VehicleRequestsSection {...requestSectionProps} />
            ) : filterType === 'AUT' ? (
              <AuthorizationRequestsSection {...requestSectionProps} />
            ) : filterType === 'LEG' ? (
              <LegalisationRequestsSection {...requestSectionProps} />
            ) : filterType === 'ATT' ? (
              <AttestationRequestsSection {...requestSectionProps} />
            ) : filterType === 'EC' ? (
              <CivilStatusRequestsSection {...requestSectionProps} />
            ) : (
              <RequestsSection
                {...requestSectionProps}
              />
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
            <h3 className="text-2xl font-black text-slate-950">Assigner la mission</h3>
            <p className="mt-2 text-sm font-semibold text-slate-500">Choisissez un chauffeur et un véhicule libres pour le {assignmentDay}.</p>
            <select value={assignModal.driverId} onChange={(e) => setAssignModal({ ...assignModal, driverId: e.target.value })} className="mt-5 h-12 w-full rounded-2xl border border-slate-200 px-4 font-bold">
              <option value="">Sélectionner le chauffeur</option>
              {assignableDrivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name} - {driver.status}</option>)}
            </select>
            <select value={assignModal.vehicleId} onChange={(e) => setAssignModal({ ...assignModal, vehicleId: e.target.value })} className="mt-3 h-12 w-full rounded-2xl border border-slate-200 px-4 font-bold">
              <option value="">Sélectionner le véhicule</option>
              {assignableVehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.plateNumber} - {vehicle.model} - {vehicle.status}</option>)}
            </select>
            <button onClick={assignMission} disabled={!assignModal.driverId || !assignModal.vehicleId} className="mt-6 h-12 w-full rounded-2xl bg-[#064e3b] font-black text-white disabled:opacity-50">Accepter et assigner</button>
          </div>
        </div>
      )}

      {docModal.open && docModal.docs && docModal.docs.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setDocModal({ open: false, docs: [], activeIndex: 0 })}></div>
          <div className="relative z-10 flex h-full max-h-[90vh] w-full max-w-5xl flex-col rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-950">Documents justificatifs</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Document {docModal.activeIndex + 1} sur {docModal.docs.length} : <span className="text-[#064e3b] font-bold">{docModal.docs[docModal.activeIndex].name}</span>
                </p>
              </div>
              <button onClick={() => setDocModal({ open: false, docs: [], activeIndex: 0 })} className="rounded-xl bg-gray-100 p-2 text-gray-700 hover:bg-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {docModal.docs.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-slate-100">
                {docModal.docs.map((doc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDocModal({ ...docModal, activeIndex: idx })}
                    className={`shrink-0 px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
                      docModal.activeIndex === idx
                        ? 'bg-[#064e3b] text-white border-[#064e3b]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {doc.name}
                  </button>
                ))}
              </div>
            )}
            
            <div className="w-full flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              <object data={docModal.docs[docModal.activeIndex].url} className="h-full w-full object-contain">
                <div className="flex h-full flex-col items-center justify-center font-medium text-gray-500 p-6">
                  <p className="mb-2">Aperçu non disponible directement.</p>
                  <a 
                    href={docModal.docs[docModal.activeIndex].url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#064e3b] hover:underline font-black text-sm"
                  >
                    Ouvrir le document dans un nouvel onglet
                  </a>
                </div>
              </object>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
