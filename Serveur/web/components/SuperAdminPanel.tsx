import React, { useState, useEffect } from 'react';
import { Patient, User, Site } from '../types';
import { getEmployees, getSites, addSite, deleteSite, addEmployee, removeEmployee } from '../services/api';
import { Trash2, Shield, MapPin } from 'lucide-react';

interface SuperAdminPanelProps {
  patients: Patient[];
  refreshData: () => void;
  currentSiteId?: number;
}

const SuperAdminPanel: React.FC<SuperAdminPanelProps> = ({ refreshData, currentSiteId }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'sites' | 'users' | 'employees'>('sites');
  
  // Forms state - Sites
  const [newSSite, setNewSSite] = useState('');
  const [newSAdresse, setNewSAdresse] = useState('');

  // Forms state - Users
  const [newEEmail, setNewEEmail] = useState('');
  const [newENom, setNewENom] = useState('');
  const [newEPrenom, setNewEPrenom] = useState('');
  const [newETelephone, setNewETelephone] = useState('');
  const [newEAdresse, setNewEAdresse] = useState('');
  const [newEPassword, setNewEPassword] = useState('');
  const [newERole, setNewERole] = useState<'super_admin' | 'admin' | 'employe' | 'patient'>('admin');
  const [newESiteId, setNewESiteId] = useState<number | ''>('');

  useEffect(() => {
    const loadSitesData = async () => {
      const loadedSites = await getSites();
      setSites(loadedSites);
    };
    const loadEmps = async () => {
      const emps = await getEmployees(currentSiteId);
      setEmployees(emps);
    };
    loadSitesData();
    loadEmps();
  }, [currentSiteId]);

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if(newSSite) {
      await addSite(newSSite, newSAdresse);
      setNewSSite(''); setNewSAdresse('');
      const loadedSites = await getSites();
      setSites(loadedSites);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if(newEEmail && newENom && newEPrenom && newEPassword) {
        // Enforce site ID mapping for admin/employé/patient (or pass null if global superAdmin?)
        // The addEmployee handles passing the siteId explicitly
        let targetSiteId = newESiteId === '' ? undefined : Number(newESiteId);
        if (newERole === 'super_admin') {
          targetSiteId = undefined; // override
        }
        await addEmployee(newEEmail, newENom, newEPrenom, newETelephone, newEAdresse, newEPassword, newERole, targetSiteId);
        setNewEEmail(''); setNewENom(''); setNewEPrenom(''); setNewETelephone(''); setNewEAdresse(''); setNewEPassword('');
        setNewERole('admin');
        setNewESiteId('');
        const emps = await getEmployees(currentSiteId);
        setEmployees(emps);
        refreshData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-700 pb-2">
        <button
            onClick={() => setActiveTab('sites')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors flex gap-2 items-center ${activeTab === 'sites' ? 'bg-yellow-500/20 text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <MapPin className="w-4 h-4"/> Gestion des Sites
        </button>
        <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
            Création Utilisateurs Globaux
        </button>
        <button
            onClick={() => setActiveTab('employees')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${activeTab === 'employees' ? 'bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
        >
            Supervision du Personnel
        </button>
      </div>

      {activeTab === 'sites' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-yellow-500/20">
            <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5"/> Ajouter un nouveau site (Maison de retraite / Service)</h3>
            <form onSubmit={handleAddSite} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Nom du Site *</label>
                  <input required placeholder="ex: Les Tournesols" value={newSSite} onChange={e => setNewSSite(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Adresse (Optionnel)</label>
                  <input placeholder="15 Avenue de Paris" value={newSAdresse} onChange={e => setNewSAdresse(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white" />
                </div>
              </div>
              <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded transition-colors uppercase text-sm tracking-wider flex items-center justify-center gap-2">
                Créer le site
              </button>
            </form>
          </div>

          <div className="glass-panel rounded-xl overflow-hidden border border-gray-700">
             <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-black/40 text-gray-200 uppercase font-medium">
                    <tr>
                        <th className="p-4">Identifiant</th>
                        <th className="p-4">Nom du Site</th>
                        <th className="p-4">Adresse</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {sites.map(site => (
                        <tr key={site.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-mono text-cyan-400">#{site.id}</td>
                            <td className="p-4 font-bold text-white">{site.nom}</td>
                            <td className="p-4 text-gray-300">{site.adresse || <span className="italic text-gray-600">Non renseignée</span>}</td>
                            <td className="p-4 text-right">
                                <button onClick={async () => { await deleteSite(site.id); setSites(await getSites()); }} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded" title="Supprimer ce site définitivement">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
           <div className="glass-panel p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" /> Créer un Nouvel Utilisateur (Admin / Super Admin)
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
                  <label className="block text-xs uppercase text-gray-400 mb-1">Rôle</label>
                  <select value={newERole} onChange={e => setNewERole(e.target.value as any)} className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white">
                    <option value="super_admin">Super Administrateur</option>
                    <option value="admin">Administrateur du Site</option>
                  </select>
                </div>
                {newERole === 'admin' && (
                  <div>
                    <label className="block text-xs uppercase text-gray-400 mb-1">Site Affecté *</label>
                    <select required value={newESiteId} onChange={e => setNewESiteId(Number(e.target.value))} className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white">
                      <option value="">-- Sélectionner un Site --</option>
                      {sites.map(s => (
                        <option key={s.id} value={s.id}>{s.nom}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition-colors">Créer le Super compte</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'employees' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-xl overflow-hidden border border-gray-700">
             <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-black/40 text-gray-200 uppercase font-medium">
                    <tr>
                        <th className="p-4">Nom</th>
                        <th className="p-4">Rôle</th>
                        <th className="p-4">Site ID</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {employees.map(emp => (
                        <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium text-white">{emp.name}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs border ${
                                emp.role === 'super_admin' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                                emp.role === 'admin' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                                'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              }`}>
                                {emp.role === 'super_admin' ? 'Super Admin' : 
                                 emp.role === 'admin' ? 'Administrateur' : 'Employé'}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-cyan-400">{emp.site_id || 'Global'}</td>
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
      )}
    </div>
  );
};

export default SuperAdminPanel;
