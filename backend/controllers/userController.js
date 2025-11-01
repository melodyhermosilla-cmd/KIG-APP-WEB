const User = require('../models/User');
const conexionMagica = require('../config/database');

const userController = {
  // 👤 ACTUALIZAR PERFIL - IMPLEMENTACIÓN COMPLETA
  async actualizarPerfil(req, res) {
    try {
      console.log('🔍 ACTUALIZAR PERFIL - Usuario:', req.usuario);
      console.log('🔍 ACTUALIZAR PERFIL - Body:', req.body);
      
      const { id } = req.usuario; // Del middleware de autenticación
      const { nombre } = req.body;

      if (!nombre) {
        return res.status(400).json({ error: 'El nombre es requerido' });
      }

      console.log('🔄 Actualizando usuario ID:', id, 'con nombre:', nombre);

      // IMPLEMENTACIÓN REAL para actualizar en MySQL
      const query = 'UPDATE usuarios SET nombre = ? WHERE id = ?';
      
      conexionMagica.execute(query, [nombre, id], (error, results) => {
        if (error) {
          console.log('❌ Error en BD al actualizar perfil:', error);
          return res.status(500).json({ error: 'Error al actualizar perfil en base de datos' });
        }

        console.log('✅ Perfil actualizado correctamente. Resultados:', results);
        
        res.json({
          mensaje: '¡Perfil actualizado! ✨',
          usuario: {
            id: id,
            nombre: nombre,
            email: req.usuario.email
          }
        });
      });

    } catch (error) {
      console.log('❌ Error en actualizarPerfil:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // 📊 GUARDAR PUNTAJE (mantén tu código existente)
  async guardarPuntaje(req, res) {
    try {
      const { usuario_id, juego, puntaje } = req.body;
      
      const query = 'INSERT INTO puntuaciones (usuario_id, juego, puntaje) VALUES (?, ?, ?)';
      
      conexionMagica.execute(query, [usuario_id, juego, puntaje], (error, results) => {
        if (error) {
          console.log('❌ Error guardando puntaje:', error);
          return res.status(500).json({ error: 'Error al guardar puntaje' });
        }

        res.json({
          mensaje: `¡Ganaste ${puntaje} puntos mágicos! ⭐`,
          felicitacion: 'Eres una estrella brillante 🌟',
          nuevoPuntaje: puntaje,
          nivel: puntaje > 800 ? 'Mago Maestro' : 'Aprendiz Avanzado'
        });
      });
    } catch (error) {
      console.log('❌ Error en guardarPuntaje:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
};

module.exports = userController;