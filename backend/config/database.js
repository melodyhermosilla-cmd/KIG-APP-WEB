// config/database.js
const mysql = require('mysql2');

// Conexión  (que es lo que tienes)
const conexionMagica = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '',  // Si no tienes contraseña
  database: 'juegos_db'
});

// Probar conexión
conexionMagica.connect((error) => {
  if (error) {
    console.log('❌ ERROR conectando a la base de datos:', error.message);
  } else {
    console.log('✅ CONECTADO a la base de datos! Listo para usuarios ✨');
  }
});

module.exports = conexionMagica;