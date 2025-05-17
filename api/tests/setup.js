// Configuración de variables de entorno para pruebas
process.env.JWT_SECRET_KEY = "test-secret-key";
process.env.JWT_REFRESH_KEY = "test-refresh-key";
process.env.NODE_ENV = "test";

console.log("Test environment variables set");

// Silenciar console.log durante las pruebas si no está en modo verbose
if (process.env.JEST_WORKER_ID && !process.env.VERBOSE) {
  global.console.log = jest.fn();
}

// Additional setup code can go here
