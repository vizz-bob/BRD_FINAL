import React, { createContext, useContext, useState, useCallback } from 'react';

const MessageContext = createContext(null);

export const useMessage = () => {
  return useContext(MessageContext);
};

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success'); // 'success' or 'error'

  const showMessage = useCallback((msg, type = 'success', duration = 3000) => {
    setMessage(msg);
    setMessageType(type);
    const timer = setTimeout(() => {
      setMessage(null);
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  const value = {
    message, 
    messageType,
    showMessage,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};
