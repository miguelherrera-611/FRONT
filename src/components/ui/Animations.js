// src/components/ui/Animations.js
import React, { useState, useEffect } from 'react';

// Hook para animaciones al hacer scroll
export const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.scroll-animate');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return isVisible;
};

// Componente de tarjeta con hover effects mejorado
export const AnimatedCard = ({ children, className = "", delay = 0 }) => {
  return (
    <div 
      className={`
        group relative overflow-hidden rounded-2xl bg-white shadow-lg 
        hover:shadow-2xl transition-all duration-500 ease-out
        hover:-translate-y-2 transform-gpu
        before:absolute before:inset-0 before:bg-gradient-to-r 
        before:from-blue-500/10 before:to-purple-500/10 
        before:opacity-0 before:transition-opacity before:duration-300
        hover:before:opacity-100
        ${className}
      `}
      style={{ 
        animationDelay: `${delay}ms`,
        animation: 'slideInUp 0.6s ease-out forwards'
      }}
    >
      <div className="relative z-10 p-6">
        {children}
      </div>
      
      {/* Efecto de brillo al hover */}
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
    </div>
  );
};

// Botón con efectos mejorados
export const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "md",
  icon,
  loading = false,
  className = ""
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/25",
    secondary: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-green-500/25",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-red-500/25",
    ghost: "bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white/20"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        relative overflow-hidden rounded-xl font-medium
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {/* Efecto de onda al click */}
      <span className="absolute inset-0 w-full h-full bg-white/20 transform scale-0 group-active:scale-100 rounded-xl transition-transform duration-300"></span>
      
      <span className="relative flex items-center justify-center space-x-2">
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {icon && <span>{icon}</span>}
        <span>{children}</span>
      </span>
    </button>
  );
};

// Modal mejorado con animaciones
export const AnimatedModal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      ></div>
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
        style={{ animation: 'slideInScale 0.4s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Componente de estadísticas animadas
export const AnimatedStatCard = ({ icon, title, value, color = "blue", trend }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const increment = value / 50;
      const counter = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(counter);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, 50);
      return () => clearInterval(counter);
    }, 200);

    return () => clearTimeout(timer);
  }, [value]);

  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600"
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{animatedValue}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '↗️' : '↘️'} {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colors[color]} flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Notificación toast mejorada
export const AnimatedToast = ({ message, type = "success", onClose }) => {
  const types = {
    success: "from-green-500 to-green-600 text-white",
    error: "from-red-500 to-red-600 text-white",
    info: "from-blue-500 to-blue-600 text-white",
    warning: "from-yellow-500 to-yellow-600 text-white"
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠"
  };

  return (
    <div 
      className={`
        fixed top-4 right-4 z-50 flex items-center space-x-3 px-6 py-4 rounded-xl shadow-lg
        bg-gradient-to-r ${types[type]}
        transform transition-all duration-300 ease-out
      `}
      style={{ animation: 'slideInRight 0.3s ease-out' }}
    >
      <span className="text-xl">{icons[type]}</span>
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white/80 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
};

// CSS para las animaciones (agregar al index.css)
export const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInScale {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scroll-animate {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.scroll-animate.visible {
  opacity: 1;
  transform: translateY(0);
}

.glass-effect {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
`;