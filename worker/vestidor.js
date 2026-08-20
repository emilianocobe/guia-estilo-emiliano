/* El vestidor: guarda la llave, cuida la factura y le habla a Nano Banana Pro.
   Nadie que abra el sitio ve la clave; lo único que viaja de vuelta es la imagen. */

const MODELO = 'gemini-3-pro-image';
const BASE = 'https://generativelanguage.googleapis.com/v1beta';

/* ── el encargo ──────────────────────────────────────────────────────────
   El texto es el de Emiliano, palabra por palabra. Lo único que se arma en
   el momento son las partes que dependen de qué casilleros llenó: la lista
   de selección, cuántas imágenes van y los rangos que las nombran.        */

/* cómo se llama en el encargo cada categoría del shop */
const NOMBRE = {
  pantalon: 'the trousers',
  buzo: 'the knitted top',
  remera: 'the t-shirt',
  camisa: 'the shirt',
  calzado: 'the shoes',
  campera: 'the jacket',
  accesorio: 'the accessory',
  abrigo: 'the coat',
  saco: 'the blazer',
};

/* de reserva, si la ficha viniera sin categoría */
const POR_CASILLERO = {
  capa: 'the outer garment',
  arriba: 'the top',
  pantalon: 'the trousers',
  calzado: 'the shoes',
  foco: 'the accessory',
};

function comoSeLlama(p) {
  const base = NOMBRE[p.cat] || POR_CASILLERO[p.rot] || 'the garment';
  /* la capa se nombra "outer" para que no compita con la prenda de torso */
  return p.rot === 'capa' && !/^the (coat|blazer)$/.test(base)
    ? base.replace('the ', 'the outer ')
    : base;
}

/* el orden en que se apilan, del cuerpo hacia afuera */
const ORDEN = ['arriba', 'capa', 'pantalon', 'calzado', 'foco'];

/* "2, 3, 4 and 5" · "2 and 3" · "2" */
function enumerar(desde, hasta) {
  const ns = [];
  for (let i = desde; i <= hasta; i++) ns.push(String(i));
  if (ns.length === 1) return ns[0];
  return ns.slice(0, -1).join(', ') + ' and ' + ns[ns.length - 1];
}

const numero = (n) => ['zero','one','two','three','four','five','six','seven'][n] || String(n);
const mayus = (s) => s.replace(/^\w/, (c) => c.toUpperCase());

function encargo(prendas) {
  const lista = ordenar(prendas);
  const n = lista.length;
  const ultima = n + 1;
  const seleccion = lista
    .map((p, i) => `  · From Image ${i + 2}, take ONLY: [${comoSeLlama(p)}]`)
    .join('\n');
  const listadas = enumerar(2, ultima);
  const rango = n === 1 ? `Image 2` : `Images 2-${ultima}`;

  return `GARMENT SELECTION — from each reference, take ONLY the one item named here, and nothing else:
${seleccion}

${mayus(numero(ultima))} reference images, each with ONE strict job. Take nothing from an image except the job assigned to it.

IMAGE 1 = THE PERSON. Keep this person EXACTLY: same face, same bone and facial structure, same skin tone and real skin texture, same eyes, nose, lips, eyebrows, same hairstyle, hair colour and hairline, same body type, build, height and proportions, same natural expression. Preserve their distinctive features exactly — do NOT "correct" them toward a generic default, do NOT lighten the skin, smooth the hair, de-age or slim the body. Ignore the pose, framing and background of Image 1. Its clothing is replaced wherever another reference covers that part of the body, and kept only where no other reference does (see the coverage rule below).

IMAGE${n === 1 ? '' : 'S'} ${listadas} ${n === 1 ? 'IS A GARMENT REFERENCE' : 'ARE GARMENT REFERENCES'}. Each one may show a person wearing a complete outfit, several layers, or extra items. That does not matter: from each image you take ONLY the single item named in the GARMENT SELECTION list above.

For the named item, LOOK at it and reproduce it exactly as it appears: its real category and type, its exact cut, silhouette, length, collar or neckline, closure, sleeves, exact colour, exact fabric, texture and weave, pockets, seams, stitching and every visible detail. If it is a casual jacket, it stays that exact kind of casual jacket — never upgrade, formalise, casualise or substitute it for a different type of garment. Do NOT redesign, restyle, recolour, simplify or "improve" it. If part of it is hidden in the reference, reconstruct that part plausibly, consistent with what IS visible.

EVERYTHING ELSE IN THOSE IMAGES IS SET DRESSING, NOT CLOTHING: the wearer, their face and body, the background, and — critically — every other garment, layer and accessory they have on. Those other garments are NOT to be worn by the person in Image 1, not even partially. They must also not influence the chosen item: no colour, fabric, pattern, cut or detail from a neighbouring garment may bleed into the one you are reproducing.

ONE ZONE, ONE SOURCE — no duplication: each part of the body is dressed by exactly one source. Once a body zone has been assigned its garment, no other reference may add a second garment to that same zone. If two references happen to contain a similar item, only the one explicitly named for that zone is used and the other is ignored. Never end up with two shirts, two jackets in the same position, or two lower-body garments.

LAYERING: if more than one of the selected items is an upper-body garment, wear them all at once, stacked from lightest and most fitted closest to the skin, outward to the heaviest and most structured on the outside, with the outermost one left open. Each layer ends at a different, believable height, and the layer underneath stays visible at the collar, cuffs and hem.

COVERAGE RULE — the person is fully and normally dressed, head to feet. Every body zone gets its clothing from one of two sources, and from nowhere else:
  1. If one of the selected items dresses that zone, use it, reproduced exactly.
  2. If NO selected item dresses that zone, keep exactly what the person is already wearing there in Image 1 — same garment, same cut, same colour, same fabric, reproduced faithfully and unchanged.
So if none of the selected items is a lower-body garment, the person keeps the trousers or skirt they already wear in Image 1, unchanged — do not invent a new one, and never leave the legs undressed.

INVENTORY LOCK: every single garment visible in the final image must come either from the GARMENT SELECTION list or from what the person already wears in Image 1. Nothing is invented and nothing is added. Do NOT add a blazer, suit jacket, coat, cardigan, vest, sweater, shirt, tie, scarf, belt, hat or any accessory that is not in one of those two sources, and never add a formal layer to "complete" or dress up a casual outfit.

The clothes fit the real body and proportions from Image 1 — draping, folding and creasing with true fabric weight and behaviour, with correct contact and fold shadows, all under one single consistent light source.

CRITICAL BLENDING RULES:
- Face, neck and hands share exactly the same skin tone — one single real person, NO visible seam or colour change at the neck or wrists.
- Do NOT average or blend any of the references into a new person: the identity is 100% Image 1.
- Do NOT take a face or body from ${rango}.
- Each garment stays exactly as it is in its own reference — no colour, fabric, cut or detail bleeds from one garment into another.
- The result is ONE seamless photograph of a real person genuinely wearing these clothes: no pasted, cut-out, composite or collage look, no double edges, no mismatched lighting between head and body.

FRAMING: full-length photograph, standing frontal, relaxed natural pose, arms at the sides, feet flat and anchored to the floor so the footwear is fully visible. CAMERA POSITIONED AT WAIST HEIGHT — not at eye level — so the full figure is rendered without foreshortening and the legs read at their true length. Plain, uncluttered neutral background. Soft, even, natural light that shows every fabric's true colour and texture.

REALISM: hyper-detailed realistic skin with visible pores, fine vellus peach-fuzz, subtle imperfections and natural texture variation, subsurface scattering, realistic catchlights in the eyes, individual hair strands. Real fabric texture — weave, nap, stitching and sheen — reacting correctly to the light. Remove any smooth, waxy, airbrushed, plastic, CGI or AI look.

Avoid: copying any garment from a reference other than the one named for it; wearing the other clothes visible in ${rango}; two garments on the same body zone; two shirts, two jackets or two lower-body garments; adding any garment that comes from neither the selection list nor Image 1; substituting a garment for a different type than the one shown; formalising or dressing up a casual garment; leaving any part of the body undressed; missing or invented trousers; placing a garment on the wrong part of the body; a neighbouring garment's colour or fabric contaminating the chosen one; changing the face, bone structure, hairstyle, skin tone or body proportions of Image 1; averaging the references into a new identity; taking a face or body from ${rango}; redesigning, recolouring or simplifying any garment; hiding the footwear or cropping the feet; mismatched skin tone at the neck or wrists; visible seam, double edge or colour break; a pasted, cut-out or collage look; inconsistent lighting between head and body; plastic, waxy or airbrushed skin; high camera angle, foreshortened or shortened legs; busy background; invented text or logos on the garments.`;
}

/* las imágenes viajan en el mismo orden en que el encargo las nombra */
function ordenar(prendas) {
  const ord = ORDEN.map((r) => prendas.find((p) => p.rot === r)).filter(Boolean);
  return [...ord, ...prendas.filter((p) => !ORDEN.includes(p.rot))];
}

/* ── las dos formas de la API: la nueva primero, la vieja de respaldo ── */
async function pedirImagen(llave, texto, imagenes) {
  const cabeceras = { 'x-goog-api-key': llave, 'Content-Type': 'application/json' };

  const nueva = await fetch(`${BASE}/interactions`, {
    method: 'POST',
    headers: cabeceras,
    body: JSON.stringify({
      model: MODELO,
      input: [
        { type: 'text', text: texto },
        ...imagenes.map((im) => ({ type: 'image', mime_type: im.mime, data: im.data })),
      ],
      response_format: { type: 'image', mime_type: 'image/jpeg', aspect_ratio: '3:4', image_size: '2K' },
    }),
  });

  if (nueva.ok) return { cuerpo: await nueva.json(), via: 'interactions' };
  if (nueva.status !== 404 && nueva.status !== 400) {
    return { error: `interactions ${nueva.status}: ${(await nueva.text()).slice(0, 400)}` };
  }

  const vieja = await fetch(`${BASE}/models/${MODELO}:generateContent`, {
    method: 'POST',
    headers: cabeceras,
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: texto },
            ...imagenes.map((im) => ({ inline_data: { mime_type: im.mime, data: im.data } })),
          ],
        },
      ],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: '3:4', imageSize: '2K' },
      },
    }),
  });

  if (!vieja.ok) {
    return { error: `generateContent ${vieja.status}: ${(await vieja.text()).slice(0, 400)}` };
  }
  return { cuerpo: await vieja.json(), via: 'generateContent' };
}

/* ── la imagen aparece en un lugar distinto según la forma ── */
function sacarImagen(cuerpo) {
  for (const paso of cuerpo?.steps || []) {
    for (const c of paso?.content || []) {
      if (c?.type === 'image' && c.data) return { data: c.data, mime: c.mime_type || 'image/jpeg' };
    }
  }
  for (const parte of cuerpo?.candidates?.[0]?.content?.parts || []) {
    const en = parte.inlineData || parte.inline_data;
    if (en?.data) return { data: en.data, mime: en.mimeType || en.mime_type || 'image/jpeg' };
  }
  const bloqueo = cuerpo?.candidates?.[0]?.finishReason || cuerpo?.promptFeedback?.blockReason;
  return { error: bloqueo ? `el modelo no devolvió imagen (${bloqueo})` : 'el modelo no devolvió imagen' };
}

/* ── el freno: un techo en dólares por día, traducido a generaciones ── */
const hoy = () => new Date().toISOString().slice(0, 10);

function diales(env) {
  const costo = Number(env.COSTO_IMAGEN_USD || 0.134);
  const bolsillo = Number(env.TECHO_USD_DIARIO || 1);
  const porPersona = Number(env.TOPE_DIARIO || 7);
  return { costo, bolsillo, porPersona, techoGen: Math.max(1, Math.floor(bolsillo / costo)) };
}

async function cupo(env, ip) {
  const { costo, bolsillo, porPersona, techoGen } = diales(env);
  let usadas = 0, globales = 0;
  if (env.CUPOS) {
    const [a, b] = await Promise.all([
      env.CUPOS.get(`d:${hoy()}:${ip}`),
      env.CUPOS.get(`d:${hoy()}:TODAS`),
    ]);
    usadas = Number(a || 0);
    globales = Number(b || 0);
  }
  const mias = Math.max(0, porPersona - usadas);
  const sitio = Math.max(0, techoGen - globales);
  return {
    quedan: Math.min(mias, sitio),
    tope: Math.min(porPersona, techoGen),
    usadas,
    techoGen,
    gastado: Number((globales * costo).toFixed(2)),
    bolsillo,
    costo,
    techoLleno: sitio <= 0,
  };
}

async function anotar(env, ip) {
  if (!env.CUPOS) return;
  const dia = hoy();
  const vida = { expirationTtl: 60 * 60 * 26 };
  const [a, b] = await Promise.all([
    env.CUPOS.get(`d:${dia}:${ip}`),
    env.CUPOS.get(`d:${dia}:TODAS`),
  ]);
  await Promise.all([
    env.CUPOS.put(`d:${dia}:${ip}`, String(Number(a || 0) + 1), vida),
    env.CUPOS.put(`d:${dia}:TODAS`, String(Number(b || 0) + 1), vida),
  ]);
}

/* ── sólo contesta a los orígenes que vos declaraste ── */
function permitido(req, env) {
  const origen = req.headers.get('Origin') || '';
  const lista = (env.ORIGENES || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!lista.length) return '*';
  return lista.includes(origen) ? origen : null;
}

function cors(origen) {
  return {
    'Access-Control-Allow-Origin': origen,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

const responder = (datos, estado, origen) =>
  new Response(JSON.stringify(datos), {
    status: estado,
    headers: { 'Content-Type': 'application/json', ...cors(origen) },
  });

export default {
  async fetch(req, env) {
    const origen = permitido(req, env);
    if (!origen) return new Response('origen no autorizado', { status: 403 });
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origen) });

    const ruta = new URL(req.url).pathname.replace(/\/+$/, '');
    const ip = req.headers.get('CF-Connecting-IP') || 'sin-ip';

    if (ruta === '/cupo') return responder(await cupo(env, ip), 200, origen);
    if (ruta !== '/vestir') return responder({ error: 'ruta desconocida' }, 404, origen);
    if (req.method !== 'POST') return responder({ error: 'usá POST' }, 405, origen);
    if (!env.GEMINI_API_KEY) return responder({ error: 'al Worker le falta la clave' }, 500, origen);

    const c = await cupo(env, ip);
    if (c.quedan <= 0) {
      return responder(
        {
          error: c.techoLleno
            ? `el sitio gastó su presupuesto de hoy (US$${c.bolsillo}); vuelve a las 00 UTC`
            : 'llegaste a tu tope de generaciones de hoy',
          ...c,
        },
        429,
        origen
      );
    }

    let cuerpo;
    try {
      cuerpo = await req.json();
    } catch {
      return responder({ error: 'el pedido no es JSON' }, 400, origen);
    }

    const { persona, prendas } = cuerpo || {};
    if (!persona?.data) return responder({ error: 'falta la foto de la persona' }, 400, origen);
    if (!Array.isArray(prendas) || !prendas.length) {
      return responder({ error: 'falta al menos una prenda' }, 400, origen);
    }
    if (prendas.length > 5) return responder({ error: 'como mucho cinco prendas' }, 400, origen);

    const pesa = (im) => (im?.data?.length || 0) * 0.75;
    const total = pesa(persona) + prendas.reduce((s, p) => s + pesa(p), 0);
    if (total > 18 * 1024 * 1024) return responder({ error: 'las imágenes pesan demasiado' }, 413, origen);

    const enOrden = ordenar(prendas);
    const r = await pedirImagen(env.GEMINI_API_KEY, encargo(prendas), [persona, ...enOrden]);
    if (r.error) return responder({ error: r.error }, 502, origen);

    const im = sacarImagen(r.cuerpo);
    if (im.error) return responder({ error: im.error }, 502, origen);

    await anotar(env, ip);
    const despues = await cupo(env, ip);
    return responder({ imagen: im.data, mime: im.mime, via: r.via, ...despues }, 200, origen);
  },
};
