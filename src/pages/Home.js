import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { AnimatedCard, AnimatedButton, AnimatedStatCard } from '../components/ui/Animations';

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherEmoji, setWeatherEmoji] = useState('☀️');

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simular clima (en una app real, esto vendría de una API)
  useEffect(() => {
    const weathers = ['☀️', '🌤️', '⛅', '🌧️', '⛈️'];
    const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
    setWeatherEmoji(randomWeather);
  }, []);

  const features = [
    {
      title: 'Registro de Mascotas',
      description: 'Mantén un registro completo y detallado de todas las mascotas con historial médico',
      icon: '🐕',
      link: ROUTES.MASCOTAS,
      gradient: 'from-green-400 to-green-600',
      stats: '1,234 mascotas registradas'
    },
    {
      title: 'Programar Citas',
      description: 'Sistema inteligente de citas con recordatorios automáticos y gestión de horarios',
      icon: '📅',
      link: ROUTES.CITAS,
      gradient: 'from-blue-400 to-blue-600',
      stats: '345 citas este mes'
    },
    {
      title: 'Vista de Agenda',
      description: 'Visualiza la agenda diaria con vista de calendario interactivo y filtros avanzados',
      icon: '🗓️',
      link: ROUTES.AGENDA,
      gradient: 'from-purple-400 to-purple-600',
      stats: '12 veterinarios activos'
    },
    {
      title: 'Tienda Veterinaria',
      description: 'Catálogo completo de productos con carrito de compras y pagos seguros',
      icon: '🛒',
      link: ROUTES.TIENDA,
      gradient: 'from-yellow-400 to-orange-500',
      stats: '500+ productos disponibles'
    },
  ];

  const quickActions = [
    {
      title: 'Cita de Emergencia',
      description: 'Programa una cita urgente',
      icon: '🚨',
      link: ROUTES.CITAS,
      color: 'red'
    },
    {
      title: 'Consulta Rápida',
      description: 'Chat con veterinario online',
      icon: '💬',
      link: '#',
      color: 'green'
    },
    {
      title: 'Ver Historial',
      description: 'Accede al historial médico',
      icon: '📋',
      link: ROUTES.HISTORIAS,
      color: 'blue'
    }
  ];

  const stats = [
    { 
      label: 'Mascotas Felices', 
      value: 1234, 
      icon: '🐾',
      color: 'green',
      trend: 12
    },
    { 
      label: 'Familias Satisfechas', 
      value: 856, 
      icon: '👨‍👩‍👧‍👦',
      color: 'blue',
      trend: 8
    },
    { 
      label: 'Veterinarios Expertos', 
      value: 12, 
      icon: '👨‍⚕️',
      color: 'purple',
      trend: 0
    },
    { 
      label: 'Consultas Exitosas', 
      value: 3456, 
      icon: '✅',
      color: 'orange',
      trend: 15
    }
  ];

  const testimonials = [
    {
      name: "María González",
      pet: "Luna (Golden Retriever)",
      message: "El mejor cuidado veterinario que he encontrado. El equipo es increíble.",
      rating: 5,
      avatar: "👩‍🦱"
    },
    {
      name: "Carlos Rodríguez",
      pet: "Whiskers (Gato Persa)",
      message: "Profesionales excepcionales. Mi gato ahora está completamente sano.",
      rating: 5,
      avatar: "👨‍🦲"
    },
    {
      name: "Ana Martínez",
      pet: "Rocky (Pastor Alemán)",
      message: "Atención 24/7 y un servicio que va más allá de lo esperado.",
      rating: 5,
      avatar: "👩‍🦰"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section Mejorado */}
      <section className="relative overflow-hidden">
        {/* Formas decorativas de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 py-16">
          {/* Barra de estado superior */}
          <div className="flex justify-between items-center mb-8 p-4 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">{weatherEmoji}</div>
              <div>
                <p className="text-sm text-gray-600">Quimbaya, Quindío</p>
                <p className="font-medium text-gray-800">
                  {currentTime.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Hora actual</p>
              <p className="text-2xl font-bold text-gray-800 font-mono">
                {currentTime.toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Hero principal */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="text-8xl mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
                🏥
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Veterinaria</span>
              <br />
              <span className="text-gray-800">del Futuro</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Tecnología de vanguardia para el <span className="font-semibold text-blue-600">mejor cuidado</span> de tus mascotas
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <AnimatedButton
                variant="primary"
                size="lg"
                icon="📅"
                onClick={() => window.location.href = ROUTES.CITAS}
              >
                Agendar Cita
              </AnimatedButton>
              
              <AnimatedButton
                variant="ghost"
                size="lg"
                icon="🐾"
                onClick={() => window.location.href = ROUTES.MASCOTAS}
              >
                Registrar Mascota
              </AnimatedButton>
            </div>

            {/* Acciones rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              {quickActions.map((action, index) => (
                <AnimatedCard key={index} delay={index * 100}>
                  <Link to={action.link} className="block text-center p-4 hover:scale-105 transition-transform">
                    <div className="text-3xl mb-2">{action.icon}</div>
                    <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </Link>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas animadas */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            📊 Nuestros Números Hablan
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <AnimatedStatCard
                key={index}
                icon={stat.icon}
                title={stat.label}
                value={stat.value}
                color={stat.color}
                trend={stat.trend}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Características principales */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              🚀 Funcionalidades de Vanguardia
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre todas las herramientas que hacen de nuestra clínica la más avanzada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <AnimatedCard key={index} delay={index * 150}>
                <Link to={feature.link} className="block">
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                      {feature.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {feature.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-600">
                          {feature.stats}
                        </span>
                        <span className="text-blue-600 group-hover:translate-x-2 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            💬 Lo que Dicen Nuestras Familias
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedCard key={index} delay={index * 200} className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
                <div className="text-center">
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  <h4 className="font-bold text-lg mb-1">{testimonial.name}</h4>
                  <p className="text-white/80 text-sm mb-4">{testimonial.pet}</p>
                  
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">⭐</span>
                    ))}
                  </div>
                  
                  <p className="text-white/90 italic">
                    "{testimonial.message}"
                  </p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Llamada a la acción final */}
      <section className="py-16 bg-gradient-to-br from-green-400 to-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              🌟 ¿Listo para Comenzar?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a las miles de familias que confían en nosotros para el cuidado de sus mascotas
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton
                variant="ghost"
                size="lg"
                icon="📱"
                onClick={() => window.location.href = '/login'}
              >
                Crear Cuenta Gratis
              </AnimatedButton>
              
              <AnimatedButton
                variant="primary"
                size="lg"
                icon="📞"
                onClick={() => window.location.href = 'tel:+576123456789'}
              >
                Llamar Ahora
              </AnimatedButton>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-8 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span>Atención 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span>Primera consulta gratis</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span>Garantía total</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;