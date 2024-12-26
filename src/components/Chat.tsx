import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, AlertCircle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { generateResponse, validateMessage } from '../lib/chat/chatService';
import { useUserProfile } from '../hooks/useUserProfile';
import 'katex/dist/katex.min.css';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'ai';
  timestamp: Date;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useUserProfile();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
    scrollToBottom();
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0 && profile) {
      const greeting: Message = {
        id: crypto.randomUUID(),
        content: `Hi${profile.firstName ? ` ${profile.firstName}` : ''}! 👋 I'm Eliana, your AI learning assistant. I'm here to help you with your studies! 📚✨\n\nI can help you with:\n- Understanding difficult concepts\n- Solving problems step by step\n- Answering questions in any subject\n- Providing practice exercises\n\nWhat would you like to learn about today?`,
        role: 'ai',
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!validateMessage(inputMessage)) {
      setError('Please enter a valid message (1-2000 characters)');
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setError(null);

    try {
      const response = await generateResponse(
        inputMessage,
        {
          gradeLevel: profile?.gradeLevel,
          subjects: profile?.subjects,
          learningGoals: profile?.learningGoals,
        },
        messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      );

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        role: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to get response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        <Bot className="w-6 h-6 text-purple-600" />
        <div>
          <h3 className="font-medium text-gray-900">Eliana</h3>
          <p className="text-sm text-gray-500">AI Learning Assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth bg-gray-50"
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white ml-4'
                    : 'bg-white text-gray-900 mr-4'
                }`}
              >
                {message.role === 'ai' ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        p: ({children}) => <p className="mb-2 last:mb-0 text-gray-800">{children}</p>,
                        h1: ({children}) => <h1 className="text-xl font-bold mb-2 text-gray-900">{children}</h1>,
                        h2: ({children}) => <h2 className="text-lg font-bold mb-2 text-gray-900">{children}</h2>,
                        h3: ({children}) => <h3 className="text-base font-bold mb-2 text-gray-900">{children}</h3>,
                        ul: ({children}) => <ul className="list-disc list-inside mb-2 text-gray-800">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside mb-2 text-gray-800">{children}</ol>,
                        li: ({children}) => <li className="mb-1 text-gray-800">{children}</li>,
                        code({node, inline, className, children, ...props}) {
                          if (inline) {
                            return (
                              <code className="px-1.5 py-0.5 rounded bg-gray-100 text-purple-600 font-mono text-sm">
                                {children}
                              </code>
                            );
                          }
                          return (
                            <div className="bg-gray-100 rounded-lg p-3 my-2">
                              <code className="block text-sm text-gray-800 font-mono whitespace-pre-wrap">
                                {children}
                              </code>
                            </div>
                          );
                        }
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500">
            <Bot className="w-4 h-4" />
            <div className="flex gap-1">
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                •
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              >
                •
              </motion.span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              >
                •
              </motion.span>
            </div>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg mx-4"
          >
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
              setError(null);
            }}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !inputMessage.trim()}
            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTyping ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};