import React from 'react';
import MessageBubble from './MessageBubble';

type Message = {
  sender: 'user' | 'agent';
  text: string;
};

export default function ChatWindow({
  messages,
  loading
}: {
  messages: Message[];
  loading: boolean;
}) {
  return (
    <div className="flex-1 overflow-y-auto mb-2 space-y-2">
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} sender={msg.sender} text={msg.text} />
      ))}
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
