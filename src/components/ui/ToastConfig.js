// src/components/ui/ToastConfig.js
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componente de Toast personalizado
const CustomToast = ({ type, message, icon, onClose }) => {
  const getBackgroundColor = (type) => {
    const colors = {
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      appointment: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      payment: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      emergency: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
    };
    return colors[type] || colors.info;
  };

  return (
    <div 
      className="flex items-center p-4 rounded-xl shadow-lg text-white relative overflow-hidden"
      style={{ 
        background: getBackgroundColor(type),
        minWidth: '300px'
      }}
    >
      {/* Efecto de brillo */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>
      
      <div className="relative z-10 flex items-center w-full">
        {/* Icono */}
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">
            {icon}
          </div>
        </div>
        
        {/* Mensaje */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">{message}</p>
        </div>
        
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-3 text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Funciones de toast mejoradas para veterinaria
export const veterinaryToast = {
  success: (message, options = {}) => {
    return toast(
      <CustomToast 
        type="success" 
        message={message} 
        icon="🎉"
        onClose={() => toast.dismiss()}
      />,
      {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast-success',
        bodyClassName: 'custom-toast-body',
        ...options
      }
    );
  },

  error: (message, options = {}) => {
    return toast(
      <CustomToast 
        type="error" 
        message={message} 
        icon="❌"
        onClose={() => toast.dismiss()}
      />,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast-error',
        ...options
      }
    );
  },

  info: (message, options = {}) => {
    return toast(
      <CustomToast 
        type="info" 
        message={message} 
        icon="ℹ️"
        onClose={() => toast.dismiss()}
      />,
      {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast-info',
        ...options
      }
    );
  },

  warning: (message, options = {}) => {
    return toast(
      <CustomToast 
        type="warning" 
        message={message} 
        icon="⚠️"
        onClose={() => toast.dismiss()}
      />,
      {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast-warning',
        ...options
      }
    );
  },

  // Toasts específicos para veterinaria
  appointment: (petName, action = 'programada', options = {}) => {
    return toast(
      <CustomToast 
        type="appointment" 
        message={`Cita ${action} para ${petName}`} 
        icon="📅"
        onClose={() => toast.dismiss()}
      />,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast-appointment',
        ...options
      }
    );
  },

  payment: (amount, concept = '', options = {}) => {
    return toast(
      <CustomToast 
        type="payment" 
        message={`Pago de $${amount.toLocaleString()} procesado ${concept ? `por ${concept}` : 'exitosamente'}`} 
        icon="💳"
        onClose={() => toast.dismiss()}
      />,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast-payment',
        ...options
      }
    );
  },

  emergency: (message, options = {}) => {
    return toast(
      <CustomToast 
        type="emergency" 
        message={`🚨 EMERGENCIA: ${message}`} 
        icon="🆘"
        onClose={() => toast.dismiss()}
      />,
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        className: 'custom-toast-emergency',
        ...options
      }
    );
  },

  petRegistered: (petName, species, options = {}) => {
    return toast(
      <CustomToast 
        type="success" 
        message={`${petName} (${species}) ha sido registrado exitosamente`} 
        icon="🐾"
        onClose={() => toast.dismiss()}
      />,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast-pet',
        ...options
      }
    );
  },

  vaccineReminder: (petName, vaccine, dueDate, options = {}) => {
    return toast(
      <CustomToast 
        type="warning" 
        message={`Recordatorio: ${petName} necesita ${vaccine} antes del ${dueDate}`} 
        icon="💉"
        onClose={() => toast.dismiss()}
      />,
      {
        position: "top-right",
        autoClose: 8000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast-vaccine',
        ...options
      }
    );
  },

  welcome: (userName, role, options = {}) => {
    const roleEmojis = {
      'ROLE_ADMIN': '👑',
      'ROLE_VETERINARIO': '👨‍⚕️',
      'ROLE_PROPIETARIO': '👤',
      'ROLE_USER': '👤'
    };
    
    return toast(
      <CustomToast 
        type="success" 
        message={`¡Bienvenido ${userName}! ${roleEmojis[role] || '👤'}`} 
        icon="🎉"
        onClose={() => toast.dismiss()}
      />,
      {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast-welcome',
        ...options
      }
    );
  }
};

// Configuración del contenedor de Toast
export const VeterinaryToastContainer = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar
      newestOnTop
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      className="custom-toast-container"
      toastClassName="custom-toast"
      bodyClassName="custom-toast-body"
      closeButton={false}
      style={{
        top: '80px' // Para que no interfiera con el header fijo
      }}
    />
  );
};

// Estilos CSS adicionales para los toasts (agregar al index.css)
export const toastStyles = `
.custom-toast-container {
  z-index: 9999;
}

.custom-toast {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin-bottom: 1rem;
  border-radius: 12px;
}

.custom-toast-body {
  padding: 0 !important;
  margin: 0 !important;
}

.custom-toast-success {
  animation: slideInRight 0.4s ease-out;
}

.custom-toast-error {
  animation: slideInRight 0.4s ease-out, shake 0.5s ease-out 0.2s;
}

.custom-toast-emergency {
  animation: slideInDown 0.5s ease-out, pulse 1s ease-in-out infinite 1s;
}

.custom-toast-appointment {
  animation: slideInRight 0.4s ease-out, bounce 0.6s ease-out 0.3s;
}

.custom-toast-payment {
  animation: slideInRight 0.4s ease-out, glow 0.8s ease-out 0.2s;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.6); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .custom-toast-container {
    left: 1rem !important;
    right: 1rem !important;
    width: auto !important;
  }
  
  .custom-toast {
    margin-bottom: 0.5rem;
  }
}
`;

// Hook para usar los toasts veterinarios de manera más fácil
export const useVeterinaryToast = () => {
  return {
    success: veterinaryToast.success,
    error: veterinaryToast.error,
    info: veterinaryToast.info,
    warning: veterinaryToast.warning,
    appointment: veterinaryToast.appointment,
    payment: veterinaryToast.payment,
    emergency: veterinaryToast.emergency,
    petRegistered: veterinaryToast.petRegistered,
    vaccineReminder: veterinaryToast.vaccineReminder,
    welcome: veterinaryToast.welcome
  };
};