const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../helpers/jwt.js");
const { matchedData } = require("express-validator");
const ApiResponse = require("../utils/apiResponse.js");
const { ConflictError, BadRequestError, NotFoundError } = require("../utils/errors.js");
const logger = require("../utils/logger.js");

/**
 * Registra un nuevo usuario
 * @param {Request} req - Objeto request de Express
 * @param {Response} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const register = async (req, res, next) => {
  try {
    // Obtiene los datos validados
    const data = matchedData(req);

    // Verifica si el correo electrónico ya está registrado
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new ConflictError("El correo electrónico ya está en uso");
    }

    // Cifra la contraseña proporcionada (aumentamos las rondas a 14 para mayor seguridad)
    data.password = await bcrypt.hash(data.password, 14);

    // Guarda el usuario con la contraseña cifrada
    const newUser = await User.create(data);

    // Crea el objeto de usuario sin la contraseña
    const userToReturn = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      pic: newUser.pic,
    };

    // Genera tokens de acceso y refresco
    const accessToken = generateAccessToken(userToReturn);
    const refreshToken = generateRefreshToken({ id: newUser._id });

    // Registra la actividad
    logger.info(`Nuevo usuario registrado: ${newUser.email}`);

    // Devuelve el objeto de usuario y proporciona los tokens
    return res.status(201).json(
      ApiResponse.success({
        user: userToReturn,
        accessToken,
        refreshToken
      }, "Usuario registrado con éxito", 201)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Inicia sesión de usuario
 * @param {Request} req - Objeto request de Express
 * @param {Response} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const login = async (req, res, next) => {
  try {
    // Obtiene el correo electrónico y la contraseña validados
    const { email, password } = matchedData(req);

    // Busca el usuario por su correo electrónico
    const user = await User.findOne({ email });

    // Verifica si la contraseña coincide con la almacenada
    let passwordMatch = false;
    if (user) {
      passwordMatch = await bcrypt.compare(password, user.password);
    }

    // Devuelve un error si la contraseña es incorrecta o no se encontró el usuario
    if (!passwordMatch || !user) {
      throw new BadRequestError("Correo electrónico o contraseña incorrectos");
    }

    // Crea el objeto de usuario
    const userToReturn = {
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
    };

    // Genera tokens de acceso y refresco
    const accessToken = generateAccessToken(userToReturn);
    const refreshToken = generateRefreshToken({ id: user._id });

    // Registra la actividad
    logger.info(`Usuario autenticado: ${user.email}`);

    // Devuelve el objeto de usuario y proporciona los tokens
    return res.status(200).json(
      ApiResponse.success({
        user: userToReturn,
        accessToken,
        refreshToken
      }, "Inicio de sesión exitoso")
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Lista usuarios por nombre
 * @param {Request} req - Objeto request de Express
 * @param {Response} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const listUsers = async (req, res, next) => {
  try {
    // Obtiene los parámetros de consulta validados
    const { search = "" } = matchedData(req);
    const { pagination } = req;

    // Construye el filtro de búsqueda
    const filter = {
      name: { $regex: search, $options: "i" },
      _id: { $ne: req.user._id } // Excluye al usuario actual
    };

    // Realiza la consulta con paginación
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password") // Excluye el campo de contraseña
      .sort(pagination?.sort || { createdAt: -1 })
      .skip(pagination?.skip || 0)
      .limit(pagination?.limit || 10);

    // Devuelve un error si no hay usuarios coincidentes
    if (users.length === 0) {
      return res.status(200).json(
        ApiResponse.success([], "No se encontraron usuarios con ese criterio")
      );
    }

    // Información de paginación
    const paginationInfo = pagination ? {
      page: pagination.page,
      limit: pagination.limit,
      total,
      pages: Math.ceil(total / pagination.limit)
    } : null;

    // Envía la lista de usuarios con los usuarios coincidentes
    return res.status(200).json(
      ApiResponse.paginated(users, paginationInfo, "Usuarios encontrados")
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Genera nuevo token de acceso usando token de refresco
 * @param {Request} req - Objeto request de Express
 * @param {Response} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const refreshToken = async (req, res, next) => {
  try {
    // Obtiene los datos del usuario desde el middleware de autenticación
    const { id } = req.user;

    // Busca el usuario en la base de datos
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new NotFoundError("usuario", id);
    }

    // Crea el objeto de usuario
    const userToReturn = {
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
    };

    // Genera un nuevo token de acceso
    const accessToken = generateAccessToken(userToReturn);

    // Devuelve el nuevo token
    return res.status(200).json(
      ApiResponse.success({ accessToken }, "Token de acceso renovado")
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  listUsers,
  refreshToken
};
