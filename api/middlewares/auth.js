const { verifyToken } = require(`../helpers/jwt.js`);
const ApiResponse = require("../utils/apiResponse");

/**
 * Middleware de autenticación para proteger rutas
 * @param {Request} req - Objeto request de Express
 * @param {Response} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 * @returns {Response|void} - Respuesta de error o continúa con el siguiente middleware
 */
exports.auth = (req, res, next) => {
  // Verifica si existe un token en los encabezados
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
    return res.status(401).json(
      ApiResponse.error("Se requiere un token de autenticación", 401)
    );
  }

  // Extrae el token
  const token = req.headers.authorization.split(" ")[1];

  try {
    // Verifica el token
    const payload = verifyToken(token);
    
    // Almacena los datos del usuario en la solicitud
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json(
      ApiResponse.error("Token inválido o expirado", 401)
    );
  }
};

/**
 * Middleware para verificar roles de usuario
 * @param {string[]} roles - Array de roles permitidos
 * @returns {Function} Middleware de Express
 */
exports.hasRole = (roles = []) => {
  return (req, res, next) => {
    // Requiere el middleware auth primero
    if (!req.user) {
      return res.status(401).json(
        ApiResponse.error("No autenticado", 401)
      );
    }

    // Verifica si el usuario tiene el rol requerido
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json(
        ApiResponse.error("No tienes permiso para acceder a este recurso", 403)
      );
    }

    next();
  };
};
