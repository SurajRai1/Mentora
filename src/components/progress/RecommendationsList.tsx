import React from 'react';
import { StudyRecommendation } from '../../types/progress';
import { BookOpen, Clock, Target, ChevronRight } from 'lucide-react';

interface RecommendationsListProps {
  recommendations: StudyRecommendation[];
  onActionClick: (recommendation: StudyRecommendation) => void;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
  onActionClick
}) => {
  if (!recommendations.length) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
          <BookOpen className="w-6 h-6 text-purple-600" />
        </div>
        <p className="text-gray-500">No recommendations available yet.</p>
        <p className="text-sm text-gray-400">Complete more study sessions to get personalized recommendations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation) => (
        <div
          key={recommendation.id}
          className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {recommendation.type === 'topic' && (
                <BookOpen className="w-5 h-5 text-purple-600" />
              )}
              {recommendation.type === 'method' && (
                <Target className="w-5 h-5 text-blue-600" />
              )}
              {recommendation.type === 'schedule' && (
                <Clock className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
                </div>
                <span className={`
                  text-xs font-medium px-2 py-1 rounded-full
                  ${recommendation.priority === 'high' ? 'bg-red-100 text-red-700' : ''}
                  ${recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${recommendation.priority === 'low' ? 'bg-green-100 text-green-700' : ''}
                `}>
                  {recommendation.priority}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {recommendation.timeEstimate} mins
                </div>
                <button
                  onClick={() => onActionClick(recommendation)}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  Take Action
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};