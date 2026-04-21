import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { User } from './types';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = '970271443332-a6bdndhkl4be77d5g26t1nvu9qrl6iap.apps.googleusercontent.com';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <>
      {user ? (
        <Dashboard 
            user={user} 
            onLogout={handleLogout} 
            onUserUpdate={handleUserUpdate}
        />
      ) : (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <Login onLogin={handleLogin} />
        </GoogleOAuthProvider>
      )}
    </>
  );
};

export default App;