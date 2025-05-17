# Script para ejecutar pruebas automatizadas en Windows

# Establecer variables de entorno para pruebas
$env:NODE_ENV = "test"
$env:JWT_SECRET_KEY = "test-secret-key"
$env:JWT_REFRESH_KEY = "test-refresh-key"

# Limpieza y preparación
Write-Host "Limpiando caché de pruebas anteriores..."
if (Test-Path coverage) { Remove-Item -Recurse -Force coverage }
if (Test-Path .nyc_output) { Remove-Item -Recurse -Force .nyc_output }

# Ejecutar pruebas unitarias primero
Write-Host "Ejecutando pruebas unitarias..."
npx jest --testMatch="**/tests/unit/**/*.test.js" --detectOpenHandles

# Si las pruebas unitarias pasan, ejecutar pruebas de integración
if ($LASTEXITCODE -eq 0) {
  Write-Host "Ejecutando pruebas de integración..."
  npx jest --testMatch="**/tests/integration/**/*.test.js" --detectOpenHandles
} else {
  Write-Host "Las pruebas unitarias fallaron. Corrige los errores antes de ejecutar las pruebas de integración."
  exit 1
}

# Generar informe de cobertura
Write-Host "Generando informe de cobertura..."
npx jest --coverage

Write-Host "Pruebas completadas."
