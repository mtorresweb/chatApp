const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const { NotFoundError } = require("./utils/errors.js");
const errorHandler = require("./middlewares/errorHandler.js");
const logger = require("./utils/logger.js");
const cache = require("./utils/cache.js");

// Importación de rutas
const userRoutes = require("./routes/user.js");
const chatRoutes = require("./routes/chat.js");
const messageRoutes = require("./routes/message.js");

const app = express();

// Habilitar proxy confiable (para Heroku, AWS, etc.)
app.set("trust proxy", 1);

// Middleware de registro HTTP
app.use(logger.httpLogger());

// Configuración de seguridad
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
};

app.use(cors(corsOptions));

// Configuración de Helmet para seguridad de cabeceras HTTP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'strict-dynamic'", "'nonce-rAnd0m123'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "https:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      },
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: {
      maxAge: 15552000, // 180 días
      includeSubDomains: true,
      preload: true,
    },
  })
);

// Middleware para limitar solicitudes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // Límite de 200 solicitudes por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: "Demasiadas solicitudes desde esta IP, por favor intenta de nuevo después de 15 minutos",
});

// Aplicar límites de solicitudes a todas las rutas API
app.use("/api", apiLimiter);

// Middleware para el análisis de cuerpos de peticiones
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Middleware de caché (solo para entornos de producción)
if (process.env.NODE_ENV === "production") {
  app.use("/api", cache.middleware(60 * 5)); // 5 minutos de caché
}

// Definición de rutas API
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Ruta de estado/salud de la API
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: process.env.npm_package_version || "1.0.0"
  });
});

// Middleware para manejo de rutas no encontradas
app.use("*", (req, res, next) => {
  next(new NotFoundError("ruta", req.path));
});

// Middleware para manejo centralizado de errores
app.use(errorHandler);

module.exports = app;
