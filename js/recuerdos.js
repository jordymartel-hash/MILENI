// Recuerdos que ella (o él) agregan al álbum. Se guardan en Supabase ya cifrados en el navegador:
// la tabla solo ve texto ilegible y la llave viene dentro de secreto.bin.
import { importarLlave, sellar, abrir } from "./cripto.js";

const URL_API = "https://lpmbbhyjgbbnrjqfxxrn.supabase.co/rest/v1/recuerdos";
const LLAVE_PUBLICA = "sb_publishable_EDzHNLrCuNUKj_7JBONVgw_iNJFpXj8";
const CABECERAS = { apikey: LLAVE_PUBLICA, "Content-Type": "application/json" };

export async function conectar(llaveBase64) {
  const llave = await importarLlave(llaveBase64);

  return {
    // Filas que no se pueden abrir (basura de terceros) se ignoran en silencio.
    async listar() {
      const r = await fetch(`${URL_API}?select=id,creado,datos&order=creado.asc`, { headers: CABECERAS });
      if (!r.ok) throw new Error("red");
      const filas = await r.json();
      const abiertos = await Promise.all(
        filas.map((f) => abrir(f.datos, llave).then((d) => ({ id: f.id, creado: f.creado, ...d }), () => null)),
      );
      return abiertos.filter(Boolean);
    },
    async guardar(recuerdo) {
      const r = await fetch(URL_API, {
        method: "POST",
        headers: { ...CABECERAS, Prefer: "return=representation" },
        body: JSON.stringify({ datos: await sellar(recuerdo, llave) }),
      });
      if (!r.ok) throw new Error("red");
      const [fila] = await r.json();
      return { id: fila.id, creado: fila.creado, ...recuerdo };
    },
  };
}

// Achica la foto del celular (pueden ser 5 MB) a JPEG de 1000 px máx.
export async function prepararFoto(archivo) {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(bitmap.width * escala);
  lienzo.height = Math.round(bitmap.height * escala);
  lienzo.getContext("2d").drawImage(bitmap, 0, 0, lienzo.width, lienzo.height);
  bitmap.close?.();
  return lienzo.toDataURL("image/jpeg", 0.8);
}
