import React from 'react';
import { X, Bell, AlertTriangle, Clock, Check } from 'lucide-react';
import { Patient } from '../types';

interface NotificationsModalProps {
  patients: Patient[];
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ patients, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Generate notifications from patients
  const notifications = patients.flatMap(patient => {
    const alerts = [];
    
    if (patient.currentAlerts.chute_detecte && patient.currentAlerts.chute_date) {
      alerts.push({
        id: `chute-${patient.id}`,
        patientId: patient.id,
        patientName: patient.name,
        room: patient.room,
        type: 'chute',
        message: 'Chute détectée',
        date: new Date(patient.currentAlerts.chute_date),
        severity: 'critical',
        read: false
      });
    }
    
    if (patient.currentAlerts.bnt_presse && patient.currentAlerts.bnt_date) {
      alerts.push({
        id: `button-${patient.id}`,
        patientId: patient.id,
        patientName: patient.name,
        room: patient.room,
        type: 'urgence',
        message: 'Bouton d\'urgence pressé',
        date: new Date(patient.currentAlerts.bnt_date),
        severity: 'critical',
        read: false
      });
    }

    // BPM anomalies
    const lastBpm = patient.bpmHistory[patient.bpmHistory.length - 1];
    if (lastBpm && lastBpm.valeur > 100) {
      alerts.push({
        id: `bpm-${patient.id}`,
        patientId: patient.id,
        patientName: patient.name,
        room: patient.room,
        type: 'bpm',
        message: `Rythme cardiaque élevé (${lastBpm.valeur} BPM)`,
        date: new Date(lastBpm.date_mesure),
        severity: 'warning',
        read: false
      });
    }
    
    return alerts;
  }).sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            Notifications
            {notifications.length > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                {notifications.length}
              </span>
            )}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" title="Fermer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all hover:bg-white/5 cursor-pointer ${
                    notification.severity === 'critical' 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : 'bg-yellow-500/10 border-yellow-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                        notification.severity === 'critical'
                          ? 'bg-red-500/20 border-red-500'
                          : 'bg-yellow-500/20 border-yellow-500'
                      }`}>
                        {notification.severity === 'critical' ? (
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        ) : (
                          <Bell className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-semibold ${
                            notification.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                            Chambre {notification.room} - {notification.patientName}
                          </span>
                          {notification.severity === 'critical' && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold uppercase rounded animate-pulse">
                              URGENT
                            </span>
                          )}
                        </div>
                        <p className="text-white text-base mb-1">{notification.message}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>
                            {notification.date.toLocaleDateString('fr-FR', { 
                              day: '2-digit', 
                              month: 'short' 
                            })} à {notification.date.toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button 
                      className="text-gray-400 hover:text-green-400 transition-colors"
                      title="Marquer comme lu"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Bell className="h-10 w-10 mb-2 opacity-50" />
              <p>Aucune notification</p>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 border-t border-white/10">
            <button className="w-full py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Marquer toutes comme lues
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsModal;
