import React, { useState, useEffect } from 'react';
import { juegosAPI } from '../services/api';
import './Hardware.css';

function Hardware({ onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ✅ CARGAR JUEGOS DESDE EL BACKEND
  useEffect(() => {
    cargarJuegosHardware();
  }, []);

  const cargarJuegosHardware = async () => {
    try {
      const data = await juegosAPI.obtenerJuegos();
      // Filtrar solo juegos de hardware y agregar enlaces
      const juegosHardware = data.juegos.hardware.map(juego => ({
        ...juego,
        enlace: obtenerEnlaceJuego(juego.nombre)
      }));
      setJuegos(juegosHardware);
    } catch (error) {
      console.error('Error cargando juegos de hardware:', error);
      // ✅ DATOS DE RESPUESTA POR SI FALLA LA CONEXIÓN
      const juegosRespaldo = [
        {
          id: 1,
          nombre: "Sopa de Letras - Componentes",
          descripcion: "Encuentra los componentes de hardware en esta sopa de letras divertida",
          icono: "🔍",
          tipo: "sopa-letras",
          enlace: "/juegos-hardware/sopa/sopa.html"
        },
        {
          id: 2,
          nombre: "Crucigrama - Partes de PC", 
          descripcion: "Completa el crucigrama con las partes de una computadora",
          icono: "🧩",
          tipo: "crucigrama",
          enlace: "/juegos-hardware/crucigrama/crucigrama.html"
        },
        {
          id: 3,
          nombre: "Quiz - Hardware Básico",
          descripcion: "Responde preguntas sobre componentes básicos de hardware",
          icono: "❓",
          tipo: "quiz",
          enlace: "/juegos-hardware/preg/index.html"
        },
        {
          id: 4,
          nombre: "Rompecabezas - Placa Base",
          descripcion: "Arma el rompecabezas de una placa base y sus componentes",
          icono: "🧩",
          tipo: "rompecabezas",
          enlace: "/juegos-hardware/rompecabezas/puzzle_ramycpu.html"
        },
        {
          id: 5,
          nombre: "Memoria - Periféricos",
          descripcion: "Encuentra las parejas de periféricos de entrada y salida",
          icono: "🎮",
          tipo: "memoria",
          enlace: "/juegos-hardware/memorama/memorama.html"
        },
        {
          id: 6,
          nombre: "Ahorcado - Componentes", 
          descripcion: "Adivina los componentes de hardware antes de que se complete el ahorcado",
          icono: "🎯",
          tipo: "ahorcado",
          enlace: "/juegos-hardware/ahorcado/ahorcado.html"
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
      'Sopa de Letras - Componentes': '/juegos-hardware/sopa/sopa.html',
      'Crucigrama - Partes de PC': '/juegos-hardware/crucigrama/crucigrama.html',
      'Quiz - Hardware Básico': '/juegos-hardware/preg/index.html',
      'Rompecabezas - Placa Base': '/juegos-hardware/rompecabezas/puzzle_ramycpu.html',
      'Memoria - Periféricos': '/juegos-hardware/memorama/memorama.html',
      'Ahorcado - Componentes': '/juegos-hardware/ahorcado/ahorcado.html'
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
      <section id="hardware" className="section active">
        <div className="cargando-hardware">
          <h2>💻 HARDWARE</h2>
          <p>Cargando juegos de hardware... 🖥️</p>
        </div>
      </section>
    );
  }

  return (
    <section id="hardware" className="section active">
      <button className="back-button" onClick={onBack}>
        ← Volver a Temáticas
      </button>
      
      <div className="tematica-header">
        <h2>💻 HARDWARE</h2>
        <p>Descubre las partes físicas de una computadora a través de juegos divertidos</p>
        <div className="contador-juegos">
          Juego {currentIndex + 1} de {juegos.length}
        </div>
      </div>
      
      {/* CARRUSEL GIRATORIO MEJORADO */}
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

export default Hardware;