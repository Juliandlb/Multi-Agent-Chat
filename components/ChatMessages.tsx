// ChatMessages: Displays the list of chat messages in the conversation, including user, agent, and system messages.

import React from 'react';
import ReactMarkdown from 'react-markdown';

type ChatMessage = {
  /** Who sent the message: user, agent, or system */
  sender: 'user' | 'agent' | 'system';
  /** The message text (supports Markdown) */
  text: string;
  /** Optional trace of processing steps */
  trace?: string[];
  /** Optional timestamp for the message */
  timestamp?: string;
};

type Props = {
  /** Array of chat messages to display */
  messages: ChatMessage[];
  /** Whether a message is currently being sent/received */
  loading: boolean;
  /** Ref to scroll to the end of the messages */
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

const ChatMessages: React.FC<Props> = ({ messages, loading, messagesEndRef }) => (
  <main className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-white font-sans">
    {/* Render each message */}
    {messages.map((msg, idx) => {
      const isUser = msg.sender === 'user';
      return (
        <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div>
              {/* Show user avatar or agent logo */}
              {isUser ? (
                <div className="bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                  U
                </div>
              ) : (
                <img
                  src="/MonedaLogo.jpeg"
                  alt="Moneda Logo"
                  className="rounded-full w-8 h-8 object-cover border border-blue-200"
                />
              )}
            </div>
            <div>
              {/* Message bubble */}
              <div
                className={`px-4 py-3 rounded-xl max-w-xs text-base break-words shadow-sm
                  ${isUser
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-900 rounded-bl-md border border-blue-100'
                  }`}
              >
                {/* Render Markdown in message text */}
                <ReactMarkdown
                  components={{
                    strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
              {/* Show trace if present */}
              {msg.trace && (
                <div className="mt-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded px-2 py-1 inline-block">
                  <span className="font-semibold">Processing path:</span>{' '}
                  {msg.trace.join(' → ')}
                </div>
              )}
              {/* Show timestamp if present */}
              <div className="text-[11px] text-gray-400 mt-1 ml-1">
                {msg.timestamp}
              </div>
            </div>
          </div>
        </div>
      );
    })}
    {/* Show loading indicator if agent is typing */}
    {loading && (
      <div className="flex justify-start">
        <div className="flex items-end gap-2">
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
    {/* Dummy div for scrolling to bottom */}
    <div ref={messagesEndRef} />
  </main>
);

export default ChatMessages;
