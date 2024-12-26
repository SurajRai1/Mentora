import React from 'react';
import { Chat } from '../components/Chat';
import { BookOpen } from 'lucide-react';

export const ChatPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Chat with Eliana</h1>
        <p className="text-gray-600">
          Ask questions, get explanations, and receive personalized learning guidance.
        </p>
      </div>
      
      <Chat />
      
      <div className="mt-8 p-4 bg-purple-50 rounded-lg">
        <div className="flex items-start gap-3">
          <BookOpen className="w-6 h-6 text-purple-600 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900">Learning Tips</h3>
            <ul className="mt-2 text-sm text-gray-600 space-y-2">
              <li>• Be specific with your questions</li>
              <li>• Ask for examples if something isn't clear</li>
              <li>• Use follow-up questions to dive deeper</li>
              <li>• Connect concepts to real-world applications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};