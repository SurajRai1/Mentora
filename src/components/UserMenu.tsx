import React from 'react';
import { LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAuth } from './auth/AuthContext';

export const UserMenu = () => {
  const [user] = useAuthState(auth);
  const { setShowAuth, setAuthMode } = useAuth();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex gap-4">
        <button
          onClick={() => {
            setAuthMode('signin');
            setShowAuth(true);
          }}
          className="text-gray-600 hover:text-gray-900"
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setAuthMode('signup');
            setShowAuth(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
    >
      <LogOut size={20} />
      <span>Sign Out</span>
    </button>
  );
};