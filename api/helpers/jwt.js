const jwt = require("jsonwebtoken");

// Claves de JWT (deberían estar en variables de entorno)
const secretKey = process.env.JWT_SECRET_KEY;
const refreshKey = process.env.JWT_REFRESH_KEY || secretKey + "-refresh";

/**
 * Genera un token JWT de acceso
 * @param {Object} payload - Datos a incluir en el token
 * @param {string} expiry - Tiempo de expiración (default: "24h")
 * @returns {string} Token JWT firmado
 */
const generateAccessToken = (payload, expiry = "24h") => {
  return jwt.sign(payload, secretKey, { 
    expiresIn: expiry,
    issuer: "chat-app-api",
    audience: "chat-app-client"
  });
};

/**
 * Genera un token JWT de refresco
 * @param {Object} payload - Datos a incluir en el token
 * @returns {string} Token de refresco JWT firmado
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, refreshKey, { 
    expiresIn: "30d",
    issuer: "chat-app-api",
    audience: "chat-app-client"
  });
};

/**
 * Verifica un token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Payload del token verificado
 * @throws {Error} Si el token es inválido
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
};

/**
 * Verifica un token de refresco
 * @param {string} token - Token de refresco a verificar
 * @returns {Object} Payload del token verificado
 * @throws {Error} Si el token es inválido
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, refreshKey);
  } catch (error) {
    throw new Error("Token de refresco inválido o expirado");
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  secretKey,
  refreshKey
};
