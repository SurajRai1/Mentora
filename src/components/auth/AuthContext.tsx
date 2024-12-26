import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AuthModal } from '../AuthModal';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  showAuth: boolean;
  setShowAuth: (show: boolean) => void;
  authMode: 'signup' | 'signin';
  setAuthMode: (mode: 'signup' | 'signin') => void;
  userPreferences: any;
  setUserPreferences: (prefs: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [userPreferences, setUserPreferences] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          navigate('/onboarding');
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ 
      showAuth, 
      setShowAuth, 
      authMode, 
      setAuthMode,
      userPreferences,
      setUserPreferences
    }}>
      {children}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        mode={authMode}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};