const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const { generateAccessToken } = require("../../helpers/jwt");

let mongoServer;

/**
 * Conecta a la base de datos en memoria para pruebas
 */
const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
  console.log(`MongoDB conectada en: ${mongoUri}`);
};

/**
 * Cierra la conexión a la base de datos en memoria
 */
const closeDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  console.log("MongoDB desconectada");
};

/**
 * Limpia todas las colecciones de la base de datos
 */
const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

/**
 * Genera tokens para realizar pruebas
 * @param {Object} user - Datos del usuario para generar el token
 * @returns {Object} Tokens generados
 */
const generateTestTokens = (user) => {
  const userPayload = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  return {
    accessToken: generateAccessToken(userPayload),
  };
};

module.exports = {
  connectDB,
  closeDB,
  clearDB,
  generateTestTokens,
};
