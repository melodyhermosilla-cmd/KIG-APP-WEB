// models/User.js
const conexionMagica = require('../config/database');  // Ruta CORRECTA

class User {
  static async crearUsuario(nombre, email, password) {
    return new Promise((resolve, reject) => {
      console.log('👶 Intentando crear usuario:', nombre);
      
      const query = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
      
      // Usamos query en lugar de execute
      conexionMagica.query(query, [nombre, email, password], (error, results) => {
        if (error) {
          console.log('❌ Error en crearUsuario:', error.message);
          reject(error);
        } else {
          console.log('✅ Usuario CREADO con ID:', results.insertId);
          resolve(results);
        }
      });
    });
  }

  static async buscarPorEmail(email) {
    return new Promise((resolve, reject) => {
      console.log('🔍 Buscando usuario con email:', email);
      
      const query = 'SELECT * FROM usuarios WHERE email = ?';
      
      conexionMagica.query(query, [email], (error, results) => {
        if (error) {
          console.log('❌ Error en buscarPorEmail:', error.message);
          reject(error);
        } else if (results.length === 0) {
          console.log('👻 Usuario no encontrado');
          resolve(null);
        } else {
          console.log('✅ Usuario encontrado:', results[0].nombre);
          resolve(results[0]);
        }
      });
    });
  }
}

module.exports = User;