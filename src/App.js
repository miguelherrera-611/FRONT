import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importar componentes de layout
import Header from './components/Header';
import Footer from './components/Footer';

// Importar páginas (las crearemos después)
import Home from './pages/Home';
import Login from'./pages/login/Login'
import MascotasList from './pages/mascotas/MascotasList';
import CitasList from './pages/citas/CitasList';
import AgendaView from './pages/citas/AgendaView';
import ProductosList from './pages/tienda/ProductosList';
import HistoriasList from './pages/historias/HistoriasList';

// Importar rutas de constantes
import { ROUTES } from './utils/constants';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header de navegación */}
        <Header />
        
        {/* Contenido principal */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Página principal */}
            <Route path={ROUTES.HOME} element={<Home />} />
            
            {/* Inciar sesión*/}
            <Route path="/login" element={<Login />} />
            
            {/* Rutas de mascotas */}
            <Route path={ROUTES.MASCOTAS} element={<MascotasList />} />
            
          
            
            {/* Rutas de citas */}
            <Route path={ROUTES.CITAS} element={<CitasList />} />
            <Route path={ROUTES.AGENDA} element={<AgendaView />} />
            
            {/* Rutas de tienda */}
            <Route path={ROUTES.TIENDA} element={<ProductosList />} />
            {/* Rutas de historias clínicas */}
            <Route path={ROUTES.HISTORIAS} element={<HistoriasList />} />
            
            {/* Ruta 404 */}
            <Route 
              path="*" 
              element={
                <div className="text-center py-12">
                  <h1 className="text-4xl font-bold text-gray-600">404</h1>
                  <p className="text-xl text-gray-500 mt-4">Página no encontrada</p>
                </div>
              } 
            />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
        
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
        />
      </div>
    </Router>
  );
}

export default App;