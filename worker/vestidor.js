/* El vestidor: guarda la llave, cuida la factura y le habla a Nano Banana Pro.
   Nadie que abra el sitio ve la clave; lo único que viaja de vuelta es la imagen. */

const MODELO = 'gemini-3-pro-image';
const BASE = 'https://generativelanguage.googleapis.com/v1beta';

/* ── el encargo ──────────────────────────────────────────────────────────
   El texto es el de Emiliano, palabra por palabra. Lo único que se arma en
   el momento son las tres partes que dependen de qué casilleros llenó:
   cuántas imágenes van, qué trabajo tiene cada una, y en qué orden se apilan.
   Su versión original describía cuatro prendas sin pantalón; acá el orden
   sale de la percha, así que sirve para cualquier combinación.            */

const OFICIO = {
  arriba:   'one garment',
  capa:     'one garment',
  pantalon: 'one garment',
  calzado:  'the footwear',
  foco:     'one accessory',
};

/* el orden en que se apilan, del cuerpo hacia afuera */
const ORDEN = ['arriba', 'capa', 'pantalon', 'calzado', 'foco'];

function comoSeUsa(rot, n) {
  return {
    arriba: `the garment from Image ${n} sits closest to the body as the base layer`,
    capa: `the garment from Image ${n} is worn over it and left open`,
    pantalon: `the garment from Image ${n} goes on the legs`,
    calzado: `the footwear from Image ${n} goes on the feet`,
    foco: `the accessory from Image ${n} is worn exactly as it appears in its own reference`,
  }[rot];
}

const numero = (n) => ['zero','one','two','three','four','five','six','seven'][n] || String(n);

function encargo(prendas) {
  /* las prendas se numeran en el orden de apilado, no en el que llegaron */
  const ord = ORDEN.map((r) => prendas.find((p) => p.rot === r)).filter(Boolean);
  const otras = prendas.filter((p) => !ORDEN.includes(p.rot));
  const lista = [...ord, ...otras];
  const n = lista.length;
  const numDe = (rot) => lista.findIndex((p) => p.rot === rot) + 2;

  const trabajos = lista.map((p, i) => `  · Image ${i + 2} = ${OFICIO[p.rot] || 'one garment'}`).join('\n');
  const capas = lista.map((p) => comoSeUsa(p.rot, numDe(p.rot)) || `the item from Image ${numDe(p.rot)} is worn as shown`).join('; ');
  const cuantas = `${numero(n)} item${n === 1 ? '' : 's'}`;

  return `${numero(n + 1).replace(/^\w/, (c) => c.toUpperCase())} reference images, each with ONE strict job. Take nothing from an image except the job assigned to it.

IMAGE 1 = THE PERSON. Keep this person EXACTLY: same face, same bone and facial structure, same skin tone and real skin texture, same eyes, nose, lips, eyebrows, same hairstyle, hair colour and hairline, same body type, build, height and proportions, same natural expression. Preserve their distinctive features exactly — do NOT "correct" them toward a generic default, do NOT lighten the skin, smooth the hair, de-age or slim the body. IGNORE the clothing, pose, framing and background of Image 1 — only the person comes from here.

IMAGES 2 TO ${n + 1} EACH CONTAIN ONE GARMENT OR PAIR OF FOOTWEAR. Do not assume what type of garment each one is — LOOK at each image and reproduce whatever garment is actually shown there, exactly as it appears: its real category and type, its exact cut, silhouette, length, collar or neckline, closure, sleeves, exact colour, exact fabric, texture and weave, pockets, seams, stitching and every visible detail. If a garment is a jacket, keep it that exact kind of jacket; do not upgrade, formalise, casualise or substitute it for a different type of garment. Do NOT redesign, restyle, recolour, simplify or "improve" any of them. From each of these images IGNORE the wearer, their body, pose, background and everything else.

${trabajos}

THE TASK: dress the person from Image 1 in these ${cuantas} and ONLY these ${cuantas}, worn exactly like this — ${capas}.

GARMENT INVENTORY LOCK — this is critical: the person wears EXACTLY ${cuantas}, one taken from each of Images 2 to ${n + 1}. No further garment of any kind exists in this image. Do NOT add, invent or layer in any extra clothing — no additional jacket, blazer, suit jacket, coat, cardigan, vest, sweater, tie, scarf, belt, hat or accessory — unless it is visibly part of one of the ${numero(n)} reference images. If a reference garment is casual, it stays casual: never add a formal layer over or under it to "complete" the outfit.

The layers must read as a real, deliberate stack, with each one ending at a different, believable height and the layer underneath visible at the collar, cuffs and hem. The clothes fit the real body and proportions from Image 1 — draping, folding and creasing with true fabric weight and behaviour, with correct contact and fold shadows, all under one single consistent light source.

CRITICAL BLENDING RULES:
- Face, neck and hands share exactly the same skin tone — one single real person, NO visible seam or colour change at the neck or wrists.
- Do NOT average or blend any of the references into a new person: the identity is 100% Image 1.
- Do NOT take a face or body from Images 2 to ${n + 1}, and do NOT keep any clothing from Image 1.
- Each garment stays exactly as it is in its own reference — no colour, fabric, cut or detail bleeds from one garment into another.
- The result is ONE seamless photograph of a real person genuinely wearing these clothes: no pasted, cut-out, composite or collage look, no double edges, no mismatched lighting between head and body.

FRAMING: full-length photograph, standing frontal, relaxed natural pose, arms at the sides, feet flat and anchored to the floor so the footwear is fully visible. CAMERA POSITIONED AT WAIST HEIGHT — not at eye level — so the full figure is rendered without foreshortening and the legs read at their true length. Plain, uncluttered neutral background. Soft, even, natural light that shows every fabric's true colour and texture.

REALISM: hyper-detailed realistic skin with visible pores, fine vellus peach-fuzz, subtle imperfections and natural texture variation, subsurface scattering, realistic catchlights in the eyes, individual hair strands. Real fabric texture — weave, nap, stitching and sheen — reacting correctly to the light. Remove any smooth, waxy, airbrushed, plastic, CGI or AI look.

Avoid: adding any garment that is not in Images 2 to ${n + 1}; adding a blazer, suit jacket, coat, vest, cardigan, tie or scarf that no reference contains; substituting a garment for a different type than the one shown; formalising or dressing up a casual garment; wearing two outer layers when only one is referenced; changing the face, bone structure, hairstyle, skin tone or body proportions of Image 1; averaging the references into a new identity; taking a face or body from Images 2 to ${n + 1}; keeping any clothing from Image 1; redesigning, recolouring, simplifying or inventing details on any garment; swapping or merging the garments; wrong layering order; hiding the footwear or cropping the feet; mismatched skin tone at the neck or wrists; visible seam, double edge or colour break; a pasted, cut-out or collage look; inconsistent lighting between head and body; plastic, waxy or airbrushed skin; high camera angle, foreshortened or shortened legs; busy background; invented text or logos on the garments.`;
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
