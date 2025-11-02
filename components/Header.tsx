
import React from 'react';
import { BrainCircuitIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 shadow-md p-4 flex items-center justify-center space-x-3">
      <BrainCircuitIcon className="w-8 h-8 text-cyan-400" />
      <h1 className="text-2xl font-bold text-white tracking-wider">IntelliTutor</h1>
    </header>
  );
};

export default Header;
