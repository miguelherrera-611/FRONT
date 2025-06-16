import React from 'react';
import { APP_CONFIG } from '../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información de la empresa */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🏥</span>
              <h3 className="text-lg font-semibold">{APP_CONFIG.APP_NAME}</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Sistema integral de gestión veterinaria para el cuidado de tus mascotas.

            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">

                <li>
                <a href="/mascotas" className="text-gray-300 hover:text-white transition-colors">
                  Registro de Mascotas
                </a>
              </li>
              <li>
                <a href="/citas" className="text-gray-300 hover:text-white transition-colors">
                  Programar Citas
                </a>
              </li>
              <li>
                <a href="/tienda" className="text-gray-300 hover:text-white transition-colors">
                  Tienda Veterinaria
                </a>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>Quimbaya, Quindío, Colombia</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>+57 (6) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✉️</span>
                <span>info@veterinaria.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🕒</span>
                <span>Lun - Vie: 8:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} {APP_CONFIG.APP_NAME}. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">
                Versión {APP_CONFIG.VERSION}
              </span>
              <span className="text-gray-400 text-sm">
                Desarrollado con ❤️
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;