import React, { useEffect, useState, useMemo } from 'react';
import Header from './Header';
import PatientCard from './PatientCard';
import AdminPanel from './AdminPanel';
import SuperAdminPanel from './SuperAdminPanel';
import UserProfileModal from './UserProfileModal';
import PatientDetailsModal from './PatientDetailsModal';
import PatientHistoryModal from './PatientHistoryModal';
import NotificationsModal from './NotificationsModal';
import { fetchDashboardData } from '../services/api';
import { Patient, User } from '../types';
import { Search } from 'lucide-react';

import RgpdModal from './RgpdModal';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUserUpdate }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRgpdOpen, setIsRgpdOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [currentSiteId, setCurrentSiteId] = useState<number | undefined>(user.site_id || undefined);

  // Function to load data
  const loadData = async () => {
    try {
      const data = await fetchDashboardData(user, currentSiteId);
      setPatients(data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  // Real-time loop
  useEffect(() => {
    loadData();
    // Poll every 2 seconds
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, [user, currentSiteId]); // Reload if user or site changes

  // Optimization: Memoize filtered patients
  const filteredPatients = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return patients;

    return patients.filter(patient => 
      patient.name.toLowerCase().includes(query) || 
      patient.room.toLowerCase().includes(query)
    );
  }, [patients, searchQuery]);

  // Calculate notification count
  const notificationCount = useMemo(() => {
    return patients.filter(p => 
      p.currentAlerts.chute_detecte || 
      p.currentAlerts.bnt_presse ||
      (p.bpmHistory[p.bpmHistory.length - 1]?.valeur || 0) > 100
    ).length;
  }, [patients]);

  const handleOpenDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailsOpen(true);
  };

  const handleOpenHistory = () => {
    // For patient role, open their own history
    // For employe, could open a list or first patient
    if (filteredPatients.length > 0) {
      setSelectedPatient(filteredPatients[0]);
      setIsHistoryOpen(true);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <Header 
        user={user.name} 
        role={user.role}
        onLogout={onLogout} 
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenHistory={handleOpenHistory}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        notificationCount={notificationCount}
      />

      <UserProfileModal 
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onUpdate={onUserUpdate}
      />

      {selectedPatient && (
        <>
          <PatientDetailsModal
            patient={selectedPatient}
            user={user}
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
          />
          
          <PatientHistoryModal
            patient={selectedPatient}
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
          />
        </>
      )}

      <NotificationsModal
        patients={patients}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <main className="container mx-auto px-6">
        
        {/* SECTION 1: SYSTEM STATS - Visible ONLY for Admin */}
        {user.role === 'admin' && (
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
             <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs uppercase">Total Patients</p>
                  <p className="text-2xl font-bold text-white">{patients.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                  <span className="text-cyan-400 font-bold">P</span>
                </div>
             </div>
             <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs uppercase">Système</p>
                  <p className="text-lg font-bold text-green-400">Stable</p>
                </div>
                 <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/30">
                  <span className="text-green-400 font-bold">OK</span>
                </div>
             </div>
             <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs uppercase">DB Connexion</p>
                  <p className="text-xs font-mono text-cyan-300">192.168.31.18</p>
                </div>
                 <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                  <span className="text-blue-400 font-bold text-xs">SQL</span>
                </div>
             </div>
          </div>
        )}

        {/* SECTION 2: VIEW CONTROLLER */}
        {user.role === 'super_admin' ? (
          // --- SUPER ADMIN VIEW ---
          <SuperAdminPanel patients={patients} refreshData={loadData} currentSiteId={user.site_id} />
        ) : user.role === 'admin' ? (
          // --- ADMIN VIEW ---
          <AdminPanel patients={patients} userRole={user.role} refreshData={loadData} currentSiteId={user.site_id} />
        ) : (
          // --- EMPLOYEE & PATIENT VIEW ---
          <>
            {/* Search Bar - Only relevant if there are multiple patients (Employe) */}
            {user.role === 'employe' && (
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                  Mes Patients
                  <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    {filteredPatients.length}
                  </span>
                </h2>
                
                <div className="relative w-full md:w-80 group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-black/40 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-black/60 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 sm:text-sm transition-all shadow-inner"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Patient Header */}
            {user.role === 'patient' && (
               <h2 className="text-2xl font-light text-white mb-6 border-b border-gray-800 pb-4">
                 Bonjour, <span className="font-bold text-cyan-400">{user.name}</span>
               </h2>
            )}

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredPatients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map(patient => (
                  <PatientCard 
                    key={patient.id} 
                    patient={patient}
                    user={user}
                    onOpenDetails={handleOpenDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 glass-panel rounded-xl border-dashed border-gray-700">
                <Search className="h-10 w-10 mb-2 opacity-50" />
                <p>Aucun patient trouvé ou assigné.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer minimaliste pour mentions légales */}
      <footer className="fixed bottom-0 left-0 w-full text-center py-3 text-xs text-gray-500 bg-[#0b0e14] border-t border-cyan-500/20 z-40 transform-gpu">
        <span>© 2026 MediMonitor Pro. Hébergé de façon sécurisée (Belgique).</span>
        <button onClick={() => setIsRgpdOpen(true)} className="ml-4 hover:text-cyan-400 transition-colors uppercase tracking-wider font-bold">
          Politique RGPD (Belgique) & Confidentialité
        </button>
      </footer>

      {isRgpdOpen && (
        <RgpdModal onClose={() => setIsRgpdOpen(false)} />
      )}
    </div>
  );
};

export default Dashboard;