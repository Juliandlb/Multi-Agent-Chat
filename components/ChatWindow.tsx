import React from 'react';
import MessageBubble from './MessageBubble';

type Message = {
  sender: 'user' | 'agent';
  text: string;
};

// ChatWindow displays a list of messages and a loading indicator
export default function ChatWindow({
  messages,
  loading
}: {
  messages: Message[];
  loading: boolean;
}) {
  return (
    <div className="flex-1 overflow-y-auto mb-2 space-y-2">
      {/* Render each message */}
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} sender={msg.sender} text={msg.text} />
      ))}
      {/* Show loading indicator if agent is typing */}
      {loading && (
        <div className="flex justify-start">
          <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg inline-block animate-pulse">
            Agent is typing...
          </div>
        </div>
      )}
    </div>
  );
}
