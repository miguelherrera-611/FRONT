// src/components/chatbot/ChatSuggestions.js

import React from 'react';

const ChatSuggestions = ({ 
  suggestions = [], 
  onSuggestionClick, 
  showDefaultSuggestions = false,
  defaultSuggestions = []
}) => {
  // Mostrar sugerencias por defecto si está especificado
  const suggestionsToShow = showDefaultSuggestions ? defaultSuggestions : suggestions;

  if (!suggestionsToShow || suggestionsToShow.length === 0) {
    return null;
  }

  // Obtener icono para sugerencias por defecto
  const getDefaultIcon = (suggestion) => {
    if (typeof suggestion === 'object' && suggestion.icon) {
      return suggestion.icon;
    }
    
    // Iconos basados en contenido para strings simples
    const text = typeof suggestion === 'string' ? suggestion.toLowerCase() : '';
    
    if (text.includes('enferm') || text.includes('síntoma')) return '🏥';
    if (text.includes('alimenta') || text.includes('comida')) return '🍖';
    if (text.includes('vacuna') || text.includes('prevención')) return '💉';
    if (text.includes('comporta')) return '🐕';
    if (text.includes('cuidado')) return '💖';
    if (text.includes('emergencia')) return '🚨';
    
    return '💬';
  };

  // Obtener texto de la sugerencia
  const getSuggestionText = (suggestion) => {
    return typeof suggestion === 'object' ? suggestion.text : suggestion;
  };

  return (
    <div className="p-4 border-t bg-gray-50">
      <div className="text-xs text-gray-500 mb-3 flex items-center">
        <span className="mr-2">💡</span>
        <span>
          {showDefaultSuggestions 
            ? 'Preguntas frecuentes - Haz clic en una opción:' 
            : 'Respuestas sugeridas:'
          }
        </span>
      </div>
      
      <div className={`
        ${showDefaultSuggestions 
          ? 'grid grid-cols-2 gap-2' 
          : 'flex flex-wrap gap-2'
        }
      `}>
        {suggestionsToShow.map((suggestion, index) => {
          const text = getSuggestionText(suggestion);
          const icon = getDefaultIcon(suggestion);
          
          return (
            <button
              key={index}
              onClick={() => onSuggestionClick(text)}
              className={`
                ${showDefaultSuggestions 
                  ? 'flex items-center justify-start p-3 bg-white hover:bg-blue-50 border border-gray-200 rounded-xl transition-all duration-200 text-left group hover:border-blue-300 hover:shadow-sm' 
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs px-3 py-2 rounded-full transition-colors'
                }
              `}
            >
              {showDefaultSuggestions ? (
                <>
                  <span className="text-xl mr-2 group-hover:scale-110 transition-transform">
                    {icon}
                  </span>
                  <span className="text-sm font-medium flex-1 group-hover:text-blue-700 transition-colors">
                    {text}
                  </span>
                </>
              ) : (
                <span>{text}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Consejos adicionales para sugerencias por defecto */}
      {showDefaultSuggestions && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 text-lg">ℹ️</span>
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">💡 Consejos para usar el chat:</p>
              <ul className="space-y-1 text-blue-600">
                <li>• Describe los síntomas con detalle</li>
                <li>• Menciona la especie y edad de tu mascota</li>
                <li>• En emergencias, contacta directamente al veterinario</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Botón para limpiar chat */}
      {!showDefaultSuggestions && suggestions.length > 3 && (
        <div className="mt-3 text-center">
          <button
            onClick={() => onSuggestionClick('Nueva consulta')}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            🔄 Nueva consulta
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatSuggestions;