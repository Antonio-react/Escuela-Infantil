// Formas compartidas por varios componentes (un solo sitio: si cambia, cambia en todos).

// La nube "original" (la de las pizarras): bultos alrededor, también por debajo. La usan la nube de tiza
// (Tiza.tsx) y la nube rellena (Nube, en Decoracion.tsx: hero, nubecitas del árbol y cabeceras). Ocupa
// x 8-236 e y 0-108: ese es su viewBox ajustado (VIEWBOX_NUBE). La máscara del botón "Solicitar visita"
// (index.css) repite este mismo trazo, porque el CSS no puede importar de aquí.
export const CONTORNO_NUBE =
  'M22 66C10 52 22 36 40 42C44 24 66 16 82 28C90 6 126 0 142 22C152 10 178 12 188 32C210 28 232 46 222 64C236 76 224 98 204 92C196 104 168 106 156 96C144 106 112 106 102 96C90 104 62 104 56 92C34 98 12 84 22 66Z'
export const VIEWBOX_NUBE = '8 0 228 108'
