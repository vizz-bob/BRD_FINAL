import React from 'react';
import { useMessage } from '../context/MessageContext';

const GlobalMessageDisplay = () => {
  const { message, messageType } = useMessage();

  if (!message) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm`}>
      <div className={`px-8 py-4 rounded-xl shadow-2xl text-white text-center text-xl font-semibold transform transition-all duration-300 ease-out scale-105
        ${messageType === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
        {message}
      </div>
    </div>
  );
};

export default GlobalMessageDisplay;
