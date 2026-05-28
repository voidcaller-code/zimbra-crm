import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Prospectos = () => {
  const navigate = useNavigate();

  const [prospectos, setProspectos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarProspectos = async () => {
      try {
        const response = await api.get('/prospectos/');
        setProspectos(response.data);
      } catch (err) {
        setError('No se pudieron cargar los prospectos.');
      } finally {
        setCargando(false);
      }
    };

    cargarProspectos();
  }, []);

  if (cargando) {
    return (
      <div style={pageStyle}>
        <p>Cargando prospectos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1>Prospectos</h1>
          <p style={{ color: '#fca5a5' }}>{error}</p>

          <button type="button" style={buttonStyle} onClick={() => navigate('/dashboard')}>
            Volver al dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div>
            <p style={tagStyle}>Gestión comercial</p>
            <h1 style={titleStyle}>Prospectos</h1>
            <p style={descriptionStyle}>
              Consulta los prospectos registrados, su puntaje y si descargaron la versión de prueba.
            </p>
          </div>

          <button type="button" style={buttonStyle} onClick={() => navigate('/dashboard')}>
            Volver al dashboard
          </button>
        </div>

        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Teléfono</th>
                <th style={thStyle}>Empresa</th>
                <th style={thStyle}>Cargo</th>
                <th style={thStyle}>Descargó prueba</th>
                <th style={thStyle}>Puntaje</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Vendedor</th>
              </tr>
            </thead>

            <tbody>
              {prospectos.length > 0 ? (
                prospectos.map((prospecto) => (
                  <tr key={prospecto.id}>
                    <td style={tdStyle}>
                      {prospecto.nombre} {prospecto.apellido}
                    </td>
                    <td style={tdStyle}>{prospecto.email}</td>
                    <td style={tdStyle}>{prospecto.telefono || 'Sin teléfono'}</td>
                    <td style={tdStyle}>{prospecto.empresa || 'Sin empresa'}</td>
                    <td style={tdStyle}>{prospecto.cargo || 'Sin cargo'}</td>
                    <td style={tdStyle}>
                      {prospecto.descargo_prueba ? (
                        <span style={badgeSuccessStyle}>Sí</span>
                      ) : (
                        <span style={badgeDangerStyle}>No</span>
                      )}
                    </td>
                    <td style={scoreStyle}>{prospecto.score_calificacion}</td>
                    <td style={tdStyle}>{prospecto.estado}</td>
                    <td style={tdStyle}>{prospecto.vendedor || 'Sin asignar'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={emptyStyle} colSpan="9">
                    No hay prospectos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const pageStyle = {
  minHeight: '100vh',
  background: '#0D1B2A',
  color: '#F0F4F8',
  padding: '40px',
  fontFamily: 'DM Sans, sans-serif',
};

const cardStyle = {
  background: '#13293D',
  borderRadius: '22px',
  padding: '28px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '20px',
  marginBottom: '24px',
};

const tagStyle = {
  margin: 0,
  color: '#93C5FD',
  fontSize: '0.78rem',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  fontWeight: 700,
};

const titleStyle = {
  margin: '8px 0',
  fontSize: '2rem',
};

const descriptionStyle = {
  margin: 0,
  color: '#8FA3B8',
};

const buttonStyle = {
  padding: '0.7rem 1.2rem',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'transparent',
  color: '#F0F4F8',
  cursor: 'pointer',
};

const tableWrapperStyle = {
  overflowX: 'auto',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#0D1B2A',
  borderRadius: '14px',
  overflow: 'hidden',
};

const thStyle = {
  padding: '14px',
  textAlign: 'left',
  background: '#1B263B',
  color: '#F0F4F8',
  fontSize: '0.85rem',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
};

const tdStyle = {
  padding: '14px',
  color: '#CBD5E1',
  fontSize: '0.85rem',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
};

const scoreStyle = {
  ...tdStyle,
  color: '#60A5FA',
  fontWeight: 700,
};

const badgeSuccessStyle = {
  background: '#DCFCE7',
  color: '#166534',
  padding: '5px 10px',
  borderRadius: '999px',
  fontWeight: 700,
};

const badgeDangerStyle = {
  background: '#FEE2E2',
  color: '#991B1B',
  padding: '5px 10px',
  borderRadius: '999px',
  fontWeight: 700,
};

const emptyStyle = {
  ...tdStyle,
  textAlign: 'center',
  color: '#8FA3B8',
};

export default Prospectos;
