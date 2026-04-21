import React, { useState } from 'react';
import { login, loginWithGoogle, loginWithMicrosoft } from '../services/api';
import { useGoogleLogin } from '@react-oauth/google';
import { PublicClientApplication } from '@azure/msal-browser';

import RgpdModal from './RgpdModal';

const msalConfig = {
  auth: {
    clientId: '2402068b-01f8-4679-89ac-9067248a5c26',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin
  }
};
const msalInstance = new PublicClientApplication(msalConfig);

let msalInitialized = false;

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRgpdOpen, setIsRgpdOpen] = useState(false);

  const handleGoogleSuccess = async (tokenResponse: any) => {
    setLoading(true);
    setError('');
    try {
      // Récupérer les infos utilisateur depuis Google
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
      });
      const userInfo = await res.json();
      
      // Essayer de se connecter par l'API avec cet email
      const user = await loginWithGoogle(userInfo.email);
      onLogin(user);
    } catch (err: any) {
      setError(err?.message || 'Ce compte Google n\'est pas reconnu');
    }
    setLoading(false);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('Échec de la connexion Google'),
  });

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    setError('');
    try {
      if (!msalInitialized) {
        await msalInstance.initialize();
        msalInitialized = true;
      }
      const loginResponse = await msalInstance.loginPopup({ scopes: ['user.read'] });
      if (loginResponse && loginResponse.account && loginResponse.account.username) {
        const user = await loginWithMicrosoft(loginResponse.account.username);
        onLogin(user);
      } else {
        setError('Impossible de récupérer les informations du compte Microsoft.');
      }
    } catch (err: any) {
      if (err?.name !== 'BrowserAuthError' || !err?.message.includes('user_cancelled')) {
        setError(err?.message || 'Échec de la connexion Microsoft');
      }
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(username, password);
      onLogin(user);
    } catch (err: any) {
      setError(err?.message || 'Identifiants invalides');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="glass-panel p-10 rounded-2xl w-full max-w-md relative z-10 border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
           <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center mb-4 neon-border">
            <span className="text-cyan-400 font-bold text-2xl neon-text">ACC</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">MediMonitor Pro</h1>
          <p className="text-gray-400 text-sm">Accès sécurisé au Hub Médical</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase text-gray-400 mb-2 font-medium tracking-wider">Identifiant</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/30 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-600"
              placeholder="ex: admin"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-gray-400 mb-2 font-medium tracking-wider">Mot de passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/30 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-600"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-[0_0_15px_rgba(8,145,178,0.4)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
          >
            {loading ? 'Connexion...' : 'Accéder au Dashboard'}
          </button>
          <div className="text-center text-xs text-gray-500 mt-4">
            En vous connectant, vous acceptez la <button type="button" onClick={() => setIsRgpdOpen(true)} className="text-cyan-500 hover:text-cyan-400 underline decoration-cyan-500/30">politique de confidentialité RGPD</button> de la Belgique.
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs text-gray-500 uppercase tracking-widest bg-transparent">
              <span className="bg-[#111] px-4 rounded-full border border-gray-800">ou continuer avec</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button 
              type="button"
              disabled={loading}
              className="w-full bg-black/40 hover:bg-black/60 border border-gray-600 hover:border-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 relative group disabled:opacity-50"
              onClick={() => googleLogin()}
            >
              <svg className="w-5 h-5 absolute left-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Connexion avec Google
            </button>
            <button 
              type="button"
              disabled={loading}
              className="w-full bg-[#000]/40 hover:bg-[#000]/60 border border-[#00a4ef]/40 hover:border-[#00a4ef]/80 text-[#00a4ef] hover:text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 relative group disabled:opacity-50"
              onClick={handleMicrosoftLogin}
            >
              <svg className="w-5 h-5 absolute left-4 group-hover:scale-110 transition-transform" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              Connexion avec Microsoft
            </button>
          </div>
        </div>
      </div>
      
      {isRgpdOpen && <RgpdModal onClose={() => setIsRgpdOpen(false)} />}
    </div>
  );
};

export default Login;