import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Trophy, Target, TrendingUp, AlertCircle } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface QuizPerformanceProps {
  stats: {
    totalQuizzes: number;
    averageScore: number;
    subjectPerformance: Record<string, {
      totalQuizzes: number;
      averageScore: number;
      highestScore: number;
      recentScores: number[];
    }>;
    strongestSubject: string;
    weakestSubject: string;
  };
}

export const QuizPerformance = ({ stats }: QuizPerformanceProps) => {
  // Prepare data for the chart
  const chartData = {
    labels: Object.keys(stats.subjectPerformance),
    datasets: [
      {
        label: 'Average Score',
        data: Object.values(stats.subjectPerformance).map(s => s.averageScore),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Highest Score',
        data: Object.values(stats.subjectPerformance).map(s => s.highestScore),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance by Subject',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-purple-600" />
            <h4 className="font-medium text-gray-900">Overall Performance</h4>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total Quizzes Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageScore.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-purple-600" />
            <h4 className="font-medium text-gray-900">Subject Analysis</h4>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Strongest Subject</p>
              <p className="text-lg font-medium text-green-600">{stats.strongestSubject}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Needs Improvement</p>
              <p className="text-lg font-medium text-orange-600">{stats.weakestSubject}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          <h4 className="font-medium text-gray-900 text-sm sm:text-base">Performance Trends</h4>
        </div>
        <div className="h-[200px] sm:h-[300px]">
          <Line 
            data={chartData} 
            options={{
              ...chartOptions,
              maintainAspectRatio: false,
              responsive: true,
              scales: {
                ...chartOptions.scales,
                x: {
                  ...chartOptions.scales?.x,
                  ticks: {
                    ...chartOptions.scales?.x?.ticks,
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                      size: window.innerWidth < 640 ? 10 : 12
                    }
                  }
                },
                y: {
                  ...chartOptions.scales?.y,
                  ticks: {
                    ...chartOptions.scales?.y?.ticks,
                    font: {
                      size: window.innerWidth < 640 ? 10 : 12
                    }
                  }
                }
              }
            }} 
          />
        </div>
      </div>

      {/* Subject Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          <h4 className="font-medium text-gray-900 text-sm sm:text-base">Subject Details</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(stats.subjectPerformance).map(([subject, data]) => (
            <div key={subject} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-medium text-gray-900 text-sm sm:text-base">{subject}</h5>
                <span className="text-xs sm:text-sm text-gray-500">{data.totalQuizzes} quizzes</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Average</p>
                  <p className="font-medium text-gray-900 text-sm sm:text-base tabular-nums">
                    {data.averageScore.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Highest</p>
                  <p className="font-medium text-gray-900 text-sm sm:text-base tabular-nums">
                    {data.highestScore}%
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-900 font-medium tabular-nums">
                    {data.completionRate.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${data.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 