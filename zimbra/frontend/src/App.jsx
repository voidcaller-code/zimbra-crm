import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Prospectos from './pages/Prospectos';
import VentasReportes from './pages/VentasReportes';
import CrearProspecto from './pages/CrearProspecto';
import EditarProspecto from './pages/EditarProspecto';
import Clientes from './pages/Clientes';
import Propuestas from './pages/Propuestas';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta raíz: redirige a login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Autenticación */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* Rutas protegidas — agregar más aquí conforme crezca el proyecto */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/ventas-reportes"
            element={
              <PrivateRoute>
                <VentasReportes />
              </PrivateRoute>
            }
          />
          <Route
            path="/prospectos/crear"
            element={
              <PrivateRoute>
                <CrearProspecto />
              </PrivateRoute>
            }
          />

          <Route
            path="/prospectos/:id/editar"
            element={
              <PrivateRoute>
                <EditarProspecto />
              </PrivateRoute>
            }
          />

          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <Clientes />
              </PrivateRoute>
            }
          />

          <Route
            path="/prospectos"
            element={
              <PrivateRoute>
                <Prospectos />
              </PrivateRoute>
            }
          />

          <Route
          path="/propuestas"
          element={
            <PrivateRoute>
              <Propuestas />
            </PrivateRoute>
          }
        />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
