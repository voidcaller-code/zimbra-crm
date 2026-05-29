import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CrearPropuesta = () => {
  const navigate = useNavigate();

  const [prospectos, setProspectos] = useState([]);

  const [form, setForm] = useState({
    prospecto: '',
    monto_total: '',
    tipo_licencia: 'BA',
    num_usuarios: 1,
    estado: 'EN',
    observaciones: '',
  });

  const [cargandoProspectos, setCargandoProspectos] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    const cargarProspectos = async () => {
      try {
        const response = await api.get('/prospectos/');
        setProspectos(response.data);
      } catch (err) {
        setError('No se pudieron cargar los prospectos.');
      } finally {
        setCargandoProspectos(false);
      }
    };

    cargarProspectos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
    setExito('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.prospecto || !form.monto_total || !form.num_usuarios) {
      setError('Selecciona un prospecto, monto total y número de usuarios.');
      return;
    }

    try {
      setGuardando(true);

      const payload = {
        prospecto: Number(form.prospecto),
        monto_total: Number(form.monto_total),
        tipo_licencia: form.tipo_licencia,
        num_usuarios: Number(form.num_usuarios),
        estado: form.estado,
        observaciones: form.observaciones,
      };

      await api.post('/propuestas/', payload);

      setExito('Propuesta creada correctamente.');

      setTimeout(() => {
        navigate('/propuestas');
      }, 800);
    } catch (err) {
      const data = err.response?.data;

      if (data) {
        const firstMessage = Object.values(data).flat()[0];
        setError(firstMessage || 'No se pudo crear la propuesta.');
      } else {
        setError('Error de conexión con el servidor.');
      }
    } finally {
      setGuardando(false);
    }
  };

  if (cargandoProspectos) {
    return (
      <div style={pageStyle}>
        <p>Cargando prospectos...</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div>
            <p style={tagStyle}>Gestión comercial</p>
            <h1 style={titleStyle}>Crear propuesta</h1>
            <p style={descriptionStyle}>
              Registra una propuesta comercial para un prospecto interesado.
            </p>
          </div>

          <button
            type="button"
            style={buttonStyle}
            onClick={() => navigate('/propuestas')}
          >
            Volver
          </button>
        </div>

        {error && <div style={errorStyle}>{error}</div>}
        {exito && <div style={successStyle}>{exito}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Prospecto *</label>
            <select
              name="prospecto"
              value={form.prospecto}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Seleccione un prospecto</option>

              {prospectos.map((prospecto) => (
                <option key={prospecto.id} value={prospecto.id}>
                  {prospecto.nombre} {prospecto.apellido} - {prospecto.empresa}
                </option>
              ))}
            </select>
          </div>

          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Monto total *</label>
              <input
                name="monto_total"
                type="number"
                min="0"
                step="0.01"
                value={form.monto_total}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Ej: 2500000"
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Número de usuarios *</label>
              <input
                name="num_usuarios"
                type="number"
                min="1"
                value={form.num_usuarios}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Tipo de licencia</label>
              <select
                name="tipo_licencia"
                value={form.tipo_licencia}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="BA">Básica</option>
                <option value="PR">Profesional</option>
                <option value="EM">Empresarial</option>
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="EN">Enviada</option>
                <option value="AC">Aceptada</option>
                <option value="RE">Rechazada</option>
                <option value="VE">Vencida</option>
              </select>
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Observaciones</label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              style={textareaStyle}
              placeholder="Observaciones de la propuesta..."
              rows="4"
            />
          </div>

          <div style={actionsStyle}>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => navigate('/propuestas')}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button type="submit" style={primaryButtonStyle} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar propuesta'}
            </button>
          </div>
        </form>
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
  maxWidth: '900px',
  margin: '0 auto',
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

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
};

const rowStyle = {
  display: 'flex',
  gap: '18px',
  flexWrap: 'wrap',
};

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: '220px',
};

const labelStyle = {
  marginBottom: '8px',
  color: '#CBD5E1',
  fontWeight: 700,
};

const inputStyle = {
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: '#0D1B2A',
  color: '#F0F4F8',
  outline: 'none',
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
};

const actionsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  marginTop: '10px',
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

const successStyle = {
  background: '#DCFCE7',
  color: '#166534',
  padding: '12px',
  borderRadius: '10px',
  marginBottom: '16px',
  fontWeight: 700,
};

export default CrearPropuesta;