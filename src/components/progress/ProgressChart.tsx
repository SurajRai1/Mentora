import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface ProgressChartProps {
  data: {
    week: string;
    totalTime: number;
    sessionsCompleted: number;
  }[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="week"
          tick={{ fill: '#6B7280' }}
          tickLine={{ stroke: '#6B7280' }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: '#6B7280' }}
          tickLine={{ stroke: '#6B7280' }}
          label={{ value: 'Time (mins)', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: '#6B7280' }}
          tickLine={{ stroke: '#6B7280' }}
          label={{ value: 'Sessions', angle: 90, position: 'insideRight', fill: '#6B7280' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '0.375rem',
          }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="totalTime"
          name="Study Time"
          stroke="#8B5CF6"
          strokeWidth={2}
          dot={{ fill: '#8B5CF6', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="sessionsCompleted"
          name="Sessions"
          stroke="#10B981"
          strokeWidth={2}
          dot={{ fill: '#10B981', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};