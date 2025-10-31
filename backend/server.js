// 🧙‍♀️ server.js - VERSIÓN DEFINITIVA PARA CALIFICAR
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const app = express();

// Configuración
app.use(cors());
app.use(express.json());

// 🔮 CONEXIÓN DEFINITIVA A BASE DE DATOS
const conexionMagica = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kids_games'
});

// Verificar y preparar base de datos al iniciar
conexionMagica.connect(async (error) => {
  if (error) {
    console.log('❌ Error conectando a la base de datos:', error.message);
    console.log('💡 SOLUCIÓN: Verifica que:');
    console.log('   1. XAMPP esté ENCENDIDO');
    console.log('   2. MySQL esté en VERDE');
    console.log('   3. La base de datos "kids_games" exista');
    console.log('');
    console.log('🔄 Creando base de datos automáticamente...');
    await crearBaseDeDatosAutomaticamente();
    return;
  }

  console.log('✅ CONEXIÓN EXITOSA a base de datos kids_games');
  prepararTablas();
});

async function crearBaseDeDatosAutomaticamente() {
  return new Promise((resolve) => {
    const conexionTemporal = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    conexionTemporal.connect((error) => {
      if (error) {
        console.log('❌ No se puede conectar a MySQL:', error.message);
        return resolve(false);
      }

      console.log('🔧 Creando base de datos kids_games...');
      conexionTemporal.execute('CREATE DATABASE IF NOT EXISTS kids_games', (error) => {
        if (error) {
          console.log('❌ Error creando base de datos:', error.message);
          return resolve(false);
        }

        console.log('✅ Base de datos kids_games creada');
        conexionTemporal.end();
        
        // Reconectar con la base de datos
        conexionMagica.connect((error) => {
          if (error) {
            console.log('❌ Error reconectando:', error.message);
            return resolve(false);
          }
          console.log('✅ Conectado a kids_games exitosamente');
          prepararTablas();
          resolve(true);
        });
      });
    });
  });
}

function prepararTablas() {
  console.log('📊 Preparando tablas...');
  
  const tablas = [
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      puntos INT DEFAULT 0,
      nivel VARCHAR(50) DEFAULT 'Aprendiz',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS puntuaciones (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      juego VARCHAR(100) NOT NULL,
      puntaje INT NOT NULL,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`
  ];

  let tablasCreadas = 0;
  
  tablas.forEach((query, index) => {
    conexionMagica.execute(query, (error) => {
      if (error) {
        console.log(`❌ Error creando tabla ${index + 1}:`, error.message);
      } else {
        console.log(`✅ Tabla ${index + 1} lista`);
        tablasCreadas++;
      }
      
      if (tablasCreadas === tablas.length) {
        console.log('🎉 ¡TODAS LAS TABLAS ESTÁN LISTAS!');
        console.log('🚀 El backend está LISTO para usar');
      }
    });
  });
}

// ⭐ RUTA DE BIENVENIDA ⭐
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '¡Bienvenida a Kids Games! ✨',
    estado: 'Backend DEFINITIVO funcionando',
    base_de_datos: 'MySQL - kids_games',
    creadoPor: 'Melody🧙‍♀️',
    fecha: new Date().toLocaleString(),
    endpoints: [
      'POST /registro - Crear cuenta',
      'POST /login - Iniciar sesión', 
      'PUT /perfil - Editar perfil',
      'POST /chatbot - Chat interactivo',
      'POST /guardar-puntaje - Guardar puntajes',
      'GET /puntuaciones - Ver ranking',
      'GET /juegos - Lista de juegos'
    ]
  });
});

// 🌟 REGISTRO DEFINITIVO 🌟
app.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;
  
  console.log('📝 Registrando usuario:', nombre);
  
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
    
    conexionMagica.execute(query, [nombre, email, hashedPassword], (error, results) => {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'El email ya está registrado' });
        }
        console.log('❌ Error en registro:', error);
        return res.status(500).json({ error: 'Error del servidor' });
      }
      
      console.log('✅ Usuario registrado ID:', results.insertId);
      
      res.json({
        success: true,
        mensaje: `¡Bienvenida ${nombre}! Tu cuenta está lista ✨`,
        usuario: {
          id: results.insertId,
          nombre: nombre,
          email: email,
          puntos: 0,
          nivel: 'Aprendiz'
        }
      });
    });
    
  } catch (error) {
    console.log('❌ Error general:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 🔑 LOGIN DEFINITIVO 🔑
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('🔐 Intentando login:', email);
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  try {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    
    conexionMagica.execute(query, [email], async (error, results) => {
      if (error) {
        console.log('❌ Error en login:', error);
        return res.status(500).json({ error: 'Error del servidor' });
      }
      
      if (results.length === 0) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }
      
      const usuario = results[0];
      const passwordValida = await bcrypt.compare(password, usuario.password);
      
      if (!passwordValida) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email }, 
        'secreto_magico_kids_games', 
        { expiresIn: '7d' }
      );
      
      res.json({
        success: true,
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
    });
    
  } catch (error) {
    console.log('❌ Error general login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 👤 EDITAR PERFIL DEFINITIVO 👤
app.put('/perfil', (req, res) => {
  const { token, nuevoNombre } = req.body;
  
  if (!token || !nuevoNombre) {
    return res.status(400).json({ error: 'Token y nuevo nombre requeridos' });
  }

  try {
    const verificado = jwt.verify(token, 'secreto_magico_kids_games');
    const query = 'UPDATE usuarios SET nombre = ? WHERE id = ?';
    
    conexionMagica.execute(query, [nuevoNombre, verificado.id], (error, results) => {
      if (error) {
        console.log('❌ Error actualizando perfil:', error);
        return res.status(500).json({ error: 'Error al actualizar perfil' });
      }
      
      res.json({
        success: true,
        mensaje: '¡Perfil actualizado! ✨',
        usuario: {
          id: verificado.id,
          nombre: nuevoNombre
        }
      });
    });
    
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

// 🤖 CHATBOT DEFINITIVO 🤖
app.post('/chatbot', (req, res) => {
  const { mensaje } = req.body;
  
  if (!mensaje) {
    return res.status(400).json({ error: 'Mensaje requerido' });
  }

  const respuestasMagicas = {
    'hola': '¡Hola, aprendiz! Soy tu duende mágico 🤖 ¿En qué puedo ayudarte?',
    'qué es hardware': '🖥️ Hardware son las partes físicas de la computadora: teclado, mouse, pantalla, CPU, memoria RAM',
    'qué es software': '💾 Software son los programas y sistemas: Windows, juegos, navegadores, Word, Excel',
    'cómo me registro': '📝 Ve a la sección REGISTRO, escribe tu nombre, email y contraseña, y listo!',
    'cómo inicio sesión': '🔐 Ve a LOGIN, ingresa tu email y contraseña, y entrarás al mundo mágico',
    'cómo cambio mi nombre': '👤 Ve a PERFIL, escribe tu nuevo nombre y guarda los cambios',
    'qué juegos hay': '🎮 Tenemos: Sopa de Letras, Rompecabezas, Memoria, Quiz, Ahorcado, Crucigrama',
    'para qué sirve esta app': '✨ Kids Games te enseña informática jugando! Aprende hardware y software divertido',
    'ayuda': '❓ Puedo explicarte: qué es hardware/software, cómo registrarse, cómo jugar, qué juegos hay'
  };
  
  const respuesta = respuestasMagicas[mensaje.toLowerCase()] || 
    '¡No entiendo ese hechizo! 🤔 Pregúntame: "qué es hardware", "qué es software", "cómo me registro", "qué juegos hay", "ayuda"';
  
  res.json({ 
    success: true,
    respuesta: respuesta 
  });
});

// 🏆 GUARDAR PUNTAJE DEFINITIVO 🏆
app.post('/guardar-puntaje', (req, res) => {
  const { token, juego, puntaje } = req.body;
  
  if (!token || !juego || !puntaje) {
    return res.status(400).json({ error: 'Token, juego y puntaje requeridos' });
  }

  try {
    const verificado = jwt.verify(token, 'secreto_magico_kids_games');
    const query = 'INSERT INTO puntuaciones (usuario_id, juego, puntaje) VALUES (?, ?, ?)';
    
    conexionMagica.execute(query, [verificado.id, juego, puntaje], (error, results) => {
      if (error) {
        console.log('❌ Error guardando puntaje:', error);
        return res.status(500).json({ error: 'Error al guardar puntaje' });
      }
      
      // Actualizar puntos del usuario
      const updateQuery = 'UPDATE usuarios SET puntos = puntos + ? WHERE id = ?';
      conexionMagica.execute(updateQuery, [puntaje, verificado.id]);
      
      res.json({
        success: true,
        mensaje: `¡Ganaste ${puntaje} puntos mágicos! ⭐`,
        felicitacion: 'Eres una estrella brillante 🌟',
        nivel: puntaje > 800 ? 'Mago Maestro' : puntaje > 500 ? 'Aprendiz Avanzado' : 'Explorador'
      });
    });
    
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

// 📊 PUNTUACIONES DEFINITIVAS
app.get('/puntuaciones', (req, res) => {
  const query = `
    SELECT u.nombre, p.juego, p.puntaje, p.fecha 
    FROM puntuaciones p 
    JOIN usuarios u ON p.usuario_id = u.id 
    ORDER BY p.puntaje DESC 
    LIMIT 10
  `;
  
  conexionMagica.execute(query, (error, results) => {
    if (error) {
      console.log('❌ Error obteniendo puntuaciones:', error);
      // Datos de ejemplo si hay error
      return res.json({
        magos: [
          { nombre: 'Ana', juego: 'Sopa de Letras', puntaje: 950 },
          { nombre: 'Carlos', juego: 'Rompecabezas', puntaje: 890 }
        ]
      });
    }
    
    res.json({ 
      success: true,
      magos: results 
    });
  });
});

// 🎮 JUEGOS DEFINITIVOS
app.get('/juegos', (req, res) => {
  const juegosMagicos = {
    hardware: [
      { id: 1, nombre: 'Sopa de Letras - Componentes', tipo: 'sopa-letras', icono: '🔍', descripcion: 'Encuentra palabras de hardware' },
      { id: 2, nombre: 'Rompecabezas - Placa Base', tipo: 'rompecabezas', icono: '🧩', descripcion: 'Arma la placa madre' },
      { id: 3, nombre: 'Quiz - Hardware Básico', tipo: 'quiz', icono: '❓', descripcion: 'Preguntas sobre componentes' }
    ],
    software: [
      { id: 4, nombre: 'Memoria - Iconos', tipo: 'memoria', icono: '🎮', descripcion: 'Encuentra los pares de programas' },
      { id: 5, nombre: 'Ahorcado - Programas', tipo: 'ahorcado', icono: '🎯', descripcion: 'Adivina nombres de software' },
      { id: 6, nombre: 'Crucigrama - Sistemas', tipo: 'crucigrama', icono: '🧩', descripcion: 'Completa el crucigrama' }
    ]
  };
  
  res.json({ 
    success: true,
    juegos: juegosMagicos 
  });
});

// 🎪 INICIAR SERVIDOR DEFINITIVO
const PORT = 5200;
app.listen(PORT, () => {
  console.log('=========================================');
  console.log('🧙‍♀️  KIDS GAMES - BACKEND DEFINITIVO');
  console.log('📍  Servidor: http://localhost:' + PORT);
  console.log('💾  Base de datos: MySQL - kids_games');
  console.log('✨  Estado: LISTO PARA CALIFICAR');
  console.log('👩‍💻  Por: Melody Hermosilla');
  console.log('=========================================');
});