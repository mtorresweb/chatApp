const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

/**
 * Establece la conexión a MongoDB con opciones mejoradas
 * @returns {Promise} Promesa de la conexión
 */
async function connection() {
  try {
    // Configuración de la conexión
    const connectionOptions = {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 30000,
      socketTimeoutMS: 45000,
    };

    // Establecer conexión
    await mongoose.connect(uri, connectionOptions);
    console.log("✓ Conexión exitosa a MongoDB");

    // Manejar eventos de conexión
    mongoose.connection.on("error", (err) => {
      console.error("✗ Error en la conexión a MongoDB:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("! MongoDB desconectado. Intentando reconectar...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✓ Reconectado a MongoDB exitosamente");
    });

    // Manejar cierre de la aplicación
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("✓ Conexión a MongoDB cerrada por finalización de la aplicación");
      process.exit(0);
    });

    return mongoose.connection;
  } catch (error) {
    console.error("✗ Error al conectar a MongoDB:", error.message);
    console.error("Detalles:", error);
    process.exit(1);
  }
}

module.exports = connection;
