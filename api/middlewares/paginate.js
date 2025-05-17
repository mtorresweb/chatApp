/**
 * Middleware para manejar la paginación en las consultas a la base de datos
 * @param {Request} req - Objeto request de Express
 * @param {Response} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const paginate = (req, res, next) => {
  // Valores predeterminados
  const defaultPage = 1;
  const defaultLimit = 10;
  const maxLimit = 100;

  // Obtener parámetros de consulta
  let { page, limit, sort, order } = req.query;

  // Convertir a números y validar
  page = parseInt(page, 10) || defaultPage;
  limit = parseInt(limit, 10) || defaultLimit;

  // Aplicar restricciones
  if (page < 1) page = defaultPage;
  if (limit < 1 || limit > maxLimit) limit = defaultLimit;

  // Calcular el número de elementos a omitir
  const skip = (page - 1) * limit;

  // Ordenación
  sort = sort || 'createdAt';
  order = order === 'asc' ? 1 : -1;

  // Añadir propiedades al objeto request
  req.pagination = {
    page,
    limit,
    skip,
    sort: { [sort]: order }
  };

  next();
};

module.exports = paginate;
