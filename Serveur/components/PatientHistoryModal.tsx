import React, { useState } from 'react';
import { X, Clock, Activity, AlertTriangle, Bell } from 'lucide-react';
import { Patient } from '../types';

interface PatientHistoryModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

const PatientHistoryModal: React.FC<PatientHistoryModalProps> = ({ patient, isOpen, onClose }) => {
  if (!isOpen) return null;

  const { bpmHistory, currentAlerts } = patient;

  // Generate history events from BPM readings and alerts
  const historyEvents = [
    ...bpmHistory.slice(-20).map(reading => ({
      id: reading.id,
      type: 'bpm',
      date: new Date(reading.date_mesure),
      value: reading.valeur,
      status: reading.valeur > 100 ? 'warning' : 'normal'
    })),
    ...(currentAlerts.chute_detecte && currentAlerts.chute_date ? [{
      id: 'chute-' + new Date(currentAlerts.chute_date).getTime(),
      type: 'alert',
      date: new Date(currentAlerts.chute_date),
      value: 'Chute détectée',
      status: 'danger'
    }] : []),
    ...(currentAlerts.bnt_presse && currentAlerts.bnt_date ? [{
      id: 'button-' + new Date(currentAlerts.bnt_date).getTime(),
      type: 'alert',
      date: new Date(currentAlerts.bnt_date),
      value: 'Bouton d\'urgence pressé',
      status: 'danger'
    }] : [])
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Historique Patient - {patient.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" title="Fermer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
          {historyEvents.length > 0 ? (
            <div className="space-y-3">
              {historyEvents.map((event, index) => (
                <div 
                  key={event.id}
                  className={`p-4 rounded-lg border transition-all hover:bg-white/5 ${
                    event.status === 'danger' 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : event.status === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-black/20 border-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                        event.status === 'danger'
                          ? 'bg-red-500/20 border-red-500'
                          : event.status === 'warning'
                          ? 'bg-yellow-500/20 border-yellow-500'
                          : 'bg-cyan-500/20 border-cyan-500'
                      }`}>
                        {event.type === 'alert' ? (
                          <AlertTriangle className={`w-5 h-5 ${event.status === 'danger' ? 'text-red-400' : 'text-yellow-400'}`} />
                        ) : (
                          <Activity className={`w-5 h-5 ${event.status === 'warning' ? 'text-yellow-400' : 'text-cyan-400'}`} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-semibold ${
                            event.status === 'danger'
                              ? 'text-red-400'
                              : event.status === 'warning'
                              ? 'text-yellow-400'
                              : 'text-cyan-400'
                          }`}>
                            {event.type === 'alert' ? 'ALERTE' : 'MESURE BPM'}
                          </span>
                          {event.status === 'danger' && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold uppercase rounded">
                              URGENT
                            </span>
                          )}
                        </div>
                        <p className="text-white text-base mb-1">
                          {typeof event.value === 'string' ? event.value : `${event.value} BPM`}
                        </p>
                        <p className="text-xs text-gray-400">
                          {event.date.toLocaleDateString('fr-FR', { 
                            day: '2-digit', 
                            month: 'long', 
                            year: 'numeric' 
                          })} à {event.date.toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Clock className="h-10 w-10 mb-2 opacity-50" />
              <p>Aucun historique disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHistoryModal;
