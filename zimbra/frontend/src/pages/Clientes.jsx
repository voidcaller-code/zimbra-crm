import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Clientes = () => {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const response = await api.get('/clientes/');
        setClientes(response.data);
      } catch (err) {
        setError('No se pudieron cargar los clientes.');
      } finally {
        setCargando(false);
      }
    };

    cargarClientes();
  }, []);

  if (cargando) {
    return (
      <div style={pageStyle}>
        <p>Cargando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1>Clientes</h1>
          <p style={{ color: '#fca5a5' }}>{error}</p>

          <button
            type="button"
            style={buttonStyle}
            onClick={() => navigate('/dashboard')}
          >
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
            <h1 style={titleStyle}>Clientes</h1>
            <p style={descriptionStyle}>
              Consulta los prospectos que ya fueron convertidos en clientes de la empresa.
            </p>
          </div>

          <div style={headerButtonsStyle}>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => navigate('/prospectos')}
            >
              Ver prospectos
            </button>

            <button
              type="button"
              style={buttonStyle}
              onClick={() => navigate('/dashboard')}
            >
              Volver al dashboard
            </button>
          </div>
        </div>

        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Empresa</th>
                <th style={thStyle}>Contacto</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Teléfono</th>
                <th style={thStyle}>País</th>
                <th style={thStyle}>Tipo</th>
                <th style={thStyle}>Fecha conversión</th>
                <th style={thStyle}>Activo</th>
              </tr>
            </thead>

            <tbody>
              {clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td style={tdStyle}>{cliente.nombre_empresa}</td>
                    <td style={tdStyle}>{cliente.nombre_contacto}</td>
                    <td style={tdStyle}>{cliente.email_contacto}</td>
                    <td style={tdStyle}>{cliente.telefono || 'Sin teléfono'}</td>
                    <td style={tdStyle}>{cliente.pais || 'Sin país'}</td>
                    <td style={tdStyle}>{cliente.tipo_cliente}</td>
                    <td style={tdStyle}>{cliente.fecha_conversion}</td>
                    <td style={tdStyle}>
                      {cliente.activo ? (
                        <span style={badgeSuccessStyle}>Sí</span>
                      ) : (
                        <span style={badgeDangerStyle}>No</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={emptyStyle} colSpan="8">
                    No hay clientes registrados.
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

const headerButtonsStyle = {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
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

export default Clientes;