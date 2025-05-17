# Chat App API

![Node.js CI](https://github.com/yourusername/chat-app-api/workflows/Node.js%20CI/badge.svg)
[![codecov](https://codecov.io/gh/yourusername/chat-app-api/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/chat-app-api)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Una API REST robusta y escalable para aplicaciones de chat en tiempo real, desarrollada con Node.js, Express y MongoDB.

## 📋 Índice

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Documentación API](#-documentación-api)
- [Pruebas](#-pruebas)
- [Despliegue](#-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

- **Autenticación**: Sistema completo con registro, inicio de sesión y tokens JWT
- **Chats**: Chats individuales y grupales con capacidad de gestión
- **Mensajes**: Envío y recepción de mensajes en tiempo real
- **Búsqueda**: Capacidad para buscar usuarios y chats
- **Seguridad**: Implementación de mejores prácticas (rate limiting, sanitización de entradas, etc.)
- **Validación**: Validación robusta de todos los datos entrantes
- **Documentación**: API completamente documentada con Swagger
- **Pruebas**: Suite completa de pruebas unitarias e integración

## 🛠 Tecnologías

- **Backend**: Node.js, Express
- **Base de datos**: MongoDB, Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Tiempo real**: Socket.IO
- **Validación**: Express Validator
- **Seguridad**: Helmet, CORS, Rate Limiting
- **Documentación**: Swagger/OpenAPI
- **Pruebas**: Jest, Supertest
- **CI/CD**: GitHub Actions

## 🏗 Arquitectura

La API está construida siguiendo una arquitectura MVC (Modelo-Vista-Controlador) adaptada para APIs:

- **Modelos**: Definen la estructura de datos y operaciones de base de datos
- **Controladores**: Manejan la lógica de negocio y procesamiento
- **Rutas**: Definen los endpoints de la API y dirigen las solicitudes
- **Middlewares**: Procesan las solicitudes antes de llegar a los controladores
- **Helpers**: Proporcionan funcionalidades auxiliares reutilizables
- **Utils**: Utilidades generales para toda la aplicación

## 🚀 Instalación

### Prerrequisitos

- Node.js (v18.x o superior)
- MongoDB (v5.x o superior)
- npm (v9.x o superior)

### Pasos de instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/yourusername/chat-app-api.git
   cd chat-app-api
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Configurar variables de entorno (editar el archivo `.env` con tus valores)

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `5000` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/chatapp` |
| `JWT_SECRET_KEY` | Clave secreta para firmar tokens JWT | `tu_clave_secreta_jwt` |
| `JWT_REFRESH_KEY` | Clave para tokens de refresco | `tu_clave_refresco_jwt` |
| `NODE_ENV` | Entorno de ejecución | `development`, `production`, `test` |
| `ALLOWED_ORIGINS` | Orígenes permitidos para CORS (separados por comas) | `http://localhost:3000,https://tuapp.com` |

## 🖥 Uso

### Desarrollo

Para ejecutar la aplicación en modo desarrollo:

```bash
npm run dev
```

### Producción

Para ejecutar la aplicación en modo producción:

```bash
npm start
```

## 📚 Documentación API

La API está documentada con Swagger/OpenAPI. Para acceder a la documentación:

1. Inicia la aplicación: `npm run dev`
2. Navega a `http://localhost:5000/api-docs`

### Endpoints Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/user/register` | Registrar un nuevo usuario |
| POST | `/api/user/login` | Iniciar sesión |
| GET | `/api/user` | Buscar usuarios |
| POST | `/api/chat/access` | Acceder o crear un chat individual |
| POST | `/api/chat/createGroup` | Crear un chat grupal |
| GET | `/api/chat/getChats` | Obtener todos los chats del usuario |
| POST | `/api/message/send` | Enviar un mensaje |
| GET | `/api/message/getMessages/:chatId` | Obtener mensajes de un chat |

## 🧪 Pruebas

El proyecto incluye pruebas unitarias e integración. Para ejecutarlas:

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo vigilancia
npm run test:watch

# Ejecutar solo pruebas unitarias
npm run test:unit

# Ejecutar solo pruebas de integración
npm run test:integration

# Ejecutar pruebas con informe de cobertura
npm run test:coverage

# Ejecutar el flujo completo de pruebas (unitarias primero, luego integración)
npm run test:full
```

Más información sobre las pruebas en [tests/README.md](tests/README.md).

## 🌐 Despliegue

La aplicación está preparada para despliegue en varios servicios:

### Heroku

```bash
heroku create
git push heroku main
```

### Docker

```bash
docker build -t chat-app-api .
docker run -p 5000:5000 chat-app-api
```

## 📁 Estructura del Proyecto

```
.
├── app.js                  # Configuración de Express
├── server.js               # Punto de entrada de la aplicación
├── controllers/            # Controladores para cada recurso
│   ├── chat.js
│   ├── message.js
│   └── user.js
├── database/               # Configuración de la base de datos
│   └── connection.js
├── docs/                   # Documentación de la API
│   └── swagger.json
├── helpers/                # Funciones auxiliares
│   └── jwt.js
├── middlewares/            # Middlewares de Express
│   ├── auth.js
│   ├── errorHandler.js
│   ├── paginate.js
│   ├── validationHandler.js
│   └── validators/         # Validadores por recurso
│       ├── chatValidator.js
│       ├── messageValidator.js
│       └── userValidator.js
├── models/                 # Modelos de Mongoose
│   ├── Chat.js
│   ├── Message.js
│   └── User.js
├── routes/                 # Definición de rutas
│   ├── chat.js
│   ├── message.js
│   └── user.js
├── tests/                  # Pruebas automatizadas
│   ├── fixtures/           # Datos y utilidades para pruebas
│   ├── integration/        # Pruebas de integración
│   └── unit/               # Pruebas unitarias
└── utils/                  # Utilidades generales
    ├── apiResponse.js      # Formato estandarizado de respuestas
    ├── cache.js            # Utilidad de caché
    ├── errors.js           # Clases de error personalizadas
    └── logger.js           # Sistema de registro
```

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

### Guía de Estilo

- Utiliza ESLint para mantener un estilo de código consistente
- Escribe pruebas para toda nueva funcionalidad
- Sigue las convenciones de nombres existentes
- Documenta las nuevas características o cambios importantes

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia ISC - ver el archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado con ❤️ por [Tu Nombre](https://github.com/yourusername)
