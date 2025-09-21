
import React from 'react';
import type { View } from '../App';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const NavButton: React.FC<{ view: View, children: React.ReactNode }> = ({ view, children }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setView(view)}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 ${
          isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
        }`}
      >
        {children}
      </button>
    );
  };

  return (
    <header className="w-full bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">Gemini Fusion</h1>
          </div>
          <div className="flex items-center space-x-2">
            <NavButton view="chat">Chat</NavButton>
            <NavButton view="image">Image Generation</NavButton>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
