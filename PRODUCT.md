# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Principal:** familias de Carranque (Toledo) y alrededores con peques de 0 a 3 años, o con un bebé en camino, que están buscando escuela infantil. Lo miran sobre todo desde el móvil (muchas con iPhone y Safari), a ratos y con prisa.
- **Secundario:** reclutadores y contactos de LinkedIn que ven la web como pieza de portfolio de Antonio. Nunca pasan por delante de las familias.

## Product Purpose

Web de la Escuela Infantil Árbol de Nubes (razón social Tres Pequeños Mundos, S.L.; dueñas: las tres directoras, Cristina, Beatriz y Olga). Cuenta cómo es la escuela (aulas, horario, cocina, adaptación, equipo, calendario) para que una familia que no la conoce confíe en ella.

**Éxito:** que la familia **solicite una visita** (formulario de Contacto). Después, que llame o escriba por email.

## Positioning

Escuela pequeña y familiar en la que las tres directoras son también las educadoras tutoras y **cocinan ellas mismas cada día**. Abierta de 7:00 a 17:00 con comida casera incluida en la jornada, matrícula abierta todo el año y adaptación progresiva. Sin compararse con otras escuelas.

## Operating Context

- Páginas: Inicio, La escuela, Horario y calendario, Familias, Contacto, Aviso legal, Política de privacidad y 404 (`src/data/paginas.ts`).
- Vías de contacto: formulario "Solicitar visita" (Netlify Forms, aviso por email), teléfono (3 números, uno también de WhatsApp), email (las dueñas prefieren el correo) y mapa que se carga al pulsar.
- Las familias ya matriculadas usan la app Baby Control para el día a día; la web solo enlaza a ella.
- Las fotos las envían las dueñas; los textos los revisa la hermana (una de las directoras) y lo legal, la gestoría.

## Capabilities and Constraints

- React 19 + TypeScript estricto, Vite, Tailwind CSS v4, Motion, React Router; alojamiento en Netlify. Todo lo detalla `CLAUDE.md`, que manda sobre este archivo.
- Todos los datos viven en `src/data/`; nunca se escriben a mano en un componente. Lo que falta se marca con `TODO` y no puede quedar ninguno visible.
- Sin cookies no esenciales y sin scripts de terceros (nada de feeds de Meta ni widgets de Google; el mapa solo al pulsar).
- **Descartado:** tarifas o calculadora de precios, menú mensual en la web, reservas con calendario, documentos para pedir plaza, aviso por WhatsApp desde el formulario, barra fija de Llamar/WhatsApp en móvil.
- No se cambia el funcionamiento de nada sin hablarlo antes con Antonio.

## Brand Commitments

- Nombre: Escuela Infantil Árbol de Nubes. Logo: el árbol con el rótulo debajo (`docs/referencias/logo/`).
- Voz cercana, cálida y sencilla ("los peques", "nosotras"), en español de España con ortografía cuidada. Sin cifras de Google que caduquen.
- Identidad visual ya construida y aprobada: ver `CLAUDE.md` §6–8 (pastel luminoso, árbol del logo como marca de agua, nubes, juguetes dibujados, pizarras de tiza, cuaderno, corcho). Es el sistema vigente: se refina, no se sustituye.

## Evidence on Hand

- Testimonios reales de familias (`src/data/testimonios.ts`), recortados con "…" y sin nombres; **no se retocan ni se inventan**.
- Fotos reales de la escuela (`src/data/fotos.ts`). Fachada provisional, de poca calidad.
- Datos legales y de autorización del centro en `src/data/site.ts`.
- **Faltan:** fotos de las directoras (solo con su consentimiento) y una fachada buena. El proyecto educativo depende del texto de la hermana, sin decidir.

## Product Principles

1. La familia primero: cada decisión se mide por si ayuda a una madre o un padre con prisa, desde el móvil, a confiar y pedir visita.
2. Verdad antes que efecto: nada de datos, cifras o testimonios inventados; lo que no está confirmado no se publica.
3. Una escuela, no una plantilla: los detalles propios de escuela infantil (juguetes, tiza, cuaderno) son la marca, siempre con sentido y sin estorbar.
4. Ligera y respetuosa: rápida en móviles modestos, sin rastreo ni cookies de más.

## Accessibility & Inclusion

- Objetivo **WCAG 2.2 AA**, comprobado con Playwright + axe.
- Con `prefers-reduced-motion: reduce`, todo queda fijo, sin excepciones. Las animaciones que se repiten en reposo duran menos de 5 s (WCAG 2.2.2).
- Foco visible, "Saltar al contenido", objetivos táctiles cómodos para el pulgar y decoración con `aria-hidden`.
