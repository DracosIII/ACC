import React, { useState } from 'react';
import { User } from '../types';
import { updateUser } from '../services/api';
import { X, Save, User as UserIcon, Home, Phone, AlertCircle } from 'lucide-react';

interface UserProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    adresse: user.adresse || '',
    tel_urgence: user.tel_urgence || '',
    contact_urgence_nom: user.contact_urgence_nom || ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const updated = await updateUser(user.id, formData);
      onUpdate(updated);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Failed to update user", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-cyan-400" />
            Mon Profil
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">Informations Générales</h3>
            
            <div>
               <label className="block text-sm text-gray-300 mb-1">Nom Complet</label>
               <div className="relative">
                 <UserIcon className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                 <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                 />
               </div>
            </div>

            <div>
               <label className="block text-sm text-gray-300 mb-1">Adresse / Domicile</label>
               <div className="relative">
                 <Home className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                 <input 
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    placeholder="Votre adresse"
                    className="w-full bg-black/40 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                 />
               </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-sm uppercase tracking-wider text-red-400/80 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Contact Urgence
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm text-gray-300 mb-1">Nom du contact</label>
                   <input 
                      name="contact_urgence_nom"
                      value={formData.contact_urgence_nom}
                      onChange={handleChange}
                      placeholder="ex: Marie Dupont"
                      className="w-full bg-black/40 border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                   />
                </div>
                <div>
                   <label className="block text-sm text-gray-300 mb-1">Téléphone</label>
                   <div className="relative">
                     <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                     <input 
                        name="tel_urgence"
                        value={formData.tel_urgence}
                        onChange={handleChange}
                        placeholder="ex: 06 12 34 56 78"
                        className="w-full bg-black/40 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                     />
                   </div>
                </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
             <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-white/5 transition-colors font-medium"
             >
                Annuler
             </button>
             <button 
                type="submit" 
                disabled={loading || success}
                className={`flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${success ? 'bg-green-600 text-white' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]'}`}
             >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : success ? (
                    'Enregistré !'
                ) : (
                    <>
                        <Save className="w-4 h-4" />
                        Enregistrer
                    </>
                )}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileModal;