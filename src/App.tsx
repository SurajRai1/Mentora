import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './lib/firebase';
import { Navbar } from './components/navigation/Navbar';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProgressPage } from './pages/ProgressPage';
import { QuizPage } from './pages/QuizPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResourceLibraryPage } from './pages/ResourceLibraryPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { Footer } from './components/Footer';
import { AuthProvider } from './components/auth/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { QuizzesPage } from './pages/QuizzesPage';
import { BrainBrawlPage } from './pages/BrainBrawlPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const hasCompleteProfile = userDoc.exists() && userDoc.data().firstName;
        setProfileLoading(false);

        // If no profile, redirect to profile creation
        if (!hasCompleteProfile && window.location.pathname !== '/profile') {
          navigate('/profile');
        }
      }
    };

    if (user) {
      checkProfile();
    } else {
      setProfileLoading(false);
    }
  }, [user, navigate]);

  if (loading || profileLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/documentation" element={<DocumentationPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/onboarding" element={
                <PrivateRoute>
                  <OnboardingFlow />
                </PrivateRoute>
              } />
              <Route path="/chat" element={
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />
              <Route path="/progress" element={
                <PrivateRoute>
                  <ProgressPage />
                </PrivateRoute>
              } />
              <Route path="/quiz/:subject?" element={
                <PrivateRoute>
                  <QuizPage />
                </PrivateRoute>
              } />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } />
              <Route path="/brain-brawl" element={
                <PrivateRoute>
                  <BrainBrawlPage />
                </PrivateRoute>
              } />
              <Route path="/leaderboard" element={
                <PrivateRoute>
                  <LeaderboardPage />
                </PrivateRoute>
              } />
              <Route path="/quizzes" element={
                <PrivateRoute>
                  <QuizzesPage />
                </PrivateRoute>
              } />
              <Route path="/quiz/:subject" element={
                <PrivateRoute>
                  <QuizPage />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
};