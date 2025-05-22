import React from 'react';

type Props = {
  userEmails: string[] | undefined;
  emailsLoading: boolean;
  currentUserEmail: string | undefined;
  setCurrentUserEmail: (email: string) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (v: boolean) => void;
};

const UserDropdown: React.FC<Props> = ({
  userEmails,
  emailsLoading,
  currentUserEmail,
  setCurrentUserEmail,
  dropdownOpen,
  setDropdownOpen,
}) => (
  <div className="absolute top-4 right-4 z-20">
    <div className="relative">
      <button
        className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label="Select user"
        type="button"
      >
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
);

export default UserDropdown;
