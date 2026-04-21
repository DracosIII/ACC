import React, { useState } from 'react';
import { Patient, User } from '../types';
import { X, Save, User as UserIcon, Home, Phone, Mail, Activity, Heart } from 'lucide-react';
import StatsChart from './StatsChart';

interface PatientDetailsModalProps {
  patient: Patient;
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (data: any) => void;
}

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({ patient, user, isOpen, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [formData, setFormData] = useState({
    email: user.username || '',
    adresse: user.adresse || '',
    tel_urgence: user.tel_urgence || ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const isPatient = user.role === 'patient';
  const isEmploye = user.role === 'employe';
  const { currentAlerts, bpmHistory } = patient;
  const lastBpm = bpmHistory[bpmHistory.length - 1]?.valeur || 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (onUpdate) {
        onUpdate(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsEditing(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to update", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className={`glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 ${isEmploye && !showContactInfo ? 'max-w-4xl w-full' : 'max-w-lg w-full'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            {isPatient ? 'Mes Informations' : `Patient: ${patient.name}`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" title="Fermer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isPatient ? (
            /* CLIENT VIEW - Modification des infos personnelles */
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">Informations Personnelles</h3>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded transition-colors"
                    >
                      Modifier
                    </button>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full bg-black/40 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white outline-none transition-all ${isEditing ? 'focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500' : 'opacity-60 cursor-not-allowed'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Adresse</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Votre adresse"
                      className={`w-full bg-black/40 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white outline-none transition-all ${isEditing ? 'focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500' : 'opacity-60 cursor-not-allowed'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Numéro de téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      name="tel_urgence"
                      value={formData.tel_urgence}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Votre numéro"
                      className={`w-full bg-black/40 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white outline-none transition-all ${isEditing ? 'focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500' : 'opacity-60 cursor-not-allowed'}`}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="pt-4 flex gap-3 border-t border-white/5">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-white/5 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={handleSave}
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
              )}
            </div>
          ) : (
            /* EMPLOYEE VIEW - Vue détails + graphique + contact */
            <div className={`grid ${showContactInfo ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
              {/* Left: Patient Info */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">Informations Patient</h3>
                
                <div className="space-y-3">
                  <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                    <p className="text-xs text-gray-400 uppercase mb-1">Chambre</p>
                    <p className="text-lg font-bold text-white">{patient.room}</p>
                  </div>

                  <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                    <p className="text-xs text-gray-400 uppercase mb-1">Âge</p>
                    <p className="text-lg font-bold text-white">{patient.age} ans</p>
                  </div>

                  <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className={`w-4 h-4 ${lastBpm > 100 ? 'text-red-400 animate-pulse' : 'text-pink-500'}`} />
                      <p className="text-xs text-gray-400 uppercase">Fréquence Cardiaque</p>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-white">{lastBpm}</span>
                      <span className="text-sm text-gray-500 mb-1">BPM</span>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                    <p className="text-xs text-gray-400 uppercase mb-2">Alertes Actives</p>
                    {currentAlerts.chute_detecte || currentAlerts.bnt_presse ? (
                      <div className="space-y-1">
                        {currentAlerts.chute_detecte && (
                          <span className="block px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded">
                            CHUTE DÉTECTÉE
                          </span>
                        )}
                        {currentAlerts.bnt_presse && (
                          <span className="block px-2 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded">
                            APPEL URGENCE
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-green-400 text-sm">Aucune alerte</p>
                    )}
                  </div>
                </div>

                {!showContactInfo && (
                  <button 
                    onClick={() => setShowContactInfo(true)}
                    className="w-full py-2 text-sm font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Afficher Contact
                  </button>
                )}
              </div>

              {/* Right: Chart (large) OR Contact Info */}
              {!showContactInfo ? (
                <div className="space-y-4">
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">Historique Cardiaque (20 min)</h3>
                  <div className="bg-black/20 rounded-lg p-4 border border-white/5 chart-container">
                    <StatsChart 
                      data={bpmHistory} 
                      color="#06b6d4"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">Contact Patient</h3>
                    <button 
                      onClick={() => setShowContactInfo(false)}
                      className="text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      Retour
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4 text-cyan-400" />
                        <p className="text-xs text-gray-400 uppercase">Numéro de téléphone</p>
                      </div>
                      <p className="text-lg font-bold text-white">{patient.telephone || 'Non renseigné'}</p>
                    </div>

                    <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Home className="w-4 h-4 text-cyan-400" />
                        <p className="text-xs text-gray-400 uppercase">Adresse</p>
                      </div>
                      <p className="text-lg font-bold text-white mb-2">{patient.adresse || 'Non renseignée'}</p>
                      {patient.adresse && (
                        <div className="w-full h-40 rounded-lg overflow-hidden border border-cyan-500/20 mt-3 relative">
                          <iframe
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/place?key=VOTRE_CLE_API_GOOGLE_MAPS&q=${encodeURIComponent(patient.adresse)}`}
                            className="absolute inset-0 w-full h-full border-0"
                          ></iframe>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;
