const User = require('../models/User');

const userController = {
  // 👤 ACTUALIZAR PERFIL
  async actualizarPerfil(req, res) {
    try {
      const { id } = req.usuario; // Del middleware de autenticación
      const { nombre } = req.body;

      await User.actualizarUsuario(id, nombre);

      res.json({
        mensaje: '¡Perfil actualizado! ✨',
        usuario: {
          id: id,
          nombre: nombre
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar perfil' });
    }
  },

  // 📊 GUARDAR PUNTAJE REAL
  async guardarPuntaje(req, res) {
    try {
      const { usuario_id, juego, puntaje } = req.body;
      
      const query = 'INSERT INTO puntuaciones (usuario_id, juego, puntaje) VALUES (?, ?, ?)';
      
      conexionMagica.execute(query, [usuario_id, juego, puntaje], (error, results) => {
        if (error) {
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
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
};

module.exports = userController;