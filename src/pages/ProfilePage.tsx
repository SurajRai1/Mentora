import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { useUserProfile } from '../hooks/useUserProfile';
import { LogOut, Edit2 } from 'lucide-react';
import { ProfileForm } from '../components/auth/ProfileForm';
import { doc, updateDoc } from 'firebase/firestore';

export const ProfilePage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const { profile, loading } = useUserProfile(user?.uid);
  const [isEditing, setIsEditing] = useState(false);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpdateProfile = async (updatedData: any) => {
    try {
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          ...updatedData,
          updatedAt: new Date().toISOString()
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>;
  }

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Profile</h1>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-600 hover:text-gray-800 text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
          <ProfileForm
            initialData={profile}
            onSubmit={handleUpdateProfile}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Your Profile</h1>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm sm:text-base"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <p className="mt-1 text-base sm:text-lg text-gray-900">{profile?.firstName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <p className="mt-1 text-base sm:text-lg text-gray-900">{profile?.lastName}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">School Name</label>
            <p className="mt-1 text-base sm:text-lg text-gray-900">{profile?.schoolName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Grade Level</label>
            <p className="mt-1 text-base sm:text-lg text-gray-900">{profile?.gradeLevel}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subjects</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {profile?.subjects?.map((subject: string) => (
                <span
                  key={subject}
                  className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-purple-100 text-purple-800"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Learning Goals</label>
            <p className="mt-1 text-base sm:text-lg text-gray-900 whitespace-pre-wrap">
              {profile?.learningGoals}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="mt-6 sm:mt-8 w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};