import React from 'react';
import { Patient, User } from '../types';
import { Heart, AlertTriangle, Phone, Activity } from 'lucide-react';
import StatsChart from './StatsChart';

interface PatientCardProps {
  patient: Patient;
  user: User;
  onOpenDetails: (patient: Patient) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, user, onOpenDetails }) => {
  const { currentAlerts, bpmHistory } = patient;
  const lastBpm = bpmHistory[bpmHistory.length - 1]?.valeur || 0;

  // Logic: Chute or Button pressed recently (simulated by boolean flags here)
  const isEmergency = currentAlerts.chute_detecte || currentAlerts.bnt_presse;
  
  // Border color based on status
  const borderColor = isEmergency ? 'border-red-500/80' : 'border-cyan-500/30';
  const shadowClass = isEmergency ? 'animate-flash-red' : '';

  const isPatient = user.role === 'patient';

  return (
    <div className={`glass-panel rounded-xl p-5 border ${borderColor} ${shadowClass} transition-all duration-300 hover:bg-white/5 flex flex-col gap-4 relative overflow-hidden group`}>
      {isEmergency && (
        <div className="absolute inset-0 bg-red-500/10 z-0 pointer-events-none animate-pulse"></div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start z-10 relative">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${isEmergency ? 'bg-red-500/20 border-red-500' : 'bg-cyan-900/20 border-cyan-500/50'}`}>
            <span className={`text-xl font-bold ${isEmergency ? 'text-red-400' : 'text-cyan-400'}`}>
              {patient.room}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-100">{patient.name}</h3>
            <p className="text-xs text-gray-400">ID: #{patient.id.toString().padStart(4, '0')} • {patient.age} ans</p>
          </div>
        </div>
        
        {isEmergency && (
          <div className="flex flex-col items-end gap-1">
            {currentAlerts.chute_detecte && (
              <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                CHUTE DÉTECTÉE
              </span>
            )}
            {currentAlerts.bnt_presse && (
              <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.6)]">
                APPEL URGENCE
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 z-10 relative">
        <div className="bg-black/20 rounded-lg p-3 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Heart className={`w-4 h-4 ${lastBpm > 100 ? 'text-red-400 animate-pulse' : 'text-pink-500'}`} />
            <span className="text-xs text-gray-400 uppercase">Fréquence Cardiaque</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white">{lastBpm}</span>
            <span className="text-sm text-gray-500 mb-1">BPM</span>
          </div>
        </div>

        <div className="bg-black/20 rounded-lg p-3 border border-white/5 flex flex-col justify-between">
           <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400 uppercase">Statut Capteur</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-sm text-emerald-400">Actif</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="z-10 relative">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Historique (20 min)</p>
        <StatsChart 
          data={bpmHistory} 
          color={isEmergency ? '#ef4444' : '#06b6d4'} 
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2 z-10 relative border-t border-white/5">
        <button 
          onClick={() => onOpenDetails(patient)}
          className="flex-1 py-2 text-xs font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded transition-colors flex items-center justify-center gap-2"
        >
          <Activity className="w-3 h-3" />
          Détails
        </button>
        {!isPatient && (
          <button 
            onClick={() => onOpenDetails(patient)}
            className="flex-1 py-2 text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-3 h-3" />
            Contacter
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientCard;