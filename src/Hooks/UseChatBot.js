// src/Hooks/UseChatBot.js

import { useState, useEffect, useCallback } from 'react';
import { chatBotService } from '../services/ChatBotService';

export const useChatBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [chatData, setChatData] = useState({
    messages: [],
    suggestions: [],
    stats: { messages: 0, sessions: 0 }
  });

  // Cargar estado desde localStorage
  const loadStateFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem('chatbot_state');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('No se pudo cargar el estado del chatbot:', error);
      return null;
    }
  }, []);

  // Guardar estado en localStorage
  const saveStateToStorage = useCallback((state) => {
    try {
      localStorage.setItem('chatbot_state', JSON.stringify(state));
    } catch (error) {
      console.warn('No se pudo guardar el estado del chatbot:', error);
    }
  }, []);

  // Inicializar chatbot
  const initializeChatBot = useCallback(async () => {
    try {
      // Cargar estado previo si existe
      const savedState = loadStateFromStorage();
      
      if (savedState) {
        setIsChatOpen(savedState.isOpen || false);
        setChatData(prev => ({
          ...prev,
          stats: savedState.stats || prev.stats
        }));
      }

      // Obtener sugerencias por defecto
      const suggestions = chatBotService.getDefaultSuggestions();
      setChatData(prev => ({
        ...prev,
        suggestions
      }));

      setIsInitialized(true);
    } catch (error) {
      console.error('Error inicializando chatbot:', error);
      setIsInitialized(true); // Marcar como inicializado aunque haya error
    }
  }, [loadStateFromStorage]);

  // Inicializar el chatbot cuando se monta el componente
  useEffect(() => {
    initializeChatBot();
    
    // Limpiar cuando se desmonta
    return () => {
      chatBotService.resetContext();
    };
  }, [initializeChatBot]);

  // Detectar cambios en el localStorage para sincronizar entre pestañas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'chatbot_state') {
        const newState = JSON.parse(e.newValue || '{}');
        if (newState.isOpen !== undefined) {
          setIsChatOpen(newState.isOpen);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Abrir chat
  const openChat = useCallback(() => {
    setIsChatOpen(true);
    setHasUnreadMessages(false);
    
    // Actualizar estadísticas
    setChatData(prev => {
      const newStats = {
        ...prev.stats,
        sessions: prev.stats.sessions + 1
      };
      
      const newState = { isOpen: true, stats: newStats };
      saveStateToStorage(newState);
      
      return {
        ...prev,
        stats: newStats
      };
    });
  }, [saveStateToStorage]);

  // Cerrar chat
  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    
    const newState = { isOpen: false, stats: chatData.stats };
    saveStateToStorage(newState);
  }, [chatData.stats, saveStateToStorage]);

  // Alternar chat
  const toggleChat = useCallback(() => {
    if (isChatOpen) {
      closeChat();
    } else {
      openChat();
    }
  }, [isChatOpen, openChat, closeChat]);

  // Reiniciar chat
  const resetChat = useCallback(() => {
    chatBotService.resetContext();
    setChatData(prev => ({
      ...prev,
      messages: [],
      suggestions: chatBotService.getDefaultSuggestions()
    }));
    
    // No cerrar el chat, solo reiniciar contenido
    if (isChatOpen) {
      setHasUnreadMessages(false);
    }
  }, [isChatOpen]);

  // Simular nueva notificación (para testing o notificaciones push)
  const simulateNotification = useCallback(() => {
    if (!isChatOpen) {
      setHasUnreadMessages(true);
      
      // Opcional: mostrar notificación del navegador
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Dr. IA - Veterinario Virtual', {
          body: '¡Hola! ¿Necesitas ayuda con tu mascota?',
          icon: '/favicon.ico', // Usar el favicon de tu app
          badge: '/favicon.ico'
        });
      }
    }
  }, [isChatOpen]);

  // Solicitar permisos de notificación
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.warn('Error requesting notification permission:', error);
        return false;
      }
    }
    return Notification.permission === 'granted';
  }, []);

  // Verificar si el chatbot está disponible
  const isChatBotAvailable = useCallback(() => {
    return isInitialized && chatBotService !== null;
  }, [isInitialized]);

  // Obtener estadísticas de uso
  const getChatStats = useCallback(() => {
    const serviceStats = chatBotService.getUsageStats();
    return {
      ...chatData.stats,
      ...serviceStats,
      isActive: isChatOpen,
      hasUnread: hasUnreadMessages
    };
  }, [chatData.stats, isChatOpen, hasUnreadMessages]);

  // Configurar respuesta automática (para simular interacción automática)
  const setupAutoResponse = useCallback((delay = 10000) => {
    if (!isChatOpen) {
      const timer = setTimeout(() => {
        simulateNotification();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isChatOpen, simulateNotification]);

  // Exportar funciones y estado
  return {
    // Estado
    isChatOpen,
    hasUnreadMessages,
    isInitialized,
    chatData,
    
    // Acciones principales
    openChat,
    closeChat,
    toggleChat,
    resetChat,
    
    // Utilidades
    simulateNotification,
    requestNotificationPermission,
    isChatBotAvailable,
    getChatStats,
    setupAutoResponse,
    
    // Estado interno para debugging
    _internal: {
      chatBotService,
      saveStateToStorage,
      loadStateFromStorage
    }
  };
};