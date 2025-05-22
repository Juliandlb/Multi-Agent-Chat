// ChatInput: Input area for typing and sending chat messages, with support for multiline and keyboard shortcuts.

import React from 'react';

type Props = {
  /** The current input value */
  input: string;
  /** Callback to update the input value */
  setInput: (v: string) => void;
  /** Whether a message is being sent (disables input) */
  loading: boolean;
  /** Handler to send the message */
  handleSend: () => void;
};

const ChatInput: React.FC<Props> = ({ input, setInput, loading, handleSend }) => (
  <footer className="p-5 border-t border-blue-100 bg-white rounded-b-2xl font-sans">
    <form
      className="flex flex-col gap-2"
      onSubmit={e => {
        e.preventDefault();
        handleSend(); // Prevent default form submit and call handler
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
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          // Send on Enter, new line on Shift+Enter
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
      {/* Helper text for keyboard shortcuts */}
      <div className="text-xs text-blue-300 mt-1 ml-2 select-none">
        Press Enter to send, Shift+Enter for a new line
      </div>
    </form>
  </footer>
);

export default ChatInput;
