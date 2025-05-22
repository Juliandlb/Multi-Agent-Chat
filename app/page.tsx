'use client';

import React, { useState, useRef, useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import ReactMarkdown from 'react-markdown';

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
        {/* User selector dropdown */}
        <div className="absolute top-4 right-4 z-20">
          <div className="relative">
            <button
              className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition"
              onClick={() => setDropdownOpen(v => !v)}
              aria-label="Select user"
              type="button"
            >
              {/* User icon (SVG) */}
              <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-blue-100 rounded-lg shadow-lg z-30">
                {emailsLoading ? (
                  <div className="px-4 py-2 text-sm text-blue-400">Loading...</div>
                ) : (
                  userEmails?.map(email => (
                    <button
                      key={email}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-black ${
                        email === currentUserEmail ? 'bg-blue-100 font-semibold' : ''
                      }`}
                      onClick={() => {
                        setCurrentUserEmail(email);
                        setDropdownOpen(false);
                      }}
                    >
                      {email}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        {/* Header */}
        <header className="p-5 border-b border-blue-100 flex items-center gap-3 bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            {/* Replace text avatar with Moneda logo */}
            <img
              src="/MonedaLogo.jpeg"
              alt="Moneda Logo"
              className="rounded-full w-10 h-10 object-cover border border-blue-200"
            />
            <div>
              <div className="font-bold text-lg text-blue-900 leading-tight">Moneda Multi-Agent Assistant</div>
              <div className="text-xs text-blue-500">Your intelligent banking companion</div>
            </div>
          </div>
        </header>
        {/* Main chat area */}
        <main className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-white font-sans">
          {/* Render each chat message */}
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div>
                    {isUser ? (
                      <div className="bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                        U
                      </div>
                    ) : (
                      // Use Moneda logo for agent avatar
                      <img
                        src="/MonedaLogo.jpeg"
                        alt="Moneda Logo"
                        className="rounded-full w-8 h-8 object-cover border border-blue-200"
                      />
                    )}
                  </div>
                  {/* Bubble */}
                  <div>
                    <div
                      className={`px-4 py-3 rounded-xl max-w-xs text-base break-words shadow-sm
                        ${isUser
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md border border-blue-100'
                        }`}
                    >
                      <div>
                        {/* Render message text as Markdown */}
                        <ReactMarkdown
                          components={{
                            // Optionally, you can style strong/bold text for user/agent
                            strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                            // You can add more overrides if needed
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                    {/* Processing path (trace) */}
                    {msg.trace && (
                      <div className="mt-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded px-2 py-1 inline-block">
                        <span className="font-semibold">Processing path:</span>{' '}
                        {msg.trace.join(' → ')}
                      </div>
                    )}
                    {/* Timestamp */}
                    <div className="text-[11px] text-gray-400 mt-1 ml-1">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Loading indicator for agent typing */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2">
                {/* Use Moneda logo instead of "M" */}
                <img
                  src="/MonedaLogo.jpeg"
                  alt="Moneda Logo"
                  className="rounded-full w-8 h-8 object-cover border border-blue-200"
                />
                <div className="px-4 py-3 rounded-xl bg-gray-100 text-gray-900 text-base animate-pulse shadow-sm border border-blue-100">
                  Agent is typing...
                </div>
              </div>
            </div>
          )}
          {/* Dummy div for scroll-to-bottom */}
          <div ref={messagesEndRef} />
        </main>
        {/* Footer with input form */}
        <footer className="p-5 border-t border-blue-100 bg-white rounded-b-2xl font-sans">
          <form
            className="flex flex-col gap-2"
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
          >
            <div className="flex gap-2 items-end">
              <textarea
                className="flex-1 rounded-2xl border border-blue-100 bg-[#f6f9fb] px-5 py-4 text-base text-blue-900 outline-none focus:ring-2 focus:ring-blue-300 shadow-md transition placeholder:text-blue-300 font-sans resize-none overflow-auto min-h-[48px] max-h-[120px] scrollbar-none"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
                autoFocus
                rows={2}
                style={{
                  minHeight: '72px',
                  maxHeight: '120px',
                  scrollbarWidth: 'none', // Firefox
                  msOverflowStyle: 'none', // IE 10+
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full font-bold text-base shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed font-sans flex items-center justify-center"
                type="submit"
                disabled={loading || !input.trim()}
                style={{ height: '48px', width: '48px', minWidth: '48px', minHeight: '48px' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-blue-300 mt-1 ml-2 select-none">
              Press Enter to send, Shift+Enter for a new line
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
}
