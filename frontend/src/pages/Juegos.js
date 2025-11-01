import React, { useState, useEffect } from 'react';
import { juegosAPI } from '../services/api';
import './Juegos.css';

function Juegos() {
  const [juegos, setJuegos] = useState({ hardware: [], software: [] });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarJuegos();
  }, []);

  const cargarJuegos = async () => {
    try {
      const data = await juegosAPI.obtenerJuegos();
      setJuegos(data.juegos);
    } catch (error) {
      console.error('Error cargando juegos:', error);
      // ✅ DATOS DE RESPUESTA POR SI FALLA LA CONEXIÓN
      setJuegos({
        hardware: [
          { 
            id: 1, 
            nombre: 'Sopa de Letras - Componentes', 
            tipo: 'sopa-letras', 
            icono: '🔍', 
            descripcion: 'Encuentra palabras de hardware' 
          },
          { 
            id: 2, 
            nombre: 'Rompecabezas - Placa Base', 
            tipo: 'rompecabezas', 
            icono: '🧩', 
            descripcion: 'Arma la placa madre' 
          },
          { 
            id: 3, 
            nombre: 'Quiz - Hardware Básico', 
            tipo: 'quiz', 
            icono: '❓', 
            descripcion: 'Preguntas sobre componentes' 
          }
        ],
        software: [
          { 
            id: 4, 
            nombre: 'Memoria - Iconos', 
            tipo: 'memoria', 
            icono: '🎮', 
            descripcion: 'Encuentra los pares de programas' 
          },
          { 
            id: 5, 
            nombre: 'Ahorcado - Programas', 
            tipo: 'ahorcado', 
            icono: '🎯', 
            descripcion: 'Adivina nombres de software' 
          },
          { 
            id: 6, 
            nombre: 'Crucigrama - Sistemas', 
            tipo: 'crucigrama', 
            icono: '🧩', 
            descripcion: 'Completa el crucigrama' 
          }
        ]
      });
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <div className="cargando">Cargando juegos... 🎮</div>;

  return (
    <div className="juegos-page">
      <h1>🎮 Nuestros Juegos Educativos</h1>
      
      <section className="categoria">
        <h2>🖥️ Juegos de Hardware</h2>
        <div className="juegos-grid">
          {juegos.hardware.map(juego => (
            <div key={juego.id} className="juego-card">
              <div className="juego-header">
                <span className="juego-icono">{juego.icono}</span>
                <h3>{juego.nombre}</h3>
              </div>
              <p className="juego-descripcion">{juego.descripcion}</p>
              <span className="juego-tipo">{juego.tipo}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="categoria">
        <h2>💾 Juegos de Software</h2>
        <div className="juegos-grid">
          {juegos.software.map(juego => (
            <div key={juego.id} className="juego-card">
              <div className="juego-header">
                <span className="juego-icono">{juego.icono}</span>
                <h3>{juego.nombre}</h3>
              </div>
              <p className="juego-descripcion">{juego.descripcion}</p>
              <span className="juego-tipo">{juego.tipo}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Juegos;