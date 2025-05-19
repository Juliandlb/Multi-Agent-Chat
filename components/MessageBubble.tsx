import React from 'react';

export default function MessageBubble({
  sender,
  text
}: {
  sender: 'user' | 'agent';
  text: string;
}) {
  const isUser = sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs break-words ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        {text}
      </div>
    </div>
  );
}
