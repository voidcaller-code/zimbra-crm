import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const VentasReportes = () => {
  const navigate = useNavigate();

  const [efectividad, setEfectividad] = useState([]);
  const [mensual, setMensual] = useState([]);
  const [altaProbabilidad, setAltaProbabilidad] = useState([]);
  const [pipeline, setPipeline] = useState([]);

  const [anio, setAnio] = useState(new Date().getFullYear());
  const [scoreMinimo, setScoreMinimo] = useState(50);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const cargarReportes = async () => {
    try {
      setCargando(true);
      setError('');

      const [
        efectividadRes,
        mensualRes,
        altaProbabilidadRes,
        pipelineRes,
      ] = await Promise.all([
        api.get('/reportes/efectividad-prospectos/'),
        api.get(`/reportes/prospectos-mensual/?anio=${anio}`),
        api.get(`/reportes/prospectos-alta-probabilidad/?score_minimo=${scoreMinimo}`),
        api.get('/reportes/pipeline-estados/'),
      ]);

      setEfectividad(efectividadRes.data.data || []);
      setMensual(mensualRes.data.data || []);
      setAltaProbabilidad(altaProbabilidadRes.data.data || []);
      setPipeline(pipelineRes.data.data || []);
    } catch (err) {
      setError('No se pudieron cargar los reportes.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReportes();
  }, []);

  const efectividadGeneral = efectividad[0] || {};

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div>
            <p style={tagStyle}>Análisis comercial</p>
            <h1 style={titleStyle}>Ventas / Reportes</h1>
            <p style={descriptionStyle}>
              Consulta indicadores básicos generados desde procedimientos almacenados.
            </p>
          </div>

          <button style={buttonStyle} onClick={() => navigate('/dashboard')}>
            Volver al dashboard
          </button>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <div style={filtersStyle}>
          <div>
            <label style={labelStyle}>Año</label>
            <input
              type="number"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Score mínimo</label>
            <input
              type="number"
              value={scoreMinimo}
              onChange={(e) => setScoreMinimo(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button style={primaryButtonStyle} onClick={cargarReportes}>
            Actualizar reportes
          </button>
        </div>

        {cargando ? (
          <p>Cargando reportes...</p>
        ) : (
          <>
            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Resumen general</h2>

              <div style={summaryGridStyle}>
                <div style={summaryCardStyle}>
                  <p style={summaryLabelStyle}>Total prospectos</p>
                  <h3>{efectividadGeneral.total_prospectos || 0}</h3>
                </div>

                <div style={summaryCardStyle}>
                  <p style={summaryLabelStyle}>Descargaron prueba</p>
                  <h3>{efectividadGeneral.descargaron_prueba || 0}</h3>
                </div>

                <div style={summaryCardStyle}>
                  <p style={summaryLabelStyle}>Convertidos cliente</p>
                  <h3>{efectividadGeneral.convertidos_cliente || 0}</h3>
                </div>

                <div style={summaryCardStyle}>
                  <p style={summaryLabelStyle}>% Conversión</p>
                  <h3>{efectividadGeneral.porcentaje_conversion || 0}%</h3>
                </div>
              </div>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Reporte mensual de prospectos</h2>

              <div style={tableWrapperStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Año</th>
                      <th style={thStyle}>Mes</th>
                      <th style={thStyle}>Prospectos</th>
                      <th style={thStyle}>Descargas</th>
                      <th style={thStyle}>Convertidos</th>
                      <th style={thStyle}>Score promedio</th>
                      <th style={thStyle}>% Conversión</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mensual.length > 0 ? (
                      mensual.map((item, index) => (
                        <tr key={index}>
                          <td style={tdStyle}>{item.anio}</td>
                          <td style={tdStyle}>{item.mes}</td>
                          <td style={tdStyle}>{item.total_prospectos}</td>
                          <td style={tdStyle}>{item.total_descargaron_prueba}</td>
                          <td style={tdStyle}>{item.total_convertidos}</td>
                          <td style={tdStyle}>{item.score_promedio}</td>
                          <td style={tdStyle}>{item.porcentaje_conversion}%</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td style={emptyStyle} colSpan="7">
                          No hay datos para el año seleccionado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Prospectos de alta probabilidad</h2>

              <div style={tableWrapperStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Nombre</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Empresa</th>
                      <th style={thStyle}>Cargo</th>
                      <th style={thStyle}>Descargó prueba</th>
                      <th style={thStyle}>Score</th>
                      <th style={thStyle}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {altaProbabilidad.length > 0 ? (
                      altaProbabilidad.map((prospecto) => (
                        <tr key={prospecto.id}>
                          <td style={tdStyle}>{prospecto.nombre} {prospecto.apellido}</td>
                          <td style={tdStyle}>{prospecto.email}</td>
                          <td style={tdStyle}>{prospecto.empresa}</td>
                          <td style={tdStyle}>{prospecto.cargo || 'Sin cargo'}</td>
                          <td style={tdStyle}>{prospecto.descargo_prueba ? 'Sí' : 'No'}</td>
                          <td style={scoreStyle}>{prospecto.score_calificacion}</td>
                          <td style={tdStyle}>{prospecto.estado}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td style={emptyStyle} colSpan="7">
                          No hay prospectos con ese score mínimo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Pipeline por estado</h2>

              <div style={tableWrapperStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Estado</th>
                      <th style={thStyle}>Total prospectos</th>
                      <th style={thStyle}>Descargaron prueba</th>
                      <th style={thStyle}>Convertidos</th>
                      <th style={thStyle}>Score promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pipeline.length > 0 ? (
                      pipeline.map((item, index) => (
                        <tr key={index}>
                          <td style={tdStyle}>{item.estado}</td>
                          <td style={tdStyle}>{item.total_prospectos}</td>
                          <td style={tdStyle}>{item.descargaron_prueba}</td>
                          <td style={tdStyle}>{item.convertidos_cliente}</td>
                          <td style={tdStyle}>{item.score_promedio}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td style={emptyStyle} colSpan="5">
                          No hay datos del pipeline.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
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

const filtersStyle = {
  display: 'flex',
  gap: '14px',
  alignItems: 'end',
  flexWrap: 'wrap',
  marginBottom: '24px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  color: '#CBD5E1',
  fontWeight: 700,
};

const inputStyle = {
  padding: '10px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: '#0D1B2A',
  color: '#F0F4F8',
  outline: 'none',
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

const errorStyle = {
  background: '#FEE2E2',
  color: '#991B1B',
  padding: '12px',
  borderRadius: '10px',
  marginBottom: '16px',
  fontWeight: 700,
};

const sectionStyle = {
  marginTop: '28px',
};

const sectionTitleStyle = {
  fontSize: '1.2rem',
  marginBottom: '14px',
};

const summaryGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '14px',
};

const summaryCardStyle = {
  background: '#0D1B2A',
  padding: '18px',
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.08)',
};

const summaryLabelStyle = {
  color: '#8FA3B8',
  margin: 0,
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

const emptyStyle = {
  ...tdStyle,
  textAlign: 'center',
  color: '#8FA3B8',
};

export default VentasReportes;