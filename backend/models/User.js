// models/User.js
const conexionMagica = require('../database');

class User {
  static async crearUsuario(nombre, email, password) {
    const query = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
    return new Promise((resolve, reject) => {
      conexionMagica.execute(query, [nombre, email, password], (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  }

  static async buscarPorEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    return new Promise((resolve, reject) => {
      conexionMagica.execute(query, [email], (error, results) => {
        if (error) reject(error);
        else resolve(results[0]);
      });
    });
  }
}

module.exports = User;