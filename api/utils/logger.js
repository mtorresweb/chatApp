/**
 * Servicio de registro (logger) para la aplicación
 * Nota: En producción considera usar Winston, Pino u otra solución de logs
 */
class Logger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 4,
    };

    this.colors = {
      error: '\x1b[31m', // rojo
      warn: '\x1b[33m',  // amarillo
      info: '\x1b[36m',  // cian
      http: '\x1b[35m',  // magenta
      debug: '\x1b[32m', // verde
      reset: '\x1b[0m',  // reset
    };

    // Nivel de log basado en el entorno
    this.level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
  }

  /**
   * Determina si un nivel debe ser registrado
   * @param {string} level - Nivel de log a verificar
   * @returns {boolean} True si debe registrarse
   */
  shouldLog(level) {
    return this.levels[level] <= this.levels[this.level];
  }

  /**
   * Formatea un mensaje de log
   * @param {string} level - Nivel de log
   * @param {string} message - Mensaje a registrar
   * @returns {string} Mensaje formateado
   */
  format(level, message) {
    const timestamp = new Date().toISOString();
    const color = this.colors[level] || this.colors.reset;
    const reset = this.colors.reset;
    return `${color}[${timestamp}] [${level.toUpperCase()}]${reset}: ${message}`;
  }

  /**
   * Registra un mensaje de error
   * @param {string} message - Mensaje a registrar
   * @param {Object} [meta] - Metadatos adicionales
   */
  error(message, meta) {
    if (this.shouldLog('error')) {
      console.error(this.format('error', message), meta || '');
    }
  }

  /**
   * Registra un mensaje de advertencia
   * @param {string} message - Mensaje a registrar
   * @param {Object} [meta] - Metadatos adicionales
   */
  warn(message, meta) {
    if (this.shouldLog('warn')) {
      console.warn(this.format('warn', message), meta || '');
    }
  }

  /**
   * Registra un mensaje informativo
   * @param {string} message - Mensaje a registrar
   * @param {Object} [meta] - Metadatos adicionales
   */
  info(message, meta) {
    if (this.shouldLog('info')) {
      console.info(this.format('info', message), meta || '');
    }
  }

  /**
   * Registra una solicitud HTTP
   * @param {string} message - Mensaje a registrar
   * @param {Object} [meta] - Metadatos adicionales
   */
  http(message, meta) {
    if (this.shouldLog('http')) {
      console.log(this.format('http', message), meta || '');
    }
  }

  /**
   * Registra un mensaje de depuración
   * @param {string} message - Mensaje a registrar
   * @param {Object} [meta] - Metadatos adicionales
   */
  debug(message, meta) {
    if (this.shouldLog('debug')) {
      console.debug(this.format('debug', message), meta || '');
    }
  }

  /**
   * Middleware para registrar solicitudes HTTP
   * @returns {Function} Middleware de Express
   */
  httpLogger() {
    return (req, res, next) => {
      const start = Date.now();
      
      // Registra la solicitud entrante
      this.http(`${req.method} ${req.originalUrl}`);
      
      // Cuando la respuesta termine
      res.on('finish', () => {
        const duration = Date.now() - start;
        const logLevel = res.statusCode >= 400 ? 'error' : 'http';
        
        this[logLevel](
          `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, 
          { ip: req.ip, userAgent: req.get('user-agent') }
        );
      });
      
      next();
    };
  }
}

// Exporta una instancia única para toda la aplicación
module.exports = new Logger();
