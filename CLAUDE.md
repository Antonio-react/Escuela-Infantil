# CLAUDE.md — guarderia-infantil-app

Web de la **Escuela Infantil Árbol de Nubes** (Carranque, Toledo). Es un encargo real para la escuela (razón social: Tres Pequeños Mundos, S.L.; las **dueñas** son las tres directoras: Cristina, Beatriz y Olga) y, a la vez, una pieza de portfolio para LinkedIn. Repo y carpeta dedicados en exclusiva a este proyecto.

---

## 1. Cómo trabajar conmigo (lo más importante)

Soy Antonio. Estoy aprendiendo de verdad: **no quiero copiar y pegar código**.

- Responde siempre en **español, con ortografía y tildes cuidadas**. Tono directo, claro y colaborativo.
- Actúa como un **programador frontend senior**: resultados profesionales y de calidad.
- **Cambia solo lo necesario.** Si hay que corregir algo, toca esa línea y no reescribas ni reformatees el resto del archivo.
- Cuando cambies algo, indica **el archivo y la línea exacta**, qué cambia y **por qué** (explica el error o la decisión y qué es cada cosa).
- Antes de un cambio grande, dime qué archivos vas a tocar y por qué.
- No crees un CLAUDE.md nuevo con cada cambio. Este es el definitivo; si hay que actualizarlo, avísame y se hace a propósito.

## 2. Stack

- React 19 + TypeScript (**tipado estricto**, sin `any`)
- Vite
- Tailwind CSS v4 (los tokens van en `@theme`, en `src/index.css`)
- Motion (paquete `motion`, el nombre actual de Framer Motion; se importa desde `motion/react`)
- React Router 8 (`createBrowserRouter`; `RouterProvider` se importa de `react-router/dom`). Rutas, títulos y descripciones en `src/data/paginas.ts`
- sharp (solo desarrollo): optimiza imágenes con `npm run imagenes` (`scripts/optimizar-imagenes.mjs`). Se puede usar siempre que haga falta
- Alojamiento: **Netlify** (con `public/_redirects`: `/* /index.html 200`, para que ninguna ruta dé error al refrescar)
- Tipografía **alojada en el propio proyecto**, no cargada desde Google: **Fredoka** (títulos) + **Nunito** (texto), con Fontsource. Se cambia en `--font-*` de `src/index.css` y en los imports de `main.tsx`

## 3. Estructura de carpetas

```
guarderia-infantil-app/
├─ CLAUDE.md
├─ README.md            ← técnico, pensado para reclutadores
├─ docs/
│  └─ referencias/      ← solo logo/ (los PNG que usa `npm run imagenes`) y, de paso, fotos/ (ignorada por git). No se importa ni se despliega
├─ public/              ← lo que se publica tal cual (_redirects, PDF del calendario, imágenes)
└─ src/
   ├─ assets/           ← logo final y SVG que sí se usan
   ├─ data/             ← TODOS los datos (ver sección 4)
   ├─ components/
   └─ ...
```

- Los archivos de `docs/referencias/` son originales: **nunca se modifican**. Lo que se usa son copias en `src/assets/` o `public/`.
- **Excepción, las fotos:** van a `docs/referencias/fotos/` solo para convertirlas (`npm run imagenes`) y, con el visto bueno de Antonio, **se borran** (no se guarda copia en el proyecto). En general, **lo que no se usa, se borra**.

## 4. Datos: un solo sitio

- **Todos los datos de la escuela viven solo en `src/data/`** (empezando por `src/data/site.ts`; las FAQ en `faqs.ts`, etc.).
- Los componentes los **importan**. **Nunca se escribe un dato a mano en un componente** (teléfonos, horarios, enlaces, textos fijos...).
- Los teléfonos son 3 y **uno de ellos es también el de WhatsApp**: se marca con `whatsapp: true`; no se repite el número. Los formatos (pantalla, `tel:`, `wa.me`) se generan con funciones.
- **Regla general de código:** todo lo reutilizable (componentes, datos, estilos) va aparte y se importa. Si algo se va a usar dos veces, se extrae a un único sitio.
- Los datos que faltan se marcan **siempre con la palabra `TODO`** (no `pendiente`, ni `falta`). Antes de publicar se busca `TODO` en todo el proyecto: **no puede quedar ninguno visible en la web**.

## 5. Herramientas y skills

**Durante el proyecto**, úsalas cuando aporten:

- **Superpowers** (método de trabajo: planificar, depurar, verificar antes de dar algo por terminado).
- **Taste Skills** (skill completa; se usa como **criterio de revisión**. **No se aplica su regla 9** —sin número de calle, código postal, teléfonos en formato real ni datos registrales—: es una web real y necesita la dirección, los teléfonos, el CIF y los datos del registro), **Emil Kowalski** (animaciones y detalle de interfaz), **21st.dev** (componentes), **Context7** (documentación actual de librerías) y **Playwright** (tests).

**Solo al final del proyecto** (no las uses antes, aunque ya estén instaladas de otro proyecto, hasta que yo lo pida):

- **Impeccable** (pulido de diseño), **Chrome DevTools MCP** (revisión en navegador y rendimiento) y **claude-seo** (SEO).

## 6. Identidad visual

Estética **luminosa, pastel, bordes redondeados**. Paleta basada en el logo (provisional; la decidimos nosotros viendo la web):

- Marca: verde `#356943`, ciruela `#79386E`, coral `#B94750`, mostaza `#DEAB59`, salvia `#9DA576`, azul `#7B95A9`
- Fondos pastel: crema `#FBF8F3`, `#E0ECE2`, `#E2E8EC`, `#F4E2E3`, `#F6E7D1`, `#E8E1E5`
- Texto: `#2B2830`
- **Colores planos** al principio; los degradados se deciden viendo la web.
- Contraste medido: verde, ciruela y coral sirven para texto; mostaza, salvia y azul solo como fondo con texto oscuro o decoración.
- **Colores del árbol del logo** (medidos sobre la imagen; en el logo van al 50 % de opacidad): naranja de la "a" `#fcb436`, verde `#94c11f`, rojo `#e30613`, morado `#951b81`, azul cielo `#2daae1`. En `@theme` existen mezclados con crema al 35 % (`arbol-*`, fondo de la página activa del menú) y puros (`arbol-*-intenso`, juguetes del menú). Morado del rótulo "Escuela" `#6a2482`.

Elementos de diseño:

- **Árbol del logo como marca de agua: "sombra verde"** (`ArbolFondo.tsx`): la silueta del logo recorta un fondo verde liso con una máscara CSS (reutiliza `logo-arbol.webp`, sin peso extra), opacidad ~5 %, `pointer-events-none`, `aria-hidden`. Copa arriba (separada de la barra de navegación, o de la foto de la fachada en Inicio, por un margen de 24-56 px) y **tronco fijo** (no se dibuja con el scroll: se veía cortado a media pantalla) que **termina justo donde empieza el footer**; de ahí nacen las **raíces, que se extienden por el footer** (el footer son las raíces de la web), al doble de tamaño y algo más visibles (~12 %). En la página de inicio hay **dos árboles independientes**: el del hero y el de fondo (empieza tras la foto de la fachada, que los separa; el bloque va marcado con `data-arbol-empieza`). En el resto de páginas el de fondo empieza arriba, tras ese margen.- **Nubes** como divisores orgánicos entre secciones, con parallax suave en los laterales. (El componente `BancoNubes` se borró el 2026-11-16: no se llegó a usar.) Todas las nubes sueltas (hero, nubecitas del árbol, cabeceras, botón y pizarras) tienen la **misma forma**, la de las pizarras (`formas.ts`).
- **Juguetes y bloques ilustrados** en el suelo de las secciones, con bote o giro al hover. Nada flotando sin sentido. Ya dibujados en `Juguetes.tsx`: osito, pelota, bloque, patito, manzana y teléfono de juguete (el sonajero se borró el 2026-11-17: solo estaba en la nube de la cabecera de La escuela, sustituida por la foto de la entrada). Los que van en el menú se recolorean con variables CSS (`--juguete`, `--juguete-claro`, `--juguete-pico`).
- **Descartado:** el SVG del árbol "de trazos" (no se parecía al logo); se sustituyó por la sombra verde.
- **Botón "Solicitar visita" (`.boton-visita`):** con la **forma de nube original** (la de las pizarras, con bultos también por debajo: `CONTORNO_NUBE` en `src/components/formas.ts`; el texto, algo por debajo del centro), azul cielo del logo al 50 % (`--color-nube` `#94d1ea`) y texto tinta (8,7:1). En móvil, sombra algo más marcada.
- **Colores por página** (fondo de la página activa en los menús), con significado: Inicio naranja (bienvenida, el sol), La escuela verde (el árbol, crecer), Horario y calendario azul (el día y el paso del tiempo), Familias rojo (el corazón, el cariño), Contacto morado (cercanía; nunca azul, que va junto a la nube). Viven en `colorActivo` de `paginas.ts`.
- **Títulos (2026-11-17, antes casi todos verdes y el de la página igual que los de sección):** el h1 de cada página va en el color de su página, en su versión para texto (La escuela verde, Horario azul `arbol-azul-texto`, Familias coral, Contacto ciruela; `colorTitulo` en `paginas.ts`) y un escalón más grande que los de sección (`text-5xl sm:text-6xl`). Los de sección se turnan los colores (verde, ciruela, coral, azul, naranja oscuro): distinto del anterior, del h1 de su página y de su palabra destacada. La regla completa, en `DESIGN.md`.
- **`PRODUCT.md` y `DESIGN.md`** (raíz, 2026-11-17): la ficha del producto y el sistema visual para Impeccable ("El aula de juguete"). Si cambia algo del diseño, actualizar `DESIGN.md`.
- Logo: archivos en `docs/referencias/logo/`. El rótulo "Árbol de nubes" va **por debajo del árbol** (como en el del Instagram), no encima del tronco. (Las referencias de raíces, el logo de Instagram y el PDF original del calendario se borraron el 2026-11-18: ya no se usaban; la copia del PDF está en `public/`.)

## 7. Animación y movimiento reducido

- **Regla sin excepciones:** con `prefers-reduced-motion: reduce` **todo queda fijo**. Cualquier animación nueva lo respeta.
- Se resuelve **en un solo sitio**: un hook propio `usePrefersReducedMotion` + un bloque global en `src/index.css`. (`<MotionConfig reducedMotion="user">` solo desactiva transformaciones y layout; los fundidos de opacidad se mantienen, por eso no basta.)
- Solo se animan `transform` y `opacity`. **Excepción aprobada:** en la pizarra, `stroke-dashoffset` (dibujar los trazos poco a poco) y `clip-path` (descubrir el texto de izquierda a derecha, como si se escribiera).
- Animaciones cortas (~1 s). **Excepciones aprobadas:** la escritura del menú de pizarra y de la 404, y el vuelo de la "alfombra mágica" de la 404 (ver sección 8).
- Hover solo en dispositivos con ratón; los botones se hunden al pulsar (`scale(0.97)`).
- **Movimiento en reposo (2026-11-13):** cuando la pantalla está quieta (`useMarcaReposo` pone `data-quieto` en `<html>`), las nubes del hero y la nube "Solicitar visita" (barra de escritorio y hero en móvil) se mecen unos px a los lados (`.balancea`; ajustes en `src/components/balanceo.ts`). Mientras se hace scroll, fijas. **Menos de 5 s cada vez** y se paran (WCAG 2.2.2: más tiempo exigiría botón de pausa); se repite al volver a quedarse quieta. **Solo con ratón** (2026-11-17): en pantallas táctiles (`hover: none`) las nubes se quedan fijas y `useMarcaReposo` ni se instala (así no toca `<html>` con cada scroll, que recalculaba los estilos de toda la página).

## 8. Páginas y módulos

### Hero (inicio)
- Logo con árbol y nombre en grande, centrado.
- **Árbol del hero vivo** (`ArbolHero.tsx`, ideas de Antonio). Solo `transform` y `opacity`; con movimiento reducido, todo fijo y sin anclaje:
  - **Al llegar:** la **primera vez en la visita, quieto**, como una foto (2026-11-17); desde la segunda vez que se entra en Inicio, una sacudida corta, como si acabara de "aterrizar" (~1,4 s). Se recuerda con `vistoEnLaVisita.ts` (sessionStorage). Empieza **cuando la página ha terminado de cargar** (`trasCargarYLibre`, `src/utils/cuandoEsteLibre.ts`): a la vez que la carga, la frenaba.
  - **Al pasar el ratón o tocarlo con el dedo:** una sacudida suave (~1 s, máx. 1,6°).
  - **Al bajar con el scroll:** primero **tiembla** (desde la base del tronco, `skewX`; solo mientras se hace scroll) y, mientras sigue temblando, **de la copa salen volando pájaros y nubecitas** hacia el menú. El scroll los "suelta" y vuelan solos: si se para, siguen subiendo más despacio; si se va muy rápido, el vuelo dura al menos ~1 s (no pasan de golpe).
  - **Al subir** no retrocede (los que se fueron no vuelven); **al volver arriba del todo se rearma** y se repite al bajar otra vez.
  - El hero queda **anclado (`sticky`) durante un tramo de scroll** (60 % de pantalla) para que el efecto se vea. No se limita la velocidad del scroll (sería "scroll-jacking": molesta y da problemas de accesibilidad).
  - **Temblor en iPhone al subir arriba del todo (arreglado 2026-11-17, probado en su iPhone):** el hero entero temblaba de arriba a abajo ~1 s. En Inicio: el hero recorta con `overflow-clip` (no `hidden`), el `<main>` va sin recorte ni capa (`relative z-20`; lo de debajo del hero lleva la suya en `Inicio.tsx`, para seguir por delante del árbol de fondo) y sin rebote (`overscroll-behavior-y: none`). El árbol solo reacciona al bajar de verdad (ni la subida ni el rebote cuentan). Probado y descartado: `will-change` en el hero (peor).
  - Las **nubes grandes del hero quedan fijas** (en móvil, la de arriba a la izquierda más alta, a la altura de "Escuela"). Los rótulos no se mueven.
- **Favicon:** la copa del árbol (`favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png`). **Imagen al compartir** (`imagen-compartir.jpg`, 1200 × 630): el hero sin menú ni sello. Todo se genera con `npm run imagenes`.
- **Ramas con hojas en el árbol de fondo** (idea de Antonio, hecho): crecen mientras se hace scroll hacia abajo, **si se para el scroll se quedan quietas**, crecen hasta un máximo y al subir **no decrecen**. **Solo donde se ven** (2026-11-17): el árbol va detrás del contenido, así que se hace un mapa de lo que tapa (fotos, dibujos, cajas con fondo, texto) y cada rama se coloca donde su recuadro queda libre, alternando lados (`huecosLibres` en `ArbolFondo.tsx`). Se recalcula si cambia el tamaño de la página.
- **Sin lema** bajo el nombre (descartado, 2026-11-13).
- **"Matrícula abierta todo el año" como sello** redondo con osito (`SelloMatricula.tsx`): "Matrícula abierta" en ciruela y "todo el año" en verde. A la izquierda del árbol y **arrastrable por el hero en tablet y escritorio**; en móvil, fijo bajo el logo.
- Botón **"Solicitar visita"** en el hero **solo en móvil** (en escritorio ya está en el header).
- Redes sociales pequeñas en la **esquina inferior derecha** del hero (todos los tamaños).

### Foto de la fachada (bajo el hero)
- **Sustituye a la barra de datos** (borrada el 2026-11-17: Antonio la veía genérica, "está en todas las webs"). La escuela por fuera, **en grande y sola** (sin datos encima: ya están por toda la web), con esquinas poco redondeadas (`rounded-sm`), y debajo el texto de "Quiénes somos" (`FachadaInicio.tsx` y `Presentacion.tsx`). Separa los dos árboles. En móvil, 4:3 centrada en el edificio; desde sm, con su forma y como mucho el 70 % del alto de la pantalla.

### Contenido de la escuela
- **Aulas:** bebés (0-1), 1-2 años y 2-3 años. Excursiones extraescolares solo para 2-3 años (se muestran en esa aula). Son **cubos de letras de juguete dibujados en SVG** (`CuboSvg.tsx`, rediseño 2026-11-16 con referencias de Antonio: cara de delante de frente, lado a la derecha y arriba lisos, cantos redondeados, sombras con degradados, cuadrado crema con edad, "años" y nombre del aula): **en fila creciendo con la edad desde 640 px** y **en pila** (Bebés arriba) por debajo. "Excursiones extraescolares" va en pequeño en el borde de abajo del cubo de 2-3.
- **Tren de las aulas:** separador en la sección de aulas, un tren con **3 vagones = 3 aulas** que **cruza una sola vez** al llegar (no en bucle: sin botón de pausa). Hecho, versión normal (`Tren.tsx`).
- **Proyecto educativo:** NO va en la web (2026-11-18). La LOE (art. 121.3) solo pide que se haga público para la comunidad educativa, no en la web; la presentación de la escuela ya está en "Quiénes somos" (Inicio). Sección y `TODO` borrados.
- **Instalaciones:** aulas **climatizadas todo el año** (acondicionadas para frío y calor). En la web, solo el título y el termostato (la frase de debajo se quitó el 2026-11-19). Sin compararse con otras escuelas.
- **Horario:** abierto de 7:00 a 17:00. Jornada general de 9:00 a 15:00 **con comida incluida**. De 7:00 a 9:00 (acogida temprana) y de 15:00 a 17:00 (tarde) son **ampliaciones**. Las ampliaciones **se pagan aparte** (en la web solo eso: Antonio quitó el desayuno y la merienda, 2026-11-16). Se puede ampliar horas o cambiar de horario en cualquier momento.
- **Curso:** de septiembre a junio; julio opcional y abierto. Matrícula en cualquier momento, si hay plazas.
- **Cocina:** comida casera hecha a diario en la escuela, adaptada a alergias e intolerancias y al ritmo de cada niño (puré o sólido). Se facilitan menús mensuales, pero **el menú no va en la web** (contenido fijo). Las tres directoras cocinan ellas mismas, pero desde el 2026-11-19 **la web ya no lo dice** (ni "hecha a diario en la escuela" en la FAQ). Sin mencionar la limpieza. **La comida va incluida en la jornada de 9:00 a 15:00 y en el horario reducido de 9:00 a 13:00, no en el de 9:00 a 12:00** (`incluyeComida` en `site.ts`; de ahí salen la ficha de la cocina, el horario y la FAQ). En La escuela, la sección de cocina es **solo la ficha** con los puntos (sin título de ficha, manzana ni la frase, 2026-11-19);.
- **Adaptación:** progresiva y respetuosa, con estancias cortas de aproximadamente una hora que se amplían poco a poco. La sección de Familias va sin entradilla (2026-11-19); los pasos, en `src/data/textos.ts`.
- **Facilidades:** descuento por hermanos y pago a través de empresa (cheque guardería / beneficios sociales).
- **Baby Control** (agenda digital, fotos y novedades a diario): basta con el nombre y un **enlace a su web oficial**. Botón con texto "Conoce la app Baby Control" (no "Descargar"). La privacidad de esas fotos es cosa de la app. El botón es un **charco** (idea de Antonio, 2026-11-17: `.boton-charco`): azul de agua (`arbol-azul`, no el de la nube), orilla irregular (no pastilla) y la rana saliendo del agua con dos ondas (`OndasRana` en `Asoma.tsx`).
- **Calendario escolar:** imagen WebP con aspecto de **folio de papel** (esquinas rectas y la de abajo a la derecha un poco levantada: `.folio` en `index.css`) que **al pulsarla se amplía en un visor** (`<dialog>` nativo, con el JPG grande; el PDF, `public/calendario-escolar.pdf`, nombre fijo sin año, se abre desde "Ver PDF"), con `alt` descriptivo, `width`/`height` reales y `loading="lazy"`, y **debajo, en texto HTML real**, los festivos y no lectivos desde un archivo de datos. Añadir el aviso "sujeto a modificaciones por la Comunidad de Castilla-La Mancha o el Ayuntamiento de Carranque". Datos ya en `src/data/calendario.ts`. **Botón para descargar el calendario como imagen JPG** (atributo `download`; JPG porque lo abre cualquier galería), para que las familias lo guarden en el móvil: recuadro "Tenedlo siempre a mano" con "Guardar calendario" y "Ver PDF" con forma de **hoja de taco de calendario** (anillas de espiral, un poco girada y el reloj de juguete en la esquina; colores "azul en tonos": franja azul pastel, título, botón y enlace en azul oscuro `arbol-azul-texto`, y el reloj en naranja como único acento; descartada la "nota pegada con cinta"). Las imágenes se sacan del PDF (ver comentario de `calendario.ts`).
- **FAQ:** 8 preguntas, aprobadas de momento (adaptación; horarios y ampliaciones; comida y alergias; cómo solicitar plaza o visita; matrícula a mitad de curso; cómo me informan del día a día; descuentos y cheque guardería; julio y vacaciones). En `faqs.ts` como array `{ pregunta, respuesta }`.
- **Reseñas (decisión actual: sin API).**
  - Botón **"Ver reseñas en Google"** con **aspecto de botón de Google** (blanco, borde gris fino, sombra suave y la "G" de colores; `.boton-google` e `IconoGoogle`), que enlaza a la ficha: `site.redes.googleFicha` = `https://share.google/ti3i8cFbNmFIzzJRi` (ficha comprobada: Escuela Infantil Árbol de nubes, C. Orión 38, Carranque).
  - Sección **"Lo que dicen las familias"** (no "Reseñas de Google"): 5 testimonios **fijos**, elegidos por las dueñas, en `src/data/testimonios.ts` como `{ texto, autor, permiso }`. **En Inicio salen 4** (2026-11-17: en el móvil, tantas aburrían): los que no están ya en otra sección (`estaEnUnaSeccion`, `destacados.ts`); el de la adaptación, solo en Familias. Solo texto real en HTML (no capturas), **sin nombre ni foto** (autor genérico, como "Una familia de la escuela"), sin estrellas ni logo de Google en los testimonios (el logo solo va en el botón). Los testimonios van en **tarjetas con forma de reseña, apiladas** (algo giradas y desplazadas a un lado y a otro, caen al verse; `Cita.tsx` y `Testimonios.tsx`, rediseño de 2026-11-16): avatar con un juguete o un dibujo de las ventanas de las aulas (nunca una persona), el autor genérico y "Reseña en Google" en texto. En escritorio, la frase de Google y el botón a la izquierda, fijos al bajar. Ya no cuelgan de ramas. Los textos están recortados con "…" o "[…]" respetando las palabras originales; **no retocarlos ni reescribirlos**. No aparecen nombres de educadoras.
  - **El componente solo muestra los testimonios con `permiso: true`.** La escuela avisa a las familias y de momento están todos en `true`; si alguna familia se opone, se pone `false` y desaparece de la web.
  - **No escribir cifras fijas de Google** (como "97 reseñas" o "5,0"): se quedan desfasadas. Usar formulaciones siempre ciertas, como "Más de 90 reseñas de familias en Google".
  - **Opcional más adelante:** Google Places API. Devuelve máximo 5 reseñas (las elige Google por relevancia), requiere clave de API con facturación activada, atribución a Google, presupuesto con alerta y una función de Netlify que haga de intermediaria (la clave **no puede ir en el código del navegador**). Con plan B obligatorio: si falla, solo el botón. Antes de cachear respuestas, revisar las condiciones de Google sobre almacenar datos.
- **Equipo educativo:** datos en `src/data/equipo.ts` (Cristina, Beatriz y Olga: directoras y educadoras infantiles, tutoras de aula; Lorena: maestra y apoyo de aula). Sección **"Nuestro equipo"** (2026-11-18, `Equipo.tsx`): la **foto de grupo original** (`fotoEquipo`, delante del árbol pintado de la pared; el montaje con el fondo de la entrada se probó y quedaba falso) y debajo **solo los nombres**, cada uno bajo su persona (`enLaFoto` en `equipo.ts`, en % del ancho de la foto) y en un color del árbol (naranja, verde, coral, azul). Sin cargos (siguen en los datos: Presentacion los usa) y sin panel de color.
- **"Un día en la escuela":** en suspenso, no construir hasta que se decida.

### Contacto
- Vías: WhatsApp, teléfono, email, formulario y mapa.
- **Redes (Instagram `e.i.arboldenubes` y Facebook):** solo **iconos con enlace** al perfil, **sin widgets ni feeds incrustados** (no cargar scripts de Meta: rendimiento, cookies y fotos de niños). Un único componente `SocialLinks`, que lee los enlaces de `src/data/site.ts`, reutilizado en **hero** (pequeño y discreto, sin competir con "Solicitar visita"), **menú de móvil**, **contacto** y **footer**.
- Cada icono: `aria-label` claro (por ejemplo, "Instagram de la escuela, se abre en otra pestaña"), `target="_blank"` y `rel="noopener noreferrer"`.
- **Sin barra fija en móvil (Llamar y WhatsApp):** descartada por Antonio el 2026-11-16 (se come la pantalla y es peor para el usuario); `BarraMovil.tsx` borrado. No volver a proponerla. "Llamar" (menú, cierre, footer) usa siempre un teléfono que no es el de WhatsApp (`telefonoLlamadas`).
- **Mapa:** se carga **al pulsar "Ver el mapa"** (sin cookies de Google hasta entonces, sin banner). Antes se ve un plano de papel doblado dibujado por nosotros, con el árbol del logo marcando la escuela (`DondeEstamos.tsx`).
- **Diseño de Contacto (2026-11-13):** el formulario es una **hoja de cuaderno** (cuadrícula, margen rojo, agujeros de anilla; `.cuaderno`) que se rellena **como una carta** ("Hola, me llamo ___…"), con el sello de matrícula estampado en la esquina; las otras vías (WhatsApp, teléfonos, email) en **tipografía grande**, sin tarjetas. Nada de cajas redondeadas genéricas.

### Formulario "Solicitar visita"
- **Netlify Forms**, aviso por **email** (no por WhatsApp). El destinatario se configura en el panel de Netlify (Forms > Notifications).
- Como es una app React: **formulario "fantasma" en `index.html`** con el mismo `name` y los mismos campos, `data-netlify="true"`, campo oculto `form-name`, y **honeypot** (`netlify-honeypot`). El envío real va con `fetch`.
- Campos mínimos: nombre, teléfono o email, fecha de nacimiento del peque (o fecha prevista si aún no ha nacido; las dueñas, 2026-11-16: con la edad las familias se equivocaban de aula) y mensaje. **No pedir datos de salud ni alergias.**
- **Validación en tiempo real** con avisos de error y de envío correcto. Botón deshabilitado mientras envía (evita dobles envíos): durante ~1 s muestra un oso rodando una pelota y texto de carga.
- **Casilla de consentimiento sin marcar**, enlazada a la política de privacidad, y texto de información básica debajo. El botón no se activa sin ella.

### Páginas y footer (confirmado)
- **Inicio** (hero, foto de la fachada, quiénes somos, resumen con enlaces a las páginas, testimonios), **La escuela** (aulas, instalaciones, galería "Así es la escuela", cocina y equipo), **Horario y calendario** (jornada, ampliaciones, desayuno y merienda, curso de septiembre a junio con julio opcional, matrícula todo el año y calendario escolar), **Familias** (adaptación, Baby Control, actividades en el corcho, descuentos y cheque guardería, FAQ), **Contacto** (datos, formulario y mapa), Aviso legal, Política de privacidad y 404. Todo en `src/data/paginas.ts`.
- **"Matrícula abierta todo el año"** se destaca en la descripción de Inicio, y con el sello junto al formulario de Contacto.
- Footer: títulos de colores del árbol (Páginas naranja, Contacto morado, Horario azul, Síguenos verde; Información legal en tinta, sin color; versiones oscuras `arbol-*-texto` para el contraste) e iconos de contacto todos del mismo color. Contenido: logo y dirección, contacto, horario, redes, enlaces legales, línea "Centro autorizado por la Consejería… · código de centro", © y razón social, y raíces del árbol.

### Menú
- **El header se esconde al bajar y aparece al subir** (`useHeaderEscondido.ts`), en toda la web y en todos los dispositivos: se gana su alto para el contenido. Arriba del todo, siempre visible. En el hero de Inicio también se esconde al bajar, pero **al dejar de hacer scroll vuelve a salir**. Visible con el menú abierto o con el foco del teclado dentro. Solo `transform`.
- **Saltos a una sección con ancla** (`/contacto#solicitar-visita`, `ScrollArriba.tsx`): el título de la sección queda pegado arriba y el foco pasa a la sección (así el header, que tenía el foco del botón pulsado, se esconde y no tapa el título).
- **Escritorio:** enlaces con el color de la página activa y la nube "Solicitar visita" a la derecha. Cada enlace con **su juguete de la pizarra** (relleno, en su color intenso) sentado en la esquina: fijo en la página activa y asomando con un bote al pasar el ratón o con el foco del teclado en las demás. Posición absoluta: no ensancha la barra.
- **Qué menú sale:** desde **992 px** (`--breakpoint-menu: 62rem`, variante `menu:`), la barra de escritorio (mide ~964 px y cabe); por debajo, la pizarra. Así, las **tablets en horizontal** (desde 1024 px) ven la barra y **en vertical** (744-834 px), la pizarra. Si la barra crece, se vuelve a medir.
- **Móvil y tablet en vertical (pantalla completa): una pizarra de tiza** que parezca real (referencia de Antonio, 2026-11-12). El menú de escritorio no se toca.
  - Desde 640 px (`sm:`, iPad mini en vertical incluido) todo es un 40 % más grande, para que no se quede del tamaño de un móvil.
  - La decoración (pájaros, nubecita) va **anclada a su fila** (Inicio y La escuela) y se dibuja **después del texto de su fila**: el orden de escritura es siempre de arriba abajo y de izquierda a derecha.
  - Al abrir, el foco va al propio panel (no a la X: Safari le pintaba el anillo de foco al tocar).
  - Pizarra con grano y manchas de borrado; tiza con bordes irregulares y huecos. Tipografía **Patrick Hand** (alojada con Fontsource).
  - Título "Árbol de nubes" en **tiza verde** con subrayado que se afina. **Sin** las rayas ni las estrellas de la referencia: otra decoración (propuesta: pájaros y nubecitas de tiza).
  - Cada página con su **juguete dibujado a tiza** (**solo contorno, sin rayado dentro**: más limpio) en el color de su página: Inicio osito, La escuela bloque, Horario y calendario reloj, Familias una **familia de patos mirando de frente** (mamá y dos patitos, picos y patas naranjas), Contacto teléfono de juguete. Ojos en tiza blanca. La página activa, un **borrón de tiza de color** con el borde repasado.
  - Nube "Solicitar visita" de contorno azul, sin rayas encima. **Suelo de nubes** de contorno blanco, con "Llámanos" (subrayado verde) a la izquierda y redes a la derecha.
  - **Efecto:** sin cascada; todo se **escribe a tiza de arriba abajo y de izquierda a derecha**, como si alguien lo escribiera. La nube se pinta a la izquierda y, al terminar, se desliza a la derecha. Con movimiento reducido, todo aparece ya pintado.
  - **Duración:** la **primera vez** que se abre en la visita, **3 s** (`DURACION_PRIMERA_VEZ` en `MenuPizarra.tsx`; la velocidad la aplica `--escala-tiza` en `index.css`). Las **siguientes, ya pintado**, con un fundido de solo 0,12 s del panel entero (`.menu-entra` con `--entrada-menu`; Antonio, 2026-11-17: de golpe se notaba brusco; el fundido antiguo de 0,28 s, `.pizarra-entra`, se borró): quien ya lo ha visto se cansaría, y acelerado queda atropellado. Se recuerda en `sessionStorage` (dura lo que la pestaña; no es una cookie).
  - **Entrada en dos tiempos, solo la primera vez** (2026-11-17, al tocar "tardaba un pelín"): sale YA el fondo de la pizarra con un fundido de 0,2 s (`.menu-entra`) y el contenido se monta dos fotogramas después (`conContenido` en `MenuPizarra.tsx`). Además, el código del menú y la letra de tiza se descargan tras cargar la página (en móvil y tablet), y ya descargado se usa sin `Suspense` (React esperaba ~300 ms): `Header.tsx`.
  - Mientras está abierto, `theme-color` de pizarra para que las barras del navegador no rompan el efecto.
  - Osito (Inicio) y teléfono (Contacto) un poco girados, como dibujados a mano.
  - Tamaños verticales **en proporción al alto de la pantalla** (`min(…, …svh)`): el tope es el tamaño del iPhone Pro Max, y en Safari (barras) o en móviles pequeños todo se encoge para que la nube nunca se monte sobre el suelo. Comprobado a 440 × 750 y a 375 × 550.
  - Mientras está abierto, también el fondo de la página pasa a color pizarra: el Safari del iPhone tiñe su barra de arriba con él (no con `theme-color`).
- El panel del menú va **fuera del `<header>`** (el `transform` con el que se esconde el header haría que se midiera respecto a él).
- **Header con fondo crema opaco, sin `backdrop-blur`** (2026-11-17, auditoría de Impeccable): se ve igual, sin el velo de las fotos, y el móvil no recalcula el desenfoque en cada fotograma del scroll.

### Cierre de las páginas
- **"Ven a conocer la escuela"** (`Cierre.tsx`): antes del footer en **todas las páginas menos Contacto** (ya tiene el formulario), las legales y la 404. Es **una pizarra de aula como la 404** (`MarcoPizarra.tsx`: marco de madera y pollete con tizas y borrador) escrita a tiza: la invitación y la matrícula abierta, **la dirección con "Cómo llegar"** (enlace a Google Maps, en tiza morada), la nube "Solicitar visita" y **Escríbenos (email, no WhatsApp: las dueñas prefieren el correo)** y Llamar como botones de tiza (`.boton-tiza`); a la derecha, el osito a tiza (en móvil, pequeño en la esquina de abajo a la derecha, lo último que se dibuja, y no sale por debajo de 360 px; en tablet en vertical, pequeño en la esquina de arriba a la derecha, junto al título). **Se escribe al aparecer en pantalla** (antes, en pausa: `.pizarra-pausada`) **y solo la primera vez en la visita**; en las demás páginas sale ya pintada (2026-11-17, `vistoEnLaVisita.ts`). El **borrador** del pollete (aquí y en la 404) tiene el **mango rojo apagado** (coral tirando a madera): de madera no se veía. Texto en borrador.

### Fotos de la escuela
- **Las envían las dueñas.** Todas en `src/data/fotos.ts` (título, `alt`, medidas y encaje). **Si una lista está vacía, no se pinta** (nunca un recuadro vacío). Mejor sin niños o sin caras reconocibles; las caras de las fotos pegadas en las paredes se **difuminan** al generarlas (`FOTOS_DIFUMINAR` en el script). Las del iPhone (HEIC) se convierten con `heic-convert` (sharp no trae ese códec), sin los metadatos (GPS).
- **"Así es la escuela"** (La escuela, `GaleriaEscuela.tsx`): 7 espacios (sin la entrada, 2026-11-17) en una rejilla de filas fijas que **cuadra sin huecos** en escritorio (3 columnas) y tablet (2): psicomotricidad en grande, el baño alto y **siempre a la derecha**, el patio de los toboganes a lo ancho y el resto normales (el `encaje` de cada foto; la rejilla va en modo `grid-flow-row-dense` para rellenar el hueco sin cambiar el orden del visor; si se añade o quita una, revisarlo).
- **Foto de la entrada arriba de La escuela** (2026-11-17, sustituye a la nube con juguetes, que era provisional): en la cabecera (`CabeceraPagina`, prop `foto`; `fotoCabeceraEscuela` en `fotos.ts`), en todos los tamaños: a la derecha de las cifras desde 1280 px y debajo por debajo de eso (`max-w-xl`, alineada con el texto). Ya no va en la galería (2026-11-17: se veía dos veces).
- **"Algunas actividades"** (Familias, `Actividades.tsx`): 5 fotos impresas con borde blanco, giradas, con chincheta de color y la franja blanca de abajo **sin título** (2026-11-17; el título sale en el visor), **pinchadas en un corcho** (`.corcho`, textura generada por el script). El corcho solo aquí.
- **Visor de fotos** (`VisorFotos.tsx`, compartido): `<dialog>` con las fotos en una tira con scroll-snap (en móvil se pasan con el dedo), flechas del teclado y **lápices de colores con el `<` `>` pintado** (`LapizFlecha.tsx`, reutilizable): a los lados donde caben (variante `flechas-lado:` de `index.css`: desde 1024 px o móvil en horizontal) y, si no, debajo, junto al título. Sin bucle.
- **Fachada definitiva** (2026-11-20, de frente, 4:3; sustituye a la retocada del 19): en Inicio, en grande bajo el hero (desde sm, recortada sobre todo por abajo para no cortar el tejado: `sm:object-[50%_15%]`), y en Contacto **mientras carga el mapa** de Google. Si se cambia, se cambia en `fotos.ts` y sale sola en los dos sitios.

### Página 404
Una **pizarra de aula "de las de antes"**: marco de madera (degradados, sin imágenes) y bandeja con tizas y borrador. Escrito a tiza con las piezas del menú (`Tiza.tsx`): "404", el título "Esta página no está en la pizarra" y el texto se escriben **palabra a palabra** (`TextoTiza`: así, aunque el texto ocupe varias líneas, va de arriba abajo y de izquierda a derecha).
- **"Alfombra mágica"** (idea de Antonio): el osito, con una interrogación, va sentado sobre la nube "Volver al inicio". Se dibujan a la izquierda de la pizarra, cruzan volando meciéndose (~1,5 s) y **aterrizan en el centro y se quedan quietos** (es el botón: si no parara costaría pulsarlo y obligaría a poner pausa, WCAG 2.2.2). Todo dura ~4,6 s; con movimiento reducido, todo ya escrito y en su sitio.

## 9. Legal

- **Aviso legal:** razón social, CIF, domicilio, email, **datos del Registro Mercantil** (Registro Mercantil de Toledo, hoja TO-45048, tomo 1746, folio 132; viven en `site.ts`) y **datos de la autorización de centro** (tipo, código de centro y organismo; ya están en `site.ts`).
- **Política de privacidad:** responsable, finalidad (responder a la solicitud de visita), base legal (consentimiento), conservación, destinatarios (**Netlify** como proveedor) y derechos.
- **Política de cookies:** solo si hay cookies no esenciales (mapa de Google, reseñas). Si las hay, banner de consentimiento.
- **Hechas (2026-11-13):** los textos viven en `src/data/legal.ts` (construidos con los datos de `site.ts`) y las dos páginas usan la plantilla `PaginaLegal.tsx` (secciones numeradas y fichas de datos con líneas de puntos). La privacidad explica Netlify (formulario y alojamiento), Gmail, Google Maps al pulsar y el `sessionStorage` del menú (no es una cookie): con eso **no hace falta banner de cookies**. Al cambiar los textos, cambiar también la fecha `ACTUALIZADO`.
- Son borradores: la gestoría de la escuela da el visto bueno final.

## 10. Descartado (no volver a proponerlo)

- Tarifas y calculadora de precios (se informa en persona).
- Menú mensual en la web.
- Reservas con calendario (se usa "solicitar visita").
- Documentos para pedir plaza y aparcamiento.
- Aviso por WhatsApp desde el formulario.

## 11. Accesibilidad, SEO y calidad

- Objetivo: **Lighthouse alto**, sobre todo accesibilidad. Evitar CLS (tamaños de imagen explícitos). Se mide sobre la versión de producción (Netlify + PageSpeed Insights), nunca sobre `npm run dev`.
- **Todo se carga cuando hace falta** (2026-11-17): cada página en su propio archivo (`cargaPaginas.ts`, rutas `lazy`), con precarga al ir a pulsar un enlace (`usePrecargaEnlaces.ts`); el menú de pizarra, al ir a abrirlo; lo de debajo del hero de Inicio se monta justo después del primer dibujado (`Diferido.tsx`); las fotos en dos tamaños (800 y 1400 px, `srcset`/`sizes`) y con `loading="lazy"`.
- **Lo que corre en cada fotograma del scroll, lo más barato posible** (2026-11-17, la web iba "petada" en el iPhone): nunca cambiar estado de React si el valor no cambia (el header se volvía a pintar 60 veces por segundo: `useHeaderEscondido.ts`); nada de `getBoundingClientRect` ni `querySelector(':focus-visible')` en cada fotograma (medir una vez y al cambiar el tamaño); saltarse lo que ya ha terminado (ramas del árbol). Medido con el móvil simulado 4 veces más lento: el JavaScript del scroll bajó de ~8,7 s a ~2,9 s en Inicio.
- **Textura de tiza** (`.tiza`, `index.css`): **máscara CSS** con `src/assets/textura-tiza.webp` (la genera `npm run imagenes`, tarea `texturaTiza`: el mismo ruido que tenía el filtro). **Descartado el filtro SVG** con `feTurbulence` (2026-11-17): Safari (y Chrome en iPhone, que es Safari por dentro) lo calcula con el procesador y el menú se paraba 177 ms al abrirse en el iPhone; con la máscara, 46 ms (Android lo hacía con la tarjeta gráfica, por eso allí iba bien). Solo se pierde la ondulación de 2 px del borde, que no se distingue a tamaño real. **Descartado también** el ruido en imagen dentro del filtro (`feImage`): en Safari del iPhone hacía desaparecer el texto a tiza.
- **Fondo de las pizarras** (`.pizarra::before`, `index.css`): en su propia capa (`will-change`), detrás del texto. En Safari, el grano y los degradados se volvían a pintar con cada palabra que se escribía (el menú tardaba en abrirse). Se ve igual (comparado píxel a píxel).
- **Revisión en navegadores (2026-11-17):** WebKit (Safari) instalado para Playwright. Para probar en local con WebKit usar `vite preview`, no `scripts/servidor-pruebas.mjs`: la cabecera `upgrade-insecure-requests` le hace pedir todo por https (en Netlify no pasa). Revisado en Safari (iPhone 15 Pro Max, iPhone SE, iPad Mini, iPad horizontal, escritorio) y Chrome (Android y escritorio): sin errores, sin desbordes, tiza terminada, header y menú bien.
- **Pantallas muy grandes:** desde 1800 px de ancho la web entera crece en proporción (letra base 18 px; desde 2400 px, 20 px; `index.css`) y el hero tiene topes mayores (variante `3xl:`).
- **Responsive de verdad, también en portátiles bajos (13", ~1280×620 de área visible):** los espacios verticales grandes van en proporción al alto de la pantalla (`clamp(…, …svh, …)`), no fijos; lo que va en fila (cabecera de sección con su entradilla, footer en 5 columnas) solo desde 1280 px. Comprobar siempre en móvil (iPhone Pro Max), tablet, portátil bajo (1024×600 y 1280×620) y monitor.
- Botones fáciles de pulsar con el pulgar, **foco visible**, estructura semántica, decoración con `aria-hidden`, enlace **"Saltar al contenido"**.
- Tests automáticos con **Playwright + axe**.
- **Metadatos** (título y descripción) en todas las páginas, favicon e imagen para compartir.
- **SEO desde los datos (2026-11-18):** la dirección de la web (`site.web.url`, con `TODO` hasta el dominio definitivo) y el interruptor `site.web.indexar` viven en `site.ts`. `src/data/seo.ts` construye robots.txt, sitemap.xml (sin la 404) y los datos estructurados JSON-LD (`ChildCare` + `Preschool`: dirección, teléfono, horario de lunes a viernes, redes); el plugin `seoDesdeLosDatos` de `vite.config.ts` los genera al compilar y mete en `index.html` el título, la descripción, el canonical, las `og:*` y el JSON-LD (**en `index.html` no se escribe ningún dato a mano**). `useMetadatos.ts` pone el canonical de cada página; la 404 (`indexar: false` en `paginas.ts`) va sin canonical y con `noindex`. **Mientras `indexar` esté en `false`, todas las páginas llevan `noindex`**. Al publicar con el dominio: cambiar `web.url`, poner `indexar: true`, pasar la Prueba de resultados enriquecidos de Google y dar de alta el sitemap en Search Console.
- **Un HTML por página (opción A, 2026-11-26):** al terminar el build, `seoDesdeLosDatos` (`closeBundle` + `cabeceraDe`) copia `index.html` como archivo suelto por página (`dist/contacto.html`, no `contacto/index.html`: con carpeta Netlify redirigiría a `/contacto/`) con su título, descripción, canonical, `og:*` y robots. Sin archivo: Inicio y la 404. Motivo: Search Console avisó de "Página alternativa con etiqueta canónica adecuada", porque el HTML de todas las páginas llevaba el canonical de Inicio y Google le hace caso antes que a React. Robots: `max-image-preview:large` en las indexables (`contenidoRobots` en `seo.ts`, la usan el build y `useMetadatos`). El aviso "Página con redirección" es correcto (http y www → https sin www).
- **Precarga del árbol del logo** (`<link rel="preload" … fetchpriority="high">` en `index.html`): es el LCP del hero y la sombra del árbol de fondo; sin ella, el navegador no lo pedía hasta que React había arrancado (LCP en móvil lento simulado: 8,4 → 5,7 s).
- **CSS dentro del HTML** (2026-11-19, plugin `cssDentroDelHtml` de `vite.config.ts`): al compilar, el CSS va en un `<style>` de `index.html` en vez de un archivo aparte (PageSpeed: "solicitudes que bloquean el renderizado", ~310 ms en móvil). Se ve igual. Funciona porque la CSP permite estilos en el HTML (`style-src 'unsafe-inline'`). Notas oficiales justo antes (Inicio, 2026-11-19): móvil 95/100/100/69, escritorio 100/100/100/69.
- **Fachada en cuatro tamaños** (680, 800, 1120 y 1400 px; `tamanosExtra` en `fotos.ts`): el navegador baja el justo para cada pantalla.
- Cualquier página **empieza siempre arriba del todo** al navegar, y no da error al refrescar o abrir directamente.
- Enlaces externos con `target="_blank"` y `rel="noopener noreferrer"`.

## 12. Antes de publicar

1. Buscar `TODO` en todo el proyecto: ninguno visible.
2. Pasar Playwright + axe y Lighthouse.
3. Entonces sí: usar **Impeccable**, **Chrome DevTools MCP** y **claude-seo** para pulir y revisar el SEO.
4. Revisar `README.md` (arquitectura, decisiones de diseño, APIs externas, rendimiento).
