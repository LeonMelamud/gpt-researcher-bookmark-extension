'use client';

import URLChecker from '../components/URLChecker';

export default function Home() {
  return (
    <main className="app-container">
      <div className="w-full h-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">
            Bookmark AI Organizer
          </h1>
          <button className="w-8 h-8 rounded-full bg-[#10a37f] flex items-center justify-center">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
        <URLChecker />
      </div>
    </main>
  );
}
