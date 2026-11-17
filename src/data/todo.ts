// Los datos que faltan se marcan con 'TODO' (CLAUDE.md, sección 4) y nunca deben verse en la web.
// Los componentes preguntan aquí antes de pintar un dato que puede faltar (por ejemplo, el proyecto educativo).
export function tieneValor(valor: string): boolean {
  return valor.trim() !== '' && valor !== 'TODO'
}
