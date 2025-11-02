
import React from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-800 text-gray-100 font-sans">
      <Header />
      <main className="flex-grow flex items-center justify-center p-2 sm:p-4">
        <ChatWindow />
      </main>
    </div>
  );
};

export default App;
