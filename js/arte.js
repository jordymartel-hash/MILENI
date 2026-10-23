// Ilustraciones hechas a mano en SVG. Pochita está basada en el peluche de Mileni.

export function pochita({ clase = "", flor = false, lengua = true } = {}) {
  // Basada en la referencia oficial: dos ojos grandes, hoja de motosierra en la frente,
  // asa del cordón arriba a la derecha, hocico, colmillos, rubor rayado y cola con punta triangular.
  const borde = "#4a2414";
  return `
<svg class="pochita ${clase}" viewBox="0 0 220 220" role="img" aria-label="Pochita">
  <ellipse cx="110" cy="210" rx="70" ry="7" fill="#000" opacity=".13"/>
  <g class="pochi-cola" stroke="${borde}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M184 172 Q206 170 206 142"/>
    <path d="M206 142 L194 124 L216 122 Z" fill="#f08a3c"/>
  </g>
  <g class="pochi-asa" fill="none" stroke-linecap="round">
    <path d="M128 52 Q150 22 178 34 Q196 44 186 90" stroke="${borde}" stroke-width="11"/>
    <path d="M128 52 Q150 22 178 34 Q196 44 186 90" stroke="#2b211d" stroke-width="6"/>
  </g>
  <path d="M110 46 C60 46 30 92 30 140 C30 182 62 200 110 200 C158 200 190 182 190 140 C190 92 160 46 110 46 Z"
    fill="#f4893b" stroke="${borde}" stroke-width="4"/>
  <path d="M48 160 Q60 186 96 192" stroke="#d9672a" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/>
  <g class="pochi-sierra">
    <path d="M100 86 C72 76 46 44 54 14 C66 2 92 10 106 40 C114 58 112 76 100 86 Z" fill="#a8a29e" stroke="${borde}" stroke-width="4"/>
    <path d="M74 22 C82 34 92 56 98 76" stroke="#efebe7" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/>
    <path d="M54 14 l-7 6 l8 3 l-8 6 l9 3 l-7 7 l10 2 l-6 8 l10 1 l-4 8 l10 0" fill="none" stroke="${borde}" stroke-width="4" stroke-linejoin="round"/>
  </g>
  <g class="pochi-ojos">
    <ellipse cx="70" cy="118" rx="21" ry="24" fill="#3a1c10" stroke="${borde}" stroke-width="3"/>
    <ellipse cx="150" cy="114" rx="24" ry="26" fill="#3a1c10" stroke="${borde}" stroke-width="3"/>
    <ellipse cx="70" cy="122" rx="14" ry="15" fill="#5a2c17"/>
    <ellipse cx="150" cy="118" rx="16" ry="17" fill="#5a2c17"/>
    <path d="M62 112 h8 M144 108 h9" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
  </g>
  <path d="M98 128 q-10 2 -10 10 q0 9 11 8 q5 -1 6 -5 q2 4 7 5 q11 1 11 -8 q0 -8 -10 -10 q-7 -1 -15 0 z" fill="#f79a52" stroke="${borde}" stroke-width="3"/>
  <ellipse cx="110" cy="131" rx="5" ry="3.5" fill="${borde}"/>
  <path class="pochi-boca" d="M96 148 q14 26 30 0 q-15 6 -30 0 z" fill="#7a2418" stroke="${borde}" stroke-width="3" stroke-linejoin="round"/>
  ${lengua ? `<path class="pochi-lengua" d="M103 157 q8 12 17 0 q-8 -4 -17 0 z" fill="#ff6f7d"/>` : ""}
  <path d="M100 149 l3 7 l3 -6 M117 150 l3 6 l3 -7" fill="#fff" stroke="${borde}" stroke-width="1.5" stroke-linejoin="round"/>
  <g class="pochi-rubor" stroke="#e2553a" stroke-width="2.5" stroke-linecap="round" opacity=".75">
    <ellipse cx="54" cy="150" rx="13" ry="7" fill="#ff8a6a" stroke="none" opacity=".5"/>
    <ellipse cx="170" cy="146" rx="13" ry="7" fill="#ff8a6a" stroke="none" opacity=".5"/>
    <path d="M46 147 l-3 6 M53 147 l-3 6 M60 147 l-3 6 M163 143 l-3 6 M170 143 l-3 6 M177 143 l-3 6"/>
  </g>
  <g fill="#f4893b" stroke="${borde}" stroke-width="3.5">
    <path d="M70 190 q-4 16 8 18 q14 1 14 -16"/>
    <path d="M128 192 q0 16 14 16 q12 -2 8 -18"/>
    <path d="M36 168 q-16 10 -6 26 q10 6 22 -6"/>
  </g>
  <path d="M76 202 v4 M84 202 v4 M136 202 v4 M144 202 v4" stroke="${borde}" stroke-width="2" stroke-linecap="round"/>
  ${flor ? `<g class="pochi-flor" transform="translate(150 176) rotate(18)">
    <path d="M0 0 L0 -40" stroke="#3f8a4d" stroke-width="5" stroke-linecap="round"/>
    <path d="M0 -20 q-14 -6 -16 -18 q12 2 16 14z" fill="#62b56f" stroke="#2f6b3a" stroke-width="2"/>
    ${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-56" rx="8" ry="12" fill="#ff8fb1" stroke="#b8406a" stroke-width="2" transform="rotate(${a} 0 -46)"/>`).join("")}
    <circle cx="0" cy="-46" r="6" fill="#ffd166" stroke="#b07a10" stroke-width="2"/>
  </g>` : ""}
</svg>`;
}

export function chibiMileni() {
  return `
<svg class="chibi" viewBox="0 0 240 300" role="img" aria-label="Mileni abrazando a Pochita">
  <defs>
    <linearGradient id="chibi-pelo" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#2a2230"/><stop offset="1" stop-color="#121016"/>
    </linearGradient>
  </defs>
  <ellipse cx="120" cy="292" rx="70" ry="7" fill="#000" opacity=".1"/>
  <path d="M46 110 Q40 40 120 30 Q200 40 194 110 L204 230 Q170 250 150 214 L90 214 Q70 250 36 230 Z" fill="url(#chibi-pelo)"/>
  <path d="M70 200 Q120 180 170 200 L182 290 L58 290 Z" fill="#fdfbf7" stroke="#e6ddd0" stroke-width="2"/>
  <path d="M104 196 L120 222 L136 196" fill="none" stroke="#d9cdbb" stroke-width="2"/>
  <path d="M120 222 L120 286" stroke="#e9e0d2" stroke-width="2" stroke-dasharray="3 5"/>
  <rect x="108" y="170" width="24" height="26" rx="10" fill="#e9b48f"/>
  <ellipse cx="120" cy="118" rx="62" ry="64" fill="#f1c4a1"/>
  <path d="M58 112 Q60 52 120 48 Q184 52 182 112 Q160 88 132 82 Q130 96 112 100 Q118 86 110 80 Q80 88 58 112Z" fill="url(#chibi-pelo)"/>
  <path d="M60 104 Q50 150 56 196 L70 196 Q64 150 68 112Z" fill="url(#chibi-pelo)"/>
  <path d="M180 104 Q190 150 184 196 L170 196 Q176 150 172 112Z" fill="url(#chibi-pelo)"/>
  <g class="chibi-ojos">
    <ellipse cx="96" cy="126" rx="10" ry="13" fill="#2b1a12"/>
    <ellipse cx="144" cy="126" rx="10" ry="13" fill="#2b1a12"/>
    <circle cx="92" cy="121" r="4" fill="#fff"/><circle cx="140" cy="121" r="4" fill="#fff"/>
    <circle cx="99" cy="131" r="2" fill="#fff" opacity=".7"/><circle cx="147" cy="131" r="2" fill="#fff" opacity=".7"/>
  </g>
  <path d="M84 108 q12 -6 22 0 M134 108 q12 -6 22 0" stroke="#2a2230" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse class="chibi-rubor" cx="84" cy="148" rx="11" ry="6" fill="#ff7a93" opacity=".5"/>
  <ellipse class="chibi-rubor" cx="156" cy="148" rx="11" ry="6" fill="#ff7a93" opacity=".5"/>
  <path d="M112 152 q8 7 16 0" fill="none" stroke="#9c4a3a" stroke-width="3" stroke-linecap="round"/>
  <g transform="translate(72 196) scale(.48)">${pochita({ lengua: true }).replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, "").replace(/id="pochi-/g, 'id="chibi-pochi-').replace(/url\(#pochi-/g, "url(#chibi-pochi-")}</g>
  <ellipse cx="78" cy="252" rx="16" ry="12" fill="#f1c4a1"/>
  <ellipse cx="162" cy="252" rx="16" ry="12" fill="#f1c4a1"/>
</svg>`;
}

const COLORES_FLOR = ["#ff8fb1", "#ffb3c7", "#c49bff", "#ffd166", "#ff9e7a", "#fff1f5"];

export function flor(tipo = 0, color = COLORES_FLOR[tipo % COLORES_FLOR.length]) {
  const tallo = `<path d="M50 140 Q46 110 50 70" stroke="#4f9d5d" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M49 110 q-22 -6 -26 -24 q20 2 26 20z" fill="#62b56f"/><path d="M51 96 q20 -8 26 -26 q-20 2 -26 22z" fill="#7cc487"/>`;
  const cabezas = [
    // margarita
    `${Array.from({ length: 10 }, (_, i) => `<ellipse cx="50" cy="38" rx="7" ry="18" fill="${color}" transform="rotate(${i * 36} 50 56)"/>`).join("")}<circle cx="50" cy="56" r="10" fill="#ffd166"/>`,
    // tulipán
    `<path d="M32 70 Q30 38 40 30 L50 44 L60 30 Q70 38 68 70 Q50 82 32 70Z" fill="${color}"/><path d="M50 44 L50 74" stroke="#000" stroke-opacity=".08" stroke-width="3"/>`,
    // rosa
    `<circle cx="50" cy="56" r="20" fill="${color}"/><path d="M50 56 m-12 0 a12 12 0 1 1 12 12 a8 8 0 1 1 -6 -10 a4 4 0 1 1 4 4" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="2.5"/>`,
  ];
  return `<svg class="flor" viewBox="0 0 100 140" aria-hidden="true">${tallo}${cabezas[tipo % cabezas.length]}</svg>`;
}

export function torta(velas = 23) {
  // Dos filas dentro del piso de arriba (x 64–196): la de atrás más alta.
  const posiciones = Array.from({ length: velas }, (_, i) => {
    const fila = i < 12 ? 0 : 1;
    const enFila = fila === 0 ? 12 : velas - 12;
    const idx = fila === 0 ? i : i - 12;
    const izq = fila ? 72 : 64;
    const der = fila ? 188 : 196;
    return { x: izq + ((der - izq) / (enFila - 1 || 1)) * idx, y: fila ? 96 : 84 };
  });
  return `
<svg class="torta" viewBox="0 0 260 260" role="img" aria-label="Torta con ${velas} velas">
  <ellipse cx="130" cy="236" rx="118" ry="16" fill="#fff" stroke="#f3d6de" stroke-width="3"/>
  <rect x="34" y="150" width="192" height="80" rx="14" fill="#ffb3c7"/>
  <path d="M34 166 q24 22 48 0 q24 22 48 0 q24 22 48 0 q24 22 48 0 v-16 h-192z" fill="#fff4f7"/>
  <rect x="54" y="100" width="152" height="56" rx="12" fill="#fde2b8"/>
  <path d="M54 112 q19 18 38 0 q19 18 38 0 q19 18 38 0 q19 18 38 0 v-12 h-152z" fill="#7b3f2a"/>
  ${[60, 100, 140, 180, 200].map((x, i) => `<circle cx="${x}" cy="${196 + (i % 2) * 14}" r="6" fill="#e63950"/>`).join("")}
  <text x="130" y="140" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="22" fill="#7b3f2a">Mileni</text>
  ${posiciones.map((p, i) => `
  <g class="vela" data-i="${i}" transform="translate(${p.x} ${p.y - 6})">
    <rect x="-3" y="0" width="6" height="22" rx="2" fill="${["#ff8fb1", "#8ecae6", "#ffd166", "#b8e0a8"][i % 4]}"/>
    <path class="llama" d="M0 -14 q7 8 0 13 q-7 -5 0 -13z" fill="#ffb703"/>
  </g>`).join("")}
</svg>`;
}

// ---------- Stickers chiquitos (todo dibujado, nada de emojis) ----------
const T = "#3b1830";
const envolver = (cuerpo, vb = "0 0 64 64") => `<svg viewBox="${vb}" aria-hidden="true">${cuerpo}</svg>`;

export const STICKERS = {
  corazon: (c = "#ff5c8a") => envolver(`<path d="M32 56 C8 40 4 26 10 16 C16 6 28 8 32 18 C36 8 48 6 54 16 C60 26 56 40 32 56Z" fill="${c}" stroke="${T}" stroke-width="3.5" stroke-linejoin="round"/><path d="M16 20 q4 -6 10 -4" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>`),
  estrella: (c = "#ffd23f") => envolver(`<path d="M32 4 L40 23 L60 24 L44 37 L50 58 L32 46 L14 58 L20 37 L4 24 L24 23Z" fill="${c}" stroke="${T}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="26" cy="32" r="2.6" fill="${T}"/><circle cx="38" cy="32" r="2.6" fill="${T}"/><path d="M28 38 q4 4 8 0" stroke="${T}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`),
  caramelo: (c = "#9b7bff") => envolver(`<path d="M6 20 L18 28 L18 36 L6 44 Z M58 20 L46 28 L46 36 L58 44 Z" fill="${c}" stroke="${T}" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="32" r="15" fill="#fff" stroke="${T}" stroke-width="3.5"/><path d="M21 26 q11 -6 22 6 M20 36 q12 -8 24 4" stroke="${c}" stroke-width="5" fill="none"/>`),
  cupcake: () => envolver(`<path d="M14 34 L20 58 H44 L50 34Z" fill="#4cb8ff" stroke="${T}" stroke-width="3.5" stroke-linejoin="round"/><path d="M24 36 L26 56 M32 36 V56 M40 36 L38 56" stroke="${T}" stroke-width="2" opacity=".5"/><path d="M10 34 q0 -12 10 -12 q2 -12 12 -12 q10 0 12 12 q10 0 10 12z" fill="#ffc2d6" stroke="${T}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="32" cy="8" r="5" fill="#d81e4a" stroke="${T}" stroke-width="3"/>`),
  flor: (c = "#ff8fb1") => envolver(`${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="32" cy="16" rx="10" ry="14" fill="${c}" stroke="${T}" stroke-width="3" transform="rotate(${a} 32 32)"/>`).join("")}<circle cx="32" cy="32" r="9" fill="#ffd23f" stroke="${T}" stroke-width="3"/>`),
  shuriken: () => envolver(`<path d="M32 2 L38 26 L62 32 L38 38 L32 62 L26 38 L2 32 L26 26Z" fill="#b9c2cf" stroke="${T}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="32" cy="32" r="6" fill="#fff" stroke="${T}" stroke-width="3"/>`),
  sello: () => envolver(`<circle cx="32" cy="32" r="28" fill="#d81e4a" stroke="${T}" stroke-width="3.5"/><circle cx="32" cy="32" r="21" fill="none" stroke="#ff8fae" stroke-width="2.5" stroke-dasharray="4 4"/><path d="M32 46 C18 37 16 29 20 23 C24 17 30 19 32 25 C34 19 40 17 44 23 C48 29 46 37 32 46Z" fill="#fff"/>`),
  nube: () => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 15 a4 4 0 0 1 .5-8 a5 5 0 0 1 9.5 1.5 a3.4 3.4 0 0 1 0 6.5z" fill="#cdeaff" stroke="${T}" stroke-width="1.8"/><path d="M8 18 l-1 3 M12 18 l-1 3 M16 18 l-1 3" stroke="#4cb8ff" stroke-width="2" stroke-linecap="round"/></svg>`,
};

// Íconos de las tarjetas "lo que me encanta"
export const ICONOS = {
  risa: envolver(`<circle cx="32" cy="32" r="26" fill="#ffd23f" stroke="${T}" stroke-width="3.5"/><path d="M18 26 q5 -6 10 0 M36 26 q5 -6 10 0" stroke="${T}" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M18 36 q14 18 28 0z" fill="#7a2418" stroke="${T}" stroke-width="3" stroke-linejoin="round"/><path d="M8 30 q-4 8 2 12 M56 30 q4 8 -2 12" stroke="#4cb8ff" stroke-width="4" fill="none" stroke-linecap="round"/>`),
  hielo: envolver(`<rect x="12" y="12" width="40" height="40" rx="9" fill="#cdeaff" stroke="${T}" stroke-width="3.5"/><path d="M18 20 h10" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cx="26" cy="34" r="2.6" fill="${T}"/><circle cx="38" cy="34" r="2.6" fill="${T}"/><path d="M27 41 q5 4 10 0" stroke="${T}" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="40" rx="4" ry="2.4" fill="#ff8fae"/><ellipse cx="42" cy="40" rx="4" ry="2.4" fill="#ff8fae"/>`),
  fuerza: envolver(`<path d="M36 4 L14 36 H30 L26 60 L50 26 H34Z" fill="#f4893b" stroke="${T}" stroke-width="3.5" stroke-linejoin="round"/>`),
  sonrojo: envolver(`<circle cx="32" cy="32" r="26" fill="#ffc2d6" stroke="${T}" stroke-width="3.5"/><path d="M20 28 q4 3 8 0 M36 28 q4 3 8 0" stroke="${T}" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M28 42 q4 -3 8 0" stroke="${T}" stroke-width="3" fill="none" stroke-linecap="round"/><g stroke="#d81e4a" stroke-width="2.5" stroke-linecap="round"><path d="M14 36 l-2 5 M19 36 l-2 5 M24 36 l-2 5 M42 36 l-2 5 M47 36 l-2 5 M52 36 l-2 5"/></g>`),
};
