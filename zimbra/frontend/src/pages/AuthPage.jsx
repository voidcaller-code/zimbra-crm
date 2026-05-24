import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { register as apiRegister } from '../services/api';
import './AuthPage.css';

const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [fields, setFields] = useState({ username: '', email: '', password: '', password_confirm: '' });
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const { login, loading, error, clearError, authenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) navigate('/dashboard');
  }, [authenticated, navigate]);

  const handleChange = (e) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError('');
    clearError();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!fields.username || !fields.password) {
      setLocalError('Completa todos los campos.');
      return;
    }
    try {
      await login(fields.username, fields.password);
      navigate('/dashboard');
    } catch (_) {}
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fields.username || !fields.email || !fields.password || !fields.password_confirm) {
      setLocalError('Completa todos los campos.');
      return;
    }
    if (fields.password !== fields.password_confirm) {
      setLocalError('Las contraseñas no coinciden.');
      return;
    }
    if (fields.password.length < 8) {
      setLocalError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    setRegLoading(true);
    setLocalError('');
    try {
      await apiRegister(fields);
      setSuccess('Cuenta creada. Ya puedes iniciar sesión.');
      setMode('login');
      setFields((prev) => ({ ...prev, email: '', password: '', password_confirm: '' }));
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const firstMsg = Object.values(data).flat()[0];
        setLocalError(firstMsg || 'Error al registrar. Intenta de nuevo.');
      } else {
        setLocalError('Error de conexión con el servidor.');
      }
    } finally {
      setRegLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setLocalError('');
    setSuccess('');
    clearError();
    setFields({ username: '', email: '', password: '', password_confirm: '' });
  };

  const displayError = localError || error;
  const isLoading = loading || regLoading;

  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">
            <span className="auth-logo-z">Z</span>
          </div>
          <p className="auth-tagline">
            Gestión de clientes,<br />
            campañas y ventas<br />
            en un solo lugar.
          </p>
        </div>
        <div className="auth-decoration" aria-hidden="true">
          <div className="dec-circle dec-circle--1" />
          <div className="dec-circle dec-circle--2" />
          <div className="dec-circle dec-circle--3" />
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={mode === 'login'}
              className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Iniciar sesión
            </button>
            <button
              role="tab"
              aria-selected={mode === 'register'}
              className={`auth-tab ${mode === 'register' ? 'auth-tab--active' : ''}`}
              onClick={() => switchMode('register')}
            >
              Registrarse
            </button>
          </div>

          {success && (
            <div className="auth-alert auth-alert--success" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {success}
            </div>
          )}

          {displayError && (
            <div className="auth-alert auth-alert--error" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {displayError}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} noValidate>
              <div className="auth-field">
                <label htmlFor="login-username" className="auth-label">Usuario</label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Tu nombre de usuario"
                  value={fields.username}
                  onChange={handleChange}
                  className="auth-input"
                  disabled={isLoading}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="login-password" className="auth-label">Contraseña</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  value={fields.password}
                  onChange={handleChange}
                  className="auth-input"
                  disabled={isLoading}
                />
              </div>
              <button type="submit" className="auth-btn" disabled={isLoading}>
                {isLoading ? <span className="auth-spinner" aria-label="Cargando" /> : 'Entrar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} noValidate>
              <div className="auth-field">
                <label htmlFor="reg-username" className="auth-label">Usuario</label>
                <input
                  id="reg-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Elige un nombre de usuario"
                  value={fields.username}
                  onChange={handleChange}
                  className="auth-input"
                  disabled={isLoading}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="reg-email" className="auth-label">Correo electrónico</label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="correo@empresa.com"
                  value={fields.email}
                  onChange={handleChange}
                  className="auth-input"
                  disabled={isLoading}
                />
              </div>
              <div className="auth-row">
                <div className="auth-field">
                  <label htmlFor="reg-password" className="auth-label">Contraseña</label>
                  <input
                    id="reg-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres"
                    value={fields.password}
                    onChange={handleChange}
                    className="auth-input"
                    disabled={isLoading}
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="reg-confirm" className="auth-label">Confirmar</label>
                  <input
                    id="reg-confirm"
                    name="password_confirm"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repite la contraseña"
                    value={fields.password_confirm}
                    onChange={handleChange}
                    className="auth-input"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <button type="submit" className="auth-btn" disabled={isLoading}>
                {isLoading ? <span className="auth-spinner" aria-label="Cargando" /> : 'Crear cuenta'}
              </button>
            </form>
          )}

          <p className="auth-footer-note">
            {mode === 'login'
              ? <>¿No tienes cuenta? <button className="auth-link" onClick={() => switchMode('register')}>Regístrate</button></>
              : <>¿Ya tienes cuenta? <button className="auth-link" onClick={() => switchMode('login')}>Inicia sesión</button></>
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
