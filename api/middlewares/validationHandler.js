const { validationResult } = require("express-validator");
const ApiResponse = require("../utils/apiResponse");

/**
 * Middleware para validar datos de entrada usando express-validator
 * @param {Request} req - Objeto request de Express
 * @param {Response} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 * @returns {Response|void} - Respuesta de error o continúa con el siguiente middleware
 */
const validateResults = (req, res, next) => {
  //gets errors from validation middlewares and if there are no errors continues
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // Formatea los errores para tener una respuesta más detallada
  const formattedErrors = errors.array().map(error => ({
    field: error.path,
    message: error.msg,
    value: error.value
  }));
  
  // Usa ApiResponse para una respuesta estandarizada
  return res.status(400).json(
    ApiResponse.error("Error de validación de datos", 400, formattedErrors)
  );
};

module.exports = validateResults;
