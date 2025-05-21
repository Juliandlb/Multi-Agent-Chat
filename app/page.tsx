'use client';

import React, { useState, useRef, useEffect } from 'react';
import { trpc } from '@/utils/trpc';  // Import the tRPC client for API calls

export default function Home() {
  // State to store the list of chat messages
  const [messages, setMessages] = useState([
    { sender: 'agent', text: 'Hello! How can I help you today?' }
  ]);
  // State to store the current input value
  const [input, setInput] = useState('');
  // State to indicate if the agent is "typing"
  const [loading, setLoading] = useState(false);
  // Reference to the end of the messages list (for scrolling)
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hook up the mutation for sending messages
  const sendMessage = trpc.user.sendMessage.useMutation();

  // Function to handle sending a message
  const handleSend = async () => {
  if (!input.trim() || loading) return;

  const userMessage = input;
  setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
  setInput('');
  setLoading(true);

  try {
    const result = await sendMessage.mutateAsync({ message: userMessage });

    setMessages(prev => [
      ...prev,
      { sender: 'agent', text: result.reply },
      ...(result.trace ? [{ sender: 'system', text: `🧭 Path: ${result.trace.join(' → ')}` }] : [])
    ]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'agent', text: 'Oops! Something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };
;


  // Scroll to the bottom of the chat when messages or loading change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    // Main container: centers the chat on the page
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans">
      {/* Chat box container */}
      <div className="w-full max-w-md flex flex-col h-[80vh] bg-white rounded-3xl shadow-2xl border border-blue-100 font-sans">
        {/* Header */}
        <header className="p-6 border-b border-blue-100 flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-blue-100/10 rounded-t-3xl">
          <span className="font-bold text-2xl text-blue-700 tracking-tight font-sans">Multi-Agent Chat</span>
        </header>
        {/* Main chat area */}
        <main className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-white font-sans">
          {/* Render each message */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-5 py-3 rounded-2xl max-w-[75%] text-base shadow-sm transition break-words
                  ${msg.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-blue-50 text-blue-900 rounded-bl-md border border-blue-100'
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {/* Show "Agent is typing..." when loading */}
          {loading && (
            <div className="flex justify-start">
              <div className="px-5 py-3 rounded-2xl bg-blue-100 text-blue-700 text-base animate-pulse shadow-sm border border-blue-200">
                Agent is typing...
              </div>
            </div>
          )}
          {/* Dummy div to scroll to the bottom */}
          <div ref={messagesEndRef} />
        </main>
        {/* Footer with input form */}
        <footer className="p-6 border-t border-blue-100 bg-gradient-to-r from-blue-50/60 to-white rounded-b-3xl font-sans">
          <form
            className="flex gap-3"
            onSubmit={e => {
              e.preventDefault(); // Prevent page reload
              handleSend(); // Send the message
            }}
          >
            {/* Input box for typing messages */}
            <textarea
              className="flex-1 rounded-full border border-blue-200 px-5 py-3 text-base bg-white text-blue-900 outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder:text-blue-300 font-sans resize-none overflow-auto"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              autoFocus
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }} // Optional: control min/max height
            />
            {/* Send button */}
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold text-base shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              type="submit"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
