const { getReasonPhrase } = require("http-status-codes");

/**
 * Servicio para estandarizar respuestas de la API
 */
class ApiResponse {
  /**
   * Crea una respuesta exitosa
   * @param {object} data - Datos a enviar
   * @param {string} message - Mensaje de éxito
   * @param {number} statusCode - Código HTTP (default: 200)
   * @returns {object} Objeto de respuesta estandarizado
   */
  static success(data = null, message = "Operación exitosa", statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Crea una respuesta de error
   * @param {string} message - Mensaje de error
   * @param {number} statusCode - Código HTTP (default: 400)
   * @param {object} errors - Detalles adicionales del error
   * @returns {object} Objeto de respuesta estandarizado
   */
  static error(
    message = "Ha ocurrido un error",
    statusCode = 400,
    errors = null
  ) {
    return {
      success: false,
      statusCode,
      message: message || getReasonPhrase(statusCode),
      errors,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Crea una respuesta de paginación
   * @param {array} data - Datos paginados
   * @param {object} pagination - Información de paginación
   * @param {string} message - Mensaje de éxito
   * @returns {object} Objeto de respuesta estandarizado con paginación
   */
  static paginated(data, pagination, message = "Datos recuperados con éxito") {
    return {
      success: true,
      statusCode: 200,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = ApiResponse;
