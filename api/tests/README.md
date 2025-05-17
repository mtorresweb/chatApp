# Guía de Pruebas Automatizadas

Este documento proporciona instrucciones sobre cómo ejecutar y mantener las pruebas automatizadas para la API del chat.

## Requisitos

- Node.js (v18.x o superior)
- NPM (v9.x o superior)

## Estructura de las Pruebas

Las pruebas están organizadas en dos categorías principales:

1. **Pruebas Unitarias**: Prueban componentes individuales de forma aislada
   - Ubicación: `tests/unit/`
   - Incluyen pruebas para utilidades, middleware, helpers, etc.

2. **Pruebas de Integración**: Prueban la interacción entre varios componentes
   - Ubicación: `tests/integration/`
   - Incluyen pruebas para endpoints de API, interacciones de bases de datos, etc.

## Herramientas Utilizadas

- **Jest**: Marco de pruebas principal
- **Supertest**: Para probar endpoints HTTP
- **mongodb-memory-server**: Base de datos en memoria para pruebas
- **node-mocks-http**: Para simular objetos req/res de Express

## Ejecución de Pruebas

### Comandos Disponibles

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo vigilancia (detecta cambios en archivos)
npm run test:watch

# Ejecutar solo pruebas unitarias
npm run test:unit

# Ejecutar solo pruebas de integración
npm run test:integration

# Generar informe de cobertura
npm run test:coverage

# Ejecutar el flujo completo de pruebas (primero unitarias, luego integración)
npm run test:full
```

### Scripts de Automatización

También están disponibles scripts para una ejecución más controlada:

- `run-tests.ps1` (Windows PowerShell)
- `run-tests.sh` (Linux/Mac)

Estos scripts ejecutan primero las pruebas unitarias y, si pasan, continúan con las pruebas de integración.

## Fixtures y Utilidades

- **tests/fixtures/db.js**: Proporciona funciones de utilidad para conectar, limpiar y cerrar la base de datos en memoria
- **tests/fixtures/data.js**: Contiene datos de prueba (usuarios, chats, mensajes)
- **tests/setup.js**: Configuración global para todas las pruebas

## Creación de Nuevas Pruebas

### Pruebas Unitarias

Para crear una nueva prueba unitaria:

1. Crea un archivo en `tests/unit/` con el nombre `<componente>.test.js`
2. Importa el módulo a probar y cualquier dependencia necesaria
3. Crea casos de prueba que verifiquen el comportamiento esperado
4. Ejecuta las pruebas para verificar que pasan

Ejemplo:

```javascript
// tests/unit/example.test.js
const { myFunction } = require('../../utils/example');

describe('Example Utility', () => {
  test('debe devolver el valor esperado', () => {
    const result = myFunction(1, 2);
    expect(result).toBe(3);
  });
});
```

### Pruebas de Integración

Para crear una nueva prueba de integración:

1. Crea un archivo en `tests/integration/` con el nombre `<recurso>.test.js`
2. Importa la aplicación, modelos y utilidades necesarias
3. Configura la base de datos antes/después de las pruebas
4. Crea casos de prueba que verifiquen el comportamiento de los endpoints

Ejemplo:

```javascript
// tests/integration/example.test.js
const request = require('supertest');
const app = require('../../app');
const { connectDB, closeDB, clearDB } = require('../fixtures/db');

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await clearDB();
});

afterAll(async () => {
  await closeDB();
});

describe('API Example', () => {
  test('debe devolver 200 y datos correctos', async () => {
    const response = await request(app)
      .get('/api/example')
      .expect(200);
    
    expect(response.body.success).toBe(true);
  });
});
```

## Consejos para Pruebas Efectivas

1. **Aislamiento**: Cada prueba debe ser independiente de las demás
2. **Claridad**: Usa nombres descriptivos para las pruebas
3. **Preparación**: Configura correctamente el estado inicial antes de cada prueba
4. **Verificación**: Asegúrate de verificar todos los aspectos relevantes del resultado
5. **Limpieza**: Limpia cualquier estado modificado después de cada prueba

## Depuración de Pruebas

Si una prueba falla, puedes usar las siguientes técnicas para depurarla:

1. Ejecuta solo esa prueba específica:
   ```bash
   npx jest -t "nombre de la prueba" --detectOpenHandles
   ```

2. Agrega `console.log` en puntos estratégicos para ver valores

3. Utiliza `--verbose` para ver más detalles:
   ```bash
   npm test -- --verbose
   ```

4. Verifica los errores en el archivo de registro (`npm-debug.log`) si la prueba falla con un error grave

## Mantenimiento de Pruebas

- Actualiza las pruebas cuando cambies la funcionalidad
- Revisa regularmente la cobertura y agrega pruebas para código no cubierto
- Refactoriza las pruebas para mantenerlas limpias y comprensibles
- Asegúrate de que las pruebas sean rápidas y confiables
