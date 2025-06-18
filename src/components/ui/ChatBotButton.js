// src/components/ui/ChatBotButton.js

import React, { useState, useEffect } from 'react';

const ChatBotButton = ({ onClick, isOpen = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Mostrar el botón después de un pequeño delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mostrar notificación después de un tiempo si no se ha abierto el chat
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setHasNotification(true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setHasNotification(false);
    }
  }, [isOpen]);

  // Quitar notificación cuando se hace hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    setHasNotification(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Tooltip informativo */}
      {isHovered && !isOpen && (
        <div className="absolute bottom-16 right-0 bg-gray-800 text-white text-sm py-2 px-3 rounded-lg whitespace-nowrap animate-fadeIn">
          <div className="text-center">
            <div className="font-medium">Dr. IA - Veterinario Virtual</div>
            <div className="text-xs opacity-90">¡Pregúntame sobre tu mascota!</div>
          </div>
          {/* Flecha del tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}

      {/* Botón principal */}
      <button
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          relative w-16 h-16 rounded-full shadow-lg transition-all duration-300 transform
          ${isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-45' 
            : 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 hover:scale-110'
          }
          ${isHovered ? 'shadow-2xl' : 'shadow-lg'}
          active:scale-95
        `}
      >
        {/* Icono del botón */}
        <div className="flex items-center justify-center w-full h-full text-white">
          {isOpen ? (
            <svg className="w-6 h-6 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
              👨‍⚕️
            </div>
          )}
        </div>

        {/* Indicador de notificación */}
        {hasNotification && !isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
          </div>
        )}

        {/* Efecto de ondas cuando hay notificación */}
        {hasNotification && !isOpen && (
          <>
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" style={{ animationDelay: '0.5s' }}></div>
          </>
        )}

        {/* Efecto de brillo en hover */}
        {isHovered && !isOpen && (
          <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-pulse"></div>
        )}
      </button>

      {/* Etiqueta flotante con consejos */}
      {!isOpen && !isHovered && hasNotification && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-lg border p-3 max-w-xs animate-slideInRight">
          <div className="flex items-start space-x-2">
            <div className="text-lg">💡</div>
            <div>
              <div className="text-sm font-medium text-gray-800 mb-1">
                ¡Hola! ¿Necesitas ayuda veterinaria?
              </div>
              <div className="text-xs text-gray-600">
                Soy Dr. IA y puedo ayudarte con dudas sobre tu mascota.
              </div>
            </div>
            <button
              onClick={() => setHasNotification(false)}
              className="text-gray-400 hover:text-gray-600 text-xs"
            >
              ×
            </button>
          </div>
          
          {/* Pequeñas sugerencias */}
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Síntomas</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Alimentación</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Vacunas</span>
          </div>

          {/* Flecha apuntando al botón */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
        </div>
      )}

      {/* Indicadores de estado en la esquina */}
      <div className="absolute -bottom-2 -left-2 flex space-x-1">
        {/* Indicador online */}
        <div className="w-3 h-3 bg-green-400 rounded-full border border-white animate-pulse" title="En línea"></div>
        
        {/* Indicador de IA */}
        <div className="w-3 h-3 bg-blue-400 rounded-full border border-white" title="Powered by IA"></div>
      </div>
    </div>
  );
};

export default ChatBotButton;