
import React, { useState } from 'react';
import Header from './components/Header';
import ChatView from './components/ChatView';
import ImageGenView from './components/ImageGenView';

export type View = 'chat' | 'image';

const App: React.FC = () => {
  const [view, setView] = useState<View>('chat');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
      <Header currentView={view} setView={setView} />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {view === 'chat' ? <ChatView /> : <ImageGenView />}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Google Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
