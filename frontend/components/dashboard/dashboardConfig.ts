import {
  Activity,
  Ambulance,
  FileText,
  Home,
  LayoutDashboard,
  Settings,
  Users,
  Zap
} from 'lucide-react';

export const serviceNav = [
  { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ALL', label: 'Manage All Requests', icon: Activity },
  { id: 'VEH', label: 'Vehicules', icon: Ambulance },
  { id: 'AUT', label: 'Raccordements', icon: Zap },
  { id: 'LEG', label: 'Legalisation', icon: FileText },
  { id: 'ATT', label: 'Attestation', icon: Home },
  { id: 'EC', label: 'Etat Civil', icon: Users },
  { id: 'USERS', label: 'Users', icon: Users },
  { id: 'ADMINS', label: 'Manage Admin', icon: Settings },
  { id: 'FLEET', label: 'Drivers & Vehicles', icon: Ambulance }
];
