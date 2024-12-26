import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import { Menu, X, BookOpen, Brain, BarChart2, Trophy, Layout, MessageCircle } from 'lucide-react';

export const Navbar = () => {
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const navigation = [
    { name: 'Home', href: '/', icon: Layout },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Quizzes', href: '/quizzes', icon: Brain },
    { name: 'Brain Brawl', href: '/brain-brawl', icon: Trophy },
    { name: 'Progress', href: '/progress', icon: BarChart2 },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Mentora</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user && navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.href)
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
            {user && (
              <Link
                to="/profile"
                className="ml-2 flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`}
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
              </Link>
            )}
            {!user && (
              <div className="hidden md:flex items-center gap-4">
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
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user && navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
            {user && (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
              >
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`}
                  alt="Profile"
                  className="h-8 w-8 rounded-full mr-3"
                />
                Profile
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};