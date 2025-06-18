// src/data/veterinaryKnowledge.js

export const veterinaryKnowledge = {
  // Respuestas predeterminadas comunes
  greetings: [
    "¡Hola! 👋 Soy Dr. IA, tu veterinario virtual. ¿En qué puedo ayudarte hoy?",
    "¡Bienvenido! 🐾 Estoy aquí para ayudarte con cualquier duda sobre tu mascota.",
    "¡Hola! 👨‍⚕️ ¿Cómo está tu pequeño compañero? ¿En qué puedo asistirte?"
  ],

  // Sugerencias predeterminadas que aparecerán al usuario
  defaultSuggestions: [
    {
      id: 1,
      text: "Mi mascota está enferma 🤒",
      category: "síntomas",
      icon: "🏥"
    },
    {
      id: 2,
      text: "Dudas sobre alimentación 🍖",
      category: "alimentación", 
      icon: "🥘"
    },
    {
      id: 3,
      text: "Calendario de vacunas 💉",
      category: "prevención",
      icon: "📅"
    },
    {
      id: 4,
      text: "Comportamiento extraño 🐕",
      category: "comportamiento",
      icon: "🤔"
    },
    {
      id: 5,
      text: "Cuidados generales 🧼",
      category: "cuidados",
      icon: "💖"
    },
    {
      id: 6,
      text: "¿Es una emergencia? 🚨",
      category: "emergencia",
      icon: "⚠️"
    }
  ],

  // Respuestas por categorías
  responses: {
    síntomas: {
      "vomito": {
        response: "El vómito en mascotas puede tener varias causas. Necesito más información:",
        followUp: [
          "¿Cuántas veces ha vomitado en 24 horas?",
          "¿El vómito tiene sangre o espuma?", 
          "¿Tu mascota está bebiendo agua?",
          "¿Ha comido algo extraño?"
        ],
        urgency: "medium",
        advice: "💡 **Consejo**: Retira la comida por 12 horas pero mantén agua disponible."
      },
      "diarrea": {
        response: "La diarrea puede ser causada por varios factores:",
        followUp: [
          "¿Cuándo comenzó la diarrea?",
          "¿Hay sangre en las heces?",
          "¿Ha cambiado la alimentación?", 
          "¿Tu mascota está activa?"
        ],
        urgency: "medium",
        advice: "💡 **Consejo**: Ofrece dieta blanda (arroz con pollo hervido)."
      },
      "cojera": {
        response: "La cojera indica posible dolor o lesión:",
        followUp: [
          "¿En qué pata cojea?",
          "¿Apareció de repente?",
          "¿Hubo algún accidente?",
          "¿Cojea siempre o solo al caminar?"
        ],
        urgency: "medium", 
        advice: "💡 **Consejo**: Limita el ejercicio hasta evaluación veterinaria."
      },
      "letargo": {
        response: "El letargo puede indicar varios problemas de salud:",
        followUp: [
          "¿Desde cuándo está decaído?",
          "¿Está comiendo normalmente?",
          "¿Tiene fiebre?",
          "¿Hay otros síntomas?"
        ],
        urgency: "medium",
        advice: "💡 **Consejo**: Observa otros síntomas y considera consulta veterinaria."
      }
    },

    alimentación: {
      "cachorro": {
        response: "La alimentación de cachorros es crucial para su desarrollo:",
        info: {
          "0-4 semanas": "Solo leche materna",
          "4-6 semanas": "Introducir alimento húmedo para cachorros",
          "6-12 semanas": "Alimento seco para cachorros, 3-4 veces al día",
          "3-6 meses": "3 comidas al día",
          "6+ meses": "2 comidas al día"
        },
        advice: "💡 **Importante**: Usa alimento específico para cachorros, rico en proteínas."
      },
      "adulto": {
        response: "Para mascotas adultas, la alimentación debe ser balanceada:",
        recommendations: [
          "🥘 Alimento premium según su tamaño",
          "🕐 2 comidas al día en horarios fijos", 
          "💧 Agua fresca siempre disponible",
          "🚫 Evitar comida humana"
        ],
        advice: "💡 **Tip**: La cantidad depende del peso, edad y actividad."
      },
      "senior": {
        response: "Las mascotas mayores necesitan cuidados especiales:",
        recommendations: [
          "🍖 Alimento senior con menos calorías",
          "🦴 Suplementos para articulaciones",
          "🥄 Comidas más pequeñas y frecuentes",
          "💊 Considerar dietas terapéuticas"
        ],
        advice: "💡 **Importante**: Consulta regular veterinaria después de los 7 años."
      }
    },

    prevención: {
      "vacunas_perro": {
        response: "Calendario de vacunación para perros:",
        schedule: {
          "6-8 semanas": "Primera vacuna múltiple (DHPP)",
          "10-12 semanas": "Segunda múltiple + Bordatella", 
          "14-16 semanas": "Tercera múltiple + Rabia",
          "1 año": "Refuerzo anual"
        },
        advice: "📅 **Importante**: No sacar a lugares públicos hasta completar vacunas."
      },
      "vacunas_gato": {
        response: "Calendario de vacunación para gatos:",
        schedule: {
          "6-8 semanas": "Primera vacuna múltiple (FVRCP)",
          "10-12 semanas": "Segunda múltiple",
          "14-16 semanas": "Tercera múltiple + Rabia", 
          "1 año": "Refuerzo anual"
        },
        advice: "🏠 **Tip**: Gatos de interior también necesitan vacunas básicas."
      },
      "desparasitacion": {
        response: "La desparasitación es fundamental:",
        schedule: [
          "🐶 Cachorros: cada 2-3 semanas hasta 6 meses",
          "🐱 Gatitos: cada 2-3 semanas hasta 6 meses", 
          "🦎 Adultos: cada 3-6 meses",
          "💊 Antiparasitarios externos mensualmente"
        ],
        advice: "💡 **Importante**: Seguir indicaciones veterinarias exactas."
      }
    },

    comportamiento: {
      "agresividad": {
        response: "La agresividad puede tener varias causas:",
        causes: [
          "😰 Miedo o ansiedad",
          "🏥 Dolor o enfermedad",
          "🏠 Protección territorial",
          "🍖 Protección de recursos"
        ],
        advice: "⚠️ **Importante**: Consulta un etólogo veterinario para evaluación."
      },
      "ansiedad": {
        response: "La ansiedad es común en mascotas:",
        signs: [
          "🏃 Destrucción cuando están solos",
          "😵 Jadeo excesivo",
          "🎵 Ladridos o maullidos constantes",
          "💩 Eliminación inadecuada"
        ],
        advice: "💡 **Tip**: Rutinas fijas y enriquecimiento ambiental ayudan."
      }
    },

    emergencia: {
      "signos_criticos": {
        response: "🚨 **SIGNOS DE EMERGENCIA** - Acudir inmediatamente:",
        signs: [
          "🩸 Sangrado abundante que no para",
          "😵 Pérdida de consciencia", 
          "🫁 Dificultad severa para respirar",
          "🤢 Vómito con sangre",
          "🥶 Convulsiones",
          "🦴 Fracturas evidentes",
          "🐍 Mordedura de serpiente",
          "💊 Ingestión de tóxicos"
        ],
        contact: {
          phone: "+57 (6) 123-4567",
          address: "Veterinaria Humboldt, Quimbaya, Quindío",
          hours: "24/7 Emergencias"
        }
      }
    },

    cuidados: {
      "higiene": {
        response: "La higiene es fundamental para la salud:",
        tips: [
          "🛁 Baño: cada 4-6 semanas o cuando esté sucio",
          "🦷 Cepillado dental: 2-3 veces por semana",
          "✂️ Corte de uñas: cada 2-3 semanas",
          "👂 Limpieza de oídos: semanal con productos específicos"
        ],
        advice: "💡 **Tip**: Acostumbra desde pequeño a estas rutinas."
      },
      "ejercicio": {
        response: "El ejercicio es vital para el bienestar:",
        recommendations: [
          "🐕 Perros: 30-120 min/día según raza",
          "🐱 Gatos: 10-15 min de juego activo",
          "🧸 Juegos mentales también son importantes", 
          "🌡️ Evitar ejercicio en horas muy calurosas"
        ],
        advice: "💡 **Importante**: Adaptar ejercicio a edad y condición física."
      }
    }
  },

  // Palabras clave para detectar intenciones
  keywords: {
    síntomas: [
      "vomito", "vomita", "devuelve", "diarrea", "cojea", "cojo", "letargo",
      "decaido", "enfermo", "dolor", "sangre", "fiebre", "tos", "estornuda"
    ],
    alimentación: [
      "come", "comida", "alimento", "alimentacion", "cachorro", "adulto", 
      "senior", "mayor", "dieta", "peso", "obesidad", "delgado"
    ],
    prevención: [
      "vacuna", "vacunas", "inmunizar", "desparasitar", "parasitos", 
      "pulgas", "garrapatas", "calendario", "cuando"
    ],
    comportamiento: [
      "agresivo", "muerde", "ladra", "maulla", "ansioso", "miedo", 
      "destroza", "orina", "defeca", "comportamiento"
    ],
    emergencia: [
      "emergencia", "urgente", "grave", "critico", "accidente", 
      "atropello", "veneno", "toxico", "convulsion"
    ],
    cuidados: [
      "baño", "bañar", "cepillar", "uñas", "higiene", "ejercicio", 
      "paseo", "jugar", "cuidar"
    ]
  },

  // Respuestas de fallback
  fallback: [
    "No estoy seguro de entender tu consulta. ¿Podrías ser más específico?",
    "Esa es una pregunta interesante. ¿Podrías darme más detalles?",
    "Para ayudarte mejor, necesito más información sobre tu mascota."
  ],

  // Despedidas
  farewells: [
    "¡Espero haber sido de ayuda! 🐾 No olvides consultar a tu veterinario.",
    "¡Cuida mucho a tu mascota! 💖 Estoy aquí cuando me necesites.",
    "¡Que tengas un buen día con tu pequeño compañero! 🌟"
  ]
};

// Función para obtener sugerencias contextuales
export const getContextualSuggestions = (category) => {
  const suggestions = {
    síntomas: [
      "¿Es grave?",
      "¿Qué hago mientras tanto?", 
      "¿Necesito ir al veterinario?",
      "¿Puede ser algo que comió?"
    ],
    alimentación: [
      "¿Cuánto debe comer?",
      "¿Qué alimento recomiendas?",
      "¿Puede comer esto?",
      "¿Cuántas veces al día?"
    ],
    prevención: [
      "¿Cuándo la próxima vacuna?",
      "¿Qué pasa si me retraso?",
      "¿Efectos secundarios?", 
      "¿Costo aproximado?"
    ],
    comportamiento: [
      "¿Cómo lo corrijo?",
      "¿Es normal?",
      "¿Necesita entrenamiento?",
      "¿Puede ser estrés?"
    ],
    emergencia: [
      "¿Llamo ya al veterinario?",
      "¿Qué hago ahora?",
      "¿Es muy grave?",
      "¿Primeros auxilios?"
    ],
    cuidados: [
      "¿Con qué frecuencia?",
      "¿Qué productos usar?", 
      "¿Desde qué edad?",
      "¿Es necesario?"
    ]
  };

  return suggestions[category] || [
    "Cuéntame más",
    "¿Algo más?", 
    "¿Otras dudas?",
    "¿Te ayudo en algo más?"
  ];
};