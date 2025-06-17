// src/hooks/useVeterinaryChat.js
import { useState } from 'react';

export const useVeterinaryChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return {
    isChatOpen,
    openChat,
    closeChat,
    toggleChat
  };
};