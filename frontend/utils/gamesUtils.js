// src/utils/gameUtils.js - COMPATIBLE con su estructura
import { userAPI } from '../services/api';

export const guardarPuntuacion = async (juego, puntaje) => {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    if (!usuario) {
      console.log('🔐 Usuario no logueado - Puntuación no guardada');
      return null;
    }

    // ✅ Compatible con el backend de Melody
    const resultado = await userAPI.guardarPuntaje({
      usuario_id: usuario.id,
      juego: juego,
      puntaje: puntaje
    });

    console.log('✅ Puntuación guardada:', resultado.mensaje);
    return resultado;
    
  } catch (error) {
    console.error('❌ Error guardando puntuación:', error);
    return null;
  }
};