// src/components/ui/NotificationSystem.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Hook personalizado para notificaciones
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      timestamp: new Date(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-remove después de 5 segundos para notificaciones temporales
    if (notification.autoRemove !== false) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
    
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll,
    unreadCount
  };
};

// Tipos de notificaciones predefinidas para la veterinaria
export const NotificationTypes = {
  APPOINTMENT_CREATED: {
    type: 'appointment',
    icon: '📅',
    title: 'Nueva Cita',
    color: 'blue'
  },
  APPOINTMENT_REMINDER: {
    type: 'reminder',
    icon: '⏰',
    title: 'Recordatorio',
    color: 'yellow'
  },
  PAYMENT_SUCCESS: {
    type: 'payment',
    icon: '💳',
    title: 'Pago Exitoso',
    color: 'green'
  },
  MEDICAL_UPDATE: {
    type: 'medical',
    icon: '🏥',
    title: 'Actualización Médica',
    color: 'purple'
  },
  EMERGENCY: {
    type: 'emergency',
    icon: '🚨',
    title: 'Emergencia',
    color: 'red'
  },
  SYSTEM: {
    type: 'system',
    icon: '⚙️',
    title: 'Sistema',
    color: 'gray'
  }
};

// Componente de notificación individual
export const NotificationItem = ({ notification, onMarkAsRead, onRemove }) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: 'border-l-blue-500 bg-blue-50 text-blue-800',
      green: 'border-l-green-500 bg-green-50 text-green-800',
      yellow: 'border-l-yellow-500 bg-yellow-50 text-yellow-800',
      red: 'border-l-red-500 bg-red-50 text-red-800',
      purple: 'border-l-purple-500 bg-purple-50 text-purple-800',
      gray: 'border-l-gray-500 bg-gray-50 text-gray-800'
    };
    return colors[color] || colors.gray;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'hace un momento';
  };

  return (
    <div 
      className={`
        border-l-4 p-4 rounded-r-lg shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer
        ${getColorClasses(notification.color)}
        ${!notification.read ? 'ring-2 ring-blue-500/20' : ''}
      `}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <span className="text-2xl">{notification.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-sm">{notification.title}</h4>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <p className="text-sm opacity-90 mb-2">{notification.message}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-70">
                {formatTime(notification.timestamp)}
              </span>
              {notification.action && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    notification.action.handler();
                  }}
                  className="text-xs font-medium hover:underline"
                >
                  {notification.action.text}
                </button>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(notification.id);
          }}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Panel de notificaciones
export const NotificationPanel = ({ 
  notifications, 
  isOpen, 
  onClose, 
  onMarkAsRead, 
  onRemove, 
  onClearAll 
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-slideInScale">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Notificaciones</h3>
            <p className="text-sm opacity-90">
              {notifications.filter(n => !n.read).length} nuevas
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
              >
                Limpiar todo
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🔕</div>
            <p className="text-sm">No hay notificaciones</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t p-3 bg-gray-50">
          <button 
            className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => {
              // Aquí podrías navegar a una página de todas las notificaciones
              toast.info('Función de ver todas las notificaciones en desarrollo');
            }}
          >
            Ver todas las notificaciones
          </button>
        </div>
      )}
    </div>
  );
};

// Helpers para crear notificaciones específicas de veterinaria
export const createVetNotification = {
  appointmentCreated: (petName, date, time) => ({
    ...NotificationTypes.APPOINTMENT_CREATED,
    message: `Cita programada para ${petName} el ${date} a las ${time}`,
    action: {
      text: 'Ver detalles',
      handler: () => window.location.href = '/citas'
    }
  }),

  appointmentReminder: (petName, timeLeft) => ({
    ...NotificationTypes.APPOINTMENT_REMINDER,
    message: `Recordatorio: Cita con ${petName} en ${timeLeft}`,
    action: {
      text: 'Ver agenda',
      handler: () => window.location.href = '/agenda'
    }
  }),

  paymentSuccess: (amount, concept) => ({
    ...NotificationTypes.PAYMENT_SUCCESS,
    message: `Pago de ${amount} procesado exitosamente por ${concept}`,
    action: {
      text: 'Ver recibo',
      handler: () => toast.info('Función de recibos en desarrollo')
    }
  }),

  medicalUpdate: (petName, update) => ({
    ...NotificationTypes.MEDICAL_UPDATE,
    message: `Actualización médica para ${petName}: ${update}`,
    action: {
      text: 'Ver historia',
      handler: () => window.location.href = '/historias'
    }
  }),

  emergency: (message, location) => ({
    ...NotificationTypes.EMERGENCY,
    message: `🚨 EMERGENCIA: ${message} ${location ? `en ${location}` : ''}`,
    autoRemove: false,
    action: {
      text: 'Atender',
      handler: () => toast.error('Protocolo de emergencia activado')
    }
  }),

  systemUpdate: (message) => ({
    ...NotificationTypes.SYSTEM,
    message: message,
    action: {
      text: 'Más info',
      handler: () => toast.info('Información del sistema')
    }
  }),

  vaccineReminder: (petName, vaccine, dueDate) => ({
    ...NotificationTypes.APPOINTMENT_REMINDER,
    message: `${petName} necesita la vacuna ${vaccine} antes del ${dueDate}`,
    action: {
      text: 'Programar',
      handler: () => window.location.href = '/citas'
    }
  }),

  lowStock: (productName, currentStock) => ({
    ...NotificationTypes.SYSTEM,
    message: `Stock bajo: ${productName} (${currentStock} unidades restantes)`,
    action: {
      text: 'Ver inventario',
      handler: () => window.location.href = '/tienda'
    }
  })
};

// Hook para notificaciones automáticas del sistema
export const useVetNotifications = () => {
  const { notifications, addNotification, ...rest } = useNotifications();

  // Función para simular notificaciones periódicas (demo)
  const startDemoNotifications = () => {
    const demoNotifications = [
      () => addNotification(createVetNotification.appointmentReminder('Luna', '30 minutos')),
      () => addNotification(createVetNotification.paymentSuccess('150,000', 'Consulta veterinaria')),
      () => addNotification(createVetNotification.vaccineReminder('Max', 'Antirrábica', '15 de Julio')),
      () => addNotification(createVetNotification.lowStock('Alimento Premium', 5)),
      () => addNotification(createVetNotification.medicalUpdate('Whiskers', 'Resultados de laboratorio disponibles'))
    ];

    // Enviar una notificación cada 30 segundos (solo para demo)
    let index = 0;
    const interval = setInterval(() => {
      if (index < demoNotifications.length) {
        demoNotifications[index]();
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30000);

    return () => clearInterval(interval);
  };

  // Notificaciones específicas de veterinaria
  const notifyAppointment = (petName, date, time) => {
    addNotification(createVetNotification.appointmentCreated(petName, date, time));
    
    // También mostrar toast
    toast.success(`🎉 Cita programada para ${petName}`, {
      icon: '📅'
    });
  };

  const notifyPayment = (amount, concept) => {
    addNotification(createVetNotification.paymentSuccess(amount, concept));
    
    toast.success(`💳 Pago de ${amount} procesado`, {
      icon: '✅'
    });
  };

  const notifyEmergency = (message, location) => {
    addNotification(createVetNotification.emergency(message, location));
    
    // Toast de emergencia con sonido (si está disponible)
    toast.error(`🚨 EMERGENCIA: ${message}`, {
      icon: '🚨',
      autoClose: false,
      closeOnClick: false
    });

    // Intentar reproducir sonido de emergencia
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N+PQAoUXrTp66hVFApGn+DyvmwhBjiS1/LNeSsFJHfH8N+PQAoUXrTp66hVFApGn+DyvmwhBziR1/LMeywFJHfH8N+PQAoUXrTp66hVFApGn+DyvmwhBziR1/LMeSwFJHfH8N+PQAoUXrTp66hVFApGn+DyvmwhBziR1/LMeSwFJHfH8N+PQAoUXrTp66hVFApGn+DyvmwhBziR1/LMeSwFJHfH8N+PQAoUXrTp66hVFApGn+DyvmwhBziR1/LMeSwFJHfH8N+PQAoUXrTp66hVFApGn+DyvmwhBziR1/LMeSwFJHfH8N+PQAoUXrTp66hVFApGn+DyvmwhBziR1/LMeSwFJHfH8N+PQAoUXrTp66hVFApGn+DyvmwhBziR1/LMeSwFJHfH8N+PQAoUXrTp66hVFApGn+DyvmwkhSdnUlh0dXSWn6GQlJaUkZWPTIZsaG6LdXmxhW5HVCJ1cZi2mJWpQEMnqeXmmnBhEQV4o9nqjkUPQ6Pj7bBsFg52r+DvhokaI2jA5OeNYAYIUZLSyIvBlzZYVWl8pZipj/OPwJJOQTGaVjhMuFFkPJhk/TMnR0U0PYl7/zZeAuPa2O5K/tJmr//7QAvRAInb3h9WQyKaBVEJB/5h3mE7sZxP/CgHGAZgJ7vv01iJCgXbZf/K02GeCztqFyH4nBu1dDOEjQyQGWBteFxBf+7LdnuAx6dO2KuzjVxRQyahGt5rbyVlCnKiGOYOJRJ7hJevqGNObnAWwPeFNJAYJYyNw9I8BHXP6TBOCzZICvC/Dz0LX7XPRwz9Wd9xS5aapXVlhRhBh2BxfXCR3mBEXAhgj7x3xIwSm4Y8wvnAMbI8ZBQF/EzVAMK1ujLPdqJKB5X8b1vKb9AUBwZDcCh7vFpOzgBi/0WvGVdHSiM0I4VTx3vhCXLz5N1yPgRjgJjH+K2M/Rn7q7FG3b39a5rdpRaXSlNYKy9/jkKkCZJfqVa2vUhcDHhJPqMm7ZeVD4VVa6ZKwxNp7W8/k5Edn4JaXd3MJ0uy7YUfpJhgMnAJgd4WE6E8k3AQBN9WTjsblpQDEz8YfRrU5D/YgYbP0HpYF8='
      );
      audio.play().catch(() => {
        // Silently fail if audio is not supported
      });
    } catch (error) {
      // Silently fail
    }
  };

  const notifyMedicalUpdate = (petName, update) => {
    addNotification(createVetNotification.medicalUpdate(petName, update));
    
    toast.info(`📋 Actualización médica para ${petName}`, {
      icon: '🏥'
    });
  };

  return {
    notifications,
    addNotification,
    notifyAppointment,
    notifyPayment,
    notifyEmergency,
    notifyMedicalUpdate,
    startDemoNotifications,
    ...rest
  };
};

// Toast personalizado para notificaciones de veterinaria
export const showVetToast = {
  success: (message, options = {}) => {
    toast.success(message, {
      icon: '🎉',
      style: {
        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
        color: 'white',
        borderRadius: '12px'
      },
      ...options
    });
  },

  error: (message, options = {}) => {
    toast.error(message, {
      icon: '❌',
      style: {
        background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        borderRadius: '12px'
      },
      ...options
    });
  },

  info: (message, options = {}) => {
    toast.info(message, {
      icon: 'ℹ️',
      style: {
        background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
        color: 'white',
        borderRadius: '12px'
      },
      ...options
    });
  },

  warning: (message, options = {}) => {
    toast.warning(message, {
      icon: '⚠️',
      style: {
        background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
        color: 'white',
        borderRadius: '12px'
      },
      ...options
    });
  },

  appointment: (petName, action = 'programada') => {
    toast.success(`📅 Cita ${action} para ${petName}`, {
      icon: '🐾',
      style: {
        background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)',
        color: 'white',
        borderRadius: '12px'
      }
    });
  },

  payment: (amount) => {
    toast.success(`💳 Pago de ${amount} procesado exitosamente`, {
      icon: '💰',
      style: {
        background: 'linear-gradient(90deg, #059669 0%, #047857 100%)',
        color: 'white',
        borderRadius: '12px'
      }
    });
  },

  emergency: (message) => {
    toast.error(`🚨 EMERGENCIA: ${message}`, {
      icon: '🆘',
      autoClose: false,
      closeOnClick: false,
      style: {
        background: 'linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)',
        color: 'white',
        borderRadius: '12px',
        fontWeight: 'bold'
      }
    });
  }
};