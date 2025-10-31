const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// 👤 Rutas de usuario (protegidas)
router.put('/perfil', authMiddleware, userController.actualizarPerfil);
router.post('/puntaje', authMiddleware, userController.guardarPuntaje);

module.exports = router;