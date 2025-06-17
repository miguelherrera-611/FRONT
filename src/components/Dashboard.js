// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { AnimatedCard, AnimatedStatCard } from './ui/Animations';
import { useVetNotifications, showVetToast } from './ui/NotificationSystem';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayStats, setTodayStats] = useState({
    appointments: 12,
    emergencies: 2,
    payments: 8,
    newPets: 5
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const { notifyAppointment, notifyPayment, notifyEmergency } = useVetNotifications();

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simular actividad reciente
  useEffect(() => {
    setRecentActivity([
      {
        id: 1,
        type: 'appointment',
        message: 'Cita completada con Luna (Golden Retriever)',
        time: '10:30 AM',
        icon: '✅',
        color: 'green'
      },
      {
        id: 2,
        type: 'payment',
        message: 'Pago recibido - $150,000 por consulta',
        time: '10:15 AM',
        icon: '💳',
        color: 'blue'
      },
      {
        id: 3,
        type: 'registration',
        message: 'Nueva mascota registrada: Max (Pastor Alemán)',
        time: '09:45 AM',
        icon: '🐕',
        color: 'purple'
      },
      {
        id: 4,
        type: 'emergency',
        message: 'Emergencia atendida - Gato con dificultad respiratoria',
        time: '09:20 AM',
        icon: '🚨',
        color: 'red'
      }
    ]);

    setUpcomingAppointments([
      {
        id: 1,
        petName: 'Whiskers',
        ownerName: 'María González',
        time: '11:00 AM',
        type: 'Consulta general',
        urgent: false
      },
      {
        id: 2,
        petName: 'Rocky',
        ownerName: 'Carlos Martínez',
        time: '11:30 AM',
        type: 'Vacunación',
        urgent: false
      },
      {
        id: 3,
        petName: 'Bella',
        ownerName: 'Ana López',
        time: '12:00 PM',
        type: 'Emergencia',
        urgent: true
      }
    ]);
  }, []);

  const quickActions = [
    {
      title: 'Nueva Cita',
      description: 'Programar consulta',
      icon: '📅',
      link: ROUTES.CITAS,
      color: 'blue',
      action: () => {
        showVetToast.info('Redirigiendo a programación de citas...');
      }
    },
    {
      title: 'Emergencia',
      description: 'Atención urgente',
      icon: '🚨',
      link: '#',
      color: 'red',
      action: () => {
        notifyEmergency('Nueva emergencia reportada', 'Sala 2');
        showVetToast.emergency('Protocolo de emergencia activado');
      }
    },
    {
      title: 'Registrar Mascota',
      description: 'Nuevo paciente',
      icon: '🐾',
      link: ROUTES.MASCOTAS,
      color: 'green',
      action: () => {
        showVetToast.info('Abriendo formulario de registro...');
      }
    },
    {
      title: 'Ver Inventario',
      description: 'Productos y stock',
      icon: '📦',
      link: ROUTES.TIENDA,
      color: 'yellow',
      action: () => {
        showVetToast.info('Cargando inventario...');
      }
    }
  ];

  const weatherInfo = {
    temperature: '24°C',
    condition: 'Soleado',
    icon: '☀️',
    humidity: '65%',
    location: 'Quimbaya, Quindío'
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '🌅 Buenos días';
    if (hour < 18) return '☀️ Buenas tardes';
    return '🌙 Buenas noches';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-12">
      <div className="container mx-auto px-4 space-y-8">
        {/* Header del Dashboard */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg mb-6">
            <div className="text-4xl animate-bounce">🏥</div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {getGreeting()}
              </h1>
              <p className="text-gray-600">{formatDate(currentTime)}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800 font-mono">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-gray-500">
                {weatherInfo.icon} {weatherInfo.temperature} • {weatherInfo.condition}
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas del día */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <AnimatedStatCard
            icon="📅"
            title="Citas de Hoy"
            value={todayStats.appointments}
            color="blue"
            trend={8}
          />
          <AnimatedStatCard
            icon="🚨"
            title="Emergencias"
            value={todayStats.emergencies}
            color="red"
            trend={-2}
          />
          <AnimatedStatCard
            icon="💳"
            title="Pagos Procesados"
            value={todayStats.payments}
            color="green"
            trend={15}
          />
          <AnimatedStatCard
            icon="🐾"
            title="Nuevas Mascotas"
            value={todayStats.newPets}
            color="purple"
            trend={5}
          />
        </div>

        {/* Acciones rápidas */}
        <AnimatedCard className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">⚡</span>
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200"
              >
                <div className="text-center">
                  <div className={`text-4xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    {action.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
                
                {/* Efecto de hover */}
                <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                  action.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  action.color === 'red' ? 'from-red-500 to-red-600' :
                  action.color === 'green' ? 'from-green-500 to-green-600' :
                  'from-yellow-500 to-yellow-600'
                }`}></div>
              </button>
            ))}
          </div>
        </AnimatedCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Próximas citas */}
          <AnimatedCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">📋</span>
                Próximas Citas
              </h2>
              <Link
                to={ROUTES.AGENDA}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver agenda completa →
              </Link>
            </div>
            
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`p-4 rounded-xl border-l-4 ${
                    appointment.urgent 
                      ? 'border-l-red-500 bg-red-50' 
                      : 'border-l-blue-500 bg-blue-50'
                  } hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-800">{appointment.petName}</h4>
                        {appointment.urgent && (
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
                            URGENTE
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{appointment.ownerName}</p>
                      <p className="text-sm text-gray-500">{appointment.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">{appointment.time}</div>
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  notifyAppointment('Nuevo Paciente', 'Hoy', '2:30 PM');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Agregar Cita
              </button>
            </div>
          </AnimatedCard>

          {/* Actividad reciente */}
          <AnimatedCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">📈</span>
                Actividad Reciente
              </h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Ver todo →
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    activity.color === 'green' ? 'bg-green-500' :
                    activity.color === 'blue' ? 'bg-blue-500' :
                    activity.color === 'purple' ? 'bg-purple-500' :
                    'bg-red-500'
                  }`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  notifyPayment('85,000', 'Vacunación');
                }}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                + Registrar Actividad
              </button>
            </div>
          </AnimatedCard>
        </div>

        {/* Panel de acceso rápido a reportes */}
        <AnimatedCard>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">📊</span>
            Reportes y Análisis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-semibold text-gray-800 mb-2">Ingresos del Mes</h3>
              <p className="text-2xl font-bold text-blue-600">$2,450,000</p>
              <p className="text-sm text-gray-600 mt-1">+15% vs mes anterior</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-3xl mb-3">🐾</div>
              <h3 className="font-semibold text-gray-800 mb-2">Mascotas Atendidas</h3>
              <p className="text-2xl font-bold text-green-600">147</p>
              <p className="text-sm text-gray-600 mt-1">Este mes</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-3xl mb-3">⭐</div>
              <h3 className="font-semibold text-gray-800 mb-2">Satisfacción</h3>
              <p className="text-2xl font-bold text-purple-600">4.9/5</p>
              <p className="text-sm text-gray-600 mt-1">Promedio de reseñas</p>
            </div>
          </div>
        </AnimatedCard>

        {/* Widget del clima y consejos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatedCard>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🌤️</span>
              Clima en {weatherInfo.location}
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-800">{weatherInfo.temperature}</div>
                <div className="text-gray-600">{weatherInfo.condition}</div>
                <div className="text-sm text-gray-500">Humedad: {weatherInfo.humidity}</div>
              </div>
              <div className="text-6xl">{weatherInfo.icon}</div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Consejo del día:</strong> El clima soleado es perfecto para paseos con mascotas. 
                Recuerda mantenerlas hidratadas y evitar el asfalto caliente.
              </p>
            </div>
          </AnimatedCard>

          <AnimatedCard>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">💡</span>
              Tips Veterinarios
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-green-800">
                  <strong>Vacunación:</strong> Recuerda programar las vacunas anuales antes del inicio del verano.
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <p className="text-sm text-yellow-800">
                  <strong>Hidratación:</strong> Las mascotas necesitan más agua en días calurosos como hoy.
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <p className="text-sm text-purple-800">
                  <strong>Ejercicio:</strong> Las primeras horas de la mañana son ideales para actividad física.
                </p>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Panel de alertas y recordatorios */}
        <AnimatedCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="mr-3">🔔</span>
              Alertas y Recordatorios
            </h2>
            <span className="text-sm text-gray-500">Actualizado hace 2 minutos</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-red-500">🚨</span>
                <span className="font-medium text-red-800">Stock Crítico</span>
              </div>
              <p className="text-sm text-red-700">Alimento Premium Canino: 3 unidades restantes</p>
              <button className="mt-2 text-xs bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors">
                Reabastecer
              </button>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-blue-500">💉</span>
                <span className="font-medium text-blue-800">Vacunas Pendientes</span>
              </div>
              <p className="text-sm text-blue-700">5 mascotas necesitan refuerzo de vacunas esta semana</p>
              <button className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors">
                Ver Lista
              </button>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-green-500">🎉</span>
                <span className="font-medium text-green-800">Cumpleaños</span>
              </div>
              <p className="text-sm text-green-700">Luna cumple 3 años hoy. ¡Envía felicitaciones!</p>
              <button className="mt-2 text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors">
                Enviar Mensaje
              </button>
            </div>
          </div>
        </AnimatedCard>

        {/* Footer del Dashboard */}
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Sistema operativo</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Última actualización: {formatTime(currentTime)}</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Veterinaria App v2.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;