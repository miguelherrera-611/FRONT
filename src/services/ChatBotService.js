// src/services/ChatBotService.js

import { veterinaryKnowledge, getContextualSuggestions } from '../data/veterinaryKnowledge';

class ChatBotService {
  constructor() {
    this.context = {
      currentCategory: null,
      conversationHistory: [],
      userProfile: {
        petType: null,
        petAge: null,
        previousConsultations: []
      }
    };
  }

  // Procesar mensaje del usuario
  async processMessage(message) {
    const normalizedMessage = this.normalizeMessage(message);
    
    // Actualizar historial
    this.context.conversationHistory.push({
      type: 'user',
      message: message,
      timestamp: new Date()
    });

    // Detectar emergencias críticas primero
    if (this.isEmergency(normalizedMessage)) {
      return this.handleEmergency(normalizedMessage);
    }

    // Detectar saludos
    if (this.isGreeting(normalizedMessage)) {
      return this.handleGreeting();
    }

    // Detectar despedidas
    if (this.isFarewell(normalizedMessage)) {
      return this.handleFarewell();
    }

    // Procesar consulta específica
    const category = this.detectCategory(normalizedMessage);
    if (category) {
      this.context.currentCategory = category;
      return this.handleCategoryQuery(category, normalizedMessage);
    }

    // Si no se detecta categoría, usar fallback
    return this.handleFallback(normalizedMessage);
  }

  // Normalizar mensaje para procesamiento
  normalizeMessage(message) {
    return message.toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .trim();
  }

  // Detectar emergencias
  isEmergency(message) {
    const emergencyKeywords = [
      'sangre', 'convulsiones', 'no respira', 'inconsciente', 'veneno', 
      'toxico', 'atropellado', 'accidente grave', 'mordida serpiente',
      'hueso roto', 'fractura', 'ahogando', 'desmayo'
    ];
    
    return emergencyKeywords.some(keyword => message.includes(keyword));
  }

  // Manejar emergencias
  handleEmergency(message) {
    const response = veterinaryKnowledge.responses.emergencia.signos_criticos;
    
    let emergencyText = `🚨 **EMERGENCIA DETECTADA**\n\n${response.response}\n\n`;
    
    response.signs.forEach(sign => {
      emergencyText += `${sign}\n`;
    });
    
    emergencyText += `\n🏥 **CONTACTO INMEDIATO**:\n`;
    emergencyText += `📞 ${response.contact.phone}\n`;
    emergencyText += `📍 ${response.contact.address}\n`;
    emergencyText += `⏰ ${response.contact.hours}`;

    return {
      response: emergencyText,
      type: 'emergency',
      suggestions: ['Llamar ahora', 'Ver ubicación', 'Primeros auxilios'],
      urgency: 'critical'
    };
  }

  // Detectar saludos
  isGreeting(message) {
    const greetingKeywords = [
      'hola', 'buenos dias', 'buenas tardes', 'buenas noches', 
      'saludos', 'hey', 'ey', 'que tal', 'como estas'
    ];
    
    return greetingKeywords.some(keyword => message.includes(keyword));
  }

  // Manejar saludos
  handleGreeting() {
    const greetings = veterinaryKnowledge.greetings;
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    return {
      response: randomGreeting,
      type: 'greeting',
      suggestions: veterinaryKnowledge.defaultSuggestions.map(s => s.text),
      showDefaultSuggestions: true
    };
  }

  // Detectar despedidas
  isFarewell(message) {
    const farewellKeywords = [
      'adios', 'hasta luego', 'nos vemos', 'chao', 'bye', 
      'gracias por todo', 'eso es todo', 'ya no necesito mas'
    ];
    
    return farewellKeywords.some(keyword => message.includes(keyword));
  }

  // Manejar despedidas
  handleFarewell() {
    const farewells = veterinaryKnowledge.farewells;
    const randomFarewell = farewells[Math.floor(Math.random() * farewells.length)];
    
    return {
      response: randomFarewell,
      type: 'farewell',
      suggestions: ['Nueva consulta', 'Programar cita', 'Ver servicios']
    };
  }

  // Detectar categoría de la consulta
  detectCategory(message) {
    const keywords = veterinaryKnowledge.keywords;
    
    for (const [category, keywordList] of Object.entries(keywords)) {
      if (keywordList.some(keyword => message.includes(keyword))) {
        return category;
      }
    }
    
    return null;
  }

  // Manejar consulta por categoría
  handleCategoryQuery(category, message) {
    const responses = veterinaryKnowledge.responses[category];
    
    if (!responses) {
      return this.handleFallback(message);
    }

    // Buscar respuesta específica dentro de la categoría
    for (const [key, data] of Object.entries(responses)) {
      if (message.includes(key) || this.containsRelatedKeywords(message, key)) {
        return this.formatCategoryResponse(data, category, key);
      }
    }

    // Si no encuentra respuesta específica, dar respuesta general de la categoría
    return this.handleGeneralCategoryQuery(category);
  }

  // Verificar palabras relacionadas
  containsRelatedKeywords(message, key) {
    const relatedKeywords = {
      'vomito': ['devuelve', 'regurgita', 'vomita'],
      'diarrea': ['suelto', 'liquido', 'caca blanda'],
      'cojera': ['pata', 'camina mal', 'renguea'],
      'cachorro': ['bebe', 'pequeño', 'joven'],
      'adulto': ['grande', 'crecido', 'maduro'],
      'senior': ['viejo', 'mayor', 'anciano'],
      'agresividad': ['agresivo', 'muerde', 'ataca'],
      'ansiedad': ['nervioso', 'estresado', 'ansioso']
    };

    const keywords = relatedKeywords[key] || [];
    return keywords.some(keyword => message.includes(keyword));
  }

  // Formatear respuesta de categoría
  formatCategoryResponse(data, category, key) {
    let response = data.response;

    // Agregar información específica según el tipo de datos
    if (data.followUp) {
      response += '\n\n❓ **Preguntas para evaluar mejor**:\n';
      data.followUp.forEach((question, index) => {
        response += `${index + 1}. ${question}\n`;
      });
    }

    if (data.info) {
      response += '\n\n📋 **Información importante**:\n';
      Object.entries(data.info).forEach(([key, value]) => {
        response += `• **${key}**: ${value}\n`;
      });
    }

    if (data.schedule) {
      response += '\n\n📅 **Calendario recomendado**:\n';
      Object.entries(data.schedule).forEach(([age, vaccine]) => {
        response += `• **${age}**: ${vaccine}\n`;
      });
    }

    if (data.recommendations) {
      response += '\n\n✅ **Recomendaciones**:\n';
      data.recommendations.forEach(rec => {
        response += `${rec}\n`;
      });
    }

    if (data.causes) {
      response += '\n\n🔍 **Posibles causas**:\n';
      data.causes.forEach(cause => {
        response += `${cause}\n`;
      });
    }

    if (data.signs) {
      response += '\n\n⚠️ **Signos a observar**:\n';
      data.signs.forEach(sign => {
        response += `${sign}\n`;
      });
    }

    if (data.tips) {
      response += '\n\n💡 **Consejos prácticos**:\n';
      data.tips.forEach(tip => {
        response += `${tip}\n`;
      });
    }

    if (data.advice) {
      response += `\n\n${data.advice}`;
    }

    return {
      response: response,
      type: category,
      suggestions: getContextualSuggestions(category),
      urgency: data.urgency || 'normal'
    };
  }

  // Manejar consulta general de categoría
  handleGeneralCategoryQuery(category) {
    const generalResponses = {
      síntomas: "Entiendo que tu mascota presenta algún síntoma. Para ayudarte mejor, ¿podrías decirme qué síntomas específicos has observado?",
      alimentación: "Las dudas sobre alimentación son muy comunes. ¿Tu consulta es sobre qué darle de comer, cuánto, o con qué frecuencia?",
      prevención: "La prevención es fundamental. ¿Te interesa información sobre vacunas, desparasitación, o cuidados preventivos en general?",
      comportamiento: "El comportamiento de nuestras mascotas puede decirnos mucho. ¿Qué comportamiento específico te preocupa?",
      cuidados: "Los cuidados diarios son muy importantes. ¿Necesitas información sobre higiene, ejercicio, o cuidados generales?"
    };

    return {
      response: generalResponses[category] || "¿Podrías ser más específico en tu consulta?",
      type: category,
      suggestions: getContextualSuggestions(category)
    };
  }

  // Manejar respuestas fallback
  handleFallback(message) {
    const fallbacks = veterinaryKnowledge.fallback;
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    
    return {
      response: `${randomFallback}\n\n🤔 **Puedes preguntarme sobre**:\n• Síntomas y enfermedades\n• Alimentación y nutrición\n• Vacunas y prevención\n• Comportamiento\n• Cuidados generales\n• Emergencias`,
      type: 'fallback',
      suggestions: veterinaryKnowledge.defaultSuggestions.map(s => s.text)
    };
  }

  // Obtener sugerencias por defecto
  getDefaultSuggestions() {
    return veterinaryKnowledge.defaultSuggestions;
  }

  // Reiniciar contexto
  resetContext() {
    this.context = {
      currentCategory: null,
      conversationHistory: [],
      userProfile: {
        petType: null,
        petAge: null,
        previousConsultations: []
      }
    };
  }

  // Obtener historial de conversación
  getConversationHistory() {
    return this.context.conversationHistory;
  }

  // Actualizar perfil del usuario
  updateUserProfile(profile) {
    this.context.userProfile = { ...this.context.userProfile, ...profile };
  }

  // Obtener estadísticas de uso
  getUsageStats() {
    const history = this.context.conversationHistory;
    const categories = {};
    
    history.forEach(msg => {
      if (msg.category) {
        categories[msg.category] = (categories[msg.category] || 0) + 1;
      }
    });

    return {
      totalMessages: history.length,
      categoriesUsed: Object.keys(categories),
      mostUsedCategory: Object.keys(categories).reduce((a, b) => 
        categories[a] > categories[b] ? a : b, null)
    };
  }
}

// Instancia singleton
export const chatBotService = new ChatBotService();

// Función helper para formatear tiempo
export const formatTime = (date) => {
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Función helper para detectar tipo de mascota en el mensaje
export const detectPetType = (message) => {
  const petTypes = {
    perro: ['perro', 'can', 'cachorro', 'perra'],
    gato: ['gato', 'felino', 'gatito', 'gata', 'minino'],
    ave: ['ave', 'pajaro', 'loro', 'canario'],
    conejo: ['conejo', 'conejito'],
    hamster: ['hamster', 'hamster'],
    reptil: ['iguana', 'serpiente', 'tortuga', 'lagarto']
  };

  for (const [type, keywords] of Object.entries(petTypes)) {
    if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
      return type;
    }
  }

  return null;
};

export default ChatBotService;