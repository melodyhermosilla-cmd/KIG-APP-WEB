import React, { useState, useEffect } from 'react';
import { perfilAPI } from '../services/api';
import './Perfil.css';

function Perfil({ onBack }) {
  const [user, setUser] = useState(null);
  const [editando, setEditando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  // ✅ CARGAR USUARIO DESDE LOCALSTORAGE Y BACKEND
  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = () => {
    const savedUser = localStorage.getItem('usuario');
    if (savedUser) {
      const usuarioData = JSON.parse(savedUser);
      setUser(usuarioData);
      setNuevoNombre(usuarioData.nombre);
    }
    setCargando(false);
  };

  // ✅ ACTUALIZAR PERFIL EN EL BACKEND
  const actualizarPerfil = async () => {
    if (!nuevoNombre.trim() || !user) return;
    
    setGuardando(true);
    try {
      const data = await perfilAPI.actualizarPerfil({ nombre: nuevoNombre });
      
      // Actualizar usuario en localStorage y estado
      const usuarioActualizado = { 
        ...user, 
        nombre: nuevoNombre,
        nivel: data.usuario?.nivel || user.nivel,
        puntos: data.usuario?.puntos || user.puntos
      };
      
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      setUser(usuarioActualizado);
      setEditando(false);
      
      // Disparar evento para actualizar el header
      window.dispatchEvent(new Event('usuarioLogueado'));
      
      alert('¡Perfil actualizado! ✨');
      
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      alert('Error al actualizar perfil: ' + error.message);
    } finally {
      setGuardando(false);
    }
  };

  // ✅ CERRAR SESIÓN
  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUser(null);
    window.dispatchEvent(new Event('usuarioDeslogueado'));
    alert('¡Hasta pronto! 👋');
    onBack();
  };

  if (cargando) {
    return (
      <div className="perfil-container">
        <button className="back-button" onClick={onBack}>
          ← Volver al Inicio
        </button>
        <div className="cargando-perfil">
          <h2>👤 Cargando perfil...</h2>
          <p>Obteniendo información del usuario</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="perfil-container">
        <button className="back-button" onClick={onBack}>
          ← Volver al Inicio
        </button>
        <div className="no-user">
          <h2>🔐 Inicia sesión para ver tu perfil</h2>
          <p>Necesitas tener una cuenta para acceder a esta sección</p>
          <button 
            className="login-redirect-btn"
            onClick={() => window.dispatchEvent(new Event('abrirLogin'))}
          >
            🔐 Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <button className="back-button" onClick={onBack}>
        ← Volver al Inicio
      </button>
      
      <div className="perfil-header">
        <h2>👤 Mi Perfil</h2>
        <p>Gestiona tu cuenta y revisa tu progreso</p>
      </div>

      <div className="perfil-content">
        <div className="profile-info">
          <div className="profile-avatar">
            {user.nombre.charAt(0).toUpperCase()}
          </div>
          
          {editando ? (
            <div className="edit-form">
              <input
                type="text"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                className="nombre-input"
                placeholder="Nuevo nombre"
                maxLength="50"
              />
              <div className="edit-actions">
                <button 
                  onClick={actualizarPerfil}
                  disabled={guardando || !nuevoNombre.trim()}
                  className="save-btn"
                >
                  {guardando ? '⏳ Guardando...' : '💾 Guardar'}
                </button>
                <button 
                  onClick={() => {
                    setEditando(false);
                    setNuevoNombre(user.nombre);
                  }}
                  className="cancel-btn"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3>{user.nombre}</h3>
              <p>{user.email}</p>
            </>
          )}
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-value">{user.juegosJugados || 0}</span>
            <span className="stat-label">Juegos Jugados</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{user.logros || 0}</span>
            <span className="stat-label">Logros</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{user.puntos || 0}</span>
            <span className="stat-label">Puntos Totales</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{user.nivel || 'Aprendiz'}</span>
            <span className="stat-label">Nivel</span>
          </div>
        </div>

        <div className="profile-actions">
          {!editando && (
            <button 
              className="action-btn primary"
              onClick={() => setEditando(true)}
            >
              ✏️ Editar Perfil
            </button>
          )}
          <button className="action-btn secondary">
            🏆 Ver Logros
          </button>
          <button className="action-btn secondary">
            📊 Historial de Juegos
          </button>
          <button 
            className="action-btn danger"
            onClick={cerrarSesion}
          >
            🔓 Cerrar Sesión
          </button>
        </div>

        <div className="profile-info-extra">
          <h4>📋 Información de la Cuenta</h4>
          <div className="info-grid">
            <div className="info-item">
              <strong>ID de Usuario:</strong>
              <span>{user.id || 'N/A'}</span>
            </div>
            <div className="info-item">
              <strong>Fecha de Registro:</strong>
              <span>{new Date().toLocaleDateString('es-ES')}</span>
            </div>
            <div className="info-item">
              <strong>Estado:</strong>
              <span className="status-active">✅ Activo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;