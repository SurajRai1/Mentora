import React from 'react';
import { Target, AlertTriangle, Trophy, Lightbulb, ChevronRight } from 'lucide-react';
import { StudyInsight } from '../../types/progress';

interface InsightCardProps {
  insight: StudyInsight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'achievement': return <Trophy className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'milestone': return <Target className="w-5 h-5 text-blue-500" />;
      default: return <Lightbulb className="w-5 h-5 text-purple-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (insight.type) {
      case 'achievement': return 'bg-green-50';
      case 'warning': return 'bg-yellow-50';
      case 'milestone': return 'bg-blue-50';
      default: return 'bg-purple-50';
    }
  };

  return (
    <div className={`rounded-lg p-4 border ${getBackgroundColor()}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{insight.title}</h4>
          <p className="text-sm text-gray-600">{insight.description}</p>
          {insight.actionable && insight.action && (
            <button 
              onClick={() => window.location.href = insight.action!.url}
              className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 mt-2"
            >
              {insight.action.label}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 