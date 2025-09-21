
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { Message, MessageSender } from '../types';
import { createChatSession } from '../services/geminiService';
import MessageBox from './MessageBox';
import LoadingSpinner from './LoadingSpinner';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatRef.current = createChatSession();
    setMessages([{
        id: 'initial-ai-message',
        sender: MessageSender.AI,
        text: "Hello! I'm Gemini. How can I assist you today?"
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: MessageSender.User,
      text: input,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMessageId, sender: MessageSender.AI, text: '' }]);
    
    try {
      const stream = await chatRef.current.sendMessageStream({ message: input });

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunkText } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev =>
          prev.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: 'Sorry, I encountered an error. Please try again.' } : msg
          )
        );
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <div className="w-full max-w-4xl h-[calc(100vh-150px)] flex flex-col bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
      <div className="flex-grow p-6 overflow-y-auto">
        {messages.map(msg => (
          <MessageBox key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length-1].sender === MessageSender.User && (
             <div className="flex items-start gap-3 my-4 justify-start">
                 <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-gray-600 text-gray-300">
                     <LoadingSpinner className="h-6 w-6" />
                 </div>
                 <div className="max-w-xl p-4 rounded-xl shadow-md bg-gray-700 text-gray-200 rounded-bl-none">
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Type your message here..."
            className="flex-grow bg-gray-700 text-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white rounded-lg p-3 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
