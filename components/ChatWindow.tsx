import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatMessage } from '../types';
import Message from './Message';
import ChatInput from './ChatInput';
import LoadingSpinner from './LoadingSpinner';

const SYSTEM_INSTRUCTION = `You are IntelliTutor — an AI-powered personal learning coach with expertise in simplifying complex academic concepts and creating effective, personalized study plans.

Your objectives:
- Based on user input, generate a detailed study plan (organized by days or weeks).
- Explain each topic clearly in simple terms when requested.
- Recommend at least 3 free online resources (YouTube, Coursera, or blogs).
- Provide motivational feedback after each response to encourage continued learning.
- Keep your tone friendly, concise, and clear. Avoid overly technical language unless the user asks for deep detail.
`;

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial-bot-message',
      role: 'model',
      content: "Hello! I'm IntelliTutor, your personal AI learning coach. What subject or skill would you like to master today?",
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const initializeChat = () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const newChat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    chatRef.current = newChat;
    return newChat;
  };

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const chat = chatRef.current ?? initializeChat();
      const result = await chat.sendMessage({ message: userInput });
      const botMessage: ChatMessage = {
        id: Date.now().toString() + '-bot',
        role: 'model',
        content: result.text,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        role: 'model',
        content: 'Oops! Something went wrong. Please check your API key or try sending your message again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl h-[85vh] flex flex-col bg-gray-900 rounded-xl shadow-2xl border border-gray-700">
      <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-start justify-start">
            <div className="flex items-center space-x-3 ml-12">
              <LoadingSpinner />
              <span className="text-gray-400 italic">IntelliTutor is thinking...</span>
            </div>
          </div>
        )}
         <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow;