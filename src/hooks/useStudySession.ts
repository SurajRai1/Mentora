import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { generateResponse } from '../lib/openai';

export const useStudySession = () => {
  const [user] = useAuthState(auth);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);

  const generateNotes = async (conversation: any[]) => {
    if (!user) return;
    
    setIsGeneratingNotes(true);
    try {
      const prompt = `Based on this conversation, generate concise study notes with key points, definitions, and examples:\n${conversation.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`;
      
      const notes = await generateResponse(prompt);
      
      const sessionDoc = await addDoc(collection(db, 'studySessions'), {
        userId: user.uid,
        notes,
        conversation,
        createdAt: new Date().toISOString(),
      });

      setCurrentSession({ id: sessionDoc.id, notes, conversation });
    } catch (error) {
      console.error('Error generating notes:', error);
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  const saveNote = async (note: string) => {
    if (!user || !currentSession) return;
    
    try {
      await addDoc(collection(db, 'notes'), {
        userId: user.uid,
        sessionId: currentSession.id,
        content: note,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return {
    currentSession,
    generateNotes,
    saveNote,
    isGeneratingNotes,
  };
};