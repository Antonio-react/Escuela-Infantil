import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { pantallas, recorrerHastaAbajo, rutas } from './paginas'

// ACCESIBILIDAD CON AXE: en cada página y cada tamaño de pantalla, axe revisa el HTML ya dibujado contra las normas
// WCAG 2.0, 2.1 y 2.2 (niveles A y AA): contraste, textos alternativos, etiquetas de formulario, nombres de botones y
// enlaces, orden de encabezados, ARIA... Con movimiento reducido, para revisar cada cosa en su estado final (a mitad
// de una animación, algo semitransparente daría un falso fallo de contraste).
// RESPONSIVE: además, que la página no se salga a lo ancho (sin scroll horizontal).
// SEGURIDAD: y que la CSP (cabeceras de public/_headers) no bloquee nada.

test.use({ reducedMotion: 'reduce' })

for (const pantalla of pantallas) {
  test.describe(`${pantalla.nombre} (${pantalla.width}×${pantalla.height})`, () => {
    test.use({ viewport: { width: pantalla.width, height: pantalla.height } })

    for (const { nombre, ruta } of rutas) {
      test(`${nombre}: sin fallos de axe ni scroll horizontal`, async ({ page }) => {
        // SEGURIDAD: lo que la CSP de public/_headers bloquee (el servidor de pruebas la envía) se apunta aquí.
        await page.addInitScript(() =>
          document.addEventListener('securitypolicyviolation', (e) => console.error(`CSP bloquea ${e.blockedURI} (${e.violatedDirective})`)),
        )
        const bloqueos: string[] = []
        page.on('console', (m) => {
          if (m.text().startsWith('CSP bloquea')) bloqueos.push(m.text())
        })
        await page.goto(ruta, { waitUntil: 'domcontentloaded' })
        // Que la página ya esté dibujada (su título) antes de revisarla.
        await expect(page.locator('h1')).toBeVisible()
        await recorrerHastaAbajo(page)

        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze()
        // Un resumen legible de cada fallo: la regla, cuánto importa y dónde (selector del elemento).
        const resumen = violations.map((v) => ({
          regla: v.id,
          impacto: v.impact,
          que: v.help,
          donde: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
        }))
        expect(resumen, JSON.stringify(resumen, null, 2)).toEqual([])

        const ancho = await page.evaluate(() => ({ pagina: document.documentElement.scrollWidth, ventana: window.innerWidth }))
        expect(ancho.pagina, 'la página se sale a lo ancho').toBeLessThanOrEqual(ancho.ventana)

        expect(bloqueos, 'la CSP ha bloqueado algo de la página').toEqual([])
      })
    }
  })
}
