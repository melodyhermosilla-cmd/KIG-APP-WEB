// src/components/ScoreListener.js - CREAR ESTE ARCHIVO
import React, { useEffect } from 'react';
import { guardarPuntuacion } from '../utils/gameUtils';

function ScoreListener() {
  useEffect(() => {
    const manejarMensaje = async (event) => {
      // Verificar que el mensaje sea del tipo correcto
      if (event.data && event.data.tipo === 'puntuacionGuardar') {
        const { juego, puntaje } = event.data;
        
        console.log(`🎯 Recibida puntuación: ${puntaje} pts en ${juego}`);
        
        try {
          const resultado = await guardarPuntuacion(juego, puntaje);
          
          if (resultado) {
            // Mostrar notificación de éxito
            alert(`⭐ ${resultado.felicitacion}\n${resultado.mensaje}`);
          }
        } catch (error) {
          console.error('Error al guardar puntuación:', error);
        }
      }
    };

    // Escuchar mensajes de los juegos
    window.addEventListener('message', manejarMensaje);
    
    return () => {
      window.removeEventListener('message', manejarMensaje);
    };
  }, []);

  return null; // Componente invisible - no renderiza nada
}

export default ScoreListener;