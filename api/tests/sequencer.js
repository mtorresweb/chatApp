// tests/sequencer.js
const Sequencer = require("@jest/test-sequencer").default;

/**
 * Secuenciador personalizado para controlar el orden de ejecución de las pruebas
 * Primero ejecuta las pruebas unitarias y luego las de integración
 */
class CustomSequencer extends Sequencer {
  /**
   * Función para ordenar las pruebas
   * @param {Array} tests - Array de pruebas a ordenar
   * @returns {Array} - Array de pruebas ordenadas
   */
  sort(tests) {
    // Ordenar por tipo de prueba (unitarias primero, luego integración)
    return tests.sort((testA, testB) => {
      const isAUnitTest = testA.path.includes("/unit/");
      const isBUnitTest = testB.path.includes("/unit/");

      // Si A es una prueba unitaria y B no, A va primero
      if (isAUnitTest && !isBUnitTest) {
        return -1;
      }

      // Si B es una prueba unitaria y A no, B va primero
      if (!isAUnitTest && isBUnitTest) {
        return 1;
      }

      // Si ambas son del mismo tipo, ordenar alfabéticamente
      return testA.path.localeCompare(testB.path);
    });
  }
}

module.exports = CustomSequencer;
