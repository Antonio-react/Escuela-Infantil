import { defineConfig, devices } from '@playwright/test'

// Pruebas en el navegador (Playwright) de la web COMPILADA, como la verá la gente: antes de probar, se hace el build y
// se sirve con scripts/servidor-pruebas.mjs (puerto 4173), que imita a Netlify: rutas y cabeceras de seguridad (CSP)
// de public/_headers. Las pruebas, en tests/. Se lanzan con `npm run test:e2e`.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  // 2 a la vez: con 4, si el ordenador iba cargado, alguna página tardaba más de 30 s en abrirse (no es la web: es la
  // máquina). Tarda algo más, pero sin falsos fallos.
  workers: 2,
  // 60 s por prueba: recorrer una página entera o pulsar Tab 40 veces en las más largas puede pasar de los 30 s de serie.
  timeout: 60_000,
  // Un reintento, por si algo puntual falla (un fallo de verdad falla las dos veces; uno puntual sale como "flaky"
  // en el informe: no se esconde).
  retries: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'tests/informe' }]],
  outputDir: 'tests/resultados',
  use: {
    // Abrir una página: como mucho 30 s. Las pruebas no esperan a que cargue TODO (waitUntil: 'domcontentloaded'), sino
    // a lo que necesitan (el h1, por ejemplo).
    navigationTimeout: 30_000,
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && node scripts/servidor-pruebas.mjs 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 180_000,
  },
})
