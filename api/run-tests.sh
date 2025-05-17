#!/bin/bash

# Script para ejecutar pruebas automatizadas

# Establecer variables de entorno para pruebas
export NODE_ENV=test
export JWT_SECRET_KEY=test-secret-key
export JWT_REFRESH_KEY=test-refresh-key

# Limpieza y preparación
echo "Limpiando caché de pruebas anteriores..."
rm -rf coverage
rm -rf .nyc_output

# Ejecutar pruebas unitarias primero
echo "Ejecutando pruebas unitarias..."
npx jest --testMatch="**/tests/unit/**/*.test.js" --detectOpenHandles

# Si las pruebas unitarias pasan, ejecutar pruebas de integración
if [ $? -eq 0 ]; then
  echo "Ejecutando pruebas de integración..."
  npx jest --testMatch="**/tests/integration/**/*.test.js" --detectOpenHandles
else
  echo "Las pruebas unitarias fallaron. Corrige los errores antes de ejecutar las pruebas de integración."
  exit 1
fi

# Generar informe de cobertura
echo "Generando informe de cobertura..."
npx jest --coverage

echo "Pruebas completadas."
