import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * PrivateRoute — protege rutas que requieren autenticación.
 * Si el usuario no está autenticado, lo redirige a /login.
 * Uso: <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
 */
const PrivateRoute = ({ children }) => {
  const { authenticated } = useAuth();
  return authenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
