/* El vestidor: guarda la llave, pone el tope y le habla a Nano Banana Pro.
   Nadie que abra el sitio ve la clave; lo único que viaja de vuelta es la imagen. */

const MODELO = 'gemini-3-pro-image';
const BASE = 'https://generativelanguage.googleapis.com/v1beta';

/* — el encargo que recibe el modelo — */
const ROTULOS = {
  capa: 'la prenda de abrigo exterior (campera, saco o abrigo)',
  arriba: 'la prenda de torso (remera, camisa o tejido)',
  pantalon: 'el pantalón',
  calzado: 'el calzado',
  foco: 'el accesorio',
};

function encargo(prendas) {
  const lista = prendas
    .map((p, i) => `Imagen ${i + 2}: ${ROTULOS[p.rot] || p.rot} — "${p.nombre}".`)
    .join('\n');
  return `Imagen 1: una persona real, de cuerpo entero.

${lista}

Generá una única fotografía de cuerpo entero de la persona de la Imagen 1 vistiendo exactamente las prendas de las imágenes siguientes.

Reglas, en orden de importancia:
1. La identidad de la persona no se toca: mismo rostro, mismo pelo, mismo tono de piel, misma contextura y misma altura relativa. Tiene que seguir siendo reconociblemente la misma persona.
2. Cada prenda conserva su color exacto, su estampa, su textura, su largo y su corte. No inventes detalles que no estén en la foto de la prenda, y no cambies un color por otro parecido.
3. Sólo las prendas listadas. No agregues accesorios, logos, bolsos ni prendas que nadie pidió.
4. Las prendas se apoyan sobre el cuerpo con caída y arrugas creíbles, no pegadas como una calcomanía.
5. Fondo de estudio liso y neutro, luz de día suave y pareja, cámara a la altura del pecho, cuerpo entero incluido el calzado, postura de pie y relajada.
6. Fotografía realista. Ni ilustración, ni render 3D, ni collage.`;
}

/* — las dos formas de la API: la nueva primero, la vieja de respaldo — */
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

/* — la imagen aparece en un lugar distinto según la forma — */
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

/* — el tope: por visitante y por día, más un techo general — */
const hoy = () => new Date().toISOString().slice(0, 10);

async function cupo(env, ip) {
  const tope = Number(env.TOPE_DIARIO || 10);
  const techo = Number(env.TECHO_DIARIO || 60);
  if (!env.CUPOS) return { usadas: 0, tope, quedan: tope };
  const [mias, todas] = await Promise.all([
    env.CUPOS.get(`d:${hoy()}:${ip}`),
    env.CUPOS.get(`d:${hoy()}:TODAS`),
  ]);
  const usadas = Number(mias || 0);
  const globales = Number(todas || 0);
  return {
    usadas,
    tope,
    quedan: Math.max(0, Math.min(tope - usadas, techo - globales)),
    techoLleno: globales >= techo,
  };
}

async function anotar(env, ip) {
  if (!env.CUPOS) return;
  const dia = hoy();
  const vida = { expirationTtl: 60 * 60 * 26 };
  const [mias, todas] = await Promise.all([
    env.CUPOS.get(`d:${dia}:${ip}`),
    env.CUPOS.get(`d:${dia}:TODAS`),
  ]);
  await Promise.all([
    env.CUPOS.put(`d:${dia}:${ip}`, String(Number(mias || 0) + 1), vida),
    env.CUPOS.put(`d:${dia}:TODAS`, String(Number(todas || 0) + 1), vida),
  ]);
}

/* — sólo contesta a los orígenes que vos declaraste — */
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
        { error: c.techoLleno ? 'el sitio llegó a su tope de hoy' : 'llegaste a tu tope de hoy', ...c },
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

    const r = await pedirImagen(env.GEMINI_API_KEY, encargo(prendas), [persona, ...prendas]);
    if (r.error) return responder({ error: r.error }, 502, origen);

    const im = sacarImagen(r.cuerpo);
    if (im.error) return responder({ error: im.error }, 502, origen);

    await anotar(env, ip);
    const despues = await cupo(env, ip);
    return responder({ imagen: im.data, mime: im.mime, via: r.via, ...despues }, 200, origen);
  },
};
