import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const EditarProspecto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    empresa: '',
    cargo: '',
    url_origen: '',
    paginas_visitadas: 0,
    tiempo_sesion_seg: 0,
    descargo_prueba: false,
    score_calificacion: 0,
    estado: 'NU',
  });

  const [convertirCliente, setConvertirCliente] = useState(false);
  const [pais, setPais] = useState('Colombia');
  const [tipoCliente, setTipoCliente] = useState('EM');

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    const cargarProspecto = async () => {
      try {
        const response = await api.get(`/prospectos/${id}/`);

        setForm({
          nombre: response.data.nombre || '',
          apellido: response.data.apellido || '',
          email: response.data.email || '',
          telefono: response.data.telefono || '',
          empresa: response.data.empresa || '',
          cargo: response.data.cargo || '',
          url_origen: response.data.url_origen || '',
          paginas_visitadas: response.data.paginas_visitadas || 0,
          tiempo_sesion_seg: response.data.tiempo_sesion_seg || 0,
          descargo_prueba: response.data.descargo_prueba || false,
          score_calificacion: response.data.score_calificacion || 0,
          estado: response.data.estado || 'NU',
        });

        if (response.data.convertido_cliente) {
          setConvertirCliente(true);
        }
      } catch (err) {
        setError('No se pudo cargar el prospecto.');
      } finally {
        setCargando(false);
      }
    };

    cargarProspecto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setError('');
    setExito('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.apellido || !form.email || !form.empresa) {
      setError('Nombre, apellido, email y empresa son obligatorios.');
      return;
    }

    try {
      setGuardando(true);

      const payload = {
        ...form,
        paginas_visitadas: Number(form.paginas_visitadas),
        tiempo_sesion_seg: Number(form.tiempo_sesion_seg),
        score_calificacion: Number(form.score_calificacion),
      };

      await api.patch(`/prospectos/${id}/`, payload);

      if (convertirCliente) {
        await api.post(`/prospectos/${id}/convertir-cliente/`, {
          pais,
          tipo_cliente: tipoCliente,
        });
      }

      setExito('Prospecto actualizado correctamente.');

      setTimeout(() => {
        navigate('/prospectos');
      }, 900);
    } catch (err) {
      const data = err.response?.data;

      if (data) {
        const firstMessage = Object.values(data).flat()[0];
        setError(firstMessage || data.message || 'No se pudo actualizar el prospecto.');
      } else {
        setError('Error de conexión con el servidor.');
      }
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div style={pageStyle}>
        <p>Cargando prospecto...</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div>
            <p style={tagStyle}>Gestión comercial</p>
            <h1 style={titleStyle}>Editar prospecto</h1>
            <p style={descriptionStyle}>
              Actualiza la información del prospecto y conviértelo en cliente si ya compró.
            </p>
          </div>

          <button type="button" style={buttonStyle} onClick={() => navigate('/prospectos')}>
            Volver
          </button>
        </div>

        {error && <div style={errorStyle}>{error}</div>}
        {exito && <div style={successStyle}>{exito}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Nombre *</label>
              <input
                style={inputStyle}
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Apellido *</label>
              <input
                style={inputStyle}
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Email *</label>
              <input
                style={inputStyle}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Teléfono</label>
              <input
                style={inputStyle}
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Empresa *</label>
              <input
                style={inputStyle}
                name="empresa"
                value={form.empresa}
                onChange={handleChange}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Cargo</label>
              <input
                style={inputStyle}
                name="cargo"
                value={form.cargo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>URL de origen</label>
            <input
              style={inputStyle}
              name="url_origen"
              value={form.url_origen}
              onChange={handleChange}
            />
          </div>

          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Páginas visitadas</label>
              <input
                style={inputStyle}
                name="paginas_visitadas"
                type="number"
                min="0"
                value={form.paginas_visitadas}
                onChange={handleChange}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Tiempo sesión (seg)</label>
              <input
                style={inputStyle}
                name="tiempo_sesion_seg"
                type="number"
                min="0"
                value={form.tiempo_sesion_seg}
                onChange={handleChange}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Score</label>
              <input
                style={inputStyle}
                name="score_calificacion"
                type="number"
                min="0"
                value={form.score_calificacion}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Estado</label>
              <select
                style={inputStyle}
                name="estado"
                value={form.estado}
                onChange={handleChange}
              >
                <option value="NU">Nuevo</option>
                <option value="CO">Contactado</option>
                <option value="CA">Calificado</option>
                <option value="CV">Convertido</option>
                <option value="DE">Descartado</option>
              </select>
            </div>

            <div style={checkboxStyle}>
              <input
                id="descargo_prueba"
                name="descargo_prueba"
                type="checkbox"
                checked={form.descargo_prueba}
                onChange={handleChange}
              />
              <label htmlFor="descargo_prueba">
                Descargó versión de prueba
              </label>
            </div>
          </div>

          <div style={conversionBoxStyle}>
            <div style={checkboxStyle}>
              <input
                id="convertir_cliente"
                type="checkbox"
                checked={convertirCliente}
                onChange={(e) => setConvertirCliente(e.target.checked)}
              />
              <label htmlFor="convertir_cliente">
                Este prospecto ya se convirtió en cliente
              </label>
            </div>

            {convertirCliente && (
              <div style={rowStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>País del cliente</label>
                  <input
                    style={inputStyle}
                    value={pais}
                    onChange={(e) => setPais(e.target.value)}
                  />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Tipo de cliente</label>
                  <select
                    style={inputStyle}
                    value={tipoCliente}
                    onChange={(e) => setTipoCliente(e.target.value)}
                  >
                    <option value="EM">Empresa</option>
                    <option value="IN">Institución</option>
                    <option value="ID">Individual</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div style={actionsStyle}>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => navigate('/prospectos')}
              disabled={guardando}
            >
              Cancelar
            </button>

            <button type="submit" style={primaryButtonStyle} disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
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

const checkboxStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: 1,
  minWidth: '220px',
  paddingTop: '10px',
  color: '#CBD5E1',
};

const conversionBoxStyle = {
  background: '#0D1B2A',
  padding: '16px',
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.08)',
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

export default EditarProspecto;