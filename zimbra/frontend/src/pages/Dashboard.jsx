import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="seller-dashboard">
      <aside className="seller-sidebar">
        <div>
          <div className="seller-brand">
            <div className="seller-logo">Z</div>

            <div>
              <h2>Zimbra CRM</h2>
              <p>Panel vendedor</p>
            </div>
          </div>

          <nav className="seller-menu">
            <button type="button" onClick={() => navigate('/prospectos')}>
              <span className="menu-icon">👥</span>
              <span>Prospectos</span>
            </button>

            <button type="button" onClick={() => navigate('/clientes')}>
              <span className="menu-icon">👥</span>
              <span>Clientes</span>
            </button>

            <button type="button" onClick={() => navigate('/propuestas')}>
              <span className="menu-icon">📄</span>
              <span>Propuestas</span>
            </button>

            <button type="button" onClick={() => navigate('/ventas-reportes')}>
              <span className="menu-icon">📊</span>
              <span>Ventas / Reportes</span>
            </button>
          </nav>
        </div>

        <button type="button" className="seller-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>

      <main className="seller-main">
        <section className="seller-welcome">
          <span className="seller-badge">Bienvenido</span>

          <h1>Panel principal del vendedor</h1>

          <p>
            Sesión iniciada correctamente. Desde este espacio puedes acceder
            rápidamente a prospectos, propuestas comerciales y reportes de ventas.
          </p>
        </section>

        <section className="seller-cards">
          <article
            className="seller-card"
            onClick={() => navigate('/prospectos')}
          >
            <div className="seller-card-icon">👥</div>
            <h3>Prospectos</h3>
            <p>
              Visualiza los prospectos registrados, su puntaje y si descargaron
              la versión de prueba.
            </p>
          </article>

          <article
            className="seller-card"
            onClick={() => navigate('/propuestas')}
          >
            <div className="seller-card-icon">📄</div>
            <h3>Propuestas</h3>
            <p>
              Consulta y gestiona propuestas comerciales asociadas a clientes o
              prospectos.
            </p>
          </article>

          <article
            className="seller-card"
            onClick={() => navigate('/ventas-reportes')}
          >
            <div className="seller-card-icon">📊</div>
            <h3>Ventas / Reportes</h3>
            <p>
              Revisa reportes comerciales, métricas y resultados del proceso de
              ventas.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;