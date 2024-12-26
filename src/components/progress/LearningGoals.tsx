import React, { useState } from 'react';
import { useLearningGoals } from '../../hooks/useLearningGoals';
import { LearningGoal } from '../../types';
import { Target, Plus, Edit2, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export const LearningGoals = () => {
  const { goals, loading, error, addGoal, updateGoal, deleteGoal } = useLearningGoals();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<LearningGoal | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-medium text-gray-900">Learning Goals</h3>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {/* Goals List */}
      <div className="grid gap-4">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No learning goals set. Click "Add Goal" to get started!
          </div>
        ) : (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => setEditingGoal(goal)}
              onDelete={() => deleteGoal(goal.id)}
            />
          ))
        )}
      </div>

      {/* Add/Edit Goal Modal */}
      {(showAddModal || editingGoal) && (
        <GoalModal
          goal={editingGoal}
          onClose={() => {
            setShowAddModal(false);
            setEditingGoal(null);
          }}
          onSubmit={async (data) => {
            if (editingGoal) {
              await updateGoal(editingGoal.id, data);
            } else {
              await addGoal(data);
            }
            setShowAddModal(false);
            setEditingGoal(null);
          }}
        />
      )}
    </div>
  );
};

const GoalCard = ({ 
  goal, 
  onEdit, 
  onDelete 
}: { 
  goal: LearningGoal; 
  onEdit: () => void; 
  onDelete: () => void; 
}) => {
  const progress = (goal.currentValue / goal.targetValue) * 100;
  const statusColors = {
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800'
  };

  const StatusIcon = {
    active: Clock,
    completed: CheckCircle,
    overdue: AlertCircle
  }[goal.status];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-medium text-gray-900">{goal.title}</h4>
          <p className="text-sm text-gray-500">{goal.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <StatusIcon className="w-4 h-4" />
          <span className={`text-sm px-2 py-1 rounded-full ${statusColors[goal.status]}`}>
            {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
          </span>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Target: {goal.targetValue}</span>
          <span className="text-gray-500">Current: {goal.currentValue}</span>
        </div>

        <div className="text-sm text-gray-500">
          Due by: {new Date(goal.targetDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

const GoalModal = ({ 
  goal, 
  onClose, 
  onSubmit 
}: { 
  goal: LearningGoal | null; 
  onClose: () => void; 
  onSubmit: (data: Omit<LearningGoal, 'id' | 'userId' | 'createdAt' | 'status'>) => Promise<void>; 
}) => {
  const [formData, setFormData] = useState({
    title: goal?.title || '',
    description: goal?.description || '',
    category: goal?.category || 'quiz',
    targetValue: goal?.targetValue || 0,
    targetDate: goal?.targetDate?.split('T')[0] || '',
    subject: goal?.subject || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {goal ? 'Edit Goal' : 'Add New Goal'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            >
              <option value="quiz">Quiz</option>
              <option value="study">Study</option>
              <option value="subject">Subject</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Value</label>
            <input
              type="number"
              value={formData.targetValue}
              onChange={(e) => setFormData(prev => ({ ...prev, targetValue: Number(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Date</label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subject (Optional)</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {goal ? 'Update Goal' : 'Add Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 