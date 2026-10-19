import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      // Las vistas quedan fuera: de ellas se encarga la prueba de humo del pipeline
      include: ['src/lib/**', 'src/context/**'],
      reporter: ['text', 'text-summary'],
      thresholds: {
        // Piso un poco por debajo de lo que hay hoy, para que la cobertura no baje
        statements: 65,
        branches: 80,
        functions: 60,
        lines: 65,
        // El motor exige 80%, como el --fail-under=80 del material del curso
        'src/lib/**': {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },
  },
})
