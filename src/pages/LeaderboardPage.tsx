import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Target, Calendar, Crown, Filter, Book, Menu } from 'lucide-react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { LeaderboardType, LeaderboardTimeframe, LeaderboardEntry } from '../types/leaderboard';
import { Subject } from '../types/brainBrawl';

const subjects: Subject[] = [
  'Mathematics',
  'Science',
  'Computer Science',
  'History',
  'Music',
  'General Knowledge',
  'Economics'
];

export const LeaderboardPage = () => {
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('global');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Mathematics');
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('all-time');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { globalLeaderboard, subjectLeaderboard, weeklyLeaderboard, loading, error } = useLeaderboard(
    leaderboardType,
    selectedSubject,
    timeframe
  );

  const currentLeaderboard = (() => {
    switch (leaderboardType) {
      case 'global':
        return globalLeaderboard?.entries || [];
      case 'subject':
        return subjectLeaderboard?.entries || [];
      case 'weekly':
        return weeklyLeaderboard?.entries || [];
      default:
        return [];
    }
  })();

  const getLeaderboardTitle = () => {
    switch (leaderboardType) {
      case 'global':
        return 'Global Rankings';
      case 'subject':
        return `${selectedSubject} Rankings`;
      case 'weekly':
        return 'Weekly Rankings';
      default:
        return 'Leaderboard';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 flex items-center justify-center gap-2 sm:gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Trophy className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-purple-600" />
          <span className="truncate">{getLeaderboardTitle()}</span>
        </motion.h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Compete with others and climb the ranks!
        </p>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 text-red-600 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-4 sm:mb-6 md:mb-8 overflow-hidden">
        <div className="p-3 sm:p-4 bg-purple-50 border-b border-purple-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            <span className="font-medium text-purple-900 text-sm sm:text-base">Filters</span>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="text-purple-600 hover:text-purple-700 transition-colors text-sm sm:text-base"
          >
            {isFilterOpen ? 'Hide' : 'Show'}
          </button>
        </div>
        
        {isFilterOpen && (
          <div className="p-3 sm:p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {/* Leaderboard Type */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                View Type
              </label>
              <div className="flex flex-col space-y-1 sm:space-y-2">
                {['global', 'subject', 'weekly'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setLeaderboardType(type as LeaderboardType)}
                    className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
                      leaderboardType === type
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {type === 'global' && <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />}
                    {type === 'subject' && <Book className="h-3 w-3 sm:h-4 sm:w-4" />}
                    {type === 'weekly' && <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Selection */}
            {leaderboardType === 'subject' && (
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Subject
                </label>
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                    className="w-full bg-white border border-gray-300 rounded-lg py-1.5 sm:py-2 px-2 sm:px-3 text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Time Period */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Time Period
              </label>
              <div className="flex flex-col space-y-1 sm:space-y-2">
                {[
                  { value: 'all-time', label: 'All Time' },
                  { value: 'weekly', label: 'This Week' },
                  { value: 'monthly', label: 'This Month' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setTimeframe(value as LeaderboardTimeframe)}
                    className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base ${
                      timeframe === value
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="min-w-[320px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="min-w-[480px] sm:min-w-full"> {/* Minimum width to prevent crushing */}
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[60px] sm:w-[80px]">
                    Rank
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px] sm:w-[100px]">
                    Score
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px]">
                    Games
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[90px] sm:w-[100px]">
                    Win Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentLeaderboard.map((entry: LeaderboardEntry, index: number) => (
                  <motion.tr 
                    key={entry.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`${index < 3 ? 'bg-purple-50' : ''} hover:bg-gray-50 transition-colors`}
                  >
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index < 3 ? (
                          <span className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full ${
                            index === 0 ? 'bg-yellow-100' :
                            index === 1 ? 'bg-gray-100' :
                            'bg-orange-100'
                          }`}>
                            {index === 0 && <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
                            {index === 1 && <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
                            {index === 2 && <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />}
                          </span>
                        ) : (
                          <span className="text-gray-900 font-medium text-sm sm:text-base tabular-nums">{entry.rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {entry.photoURL ? (
                          <img
                            src={entry.photoURL}
                            alt={entry.displayName}
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                          />
                        ) : (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-600 font-medium text-sm sm:text-base">
                              {entry.displayName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="ml-2 sm:ml-3 font-medium text-gray-900 text-sm sm:text-base truncate max-w-[80px] sm:max-w-[120px] md:max-w-[200px] lg:max-w-none">
                          {entry.displayName}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <span className="text-gray-900 font-medium text-sm sm:text-base tabular-nums">
                        {entry.score.toLocaleString()}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-gray-900 text-sm sm:text-base tabular-nums">
                      {entry.gamesPlayed}
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium tabular-nums ${
                        entry.winRate >= 75 ? 'bg-green-100 text-green-800' :
                        entry.winRate >= 50 ? 'bg-blue-100 text-blue-800' :
                        entry.winRate >= 25 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {entry.winRate}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
                {currentLeaderboard.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12 text-center text-gray-500 text-sm sm:text-base">
                      No entries found for this leaderboard.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};