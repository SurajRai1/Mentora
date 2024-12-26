import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { LearningGoal } from '../types';

export const useLearningGoals = () => {
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const goalsRef = collection(db, 'users', user.uid, 'learningGoals');
      const q = query(goalsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const fetchedGoals: LearningGoal[] = [];
      snapshot.forEach((doc) => {
        fetchedGoals.push({ id: doc.id, ...doc.data() } as LearningGoal);
      });

      // Update status based on dates and progress
      const updatedGoals = fetchedGoals.map(goal => {
        if (goal.status === 'completed') return goal;
        
        const targetDate = new Date(goal.targetDate);
        const now = new Date();
        const progress = (goal.currentValue / goal.targetValue) * 100;

        if (progress >= 100) {
          return { ...goal, status: 'completed' as const };
        } else if (targetDate < now) {
          return { ...goal, status: 'overdue' as const };
        }
        return goal;
      });

      setGoals(updatedGoals);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to load learning goals');
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goalData: Omit<LearningGoal, 'id' | 'userId' | 'createdAt' | 'status'>) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const newGoal: Omit<LearningGoal, 'id'> = {
        ...goalData,
        userId: user.uid,
        currentValue: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      const goalsRef = collection(db, 'users', user.uid, 'learningGoals');
      const docRef = await addDoc(goalsRef, newGoal);
      
      setGoals(prev => [{
        ...newGoal,
        id: docRef.id
      } as LearningGoal, ...prev]);

      return docRef.id;
    } catch (err) {
      console.error('Error adding goal:', err);
      throw new Error('Failed to add learning goal');
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<LearningGoal>) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const goalRef = doc(db, 'users', user.uid, 'learningGoals', goalId);
      await updateDoc(goalRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      setGoals(prev => prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, ...updates }
          : goal
      ));
    } catch (err) {
      console.error('Error updating goal:', err);
      throw new Error('Failed to update learning goal');
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const goalRef = doc(db, 'users', user.uid, 'learningGoals', goalId);
      await deleteDoc(goalRef);

      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    } catch (err) {
      console.error('Error deleting goal:', err);
      throw new Error('Failed to delete learning goal');
    }
  };

  const updateProgress = async (goalId: string, newValue: number) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) throw new Error('Goal not found');

      const progress = (newValue / goal.targetValue) * 100;
      const updates: Partial<LearningGoal> = {
        currentValue: newValue,
        status: progress >= 100 ? 'completed' : goal.status,
        completedAt: progress >= 100 ? new Date().toISOString() : undefined
      };

      await updateGoal(goalId, updates);
    } catch (err) {
      console.error('Error updating progress:', err);
      throw new Error('Failed to update progress');
    }
  };

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    refreshGoals: fetchGoals
  };
}; 