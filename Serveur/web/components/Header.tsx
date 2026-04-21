import React from 'react';
import { Activity, Menu, Bell, LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  user: string;
  role?: string;
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenHistory?: () => void;
  onOpenNotifications?: () => void;
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({ user, role, onLogout, onOpenProfile, onOpenHistory, onOpenNotifications, notificationCount = 0 }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-cyan-500/20 px-6 py-3 flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center">
          <span className="text-cyan-400 font-bold text-lg neon-text">ACC</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Hub Médical</h1>
          <p className="text-xs text-cyan-400/70 uppercase tracking-widest">MediMonitor Pro v1.7</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-6">
          <button className="text-sm font-medium text-cyan-400 border-b-2 border-cyan-400 pb-1">Dashboard</button>
          
          {(role === 'admin' || role === 'super_admin') && (
            <button className="text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors">Patients</button>
          )}

          <button 
            onClick={onOpenHistory}
            className="text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors"
          >
            Historique
          </button>
        </nav>

        <div className="h-6 w-px bg-cyan-500/20 mx-2"></div>

        <div className="flex items-center gap-4">
          <div className="relative">
             <Bell 
               onClick={onOpenNotifications}
               className="w-5 h-5 text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors" 
             />
             {notificationCount > 0 && (
               <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center text-[9px] font-bold text-white">
                 {notificationCount > 9 ? '9+' : notificationCount}
               </span>
             )}
          </div>
          
          <button 
            onClick={onOpenProfile}
            className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
          >
             <UserIcon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
             <span className="text-xs font-medium text-gray-300 max-w-[100px] truncate">{user}</span>
          </button>

          <button onClick={onLogout} title="Déconnexion" className="text-gray-400 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;