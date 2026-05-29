import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Propuestas = () => {
  const navigate = useNavigate();

  const [propuestas, setPropuestas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarPropuestas = async () => {
      try {
        const response = await api.get('/propuestas/');
        setPropuestas(response.data);
      } catch (err) {
        setError('No se pudieron cargar las propuestas.');
      } finally {
        setCargando(false);
      }
    };

    cargarPropuestas();
  }, []);

  const mostrarTipoLicencia = (tipo) => {
    const tipos = {
      BA: 'Básica',
      PR: 'Profesional',
      EM: 'Empresarial',
    };

    return tipos[tipo] || tipo;
  };

  const mostrarEstado = (estado) => {
    const estados = {
      EN: 'Enviada',
      AC: 'Aceptada',
      RE: 'Rechazada',
      VE: 'Vencida',
    };

    return estados[estado] || estado;
  };

  const obtenerEstiloEstado = (estado) => {
    if (estado === 'AC') return badgeSuccessStyle;
    if (estado === 'RE') return badgeDangerStyle;
    if (estado === 'VE') return badgeWarningStyle;
    return badgeInfoStyle;
  };

  const formatearMoneda = (valor) => {
    const numero = Number(valor || 0);

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(numero);
  };

  if (cargando) {
    return (
      <div style={pageStyle}>
        <p>Cargando propuestas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1>Propuestas</h1>
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
            <h1 style={titleStyle}>Propuestas</h1>
            <p style={descriptionStyle}>
              Consulta las propuestas comerciales enviadas a los prospectos.
            </p>
          </div>

          <div style={headerButtonsStyle}>
            <button
              type="button"
              style={primaryButtonStyle}
              onClick={() => navigate('/propuestas/crear')}
            >
              Crear propuesta
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
                <th style={thStyle}>Prospecto</th>
                <th style={thStyle}>Vendedor</th>
                <th style={thStyle}>Fecha emisión</th>
                <th style={thStyle}>Monto total</th>
                <th style={thStyle}>Licencia</th>
                <th style={thStyle}>Usuarios</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Observaciones</th>
                <th style={thStyle}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {propuestas.length > 0 ? (
                propuestas.map((propuesta) => (
                  <tr key={propuesta.id}>
                    <td style={tdStyle}>
                      {propuesta.prospecto_nombre || `Prospecto #${propuesta.prospecto}`}
                    </td>

                    <td style={tdStyle}>
                      {propuesta.vendedor_nombre || 'Sin asignar'}
                    </td>

                    <td style={tdStyle}>
                      {propuesta.fecha_emision || 'Sin fecha'}
                    </td>

                    <td style={montoStyle}>
                      {formatearMoneda(propuesta.monto_total)}
                    </td>

                    <td style={tdStyle}>
                      {mostrarTipoLicencia(propuesta.tipo_licencia)}
                    </td>

                    <td style={tdStyle}>
                      {propuesta.num_usuarios}
                    </td>

                    <td style={tdStyle}>
                      <span style={obtenerEstiloEstado(propuesta.estado)}>
                        {mostrarEstado(propuesta.estado)}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      {propuesta.observaciones || 'Sin observaciones'}
                    </td>

                    <td style={tdStyle}>
                      <button
                        type="button"
                        style={editButtonStyle}
                        onClick={() => navigate(`/propuestas/${propuesta.id}/editar`)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={emptyStyle} colSpan="9">
                    No hay propuestas registradas.
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

const primaryButtonStyle = {
  padding: '0.7rem 1.2rem',
  borderRadius: '10px',
  border: 'none',
  background: '#2563EB',
  color: '#FFFFFF',
  cursor: 'pointer',
  fontWeight: 700,
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

const montoStyle = {
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

const badgeWarningStyle = {
  background: '#FEF3C7',
  color: '#92400E',
  padding: '5px 10px',
  borderRadius: '999px',
  fontWeight: 700,
};

const badgeInfoStyle = {
  background: '#DBEAFE',
  color: '#1E40AF',
  padding: '5px 10px',
  borderRadius: '999px',
  fontWeight: 700,
};

const editButtonStyle = {
  padding: '0.45rem 0.8rem',
  borderRadius: '8px',
  border: 'none',
  background: '#F59E0B',
  color: '#FFFFFF',
  cursor: 'pointer',
  fontWeight: 700,
};

const emptyStyle = {
  ...tdStyle,
  textAlign: 'center',
  color: '#8FA3B8',
};

export default Propuestas;