import React, { useState, useEffect } from 'react';
import { juegosAPI, puntuacionesAPI } from '../services/api';
import './MisJuegos.css';

function MisJuegos({ onBack }) {
  const [usuario, setUsuario] = useState(null);
  const [juegos, setJuegos] = useState([]);
  const [misPuntuaciones, setMisPuntuaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    totalJuegos: 0,
    juegosCompletados: 0,
    puntuacionTotal: 0,
    juegoFavorito: 'Ninguno'
  });

  // ✅ CARGAR DATOS DEL USUARIO Y JUEGOS
  useEffect(() => {
    cargarDatosUsuario();
    cargarTodosLosJuegos();
  }, []);

  const cargarDatosUsuario = () => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuarioData = JSON.parse(usuarioGuardado);
      setUsuario(usuarioData);
      cargarMisPuntuaciones(usuarioData.id);
    } else {
      setCargando(false);
    }
  };

  const cargarTodosLosJuegos = async () => {
    try {
      const data = await juegosAPI.obtenerJuegos();
      const todosJuegos = [...data.juegos.hardware, ...data.juegos.software];
      setJuegos(todosJuegos);
    } catch (error) {
      console.error('Error cargando juegos:', error);
    }
  };

  const cargarMisPuntuaciones = async (usuarioId) => {
    try {
      const data = await puntuacionesAPI.obtenerRanking();
      // Filtrar solo las puntuaciones del usuario actual (esto sería mejor con un endpoint específico)
      const misPuntos = (data.magos || []).filter(puntaje => 
        puntaje.nombre === usuario?.nombre
      );
      setMisPuntuaciones(misPuntos);
      
      // Calcular estadísticas
      calcularEstadisticas(misPuntos);
    } catch (error) {
      console.error('Error cargando mis puntuaciones:', error);
    } finally {
      setCargando(false);
    }
  };

  const calcularEstadisticas = (puntuaciones) => {
    if (puntuaciones.length === 0) return;

    const totalJuegos = puntuaciones.length;
    const juegosCompletados = puntuaciones.filter(p => p.puntaje > 0).length;
    const puntuacionTotal = puntuaciones.reduce((sum, p) => sum + p.puntaje, 0);
    const juegoFavorito = puntuaciones.reduce((max, p) => 
      p.puntaje > max.puntaje ? p : max, puntuaciones[0]
    ).juego;

    setEstadisticas({
      totalJuegos,
      juegosCompletados,
      puntuacionTotal,
      juegoFavorito
    });
  };

  const abrirJuego = (nombreJuego) => {
    // Mapear nombre del juego a enlace
    const enlaces = {
      'Sopa de Letras - Componentes': '/juegos-hardware/sopa/sopa.html',
      'Rompecabezas - Placa Base': '/juegos-hardware/rompecabezas/puzzle_ramycpu.html',
      'Quiz - Hardware Básico': '/juegos-hardware/preg/index.html',
      'Memoria - Periféricos': '/juegos-hardware/memorama/memorama.html',
      'Ahorcado - Componentes': '/juegos-hardware/ahorcado/ahorcado.html',
      'Crucigrama - Partes de PC': '/juegos-hardware/crucigrama/crucigrama.html',
      'Sopa de Letras - Programas': '/juegos-software/softsopa/softsopa.html',
      'Crucigrama - Sistemas Operativos': '/juegos-software/softcrucigrama/softcrucigrama.html',
      'Quiz - Software Aplicativo': '/juegos-software/pregsoft/preguntasyrespuestas_software.html',
      'Rompecabezas - Interfaz Gráfica': '/juegos-software/rompsoft/puzzle_software.html',
      'Memoria - Iconos de Programas': '/juegos-software/softmemorama/softmemorama.html',
      'Ahorcado - Programas': '/juegos-software/softahorcado/softahorcado.html'
    };

    const enlace = enlaces[nombreJuego] || '#';
    const newWindow = window.open('', '_blank');
    newWindow.location.href = enlace;
  };

  if (cargando) {
    return (
      <div className="mis-juegos-container">
        <button className="back-button" onClick={onBack}>
          ← Volver al Inicio
        </button>
        
        <div className="mis-juegos-header">
          <h2>🎮 Mis Juegos</h2>
          <p>Cargando tu progreso...</p>
        </div>

        <div className="cargando-mis-juegos">
          <div className="cargando-icon">⏳</div>
          <p>Obteniendo tus datos de juego</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="mis-juegos-container">
        <button className="back-button" onClick={onBack}>
          ← Volver al Inicio
        </button>
        
        <div className="no-usuario">
          <h2>🔐 Inicia sesión</h2>
          <p>Necesitas tener una cuenta para ver tu progreso</p>
          <button 
            className="login-btn-misjuegos"
            onClick={() => window.dispatchEvent(new Event('abrirLogin'))}
          >
            🔐 Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-juegos-container">
      <button className="back-button" onClick={onBack}>
        ← Volver al Inicio
      </button>
      
      <div className="mis-juegos-header">
        <h2>🎮 Mis Juegos</h2>
        <p>Bienvenida, {usuario.nombre}! Aquí está tu progreso</p>
      </div>

      {/* ESTADÍSTICAS DEL USUARIO */}
      <div className="estadisticas-usuario">
        <h3>📊 Mis Estadísticas</h3>
        <div className="stats-grid">
          <div className="stat-card-misjuegos">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <span className="stat-number">{estadisticas.totalJuegos}</span>
              <span className="stat-label">Juegos Jugados</span>
            </div>
          </div>
          <div className="stat-card-misjuegos">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-number">{estadisticas.juegosCompletados}</span>
              <span className="stat-label">Completados</span>
            </div>
          </div>
          <div className="stat-card-misjuegos">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <span className="stat-number">{estadisticas.puntuacionTotal}</span>
              <span className="stat-label">Puntos Totales</span>
            </div>
          </div>
          <div className="stat-card-misjuegos">
            <div className="stat-icon">❤️</div>
            <div className="stat-info">
              <span className="stat-text">{estadisticas.juegoFavorito}</span>
              <span className="stat-label">Juego Favorito</span>
            </div>
          </div>
        </div>
      </div>

      {/* MIS PUNTUACIONES */}
      <div className="mis-puntuaciones">
        <h3>🏆 Mis Puntuaciones</h3>
        {misPuntuaciones.length > 0 ? (
          <div className="puntuaciones-lista">
            {misPuntuaciones.map((puntaje, index) => (
              <div key={index} className="puntaje-item">
                <div className="puntaje-info">
                  <span className="juego-nombre">{puntaje.juego}</span>
                  <span className="puntaje-fecha">{puntaje.fecha || 'Fecha no disponible'}</span>
                </div>
                <div className="puntaje-valor">
                  <span className="puntos">{puntaje.puntaje} pts</span>
                  <button 
                    className="jugar-otra-vez-btn"
                    onClick={() => abrirJuego(puntaje.juego)}
                  >
                    Jugar otra vez
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="sin-puntuaciones">
            <p>🎯 Aún no tienes puntuaciones registradas</p>
            <p>¡Comienza a jugar para aparecer aquí!</p>
          </div>
        )}
      </div>

      {/* TODOS LOS JUEGOS DISPONIBLES */}
      <div className="todos-juegos">
        <h3>🎮 Todos los Juegos Disponibles</h3>
        <div className="juegos-grid-misjuegos">
          {juegos.map(juego => (
            <div key={juego.id} className="juego-card-misjuegos">
              <div className="juego-header-misjuegos">
                <span className="juego-icono-misjuegos">{juego.icono}</span>
                <h4>{juego.nombre}</h4>
              </div>
              <p className="juego-desc-misjuegos">{juego.descripcion}</p>
              <button 
                className="jugar-btn-misjuegos"
                onClick={() => abrirJuego(juego.nombre)}
              >
                Jugar ahora
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MisJuegos;