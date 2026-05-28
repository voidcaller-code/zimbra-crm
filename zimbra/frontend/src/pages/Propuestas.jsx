import React from 'react';
import { useNavigate } from 'react-router-dom';

const Propuestas = () => {
  const navigate = useNavigate();

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1>Propuestas</h1>

        <p>
          Esta vista está reservada para la gestión de propuestas comerciales.
        </p>

        <button type="button" style={buttonStyle} onClick={() => navigate('/dashboard')}>
          Volver al dashboard
        </button>
      </div>
    </div>
  );
};

const pageStyle = {
  minHeight: '100vh',
  background: '#0d1b2a',
  color: '#f8fafc',
  padding: '40px',
  fontFamily: 'Arial, sans-serif',
};

const cardStyle = {
  background: '#13293d',
  padding: '30px',
  borderRadius: '20px',
};

const buttonStyle = {
  marginTop: '20px',
  padding: '12px 18px',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
};

export default Propuestas;