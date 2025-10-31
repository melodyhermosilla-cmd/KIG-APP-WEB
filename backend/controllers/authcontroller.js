const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  // 🔐 REGISTRO REAL
  async registro(req, res) {
    try {
      const { nombre, email, password } = req.body;
      
      // Verificar si el usuario ya existe
      const usuarioExistente = await User.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const resultado = await User.crearUsuario(nombre, email, hashedPassword);
      
      res.json({
        mensaje: `¡Bienvenida ${nombre}! Tu cuenta está lista ✨`,
        usuario: {
          id: resultado.insertId,
          nombre: nombre,
          email: email,
          nivel: 'Aprendiz',
          puntos: 0
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error en el servidor' });
    }
  },

  // 🔑 LOGIN REAL
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Buscar usuario
      const usuario = await User.buscarPorEmail(email);
      if (!usuario) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }

      // Verificar contraseña
      const passwordValida = await bcrypt.compare(password, usuario.password);
      if (!passwordValida) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }

      // Crear token
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email }, 
        'secreto_magico', 
        { expiresIn: '24h' }
      );

      res.json({
        mensaje: '¡Login exitoso! 🎪',
        token: token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          puntos: usuario.puntos,
          nivel: usuario.nivel
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
};

module.exports = authController;