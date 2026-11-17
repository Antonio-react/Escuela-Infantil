// Recordar que algo ya se ha visto en esta visita (el menú de pizarra, la pizarra del cierre…), para no repetir su
// animación: la primera vez entera y las siguientes, ya pintado. sessionStorage dura lo que la pestaña y no sale del
// navegador (no es una cookie). En modo privado puede fallar: entonces se trata como primera vez.
export function yaSeHaVisto(clave: string): boolean {
  try {
    return sessionStorage.getItem(clave) === '1'
  } catch {
    return false
  }
}

export function marcarVisto(clave: string) {
  try {
    sessionStorage.setItem(clave, '1')
  } catch {
    // Sin almacenamiento, la próxima vez vuelve a ir entero: no pasa nada.
  }
}
