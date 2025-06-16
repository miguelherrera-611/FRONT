import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const Home = () => {
  const features = [
    {
      title: 'Registro de Mascotas',
      description: 'Mantén un registro completo de todas las mascotas',
      icon: '🐕',
      link: ROUTES.MASCOTAS,
      color: 'bg-green-500'
    },
    {
      title: 'Programar Citas',
      description: 'Sistema de citas y programación de consultas',
      icon: '📅',
      link: ROUTES.CITAS,
      color: 'bg-orange-500'
    },
    {
      title: 'Vista de Agenda',
      description: 'Visualiza la agenda diaria de la clínica',
      icon: '🗓️',
      link: ROUTES.AGENDA,
      color: 'bg-red-500'
    },
    {
      title: 'Tienda Veterinaria',
      description: 'Productos y servicios para mascotas',
      icon: '🛒',
      link: ROUTES.TIENDA,
      color: 'bg-yellow-500'
    },
  ];

  const stats = [
    { label: 'Mascotas Atendidas', value: '1,234', icon: '🐾' },
    { label: 'Propietarios Registrados', value: '856', icon: '👥' },
    { label: 'Veterinarios Activos', value: '12', icon: '👨‍⚕️' },
    { label: 'Citas Este Mes', value: '345', icon: '📅' }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          🐾Veterinaria App
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Sistema integral de gestión veterinaria
        </p>
        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-80">
          Administra de manera eficiente a tus pacientes,citas y servicios 
          con nuestra plataforma completa de gestión veterinaria.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={ROUTES.CITAS}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Programar Cita
          </Link>
          <Link
            to={ROUTES.MASCOTAS}
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Registrar Mascota
          </Link>
        </div>
      </section>

      {/* Características principales */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Funcionalidades del Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
              <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-800">
                Acceder →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sección de acceso rápido */}
      <section className="bg-gray-100 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Acceso Rápido
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to={ROUTES.CITAS}
            className="bg-blue-600 text-white p-6 rounded-lg text-center hover:bg-blue-700 transition-colors"
          >
            <div className="text-4xl mb-2">📅</div>
            <h3 className="text-xl font-semibold mb-2">Nueva Cita</h3>
            <p>Programa una nueva consulta</p>
          </Link>
          <Link
            to={ROUTES.PROPIETARIOS}
            className="bg-green-600 text-white p-6 rounded-lg text-center hover:bg-green-700 transition-colors"
          >
            <div className="text-4xl mb-2">👥</div>
            <h3 className="text-xl font-semibold mb-2">Nuevo Cliente</h3>
            <p>Registra un nuevo propietario</p>
          </Link>
          <Link
            to={ROUTES.AGENDA}
            className="bg-purple-600 text-white p-6 rounded-lg text-center hover:bg-purple-700 transition-colors"
          >
            <div className="text-4xl mb-2">🗓️</div>
            <h3 className="text-xl font-semibold mb-2">Ver Agenda</h3>
            <p>Consulta la agenda del día</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;