// Medianoche del 26 de octubre en Bolivia (UTC-4), sin importar la zona del celular.
export const DESBLOQUEO = Date.parse("2026-10-26T00:00:00-04:00");

export function faltante(ahoraMs) {
  const resto = Math.max(0, Math.ceil((DESBLOQUEO - ahoraMs) / 1000));
  return {
    d: Math.floor(resto / 86400),
    h: Math.floor((resto % 86400) / 3600),
    m: Math.floor((resto % 3600) / 60),
    s: resto % 60,
    listo: resto === 0,
  };
}
