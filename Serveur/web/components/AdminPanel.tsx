import React, { useState, useEffect } from 'react';
import { Patient, User } from '../types';
import { editPatient, removePatient, addEmployee, removeEmployee, getEmployees, toggleAssignment } from '../services/api';
import { Trash2, Shield, Edit2, Check, X } from 'lucide-react';

interface AdminPanelProps {
  patients: Patient[];
  userRole?: string;
  refreshData: () => void;
  currentSiteId?: number;
  setCurrentSiteId?: (id: number | undefined) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ patients, userRole, refreshData, currentSiteId, setCurrentSiteId }) => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'patients' | 'employees' | 'users'>('patients');
  
  // Forms state - Users
  const [newEEmail, setNewEEmail] = useState('');
  const [newENom, setNewENom] = useState('');
  const [newEPrenom, setNewEPrenom] = useState('');
  const [newETelephone, setNewETelephone] = useState('');
  const [newEAdresse, setNewEAdresse] = useState('');
  const [newEPassword, setNewEPassword] = useState('');
  const [newERole, setNewERole] = useState<'employe' | 'patient'>('employe');

  // Editing state - Patients
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null);
  const [editPName, setEditPName] = useState('');
  const [editPAge, setEditPAge] = useState('');

  useEffect(() => {
    const loadEmps = async () => {
      const emps = await getEmployees(currentSiteId);
      setEmployees(emps);
    };
    loadEmps();
  }, [patients, userRole, currentSiteId]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if(newEEmail && newENom && newEPrenom && newEPassword) {
        await addEmployee(newEEmail, newENom, newEPrenom, newETelephone, newEAdresse, newEPassword, newERole, currentSiteId);
        setNewEEmail(''); setNewENom(''); setNewEPrenom(''); setNewETelephone(''); setNewEAdresse(''); setNewEPassword('');
        setNewERole('employe');
        const emps = await getEmployees(currentSiteId);
        setEmployees(emps);
        refreshData();
    }
  };

  const handleEditPatientStart = (p: Patient) => {
    setEditingPatientId(p.id);
    setEditPName(p.name);
    setEditPAge(p.age.toString());
  };

  const handleEditPatientSave = async (id: number, roomStr: string) => {
    await editPatient(id, editPName, roomStr, parseInt(editPAge));
    setEditingPatientId(null);
    refreshData();
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-700 pb-2">
        <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'patients' ? 'bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
            Gestion Patients
        </button>
        <button
            onClick={() => setActiveTab('employees')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'employees' ? 'bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
            Gestion Employés
        </button>
        <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
            Création Utilisateurs (Site)
        </button>
      </div>

      {activeTab === 'patients' ? (
        <div className="space-y-6">
          {/* Patient List */}
          <div className="glass-panel rounded-xl overflow-hidden border border-gray-700">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-black/40 text-gray-200 uppercase font-medium">
                    <tr>
                        <th className="p-4">Patient</th>
                        <th className="p-4">Age</th>
                        <th className="p-4">Assignations (Employés)</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {patients.map(p => {
                        const isEditing = editingPatientId === p.id;
                        return (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium text-white">
                                {isEditing ? (
                                    <input value={editPName} onChange={e => setEditPName(e.target.value)} className="bg-black/40 border border-gray-700 rounded p-1 text-white text-sm" />
                                ) : (
                                    <>{p.name} <span className="text-xs text-gray-500">#{p.id}</span></>
                                )}
                            </td>
                            <td className="p-4">
                                {isEditing ? (
                                    <input value={editPAge} onChange={e => setEditPAge(e.target.value)} className="bg-black/40 border border-gray-700 rounded p-1 text-white text-sm w-16" type="number"/>
                                ) : (
                                    p.age + " ans"
                                )}
                            </td>
                            <td className="p-4">
                                <div className="flex flex-wrap gap-2">
                                    {employees.map(emp => (
                                        <button
                                            key={emp.id}
                                            onClick={async () => { await toggleAssignment(p.id, emp.id); refreshData(); }}
                                            className={`px-2 py-1 rounded text-xs border ${p.assignedEmployeeIds.includes(emp.id) ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-gray-800 border-gray-600 text-gray-500 hover:bg-gray-700'}`}
                                        >
                                            {emp.name}
                                        </button>
                                    ))}
                                </div>
                            </td>
                            <td className="p-4 text-right flex justify-end gap-2">
                                {isEditing ? (
                                    <>
                                        <button onClick={() => handleEditPatientSave(p.id, p.room)} className="text-green-400 hover:text-green-300 p-2 hover:bg-green-500/10 rounded">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setEditingPatientId(null)} className="text-gray-400 hover:text-gray-300 p-2 hover:bg-gray-500/10 rounded">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => handleEditPatientStart(p)} className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/10 rounded">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                                <button onClick={async () => { await removePatient(p.id); refreshData(); }} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    )})}
                </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'employees' ? (
        <div className="space-y-6">
          <div className="glass-panel rounded-xl overflow-hidden border border-gray-700">
             <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-black/40 text-gray-200 uppercase font-medium">
                    <tr>
                        <th className="p-4">Nom</th>
                        <th className="p-4">Identifiant</th>
                        <th className="p-4">Rôle</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {employees.map(emp => (
                        <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium text-white">{emp.name}</td>
                            <td className="p-4 font-mono text-cyan-400">{emp.username}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs border ${
                                emp.role === 'admin' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                                'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              }`}>
                                {emp.role === 'admin' ? 'Administrateur' : 'Employé'}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                                <button onClick={async () => { await removeEmployee(emp.id); const updated = await getEmployees(currentSiteId); setEmployees(updated); refreshData(); }} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'users' && (
        <div className="space-y-6">
           <div className="glass-panel p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" /> Créer un Nouvel Utilisateur
            </h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Email</label>
                  <input type="email" placeholder="utilisateur@example.com" value={newEEmail} onChange={e => setNewEEmail(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white" required />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Mot de passe</label>
                  <input type="password" placeholder="••••••••" value={newEPassword} onChange={e => setNewEPassword(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white" required />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Nom</label>
                  <input placeholder="Dupont" value={newENom} onChange={e => setNewENom(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white" required />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Prénom</label>
                  <input placeholder="Jean" value={newEPrenom} onChange={e => setNewEPrenom(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white" required />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Téléphone</label>
                  <input type="tel" placeholder="06 12 34 56 78" value={newETelephone} onChange={e => setNewETelephone(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Adresse</label>
                  <input placeholder="123 Rue de la Paix" value={newEAdresse} onChange={e => setNewEAdresse(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Rôle</label>
                  <select value={newERole} onChange={e => setNewERole(e.target.value as any)} className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white">
                    <option value="employe">Employé</option>
                    <option value="patient">Patient</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition-colors">Créer l'Utilisateur</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
