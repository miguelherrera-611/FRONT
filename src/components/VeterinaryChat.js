// src/components/VeterinaryChat.js
import React, { useState, useEffect, useRef } from 'react';
import { AnimatedCard, AnimatedButton, AnimatedModal } from './ui/Animations';

const VeterinaryChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  // Preguntas frecuentes predeterminadas
  const commonQuestions = [
    {
      id: 1,
      text: "Mi mascota está vomitando 🤮",
      category: "síntomas",
      icon: "🤒"
    },
    {
      id: 2,
      text: "¿Cuándo debo vacunar a mi cachorro? 💉",
      category: "prevención",
      icon: "🐶"
    },
    {
      id: 3,
      text: "Mi gato no quiere comer 🍽️",
      category: "alimentación",
      icon: "🐱"
    },
    {
      id: 4,
      text: "¿Qué alimento es mejor para mi mascota? 🥘",
      category: "alimentación",
      icon: "🍖"
    },
    {
      id: 5,
      text: "Mi perro está cojeando 🦴",
      category: "síntomas",
      icon: "🐕"
    },
    {
      id: 6,
      text: "¿Con qué frecuencia debo bañar a mi mascota? 🛁",
      category: "cuidados",
      icon: "🧼"
    },
    {
      id: 7,
      text: "Mi mascota tiene diarrea 💩",
      category: "síntomas",
      icon: "😷"
    },
    {
      id: 8,
      text: "¿Cómo sé si es una emergencia? 🚨",
      category: "emergencia",
      icon: "⚠️"
    }
  ];

  // Base de conocimientos del veterinario IA
  const veterinaryKnowledge = {
    // Respuestas específicas para síntomas
    síntomas: {
      "vomitando": {
        response: "El vómito en mascotas puede tener varias causas. Te haré algunas preguntas para ayudarte mejor:",
        followUpQuestions: [
          "¿Cuántas veces ha vomitado en las últimas 24 horas?",
          "¿El vómito tiene sangre o es espumoso?",
          "¿Tu mascota está bebiendo agua normalmente?",
          "¿Ha comido algo extraño recientemente?"
        ],
        urgency: "medium",
        immediateAdvice: "💡 **Consejo inmediato**: Retira la comida por 12 horas pero mantén agua disponible en pequeñas cantidades."
      },
      "cojeando": {
        response: "La cojera puede indicar dolor o lesión. Necesito más información:",
        followUpQuestions: [
          "¿En qué pata específica cojea?",
          "¿La cojera apareció de repente o gradualmente?",
          "¿Hubo algún accidente o caída?",
          "¿La cojera es constante o solo cuando camina?"
        ],
        urgency: "medium",
        immediateAdvice: "💡 **Consejo inmediato**: Limita el ejercicio y evita que salte o corra hasta evaluación."
      },
      "diarrea": {
        response: "La diarrea puede ser causada por varios factores. Vamos a evaluar la situación:",
        followUpQuestions: [
          "¿Cuándo comenzó la diarrea?",
          "¿Hay sangre o mucosidad en las heces?",
          "¿Ha cambiado recientemente la alimentación?",
          "¿Tu mascota está activa y alerta?"
        ],
        urgency: "medium",
        immediateAdvice: "💡 **Consejo inmediato**: Ofrece dieta blanda (arroz cocido con pollo hervido) y asegura hidratación."
      }
    },

    // Respuestas para prevención
    prevención: {
      "vacunar cachorro": {
        response: "¡Excelente pregunta! La vacunación es crucial para la salud de tu cachorro. 🐶",
        schedule: {
          "6-8 semanas": "Primera vacuna múltiple (DHPP)",
          "10-12 semanas": "Segunda vacuna múltiple + Bordatella",
          "14-16 semanas": "Tercera vacuna múltiple + Rabia",
          "1 año": "Refuerzo anual"
        },
        advice: "📅 **Importante**: Evita sacarlo a lugares públicos hasta completar todas las vacunas."
      }
    },

    // Respuestas para alimentación
    alimentación: {
      "no come": {
        response: "La pérdida de apetito puede ser preocupante. Analicemos la situación:",
        followUpQuestions: [
          "¿Desde cuándo no quiere comer?",
          "¿Está bebiendo agua normalmente?",
          "¿Muestra otros síntomas (vómito, letargo)?",
          "¿Ha habido cambios recientes en su entorno?"
        ],
        urgency: "medium",
        immediateAdvice: "💡 **Consejo**: Si no come por más de 24 horas, es necesaria evaluación veterinaria."
      },
      "mejor alimento": {
        response: "La elección del alimento depende de varios factores específicos de tu mascota:",
        factors: [
          "🎂 **Edad**: Cachorro, adulto o senior",
          "📏 **Tamaño**: Raza pequeña, mediana o grande",
          "🏃 **Actividad**: Nivel de ejercicio diario",
          "🏥 **Salud**: Condiciones médicas especiales"
        ],
        recommendation: "Te recomiendo alimentos premium específicos para la etapa de vida de tu mascota. ¿Podrías contarme más detalles?"
      }
    },

    // Respuestas para emergencias
    emergencia: {
      "signos": {
        response: "🚨 **SIGNOS DE EMERGENCIA** que requieren atención inmediata:",
        emergencySigns: [
          "🩸 Sangrado abundante",
          "😵 Pérdida de consciencia",
          "🫁 Dificultad severa para respirar",
          "🤢 Vómito con sangre",
          "🥶 Convulsiones",
          "🦴 Fracturas evidentes",
          "🐍 Mordedura de serpiente",
          "💊 Ingestión de tóxicos"
        ],
        action: "Si observas alguno de estos signos, contacta inmediatamente:",
        contact: {
          phone: "+57 (6) 123-4567",
          emergency: "Emergencias 24/7",
          address: "Clínica Veterinaria Humboldt, Quimbaya, Quindío"
        }
      }
    }
  };

  // Mensajes de bienvenida del Dr. IA
  const welcomeMessage = {
    id: Date.now(),
    text: "¡Hola! 👋 Soy **Dr. IA**, tu asistente veterinario virtual 🤖👨‍⚕️\n\nEstoy aquí para ayudarte con consultas sobre la salud de tu mascota. Puedes preguntarme sobre síntomas, cuidados, alimentación y más.\n\n¿En qué puedo ayudarte hoy?",
    sender: "bot",
    timestamp: new Date(),
    type: "welcome"
  };

  // Inicializar chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([welcomeMessage]);
      setCurrentSuggestions(commonQuestions);
    }
  }, [isOpen]);

  // Scroll automático
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Función principal para procesar respuestas del IA
  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Detectar emergencias críticas
    const emergencyKeywords = ['sangre', 'convulsiones', 'no respira', 'inconsciente', 'veneno', 'atropellado'];
    if (emergencyKeywords.some(keyword => message.includes(keyword))) {
      return {
        text: "🚨 **EMERGENCIA DETECTADA**\n\nEsta situación requiere atención veterinaria INMEDIATA.\n\n📞 **Llama ahora**: +57 (6) 123-4567\n📍 **Dirección**: Clínica Veterinaria Humboldt, Quimbaya, Quindío\n\n⏰ **24/7 Emergencias**",
        type: "emergency",
        suggestions: ["Llamar ahora", "Ver ubicación", "Primeros auxilios"]
      };
    }

    // Detectar síntomas específicos
    if (message.includes('vomit') || message.includes('devol')) {
      const knowledge = veterinaryKnowledge.síntomas.vomitando;
      return {
        text: `${knowledge.response}\n\n${knowledge.immediateAdvice}`,
        type: "symptom",
        suggestions: knowledge.followUpQuestions
      };
    }

    if (message.includes('coje') || message.includes('pata') || message.includes('camina mal')) {
      const knowledge = veterinaryKnowledge.síntomas.cojeando;
      return {
        text: `${knowledge.response}\n\n${knowledge.immediateAdvice}`,
        type: "symptom",
        suggestions: knowledge.followUpQuestions
      };
    }

    if (message.includes('diarrea') || message.includes('suelto') || message.includes('caca')) {
      const knowledge = veterinaryKnowledge.síntomas.diarrea;
      return {
        text: `${knowledge.response}\n\n${knowledge.immediateAdvice}`,
        type: "symptom",
        suggestions: knowledge.followUpQuestions
      };
    }

    // Detectar preguntas sobre vacunas
    if (message.includes('vacun') || message.includes('inmuni')) {
      const knowledge = veterinaryKnowledge.prevención["vacunar cachorro"];
      let scheduleText = "\n\n📅 **Calendario de vacunación**:\n";
      Object.entries(knowledge.schedule).forEach(([age, vaccine]) => {
        scheduleText += `• **${age}**: ${vaccine}\n`;
      });
      return {
        text: `${knowledge.response}${scheduleText}\n${knowledge.advice}`,
        type: "prevention",
        suggestions: ["¿Cuándo la próxima?", "Efectos secundarios", "Costo de vacunas", "Programar cita"]
      };
    }

    // Detectar preguntas sobre alimentación
    if (message.includes('no come') || message.includes('apetito') || message.includes('hambre')) {
      const knowledge = veterinaryKnowledge.alimentación["no come"];
      return {
        text: `${knowledge.response}\n\n${knowledge.immediateAdvice}`,
        type: "nutrition",
        suggestions: knowledge.followUpQuestions
      };
    }

    if (message.includes('alimento') || message.includes('comida') || message.includes('comer')) {
      const knowledge = veterinaryKnowledge.alimentación["mejor alimento"];
      let factorsText = "\n\n";
      knowledge.factors.forEach(factor => {
        factorsText += `${factor}\n`;
      });
      return {
        text: `${knowledge.response}${factorsText}\n💡 ${knowledge.recommendation}`,
        type: "nutrition",
        suggestions: ["Cachorro", "Adulto", "Senior", "Problemas digestivos"]
      };
    }

    // Detectar preguntas sobre emergencias
    if (message.includes('emergencia') || message.includes('urgent') || message.includes('grave')) {
      const knowledge = veterinaryKnowledge.emergencia.signos;
      let signsText = "\n";
      knowledge.emergencySigns.forEach(sign => {
        signsText += `${sign}\n`;
      });
      return {
        text: `${knowledge.response}${signsText}\n🏥 ${knowledge.action}\n📞 ${knowledge.contact.phone}\n📍 ${knowledge.contact.address}`,
        type: "emergency",
        suggestions: ["Llamar emergencias", "Ver ubicación", "Primeros auxilios"]
      };
    }

    // Respuestas para saludos
    if (message.includes('hola') || message.includes('buenas') || message.includes('buenos días')) {
      return {
        text: "¡Hola! 😊 Me alegra poder ayudarte con la salud de tu mascota. Soy tu veterinario virtual y estoy aquí para resolver tus dudas.\n\n¿Qué te preocupa de tu pequeño compañero hoy?",
        type: "greeting",
        suggestions: ["Síntomas preocupantes", "Dudas sobre alimentación", "Calendario de vacunas", "Comportamiento extraño"]
      };
    }

    // Respuesta por defecto
    return {
      text: "Entiendo tu consulta. Para darte el mejor consejo posible, ¿podrías ser más específico?\n\nPuedes contarme sobre:\n🐾 Síntomas que has observado\n🍽️ Problemas de alimentación\n💉 Dudas sobre vacunas\n🏥 Si es una situación urgente",
      type: "general",
      suggestions: commonQuestions.slice(0, 4).map(q => q.text)
    };
  };

  // Enviar mensaje
  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setShowSuggestions(false);
    setIsTyping(true);

    // Simular tiempo de respuesta del IA
    setTimeout(() => {
      const aiResponse = getAIResponse(messageText);
      
      const botMessage = {
        id: Date.now() + 1,
        text: aiResponse.text,
        sender: "bot",
        timestamp: new Date(),
        type: aiResponse.type
      };

      setMessages(prev => [...prev, botMessage]);
      setCurrentSuggestions(aiResponse.suggestions || []);
      setIsTyping(false);
      setShowSuggestions(true);
    }, 1500);
  };

  // Manejar sugerencia clickeada
  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  if (!isOpen) return null;

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chat con Veterinario IA"
    >
      <div className="h-96 flex flex-col">
        {/* Header del chat */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">👨‍⚕️</span>
            </div>
            <div>
              <h3 className="font-semibold">Dr. IA - Veterinario Virtual</h3>
              <div className="flex items-center space-x-2 text-sm opacity-90">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>En línea • Respuesta inmediata</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.type === 'emergency'
                    ? 'bg-red-50 border-l-4 border-red-500 text-red-800'
                    : 'bg-white text-gray-800 shadow-sm border'
                }`}
              >
                <div className="text-sm whitespace-pre-line">{message.text}</div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {/* Indicador de escribiendo */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border px-4 py-2 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-sm text-gray-500 ml-2">Dr. IA está escribiendo...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Sugerencias */}
        {showSuggestions && currentSuggestions.length > 0 && (
          <div className="p-4 bg-white border-t">
            <div className="text-xs text-gray-500 mb-2">💡 Sugerencias:</div>
            <div className="flex flex-wrap gap-2">
              {currentSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input de mensaje */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu consulta veterinaria..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !inputMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl transition-colors"
            >
              <span className="text-lg">📤</span>
            </button>
          </div>
        </form>

        {/* Preguntas frecuentes iniciales */}
        {messages.length === 1 && (
          <div className="p-4 bg-gray-50 border-t">
            <div className="text-sm font-medium text-gray-700 mb-3">🔥 Preguntas frecuentes:</div>
            <div className="grid grid-cols-2 gap-2">
              {commonQuestions.slice(0, 4).map((question) => (
                <button
                  key={question.id}
                  onClick={() => handleSuggestionClick(question.text)}
                  className="text-left p-2 bg-white hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors text-sm"
                >
                  <span className="mr-2">{question.icon}</span>
                  {question.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AnimatedModal>
  );
};

export default VeterinaryChat;