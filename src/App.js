import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importar componentes de layout
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Importar páginas
import Home from './pages/Home';
import Login from './pages/login/Login';
import MascotasList from './pages/mascotas/MascotasList';
import CitasList from './pages/citas/CitasList';
import AgendaView from './pages/citas/AgendaView';
import ProductosList from './pages/tienda/ProductosList';
import HistoriasList from './pages/historias/HistoriasList';

// Importar rutas de constantes
import { ROUTES } from './utils/constants';
import { authService } from './services/AuthService';

function App() {
  // Verificar si el usuario está autenticado
  const isAuthenticated = authService.isAuthenticated();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header de navegación - Solo mostrar si NO estamos en login */}
        <Routes>
          <Route path="/login" element={null} />
          <Route path="*" element={<Header />} />
        </Routes>
        
        {/* Contenido principal */}
        <main className="flex-grow">
          <Routes>
            {/* Página principal - Accesible para todos */}
            <Route path={ROUTES.HOME} element={<Home />} />
            
            {/* Login - Solo accesible si NO está autenticado */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to={ROUTES.HOME} replace />
                ) : (
                  <Login />
                )
              } 
            />
            
            {/* Rutas protegidas - Requieren autenticación */}
            
            {/* Mascotas - Accesible para usuarios autenticados */}
            <Route 
              path={ROUTES.MASCOTAS} 
              element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                    <MascotasList />
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Citas - Accesible para usuarios autenticados */}
            <Route 
              path={ROUTES.CITAS} 
              element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                    <CitasList />
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Agenda - Solo para veterinarios y administradores */}
            <Route 
              path={ROUTES.AGENDA} 
              element={
                <ProtectedRoute requiredRole="ROLE_VETERINARIO">
                  <div className="container mx-auto px-4 py-8">
                    <AgendaView />
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Tienda - Accesible para todos */}
            <Route 
              path={ROUTES.TIENDA} 
              element={
                <div className="container mx-auto px-4 py-8">
                  <ProductosList />
                </div>
              } 
            />
            
            {/* Historias Clínicas - Solo para veterinarios y administradores */}
            <Route 
              path={ROUTES.HISTORIAS} 
              element={
                <ProtectedRoute requiredRole="ROLE_VETERINARIO">
                  <div className="container mx-auto px-4 py-8">
                    <HistoriasList />
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas adicionales protegidas por rol */}
            
            {/* Ruta de administración - Solo para administradores */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                      <div className="text-6xl mb-4">👨‍💼</div>
                      <h2 className="text-2xl font-semibold mb-2">Panel de Administración</h2>
                      <p className="text-gray-600">
                        Esta sección está en desarrollo. Aquí podrás gestionar usuarios, 
                        configuraciones del sistema y estadísticas avanzadas.
                      </p>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta para propietarios */}
            <Route 
              path="/mis-mascotas" 
              element={
                <ProtectedRoute requiredRole="ROLE_PROPIETARIO">
                  <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                      <div className="text-6xl mb-4">🐾</div>
                      <h2 className="text-2xl font-semibold mb-2">Mis Mascotas</h2>
                      <p className="text-gray-600">
                        Aquí podrás ver únicamente las mascotas que te pertenecen y 
                        gestionar sus citas e historiales.
                      </p>
                      <button 
                        onClick={() => window.location.href = ROUTES.MASCOTAS}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Ver Todas las Mascotas
                      </button>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta 404 personalizada */}
            <Route 
              path="*" 
              element={
                <div className="container mx-auto px-4 py-8">
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-4xl font-bold text-gray-600 mb-4">404</h1>
                    <h2 className="text-2xl text-gray-500 mb-4">Página no encontrada</h2>
                    <p className="text-gray-600 mb-6">
                      La página que buscas no existe o has sido redirigido incorrectamente.
                    </p>
                    <div className="space-x-4">
                      <button
                        onClick={() => window.history.back()}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        ← Volver
                      </button>
                      <button
                        onClick={() => window.location.href = ROUTES.HOME}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        🏠 Ir al Inicio
                      </button>
                    </div>
                  </div>
                </div>
              } 
            />
          </Routes>
        </main>
        
        {/* Footer - Solo mostrar si NO estamos en login */}
        <Routes>
          <Route path="/login" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
        
        {/* Container para notificaciones */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            fontSize: '14px',
            borderRadius: '8px'
          }}
        />
      </div>
    </Router>
  );
}

export default App;