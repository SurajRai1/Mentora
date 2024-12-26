import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { ProfileForm } from './ProfileForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signup' 
}) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const isNewUser = result._tokenResponse?.isNewUser;
      
      if (isNewUser) {
        setUserData(result.user);
        setStep(2);
      } else {
        onClose();
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (mode === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        setUserData(result.user);
        setStep(2);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleProfileSubmit = async (profileData: any) => {
    try {
      if (userData) {
        await setDoc(doc(db, 'users', userData.uid), {
          ...profileData,
          email: userData.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        onClose();
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full relative"
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">
              {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setMode('signin')}
                className={`pb-2 px-4 ${mode === 'signin' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`pb-2 px-4 ${mode === 'signup' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
              >
                Sign Up
              </button>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-50 mb-4"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                {mode === 'signup' ? 'Sign Up' : 'Sign In'}
              </button>
            </form>
          </>
        ) : (
          <ProfileForm onSubmit={handleProfileSubmit} />
        )}
      </motion.div>
    </div>
  );
};