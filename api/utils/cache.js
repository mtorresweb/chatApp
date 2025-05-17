/**
 * Implementación de caché en memoria para mejorar el rendimiento
 * Nota: En producción considera usar Redis u otra solución de caché distribuida
 */
class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map();
  }

  /**
   * Almacena un valor en caché
   * @param {string} key - Clave de caché
   * @param {any} value - Valor a almacenar
   * @param {number} ttlSeconds - Tiempo de vida en segundos (default: 60)
   */
  set(key, value, ttlSeconds = 60) {
    this.cache.set(key, value);
    
    // Establece el tiempo de expiración
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.ttl.set(key, expiresAt);
    
    // Programa la limpieza automática
    setTimeout(() => {
      if (this.ttl.get(key) <= Date.now()) {
        this.delete(key);
      }
    }, ttlSeconds * 1000);
  }

  /**
   * Obtiene un valor de la caché
   * @param {string} key - Clave de caché
   * @returns {any|null} Valor almacenado o null si no existe o expiró
   */
  get(key) {
    // Verifica si existe y no ha expirado
    if (this.ttl.has(key) && this.ttl.get(key) > Date.now()) {
      return this.cache.get(key);
    }
    
    // Si ha expirado, lo elimina
    this.delete(key);
    return null;
  }

  /**
   * Elimina una clave de la caché
   * @param {string} key - Clave a eliminar
   */
  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
  }

  /**
   * Limpia toda la caché
   */
  clear() {
    this.cache.clear();
    this.ttl.clear();
  }

  /**
   * Middleware para cachear respuestas HTTP
   * @param {number} ttlSeconds - Tiempo de vida en segundos
   * @returns {Function} Middleware de Express
   */
  middleware(ttlSeconds = 60) {
    return (req, res, next) => {
      // Solo cachea peticiones GET
      if (req.method !== 'GET') {
        return next();
      }

      // Genera una clave única basada en la URL y parámetros de consulta
      const key = `${req.originalUrl}`;
      const cachedResponse = this.get(key);

      if (cachedResponse) {
        // Añade una cabecera para indicar que es una respuesta cacheada
        res.set('X-Cache', 'HIT');
        return res.status(200).json(cachedResponse);
      }

      // Guarda la referencia original al método res.json
      const originalJson = res.json;
      
      // Sobreescribe el método json para interceptar la respuesta
      res.json = (body) => {
        // Restaura el método original
        res.json = originalJson;
        
        // Cachea el resultado solo si la respuesta es exitosa
        if (res.statusCode >= 200 && res.statusCode < 300) {
          this.set(key, body, ttlSeconds);
        }
        
        // Añade una cabecera para indicar que es un fallo de caché
        res.set('X-Cache', 'MISS');
        
        // Envía la respuesta
        return res.json(body);
      };

      next();
    };
  }
}

// Exporta una instancia única para toda la aplicación
module.exports = new MemoryCache();
