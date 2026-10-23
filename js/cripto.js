// Cifrado del contenido privado: PBKDF2-SHA256 → AES-GCM 256.
// Formato: salt(16) | iv(12) | ciphertext. Funciona en navegador y en Node 22.
const ITERACIONES = 600000;
const subtle = globalThis.crypto.subtle;
const codificar = new TextEncoder();

export function normalizar(usuario, clave) {
  return `${usuario.trim().toLowerCase()}:${clave.trim().toLowerCase()}`;
}

async function derivarLlave(frase, salt) {
  const base = await subtle.importKey("raw", codificar.encode(frase), "PBKDF2", false, ["deriveKey"]);
  return subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERACIONES },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function cifrar(texto, frase) {
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const llave = await derivarLlave(frase, salt);
  const datos = new Uint8Array(await subtle.encrypt({ name: "AES-GCM", iv }, llave, codificar.encode(texto)));
  const salida = new Uint8Array(28 + datos.length);
  salida.set(salt, 0);
  salida.set(iv, 16);
  salida.set(datos, 28);
  return salida;
}

export async function descifrar(bytes, frase) {
  try {
    const llave = await derivarLlave(frase, bytes.slice(0, 16));
    const plano = await subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(16, 28) }, llave, bytes.slice(28));
    return new TextDecoder().decode(plano);
  } catch {
    throw new Error("credenciales");
  }
}

// Recuerdos que ella agrega: llave AES cruda (viaja dentro de secreto.bin), sin PBKDF2 por fila.
// Formato: base64(iv(12) | ciphertext).
const aBase64 = (bytes) => {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};
const deBase64 = (texto) => Uint8Array.from(atob(texto), (c) => c.charCodeAt(0));

export const nuevaLlave = () => aBase64(globalThis.crypto.getRandomValues(new Uint8Array(32)));

export const importarLlave = (b64) =>
  subtle.importKey("raw", deBase64(b64), "AES-GCM", false, ["encrypt", "decrypt"]);

export async function sellar(objeto, llave) {
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const datos = new Uint8Array(await subtle.encrypt({ name: "AES-GCM", iv }, llave, codificar.encode(JSON.stringify(objeto))));
  const salida = new Uint8Array(12 + datos.length);
  salida.set(iv, 0);
  salida.set(datos, 12);
  return aBase64(salida);
}

export async function abrir(sello, llave) {
  const bytes = deBase64(sello);
  const plano = await subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(0, 12) }, llave, bytes.slice(12));
  return JSON.parse(new TextDecoder().decode(plano));
}
