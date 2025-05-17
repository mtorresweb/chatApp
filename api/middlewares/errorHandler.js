
const { getReasonPhrase } = require("http-status-codes");
const ApiResponse = require("../utils/apiResponse");

/**
 * Middleware global para manejo de errores
 * @param {Error} err - Error capturado
 * @param {Request} req - Objeto request de Express
 * @param {Response} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || getReasonPhrase(statusCode);
  
  // Información adicional sobre el error
  const errorDetails = {
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  };

  // Log del error (solo en consola para desarrollo)
  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${statusCode} - ${message}`);
    console.error(err.stack);
  }

  // Enviar respuesta estandarizada
  res.status(statusCode).json(
    ApiResponse.error(message, statusCode, errorDetails)
  );
};

module.exports = errorHandler;
