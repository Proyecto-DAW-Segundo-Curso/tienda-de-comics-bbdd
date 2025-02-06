const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guarda los datos del usuario en la solicitud para usarlos después
    next();
  } catch (error) {
    console.error("🔥 Error en verifyToken:", error.message);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = verifyToken;
