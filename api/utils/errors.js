/**
 * Error base para la API
 */
class ApiError extends Error {
  /**
   * Constructor del error base
   * @param {string} message - Mensaje de error
   * @param {number} statusCode - Código HTTP
   */
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error para recursos no encontrados
 */
class NotFoundError extends ApiError {
  /**
   * Constructor de error 404
   * @param {string} resource - Nombre del recurso
   * @param {string|number} id - Identificador del recurso
   */
  constructor(resource, id) {
    const message = id 
      ? `El recurso ${resource} con id ${id} no fue encontrado`
      : `La ruta solicitada no fue encontrada`;
    super(message, 404);
  }
}

/**
 * Error para solicitudes inválidas
 */
class BadRequestError extends ApiError {
  /**
   * Constructor de error 400
   * @param {string} message - Mensaje de error
   */
  constructor(message = "Solicitud inválida") {
    super(message, 400);
  }
}

/**
 * Error para problemas de autenticación
 */
class UnauthorizedError extends ApiError {
  /**
   * Constructor de error 401
   * @param {string} message - Mensaje de error
   */
  constructor(message = "No autenticado") {
    super(message, 401);
  }
}

/**
 * Error para problemas de autorización
 */
class ForbiddenError extends ApiError {
  /**
   * Constructor de error 403
   * @param {string} message - Mensaje de error
   */
  constructor(message = "No tienes permisos para acceder a este recurso") {
    super(message, 403);
  }
}

/**
 * Error para conflictos de datos
 */
class ConflictError extends ApiError {
  /**
   * Constructor de error 409
   * @param {string} message - Mensaje de error
   */
  constructor(message = "El recurso ya existe o conflicto en la solicitud") {
    super(message, 409);
  }
}

/**
 * Error para límites excedidos
 */
class TooManyRequestsError extends ApiError {
  /**
   * Constructor de error 429
   * @param {string} message - Mensaje de error
   */
  constructor(message = "Has excedido el límite de solicitudes") {
    super(message, 429);
  }
}

/**
 * Error para errores internos del servidor
 */
class InternalServerError extends ApiError {
  /**
   * Constructor de error 500
   * @param {string} message - Mensaje de error
   */
  constructor(message = "Error interno del servidor") {
    super(message, 500);
  }
}

module.exports = {
  ApiError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  TooManyRequestsError,
  InternalServerError
};
