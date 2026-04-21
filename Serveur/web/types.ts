export interface User {
  id: number;
  username: string;
  name: string; // Nom complet pour l'affichage
  role: 'super_admin' | 'admin' | 'employe' | 'patient';
  site_id?: number | null; // NULL pour super_admin, spécifique pour admin/employe/patient
  tel_urgence?: string;
  contact_urgence_nom?: string; // Nom du contact urgence
  adresse?: string; // Domicile
}

export interface Site {
  id: number;
  nom: string;
  adresse?: string;
}

export interface BpmReading {
  id: number;
  patient_id: number;
  valeur: number;
  date_mesure: string;
}

export interface AlertStatus {
  chute_detecte: boolean;
  chute_date: string | null;
  bnt_presse: boolean; // Bouton d'urgence
  bnt_date: string | null;
}

export interface Patient {
  id: number;
  name: string;
  room: string;
  age: number;
  adresse?: string;
  telephone?: string;
  bpmHistory: BpmReading[];
  currentAlerts: AlertStatus;
  assignedEmployeeIds: number[]; // Liste des ID des employés responsables
  linkedUserId?: number; // Si c'est un patient connecté, lien vers son compte User
}

export interface DashboardData {
  patients: Patient[];
  lastUpdate: string;
}