// src/components/chatbot/ChatMessage.js

import React from 'react';
import { formatTime } from '../../services/ChatBotService';

const ChatMessage = ({ message, isBot = false, timestamp, urgency = 'normal' }) => {
  // Obtener avatar según el tipo de mensaje
  const getAvatar = () => {
    if (isBot) {
      return urgency === 'critical' ? '🚨' : '👨‍⚕️';
    }
    return '👤';
  };

  // Obtener clase CSS según la urgencia
  const getUrgencyClass = () => {
    const urgencyClasses = {
      critical: 'border-l-4 border-red-500 bg-red-50',
      medium: 'border-l-4 border-yellow-500 bg-yellow-50',
      normal: 'bg-white'
    };
    return urgencyClasses[urgency] || urgencyClasses.normal;
  };

  // Formatear el texto del mensaje (convertir markdown básico)
  const formatMessage = (text) => {
    // Convertir **texto** a negrita
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convertir *texto* a cursiva
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convertir saltos de línea
    formatted = formatted.replace(/\n/g, '<br />');
    
    return formatted;
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isBot ? 'order-1' : 'order-2'}`}>
        {/* Avatar */}
        <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-1`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
            isBot 
              ? urgency === 'critical' 
                ? 'bg-red-500 text-white' 
                : 'bg-blue-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
            {getAvatar()}
          </div>
        </div>

        {/* Mensaje */}
        <div className={`
          px-4 py-3 rounded-2xl shadow-sm border
          ${isBot 
            ? `${getUrgencyClass()} text-gray-800` 
            : 'bg-blue-500 text-white'
          }
          ${isBot ? 'rounded-bl-none' : 'rounded-br-none'}
        `}>
          <div 
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
          />
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-gray-400 mt-1 ${isBot ? 'text-left' : 'text-right'}`}>
          {formatTime(timestamp)}
          {isBot && urgency === 'critical' && (
            <span className="ml-2 text-red-500 font-medium">URGENTE</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;