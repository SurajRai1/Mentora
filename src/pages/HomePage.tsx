import React from 'react';
import { Hero } from '../components/Hero';
import { Chat } from '../components/Chat';
import { Footer } from '../components/Footer';

export const HomePage = () => {
  return (
    <div>
      <Hero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Meet Eliana, Your AI Learning Assistant
            </h2>
            <p className="text-gray-600 mb-8">
              Eliana combines advanced AI with adaptive learning to provide personalized
              educational experiences. Ask questions, get guidance, and grow in your
              learning journey.
            </p>
          </div>
          <div>
            <Chat />
          </div>
        </div>
      </main>
    </div>
  );
};