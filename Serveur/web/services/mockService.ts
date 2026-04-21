import { Patient, BpmReading, User } from '../types';
import { randomInt } from 'crypto';

// --- DATABASE SIMULATION ---

let MOCK_USERS: User[] = [
  { 
    id: 1, 
    username: 'admin', 
    name: 'Administrateur', 
    role: 'admin',
    adresse: 'Siège Social, Paris',
    tel_urgence: '0102030405',
    contact_urgence_nom: 'Support IT'
  },
  { 
    id: 2, 
    username: 'nurse', 
    name: 'Infirmier Thomas', 
    role: 'employe',
    adresse: '12 Rue de la Paix',
    tel_urgence: '0611223344',
    contact_urgence_nom: 'Marie Thomas'
  },
  { 
    id: 3, 
    username: 'patient1', 
    name: 'Jean Dupont', 
    role: 'patient',
    adresse: '15 Avenue des Champs',
    tel_urgence: '0788996655',
    contact_urgence_nom: 'Sophie Dupont'
  },
];

let MOCK_PATIENTS: Patient[] = [
  {
    id: 1,
    name: "Jean Dupont",
    room: "101",
    age: 72,
    bpmHistory: [],
    currentAlerts: { chute_detecte: false, chute_date: null, bnt_presse: false, bnt_date: null },
    assignedEmployeeIds: [2], // Assigné à l'infirmier Thomas
    linkedUserId: 3
  },
  {
    id: 2,
    name: "Marie Curie",
    room: "102",
    age: 84,
    bpmHistory: [],
    currentAlerts: { chute_detecte: true, chute_date: new Date().toISOString(), bnt_presse: false, bnt_date: null },
    assignedEmployeeIds: [2],
    linkedUserId: 999
  },
  {
    id: 3,
    name: "Paul Martin",
    room: "104",
    age: 65,
    bpmHistory: [],
    currentAlerts: { chute_detecte: false, chute_date: null, bnt_presse: false, bnt_date: null },
    assignedEmployeeIds: [], // Pas assigné
    linkedUserId: 998
  },
  {
    id: 4,
    name: "Sophie Germain",
    room: "201",
    age: 91,
    bpmHistory: [],
    currentAlerts: { chute_detecte: false, chute_date: null, bnt_presse: true, bnt_date: new Date().toISOString() },
    assignedEmployeeIds: [2],
    linkedUserId: 997
  }
];

// Initialize history logic (reused)
const initHistory = () => {
  MOCK_PATIENTS.forEach(p => {
    if (p.bpmHistory.length === 0) {
      const now = Date.now();
      for (let i = 20; i > 0; i--) {
        p.bpmHistory.push({
          id: randomInt(0, Number.MAX_SAFE_INTEGER),
          patient_id: p.id,
          valeur: 60 + Math.floor(Math.random() * 40),
          date_mesure: new Date(now - i * 60000).toISOString()
        });
      }
    }
  });
};
initHistory();

// --- AUTH SERVICE ---

export const mockLogin = async (username: string, password: string): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulation simple des credentials
  if (username === 'admin' && password === 'admin') return MOCK_USERS.find(u => u.username === 'admin') || null;
  if (username === 'nurse' && password === 'nurse') return MOCK_USERS.find(u => u.username === 'nurse') || null;
  if (username === 'patient' && password === 'patient') return MOCK_USERS.find(u => u.username === 'patient1') || null;
  
  // Fallback root original pour compatibilité
  if (username === 'root' && password === 'Martin1008') return MOCK_USERS.find(u => u.role === 'admin') || null;

  return null;
};

export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network
    const index = MOCK_USERS.findIndex(u => u.id === id);
    if (index !== -1) {
        MOCK_USERS[index] = { ...MOCK_USERS[index], ...data };
        return MOCK_USERS[index];
    }
    throw new Error("User not found");
};

// --- DATA FETCHING SERVICE ---

export const fetchDashboardData = async (user: User): Promise<Patient[]> => {
  // 1. Simulation des mises à jour temps réel (BPM, Alertes)
  MOCK_PATIENTS = MOCK_PATIENTS.map(p => {
    // Generate new BPM
    const newBpm = 60 + Math.floor(Math.random() * 40);
    const newReading: BpmReading = {
      id: Math.random(),
      patient_id: p.id,
      valeur: newBpm,
      date_mesure: new Date().toISOString()
    };
    const newHistory = [...p.bpmHistory, newReading].slice(-20);

    // Random alerts simulation
    let alerts = { ...p.currentAlerts };
    if (Math.random() > 0.99) {
       alerts.chute_detecte = !alerts.chute_detecte;
       if(alerts.chute_detecte) alerts.chute_date = new Date().toISOString();
    }
    if (Math.random() > 0.99) {
       alerts.bnt_presse = !alerts.bnt_presse;
       if(alerts.bnt_presse) alerts.bnt_date = new Date().toISOString();
    }

    return { ...p, bpmHistory: newHistory, currentAlerts: alerts };
  });

  // 2. FILTRAGE SELON LE RÔLE
  let filteredPatients = [];

  if (user.role === 'admin') {
    // L'admin gère tout, on renvoie tout (pour la liste de gestion)
    filteredPatients = [...MOCK_PATIENTS]; 
  } 
  else if (user.role === 'employe') {
    // L'employé ne voit que SES patients assignés
    filteredPatients = MOCK_PATIENTS.filter(p => p.assignedEmployeeIds.includes(user.id));
    
    // TRI AUTOMATIQUE : Urgences en premier
    filteredPatients.sort((a, b) => {
      const aEmergency = a.currentAlerts.chute_detecte || a.currentAlerts.bnt_presse;
      const bEmergency = b.currentAlerts.chute_detecte || b.currentAlerts.bnt_presse;
      if (aEmergency && !bEmergency) return -1;
      if (!aEmergency && bEmergency) return 1;
      return 0;
    });
  } 
  else if (user.role === 'patient') {
    // Le patient ne voit que LUI-MÊME
    filteredPatients = MOCK_PATIENTS.filter(p => p.linkedUserId === user.id);
  }

  return filteredPatients;
};

// --- ADMIN MANAGEMENT SERVICES ---

export const getEmployees = async (): Promise<User[]> => {
  return MOCK_USERS.filter(u => u.role === 'employe');
};

export const addPatient = async (name: string, room: string, age: number): Promise<void> => {
  const newPatient: Patient = {
    id: randomInt(10000),
    name,
    room,
    age,
    bpmHistory: [],
    currentAlerts: { chute_detecte: false, chute_date: null, bnt_presse: false, bnt_date: null },
    assignedEmployeeIds: []
  };
  // Init empty history to prevent crash
  const now = Date.now();
  for (let i = 20; i > 0; i--) {
      newPatient.bpmHistory.push({
        id: randomInt(0, Number.MAX_SAFE_INTEGER),
        patient_id: newPatient.id,
        valeur: 70,
        date_mesure: new Date(now - i * 60000).toISOString()
      });
  }
  MOCK_PATIENTS.push(newPatient);
};

export const removePatient = async (id: number): Promise<void> => {
  MOCK_PATIENTS = MOCK_PATIENTS.filter(p => p.id !== id);
};

export const addEmployee = async (username: string, name: string): Promise<void> => {
  MOCK_USERS.push({
    id: randomInt(10000),
    username,
    name,
    role: 'employe'
  });
};

export const removeEmployee = async (id: number): Promise<void> => {
  MOCK_USERS = MOCK_USERS.filter(u => u.id !== id);
  // Also remove assignments
  MOCK_PATIENTS.forEach(p => {
    p.assignedEmployeeIds = p.assignedEmployeeIds.filter(empId => empId !== id);
  });
};

export const toggleAssignment = async (patientId: number, employeeId: number): Promise<void> => {
  const patient = MOCK_PATIENTS.find(p => p.id === patientId);
  if (patient) {
    if (patient.assignedEmployeeIds.includes(employeeId)) {
      patient.assignedEmployeeIds = patient.assignedEmployeeIds.filter(id => id !== employeeId);
    } else {
      patient.assignedEmployeeIds.push(employeeId);
    }
  }
};
