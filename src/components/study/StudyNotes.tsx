import React from 'react';
import { BookOpen, Save } from 'lucide-react';

interface StudyNotesProps {
  session: any;
  onGenerateNotes: (conversation: any[]) => void;
  onSaveNote: (note: string) => void;
  isGenerating: boolean;
}

export const StudyNotes: React.FC<StudyNotesProps> = ({
  session,
  onGenerateNotes,
  onSaveNote,
  isGenerating
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Study Notes</h2>
        {session && (
          <button
            onClick={() => onSaveNote(session.notes)}
            className="flex items-center text-sm text-purple-600 hover:text-purple-700"
          >
            <Save className="w-4 h-4 mr-1" />
            Save Notes
          </button>
        )}
      </div>

      {isGenerating ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : session ? (
        <div className="prose prose-sm max-w-none">
          {session.notes}
        </div>
      ) : (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Your study notes will appear here after you generate them from your conversation.
          </p>
        </div>
      )}
    </div>
  );
};