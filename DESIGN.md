---
name: Escuela Infantil Árbol de Nubes
description: Un aula de juguete luminosa y hecha a mano para que las familias confíen y pidan visita.
colors:
  verde: "#356943"
  ciruela: "#79386e"
  coral: "#b94750"
  mostaza: "#deab59"
  salvia: "#9da576"
  azul: "#7b95a9"
  logo-morado: "#6a2482"
  verde-hoja: "#5a8a1f"
  nube: "#94d1ea"
  arbol-naranja: "#fbe0b1"
  arbol-verde: "#d7e5a9"
  arbol-rojo: "#f3a3a5"
  arbol-morado: "#d7abcb"
  arbol-azul: "#b3dded"
  arbol-naranja-intenso: "#fcb436"
  arbol-verde-intenso: "#94c11f"
  arbol-rojo-intenso: "#e30613"
  arbol-morado-intenso: "#951b81"
  arbol-azul-intenso: "#2daae1"
  arbol-naranja-texto: "#8f5400"
  arbol-azul-texto: "#14688f"
  mostaza-texto: "#8a6a00"
  patito: "#ffcf2e"
  crema: "#fbf8f3"
  verde-suave: "#e0ece2"
  azul-suave: "#e2e8ec"
  coral-suave: "#f4e2e3"
  mostaza-suave: "#f6e7d1"
  ciruela-suave: "#e8e1e5"
  tinta: "#2b2830"
  pizarra: "#252826"
  tiza: "#f1eee6"
  madera: "#9a6a40"
  madera-oscura: "#6b4423"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Fredoka Variable, ui-rounded, Nunito Variable, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 600
    lineHeight: 1
  headline:
    fontFamily: "Fredoka Variable, ui-rounded, Nunito Variable, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.1
  title:
    fontFamily: "Fredoka Variable, ui-rounded, Nunito Variable, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Nunito Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  lead:
    fontFamily: "Nunito Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Fredoka Variable, ui-rounded, Nunito Variable, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1
  tiza:
    fontFamily: "Patrick Hand, Fredoka Variable, cursive"
    fontSize: "1.3rem"
    fontWeight: 400
    lineHeight: 1.2
rounded:
  papel: "2px"
  foto: "0.125rem"
  marco: "1rem"
  pastilla: "9999px"
spacing:
  gutter-movil: "1rem"
  gutter: "1.5rem"
  contenedor: "72rem"
  seccion: "clamp(3.5rem, 10svh, 7rem)"
  seccion-panel: "clamp(1.5rem, 5svh, 3.5rem)"
  cabecera-a-contenido: "clamp(2rem, 5svh, 3rem)"
components:
  button-primary:
    backgroundColor: "{colors.verde}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pastilla}"
    padding: "0 1.5rem"
    height: "3rem"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.verde}"
    typography: "{typography.label}"
    rounded: "{rounded.pastilla}"
    padding: "0 1.5rem"
    height: "3rem"
  button-secondary-hover:
    backgroundColor: "{colors.verde-suave}"
  button-visita:
    backgroundColor: "{colors.nube}"
    textColor: "{colors.tinta}"
    typography: "{typography.label}"
    padding: "1.125rem 2.5rem 0.625rem"
    height: "3.875rem"
  button-tiza:
    textColor: "{colors.tiza}"
    typography: "{typography.tiza}"
    rounded: "{rounded.pastilla}"
    padding: "0 1.2rem"
    height: "3rem"
  pizarra:
    backgroundColor: "{colors.pizarra}"
    textColor: "{colors.tiza}"
    rounded: "{rounded.marco}"
  cuaderno:
    backgroundColor: "{colors.white}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.papel}"
  folio:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.papel}"
---

# Design System: Escuela Infantil Árbol de Nubes

## Overview

**Creative North Star: "El aula de juguete"**

La web es un aula de verdad, contada con sus objetos: la pizarra de tiza, la hoja de cuaderno, el corcho con fotos pinchadas, el folio del calendario, los cubos de letras y los juguetes en el suelo de cada sección. Encima de todo, el árbol del logo: crece al fondo con el scroll, suelta pájaros y nubes desde el hero y echa raíces en el footer. Cada pieza es un dibujo propio en SVG o en CSS, nunca de librería ni una foto de banco.

El tono es **cálido, hecho a mano y sereno**: luminoso y pastel sobre crema, con mucho aire y letra redonda. El juego está en los detalles (un osito que asoma, un camión que sale con el formulario), no en el ruido. El movimiento es corto, suave y siempre con motivo; con movimiento reducido, todo queda fijo.

Lo que nunca debe parecer: **una plantilla genérica**, con tarjetas redondeadas iguales, iconos de librería y secciones intercambiables con las de cualquier otra web de empresa. Si un elemento podría estar en otra web sin cambiarle nada, no está terminado.

**Key Characteristics:**
- Cada superficie es un objeto del aula (pizarra, cuaderno, corcho, folio, cubo, pieza de puzzle), no una caja.
- Paleta sacada del logo: tres colores de marca para texto, pastel para fondos y los colores puros del árbol solo como acento.
- Fredoka redonda para títulos y botones, Nunito para leer y Patrick Hand solo en la tiza.
- Formas orgánicas: la nube de las pizarras como única silueta de nube, salientes de puzzle, esquinas de papel.
- Movimiento con motivo (llegar, aterrizar, escribir a tiza, caer como un dado), de ~1 s, y nada que se mueva solo sin parar.

## Colors

Pastel luminoso sobre crema, con tres colores de marca fuertes para el texto y los colores puros del árbol del logo como chispa.

### Primary
- **Verde Árbol** (`verde`): la marca. Títulos de página y de sección, botón principal con letra blanca (6,1:1 sobre crema).

### Secondary
- **Ciruela** (`ciruela`): segundo color de texto y anillo de foco del teclado (3 px). "Matrícula abierta" en el sello.
- **Coral** (`coral`): tercer color de texto (4,9:1), margen rojo del cuaderno, avisos cálidos.

### Tertiary
- **Colores del árbol**, en tres intensidades con papeles fijos:
  - Mezclados con crema al 35 % (`arbol-naranja`, `arbol-verde`, `arbol-rojo`, `arbol-morado`, `arbol-azul`): fondo de la página activa en los menús.
  - Puros (`arbol-*-intenso`): juguetes del menú y tizas de color. Nunca texto sobre crema.
  - Oscurecidos para texto (`arbol-naranja-texto`, `arbol-azul-texto`, `mostaza-texto`): títulos del footer, el taco del calendario y la fecha del formulario.
- **Azul Nube** (`nube`): solo la nube "Solicitar visita" (texto tinta, 8,7:1).
- **Un color por página**, con significado: Inicio naranja (el sol), La escuela verde (crecer), Horario azul (el día), Familias rojo (el cariño), Contacto morado (cercanía).

### Neutral
- **Crema** (`crema`): fondo de toda la web. En pantallas con ratón se aclara a `#fefcf9`, porque en monitor se veía más oscuro que en el móvil.
- **Tinta** (`tinta`): todo el texto de lectura. Los textos secundarios no bajan de tinta al 70 %.
- **Pasteles de sección** (`verde-suave`, `azul-suave`, `coral-suave`, `mostaza-suave`, `ciruela-suave`): fondos de bloque y de footer.
- **Pizarra y tiza** (`pizarra`, `tiza`, `madera`, `madera-oscura`): solo en las pizarras (menú de móvil, cierre de las páginas y 404).

### Colores de ilustración (excepciones aprobadas)
Los dibujos llevan sus propios colores dentro del SVG y no pasan por `@theme`: la rana y el ratoncito de `Asoma.tsx`, los juguetes de `Juguetes.tsx`, el lápiz de `LapizFlecha.tsx` y el camión de `CamionEnviar.tsx`. Son pintura de ilustración, no interfaz: nunca se usan como color de texto, fondo de bloque o botón. Fuera de los dibujos, también son excepción a propósito la madera del corcho (`#c99a63`, `#a8723f`), el gris del botón de Google (`#dadce0`, `#3c4043`) y las sombras negras translúcidas del marco y el pollete de la pizarra.

### Named Rules
**La regla del texto que se lee.** Sobre crema, solo verde, ciruela, coral, tinta y las variantes `*-texto` van como texto. Mostaza, salvia, azul y los colores puros del árbol son fondo o decoración, nunca letra.

**La regla de la paleta cerrada.** `--color-*: initial` borra la paleta de Tailwind: si un color no está en `@theme`, no existe. El único de fuera es el azul de Facebook en su icono.

## Typography

**Display Font:** Fredoka Variable (con ui-rounded y Nunito)
**Body Font:** Nunito Variable (con ui-sans-serif y system-ui)
**Label/Mono Font:** Patrick Hand, solo para la escritura a tiza

**Character:** Fredoka es redonda y amable, como letras de juguete, pero se lee seria en grande. Nunito acompaña con su terminación suave sin cansar en párrafos. Las tres fuentes van alojadas en el propio proyecto (Fontsource), nunca cargadas desde Google.

### Hierarchy
- **Display** (600, 3rem; 3,75rem desde 640 px, interlineado 1): títulos de página (h1), con `text-wrap: balance` y su inicial en una mini pizarra a tiza.
- **Headline** (600, 2,25rem; 3rem desde 640 px, 1,1): títulos de sección (h2) y las cifras de arranque de página.
- **Title** (600, 1,5rem, 1,25): títulos dentro de las secciones (aulas, cocina, preguntas).
- **Body** (400, 1rem, 1,5): texto de lectura, hasta unos 65-75 caracteres por línea (`max-w-xl` / `max-w-2xl`).
- **Lead** (400, 1,125rem): entradillas de sección y descripción de página, en tinta al 75-80 %.
- **Label** (600, 1,0625rem): botones, en Fredoka.
- **Tiza** (Patrick Hand, 400): todo lo escrito en las pizarras, con trazo irregular. Su tamaño va con la pizarra (1,6-2,2rem en el menú, el cierre, la 404 y "nació/nacerá" del formulario), fuera de la escala de arriba a propósito.
- **Etiqueta mínima** (12 px, `text-xs`): ningún texto baja de aquí.

### Named Rules
**La regla del título de la página.** El h1 de cada página va en el color de su página (La escuela verde, Horario y calendario azul, Familias coral, Contacto ciruela; `colorTitulo` en `paginas.ts`) y un escalón por encima de los títulos de sección (3rem, 3,75rem desde 640 px).

**La regla de los títulos que se turnan.** El color de cada título de sección (verde, ciruela, coral, azul o naranja oscuro) es distinto del título de la sección anterior, del h1 de su página y de su palabra destacada.

**La regla de la palabra subrayada.** Cada h2 destaca una sola palabra con un garabato de cera dibujado a mano (subrayado ondulado, círculo o chispas) en un color distinto por sección. No se repite la misma forma con el mismo color en una página.

## Layout

Columna centrada de 72rem (`max-w-6xl`) con 16 px de margen en móvil y 24 px desde 640 px. Las secciones respiran en proporción al alto de la pantalla (`clamp(3.5rem, 10svh, 7rem)` arriba y abajo; los bloques con fondo, `clamp(1.5rem, 5svh, 3.5rem)`), para que un portátil bajo de 13" no se llene de huecos ni un móvil se quede apretado.

Puntos de cambio: `sm` 640 px (todo un poco más grande, también la pizarra), `menu` 992 px (barra de escritorio por encima y pizarra a pantalla completa por debajo), `xl` 1280 px (cabeceras de sección en fila con su entradilla y footer en 5 columnas) y `3xl` 1800 px (la letra base sube a 18 px; desde 2400 px, a 20 px). Se comprueba siempre en iPhone Pro Max, tablet en vertical, 1024×600, 1280×620 y monitor.

Detrás del contenido, el árbol de fondo (verde liso al ~5 %, recortado con la silueta del logo) ocupa todo el alto. Sus ramas solo brotan en los huecos que el contenido deja libres.

## Elevation & Depth

Profundidad **de objeto físico**, no de interfaz. No hay escala de elevación: cada sombra imita cómo descansa ese objeto en concreto. El papel apenas se separa del crema, la esquina levantada del folio proyecta su sombra, el corcho tiene marco hundido y la pizarra cuelga con su madera. Las tarjetas planas sin objeto no llevan sombra.

### Shadow Vocabulary
- **Papel** (`0 0 0 1px rgb(43 40 48 / 0.06), 0 0.25rem 0.75rem rgb(43 40 48 / 0.08)`): folio del calendario. El contorno de 1 px evita que el blanco se pierda sobre el crema.
- **Cuaderno** (`0 0 0 1px rgb(43 40 48 / 0.05), 0 1rem 2.5rem rgb(43 40 48 / 0.1)`): la hoja del formulario, más separada porque es el objetivo de la web.
- **Esquina levantada** (`0.55rem 0.9rem 1rem rgb(43 40 48 / 0.3)`, caja girada 4°): solo bajo la esquina del folio.
- **Sombra de nube**: otra nube desenfocada dentro de su SVG, 6 px más abajo. Es una imagen fija: `filter: drop-shadow` parpadeaba en el iPhone al hacer scroll.
- **Botón de Google** (`0 1px 2px rgb(60 64 67 / 0.3), 0 1px 3px 1px rgb(60 64 67 / 0.15)`): imita el botón de Google y es la única sombra "de interfaz", a propósito.

### Named Rules
**La regla del objeto que descansa.** Una sombra solo existe si el objeto tiene un motivo físico para proyectarla. Si es una caja sin objeto, no lleva sombra: necesita otra forma.

## Shapes

Formas de objeto real, no de componente. El papel tiene esquinas casi rectas (2 px); el folio, además, curva la de abajo a la derecha en elipse (3,5rem × 0,9rem) para levantarla. Las tizas, el borrador y la bandeja de la pizarra llevan sus propios radios pequeños (0,25-0,375rem) por ser objetos dibujados. Las fotos llevan muy poco redondeo (`rounded-sm`), porque son fotos impresas o ventanas. El corcho y la pizarra van con marco de 1rem. Los botones son pastillas y la acción principal es una nube.

Hay una sola silueta de nube en toda la web (`CONTORNO_NUBE` en `formas.ts`, con bultos también por debajo): la usan el botón, el hero, las cabeceras y las pizarras. Las piezas de puzzle tienen el saliente clásico (cabeza redonda, cuello y hombros curvos). Lo dibujado a tiza tiene bordes irregulares y huecos; lo dibujado en color (juguetes, avatares), contorno limpio y relleno plano con poco degradado.

## Components

### Buttons
Táctiles y redondos: se hunden al pulsar (`scale(0.97)`) y solo cambian con el ratón encima en dispositivos con ratón.
- **Shape:** pastilla (9999px), 48 px de alto mínimo para el pulgar.
- **Primary:** verde con letra blanca, Fredoka 600. Al pasar el ratón, verde un 15 % más oscuro.
- **Secondary:** blanco con contorno verde de 2 px y letra verde. Al pasar el ratón, fondo verde suave.
- **Solicitar visita (firma):** nube azul cielo con texto tinta algo por debajo del centro (el cuerpo de la nube queda bajo). Sube 2 px con el ratón y se mece unos píxeles cuando la pantalla lleva quieta 3 s.
- **Tiza:** contorno de tiza de 2 px y letra Patrick Hand, solo sobre la pizarra.
- **Enviar:** un camión de bomberos dibujado (apagado, listo, enviando) que sale por la derecha al enviar. "Enviar" es texto real.
- **Animal asomando:** solo en "Conoce la app Baby Control" (rana) y "Guardar calendario" (ratoncito).
- **Charco (Baby Control):** el botón de la rana es un charco: azul del árbol suave (`arbol-azul`) con letra tinta, orilla irregular (cada esquina con un radio distinto, no pastilla), algo más de azul por dentro abajo y dos ondas blancas alrededor de la rana. No usa el azul de la nube, que es solo de "Solicitar visita".

### Inputs / Fields
El formulario es una **carta en una hoja de cuaderno**: "Hola, me llamo ___…". Los campos son huecos sobre la raya, sin caja. La cuadrícula manda: ninguna línea del papel cruza un texto. Cada dato lleva su color (nombre ciruela, fecha mostaza oscuro, contacto azul y mensaje verde), con `appearance: none` para que Safari no los dibuje a su manera. Las opciones de radio se rodean con un trazo de boli.

### Navigation
- **Escritorio (desde 992 px):** barra con enlaces en Fredoka. La página activa lleva fondo pastel de su color y su juguete sentado en la esquina; en las demás, el juguete asoma con un bote al pasar el ratón o con el foco. La nube "Solicitar visita" va a la derecha. El header se esconde al bajar y vuelve al subir.
- **Móvil y tablet en vertical:** pizarra a pantalla completa que se escribe a tiza de arriba abajo la primera vez (3 s) y después aparece ya pintada con un fundido. Cada página tiene su juguete a tiza, solo el contorno, y la activa, un borrón de tiza de color.

### Pizarra de aula (firma)
Marco de madera con vetas en degradado y un pollete con tizas y borrador que se pueden coger: se pinta con el ratón o con el dedo y el borrador borra. El texto se escribe a tiza palabra a palabra cuando aparece en pantalla. Se usa en el cierre "Ven a conocer la escuela" y en la 404.

### Objetos de papel (firma)
- **Folio:** el calendario, blanco con la esquina de abajo a la derecha levantada.
- **Taco de calendario:** recuadro "Tenedlo siempre a mano", con anillas de espiral y un poco girado.
- **Tarjetas de reseña:** apiladas, giradas y desplazadas, que caen al verse. El avatar es un juguete o un dibujo de las ventanas del aula, nunca una persona.
- **Corcho:** fotos impresas con borde blanco, chincheta y título a mano. Solo en Familias.

### Cubos y puzzle (firma)
Cubos de letras en SVG para las aulas, que caen como dados al verse. Piezas de puzzle encajadas para "Conoce la escuela", del color de su página y sin recuadro dentro.

## Do's and Don'ts

### Do:
- **Do** convertir cada bloque nuevo en un objeto del aula con sentido (papel, pizarra, juguete, cartel) antes que en una tarjeta.
- **Do** sacar cada color de `@theme` y respetar la regla del texto que se lee (4,5:1 en texto normal y 3:1 solo en texto grande).
- **Do** reutilizar `CONTORNO_NUBE` para cualquier nube y los juguetes de `Juguetes.tsx` para cualquier dibujo nuevo.
- **Do** animar solo `transform` y `opacity` (en la pizarra, también `stroke-dashoffset` y `clip-path`), en torno a 1 s, y dejarlo todo fijo con `prefers-reduced-motion`.
- **Do** dar a cada sombra un motivo físico y a cada foto, tamaño explícito.

### Don't:
- **Don't** parecer una plantilla genérica: nada de filas de tarjetas redondeadas iguales con icono, título y texto, ni iconos de librería en lugar de dibujos propios.
- **Don't** usar mostaza, salvia, azul ni los colores puros del árbol como color de texto sobre crema.
- **Don't** usar los colores de Tailwind (red-500, sky-100…) ni degradados decorativos fuera de los ya aprobados.
- **Don't** dibujar personas en avatares ni en testimonios.
- **Don't** hacer que algo se mueva solo más de 5 s seguidos ni poner animaciones en bucle.
- **Don't** crear una segunda forma de nube ni un segundo estilo de tiza.
