import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ChevronRight, Loader2 } from 'lucide-react';
import { useUserProfile } from '../hooks/useUserProfile';

export const QuizzesPage = () => {
  const { profile, loading, error } = useUserProfile();
  const subjects = profile?.subjects || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error loading profile. Please try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Subject Quizzes</h1>
        <p className="text-gray-600">
          Test your knowledge with our adaptive quizzes. Each quiz is tailored to your grade level.
        </p>
      </div>

      {profile && subjects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {subjects.map((subject) => (
            <Link
              key={subject}
              to={`/quiz/${encodeURIComponent(subject)}`}
              className="group bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{subject}</h3>
                    <p className="text-sm text-gray-500">Grade {profile.gradeLevel}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Please update your profile with subjects you're interested in to see available quizzes.
          </p>
          <Link
            to="/profile"
            className="mt-4 inline-flex items-center text-purple-600 hover:text-purple-700"
          >
            Update Profile
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
}; 