const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
  }

  try {
    const verificado = jwt.verify(token, 'secreto_magico');
    req.usuario = verificado;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;