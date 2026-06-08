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
  { id: 'DASHBOARD', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'ALL', label: 'Toutes les demandes', icon: Activity },
  { id: 'VEH', label: 'Véhicules', icon: Ambulance },
  { id: 'AUT', label: 'Raccordements', icon: Zap },
  { id: 'LEG', label: 'Légalisation', icon: FileText },
  { id: 'ATT', label: 'Attestation', icon: Home },
  { id: 'EC', label: 'État Civil', icon: Users },
  { id: 'USERS', label: 'Citoyens', icon: Users },
  { id: 'ADMINS', label: 'Gérer les Admins', icon: Settings },
  { id: 'FLEET', label: 'Chauffeurs & Véhicules', icon: Ambulance }
];
