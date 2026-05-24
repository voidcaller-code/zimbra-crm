import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D1B2A',
      color: '#F0F4F8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
      gap: '1rem'
    }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 500 }}>Dashboard</h1>
      <p style={{ color: '#8FA3B8', fontSize: '0.9rem' }}>
        Sesión iniciada correctamente. El dashboard será implementado aquí.
      </p>
      <button
        onClick={handleLogout}
        style={{
          marginTop: '1rem',
          padding: '0.6rem 1.5rem',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'transparent',
          color: '#F0F4F8',
          cursor: 'pointer',
          fontSize: '0.88rem',
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Dashboard;
