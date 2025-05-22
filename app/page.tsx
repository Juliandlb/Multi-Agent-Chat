'use client';

import React, { useState, useRef, useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import ChatHeader from '@/components/ChatHeader';
import ChatMessages from '@/components/ChatMessages';
import ChatInput from '@/components/ChatInput';
import UserDropdown from '@/components/UserDropdown';

export default function Home() {
  // Define the shape of a chat message
  type ChatMessage = {
    sender: 'user' | 'agent' | 'system';
    text: string;
    trace?: string[];
    timestamp?: string;
  };

  // State to store the list of chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'agent',
      text: 'Hello! Welcome to Moneda AI. How can I assist with your banking needs today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  // State to store the current input value
  const [input, setInput] = useState('');
  // State to indicate if the agent is "typing"
  const [loading, setLoading] = useState(false);
  // Reference to the end of the messages list (for scrolling)
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hook up the mutation for sending messages
  const sendMessage = trpc.user.sendMessage.useMutation();

  // Fetch user emails from the backend
  const { data: userEmails, isLoading: emailsLoading } = trpc.user.getAllEmails.useQuery();

  // State for current user email
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined);
  // State for dropdown open/close
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Set default user email when emails are loaded
  useEffect(() => {
    if (userEmails && userEmails.length > 0 && !currentUserEmail) {
      setCurrentUserEmail(userEmails[0]);
    }
  }, [userEmails, currentUserEmail]);

  // Function to handle sending a message
  const handleSend = async () => {
    if (!input.trim() || loading || !currentUserEmail) return;
    const userMessage = input;
    setMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text: userMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    setInput('');
    setLoading(true);

    try {
      // Send message to backend and get agent reply
      const result = await sendMessage.mutateAsync({ message: userMessage, email: currentUserEmail });
      setMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: result.reply,
          trace: result.trace,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: 'Oops! Something went wrong.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to the bottom of the chat when messages or loading change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f6f9fb] font-sans">
      <div className="w-full max-w-lg flex flex-col h-[80vh] bg-white rounded-2xl shadow-xl border border-blue-100 font-sans relative">
        <UserDropdown
          userEmails={userEmails}
          emailsLoading={emailsLoading}
          currentUserEmail={currentUserEmail}
          setCurrentUserEmail={setCurrentUserEmail}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
        />
        <ChatHeader />
        <ChatMessages
          messages={messages}
          loading={loading}
          messagesEndRef={messagesEndRef}
        />
        <ChatInput
          input={input}
          setInput={setInput}
          loading={loading}
          handleSend={handleSend}
        />
      </div>
    </div>
  );
}
