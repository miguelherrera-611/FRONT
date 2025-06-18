// src/components/chatbot/ChatBot.js

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import ChatMessage from './ChatMessage';
import ChatSuggestions from './ChatSuggestions';
import ChatInput from './ChatInput';
import { chatBotService } from '../../services/ChatBotService';
import { AnimatedCard } from '../ui/Animations';

const ChatBot = ({ isOpen, onClose }) => {
  // Estados del chat
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const [showDefaultSuggestions, setShowDefaultSuggestions] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatStats, setChatStats] = useState({ messages: 0, category: null });
  const [suggestionsCollapsed, setSuggestionsCollapsed] = useState(false); // NUEVO ESTADO

  // Referencias
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Cargar mensaje de bienvenida al abrir
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen, messages.length]);

  // Auto scroll cuando hay nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inicializar chat
  const initializeChat = async () => {
    try {
      const welcomeResponse = await chatBotService.processMessage('hola');
      const welcomeMessage = {
        id: Date.now(),
        text: welcomeResponse.response,
        isBot: true,
        timestamp: new Date(),
        urgency: welcomeResponse.urgency || 'normal'
      };

      setMessages([welcomeMessage]);
      setCurrentSuggestions(welcomeResponse.suggestions || []);
      setShowDefaultSuggestions(welcomeResponse.showDefaultSuggestions || false);
    } catch (error) {
      console.error('Error initializing chat:', error);
      setMessages([{
        id: Date.now(),
        text: "¡Hola! 👋 Soy Dr. IA, tu veterinario virtual. Lamento, pero tengo problemas técnicos. Por favor, intenta más tarde.",
        isBot: true,
        timestamp: new Date(),
        urgency: 'normal'
      }]);
    }
  };

  // Scroll automático
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Enviar mensaje
  const sendMessage = async (messageText) => {
    try {
      // Agregar mensaje del usuario
      const userMessage = {
        id: Date.now(),
        text: messageText,
        isBot: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
      setShowDefaultSuggestions(false);

      // Simular tiempo de respuesta
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Procesar respuesta del bot
      const botResponse = await chatBotService.processMessage(messageText);
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse.response,
        isBot: true,
        timestamp: new Date(),
        urgency: botResponse.urgency || 'normal',
        type: botResponse.type
      };

      setMessages(prev => [...prev, botMessage]);
      setCurrentSuggestions(botResponse.suggestions || []);
      setShowDefaultSuggestions(botResponse.showDefaultSuggestions || false);
      
      // Actualizar estadísticas
      setChatStats(prev => ({
        messages: prev.messages + 1,
        category: botResponse.type || prev.category
      }));

      // Mostrar notificación para emergencias
      if (botResponse.urgency === 'critical') {
        toast.error('🚨 EMERGENCIA DETECTADA - Contacta inmediatamente al veterinario', {
          autoClose: false,
          closeOnClick: false
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "Lo siento, he tenido un problema técnico. ¿Podrías intentar reformular tu pregunta?",
        isBot: true,
        timestamp: new Date(),
        urgency: 'normal'
      };

      setMessages(prev => [...prev, errorMessage]);
      toast.error('Error en el chat. Por favor, intenta de nuevo.');
    } finally {
      setIsTyping(false);
    }
  };

  // Manejar click en sugerencia
  const handleSuggestionClick = (suggestion) => {
    if (suggestion === 'Nueva consulta') {
      handleNewConsultation();
      return;
    }
    
    sendMessage(suggestion);
  };

  // Nueva consulta
  const handleNewConsultation = () => {
    chatBotService.resetContext();
    setMessages([]);
    setCurrentSuggestions([]);
    setShowDefaultSuggestions(true);
    setChatStats({ messages: 0, category: null });
    setSuggestionsCollapsed(false); // Mostrar sugerencias en nueva consulta
    initializeChat();
  };

  // Limpiar chat
  const handleClearChat = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar el chat?')) {
      handleNewConsultation();
      toast.info('Chat limpiado. ¡Empecemos de nuevo!');
    }
  };

  // Exportar conversación
  const handleExportChat = () => {
    const chatHistory = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.isBot ? 'Dr. IA' : 'Usuario'}: ${msg.text}`
    ).join('\n');
    
    const blob = new Blob([chatHistory], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consulta-veterinaria-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Conversación exportada exitosamente');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-16 right-4 z-50">
      <AnimatedCard className="w-[420px] h-[580px] flex flex-col bg-white border-2 border-gray-200 shadow-2xl">
        {/* Header del chat */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">
                👨‍⚕️
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Dr. IA - Veterinario Virtual</h3>
              <div className="flex items-center space-x-2 text-xs opacity-90">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>En línea</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Botón minimizar */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title={isMinimized ? "Expandir" : "Minimizar"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={isMinimized ? "M19 14l-7-7m0 0l-7 7m7-7v18" : "M5 10l7 7 7-7"} />
              </svg>
            </button>
            
            {/* Menú de opciones */}
            <div className="relative group">
              <button className="p-1 hover:bg-white/20 rounded transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              
              {/* Dropdown de opciones */}
              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto min-w-[160px]">
                <button
                  onClick={handleNewConsultation}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                >
                  🔄 Nueva consulta
                </button>
                <button
                  onClick={handleClearChat}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                >
                  🧹 Limpiar chat
                </button>
                <button
                  onClick={handleExportChat}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                >
                  📥 Exportar conversación
                </button>
              </div>
            </div>
            
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded transition-colors text-white hover:text-red-200"
              title="Cerrar chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        {!isMinimized && chatStats.messages > 0 && (
          <div className="px-3 py-2 bg-gray-50 border-b text-xs text-gray-600">
            💬 {chatStats.messages} mensajes
            {chatStats.category && (
              <span className="ml-2">
                📋 {chatStats.category}
              </span>
            )}
          </div>
        )}

        {/* Contenido del chat */}
        {!isMinimized && (
          <>
            {/* Mensajes */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50"
              style={{ 
                minHeight: suggestionsCollapsed ? '400px' : '300px', 
                maxHeight: suggestionsCollapsed ? '400px' : '300px' 
              }}
            >
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isBot={message.isBot}
                  timestamp={message.timestamp}
                  urgency={message.urgency}
                />
              ))}
              
              {/* Indicador de escritura */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border px-3 py-2 rounded-2xl rounded-bl-none shadow-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-xs text-gray-500 ml-2">Dr. IA escribiendo...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Sugerencias */}
            <div className="border-t border-gray-200 bg-white">
              {/* Header de sugerencias con botón colapsar */}
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-700">💡 Sugerencias</span>
                  {(currentSuggestions.length > 0 || showDefaultSuggestions) && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                      {currentSuggestions.length || chatBotService.getDefaultSuggestions().length}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSuggestionsCollapsed(!suggestionsCollapsed)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title={suggestionsCollapsed ? "Mostrar sugerencias" : "Ocultar sugerencias"}
                >
                  <svg 
                    className={`w-3 h-3 text-gray-600 transition-transform duration-200 ${
                      suggestionsCollapsed ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Contenido de sugerencias colapsable - FORMATO HORIZONTAL */}
              {!suggestionsCollapsed && (
                <div className="p-3">
                  {/* Layout horizontal con wrap para las sugerencias */}
                  <div className="flex flex-wrap gap-2">
                    {showDefaultSuggestions
                      ? chatBotService.getDefaultSuggestions().map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion.text)}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors text-xs flex-shrink-0"
                          >
                            {suggestion.icon} {suggestion.text}
                          </button>
                        ))
                      : currentSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg border border-green-200 transition-colors text-xs flex-shrink-0"
                          >
                            {suggestion}
                          </button>
                        ))
                    }
                  </div>
                </div>
              )}
            </div>

            {/* Input de mensaje */}
            <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
              <ChatInput
                onSendMessage={sendMessage}
                disabled={isTyping}
                placeholder="Pregúntame sobre tu mascota..."
                maxLength={500}
              />
            </div>
          </>
        )}

        {/* Vista minimizada */}
        {isMinimized && (
          <div className="p-4 text-center">
            <div className="text-2xl mb-2">👨‍⚕️</div>
            <p className="text-xs text-gray-600">Chat minimizado</p>
            <p className="text-xs text-gray-500">Clic en expandir para continuar</p>
          </div>
        )}
      </AnimatedCard>
    </div>
  );
};

export default ChatBot;