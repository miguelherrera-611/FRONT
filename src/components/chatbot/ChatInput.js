// src/components/chatbot/ChatInput.js

import React, { useState, useRef, useEffect } from 'react';

const ChatInput = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Escribe tu consulta veterinaria...",
  maxLength = 500
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-focus en el input cuando se habilita
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Manejar cambios en el input
  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // Limitar longitud
    if (value.length <= maxLength) {
      setMessage(value);
    }

    // Indicador de escritura
    setIsTyping(true);
    
    // Limpiar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Establecer nuevo timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  // Manejar envío del mensaje
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      setIsTyping(false);
      
      // Enfocar nuevamente el input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Manejar teclas especiales
  const handleKeyPress = (e) => {
    // Enviar con Enter (pero no con Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Calcular caracteres restantes
  const remainingChars = maxLength - message.length;
  const isNearLimit = remainingChars <= 50;

  return (
    <div className="border-t p-4 bg-white">
      {/* Indicador de escritura */}
      {isTyping && !disabled && (
        <div className="text-xs text-gray-500 mb-2 flex items-center">
          <div className="flex space-x-1 mr-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span>Escribiendo...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex space-x-2">
        {/* Input principal */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder={disabled ? "El Dr. IA está pensando..." : placeholder}
            className={`
              w-full resize-none border border-gray-300 rounded-xl px-4 py-3 pr-12
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200 text-sm
              ${disabled 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-gray-800'
              }
              ${message.length > 100 ? 'min-h-[80px]' : 'min-h-[48px]'}
            `}
            rows={message.length > 100 ? 3 : 1}
            maxLength={maxLength}
          />
          
          {/* Contador de caracteres */}
          {message.length > 0 && (
            <div className={`
              absolute bottom-2 right-12 text-xs 
              ${isNearLimit ? 'text-red-500 font-medium' : 'text-gray-400'}
            `}>
              {remainingChars}
            </div>
          )}

          {/* Icono de micrófono (futuro) */}
          <button
            type="button"
            disabled
            className="absolute bottom-2 right-2 p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            title="Función de voz próximamente"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={`
            px-4 py-3 rounded-xl font-medium transition-all duration-200 
            flex items-center justify-center min-w-[50px]
            ${disabled || !message.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105'
            }
          `}
        >
          {disabled ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>

      {/* Consejos de uso */}
      {message.length === 0 && !disabled && (
        <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>💡 Describe los síntomas con detalle</span>
            <span>🐾 Menciona la especie de tu mascota</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Presiona</span>
            <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Enter</kbd>
            <span>para enviar</span>
          </div>
        </div>
      )}

      {/* Advertencia de limitación */}
      {!disabled && (
        <div className="mt-2 text-xs text-gray-400 text-center">
          ⚠️ Este es un asistente virtual. Para emergencias, contacta directamente al veterinario.
        </div>
      )}
    </div>
  );
};

export default ChatInput;