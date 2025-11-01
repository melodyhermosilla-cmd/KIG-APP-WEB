import React, { useState, useEffect } from 'react';
import { juegosAPI } from '../services/api';
import './Software.css';

function Software({ onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ✅ CARGAR JUEGOS DESDE EL BACKEND
  useEffect(() => {
    cargarJuegosSoftware();
  }, []);

  const cargarJuegosSoftware = async () => {
    try {
      const data = await juegosAPI.obtenerJuegos();
      // Filtrar solo juegos de software y agregar enlaces
      const juegosSoftware = data.juegos.software.map(juego => ({
        ...juego,
        enlace: obtenerEnlaceJuego(juego.nombre)
      }));
      setJuegos(juegosSoftware);
    } catch (error) {
      console.error('Error cargando juegos de software:', error);
      // ✅ DATOS DE RESPUESTA POR SI FALLA LA CONEXIÓN
      const juegosRespaldo = [
        {
          id: 1,
          nombre: "Sopa de Letras - Programas",
          descripcion: "Encuentra nombres de programas y aplicaciones en esta sopa de letras",
          icono: "🔍",
          tipo: "sopa-letras",
          enlace: "/juegos-software/softsopa/softsopa.html"
        },
        {
          id: 2,
          nombre: "Crucigrama - Sistemas Operativos", 
          descripcion: "Completa el crucigrama sobre sistemas operativos y software",
          icono: "🧩",
          tipo: "crucigrama",
          enlace: "/juegos-software/softcrucigrama/softcrucigrama.html"
        },
        {
          id: 3,
          nombre: "Quiz - Software Aplicativo",
          descripcion: "Responde preguntas sobre diferentes tipos de software",
          icono: "❓",
          tipo: "quiz",
          enlace: "/juegos-software/pregsoft/preguntasyrespuestas_software.html"
        },
        {
          id: 4,
          nombre: "Rompecabezas - Interfaz Gráfica",
          descripcion: "Arma el rompecabezas de una interfaz gráfica de usuario",
          icono: "🧩",
          tipo: "rompecabezas",
          enlace: "/juegos-software/rompsoft/puzzle_software.html"
        },
        {
          id: 5,
          nombre: "Memoria - Iconos de Programas",
          descripcion: "Encuentra las parejas de iconos de programas famosos",
          icono: "🎮",
          tipo: "memoria",
          enlace: "/juegos-software/softmemorama/softmemorama.html"
        },
        {
          id: 6,
          nombre: "Ahorcado - Programas", 
          descripcion: "Adivina los nombres de programas antes de que se complete el ahorcado",
          icono: "🎯",
          tipo: "ahorcado",
          enlace: "/juegos-software/softahorcado/softahorcado.html"
        }
      ];
      setJuegos(juegosRespaldo);
    } finally {
      setCargando(false);
    }
  };

  // ✅ FUNCIÓN PARA OBTENER ENLACE SEGÚN EL NOMBRE DEL JUEGO
  const obtenerEnlaceJuego = (nombreJuego) => {
    const enlaces = {
      'Sopa de Letras - Programas': '/juegos-software/softsopa/softsopa.html',
      'Crucigrama - Sistemas Operativos': '/juegos-software/softcrucigrama/softcrucigrama.html',
      'Quiz - Software Aplicativo': '/juegos-software/pregsoft/preguntasyrespuestas_software.html',
      'Rompecabezas - Interfaz Gráfica': '/juegos-software/rompsoft/puzzle_software.html',
      'Memoria - Iconos de Programas': '/juegos-software/softmemorama/softmemorama.html',
      'Ahorcado - Programas': '/juegos-software/softahorcado/softahorcado.html'
    };
    return enlaces[nombreJuego] || '#';
  };

  // ✅ NAVEGACIÓN DEL CARRUSEL (MISMO CÓDIGO)
  const nextGame = () => {
    if (isAnimating || juegos.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % juegos.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevGame = () => {
    if (isAnimating || juegos.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + juegos.length) % juegos.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // ✅ NAVEGACIÓN CON TECLADO
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prevGame();
      if (e.key === 'ArrowRight') nextGame();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnimating, juegos.length]);

  // ✅ ABRIR JUEGO
  const abrirJuego = (enlace) => {
    const newWindow = window.open('', '_blank');
    newWindow.location.href = enlace;
  };

  // ✅ SISTEMA DE POSICIONES DEL CARRUSEL
  const getVisibleGames = () => {
    if (juegos.length === 0) return [];
    
    const total = juegos.length;
    const games = [];
    
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + total) % total;
      let position;
      
      if (i === 0) position = 'active';
      else if (i === -1) position = 'prev';
      else if (i === 1) position = 'next';
      else position = 'hidden';
      
      games.push({ ...juegos[index], position, index: index });
    }
    
    return games;
  };

  if (cargando) {
    return (
      <section id="software" className="section active">
        <div className="cargando-software">
          <h2>📱 SOFTWARE</h2>
          <p>Cargando juegos de software... 💾</p>
        </div>
      </section>
    );
  }

  return (
    <section id="software" className="section active">
      <button className="back-button" onClick={onBack}>
        ← Volver a Temáticas
      </button>
      
      <div className="tematica-header">
        <h2>📱 SOFTWARE</h2>
        <p>Aprende sobre programas y aplicaciones con estos juegos educativos</p>
        <div className="contador-juegos">
          Juego {currentIndex + 1} de {juegos.length}
        </div>
      </div>
      
      {/* CARRUSEL GIRATORIO - MISMO QUE HARDWARE */}
      <div className="juegos-carrusel">
        <div className="carrusel-container">
          {getVisibleGames().map((juego) => (
            <div 
              key={`${juego.id}-${juego.index}`}
              className={`carrusel-juego ${juego.position}`}
              onClick={() => juego.position === 'active' && abrirJuego(juego.enlace)}
            >
              <div className="juego-icon">{juego.icono}</div>
              <h3>{juego.nombre}</h3>
              <p>{juego.descripcion}</p>
              {juego.position === 'active' && (
                <button 
                  className="juego-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    abrirJuego(juego.enlace);
                  }}
                >
                  JUGAR AHORA
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="carrusel-controls">
          <button className="carrusel-btn prev-btn" onClick={prevGame} disabled={isAnimating}>
            ‹
          </button>
          <div className="carrusel-dots">
            {juegos.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
          <button className="carrusel-btn next-btn" onClick={nextGame} disabled={isAnimating}>
            ›
          </button>
        </div>
      </div>

      {/* ACCESO RÁPIDO A TODOS LOS JUEGOS */}
      <div className="acceso-rapido">
        <h4>🎯 Acceso Rápido a Todos los Juegos</h4>
        <div className="juegos-grid">
          {juegos.map((juego, index) => (
            <div 
              key={juego.id}
              className="juego-rapido-card"
              onClick={() => abrirJuego(juego.enlace)}
            >
              <div className="rapido-icon">{juego.icono}</div>
              <div className="rapido-info">
                <h5>{juego.nombre}</h5>
                <span className="rapido-desc">{juego.descripcion}</span>
              </div>
              <button className="rapido-btn">Jugar</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Software;