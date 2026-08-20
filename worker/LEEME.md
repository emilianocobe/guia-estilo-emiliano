# El vestidor

Guarda la clave de Google, pone el tope diario y le habla a Nano Banana Pro
(`gemini-3-pro-image`). El sitio nunca ve la clave: manda las fotos, recibe la imagen.

Corre en el plan gratuito de Cloudflare. Cada prueba te cuesta unos **US$0,13**
en la cuenta de Google, no en la de Cloudflare.

---

## Ponerlo a andar

Los cuatro pasos son tuyos porque involucran tus cuentas.

### 1. La clave de Google

Sacá una en **[aistudio.google.com/apikey](https://aistudio.google.com/apikey)**.
Es gratis crearla; la generación de imágenes se factura por uso, así que el
proyecto tiene que tener facturación activa.

### 2. El contador

```bash
cd worker
npx wrangler kv namespace create CUPOS
```

Te devuelve un `id`. Pegalo en `wrangler.toml`, reemplazando
`PEGAR_ACA_EL_ID_QUE_TE_DEVUELVA_WRANGLER`.

### 3. Guardar la clave como secreto

```bash
npx wrangler secret put GEMINI_API_KEY
```

Te la pide por teclado y queda cifrada en Cloudflare. **No la escribas en
`wrangler.toml`** — ese archivo está en el repo y es público.

### 4. Publicar

```bash
npx wrangler deploy
```

Te devuelve una dirección tipo
`https://vestidor-emiliano.TU-USUARIO.workers.dev`. Pasámela y la enchufo en
`looks.html`.

---

## Los diales

Están en `wrangler.toml` y se cambian sin tocar código:

| dial | qué hace | por defecto |
|---|---|---|
| `ORIGENES` | Qué sitios pueden pedirle. Vacío = cualquiera. | el sitio publicado y `localhost:8123` |
| `TOPE_DIARIO` | Pruebas por visitante por día. | 10 |
| `TECHO_DIARIO` | Pruebas del sitio entero por día. Es el freno de mano de tu factura. | 60 |

Con el techo en 60, el peor día posible te cuesta unos **US$8**.

Después de cambiarlos: `npx wrangler deploy`.

---

## Qué contesta

**`GET /cupo`** — cuántas pruebas te quedan hoy.

```json
{ "usadas": 2, "tope": 10, "quedan": 8 }
```

**`POST /vestir`**

```json
{
  "persona": { "mime": "image/jpeg", "data": "<base64>" },
  "prendas": [
    { "rot": "arriba", "nombre": "CAMISA BARI - BLANCO", "mime": "image/jpeg", "data": "<base64>" }
  ]
}
```

Devuelve `{ "imagen": "<base64>", "mime": "image/jpeg", "quedan": 7 }`, o un
`error` en castellano con el código que corresponda: `429` si se acabó el cupo,
`502` si Google falló o no devolvió imagen, `403` si el pedido viene de un
origen que no está en la lista.

---

## Sobre las dos formas de la API

Google está moviendo la generación de imágenes de `:generateContent` (que ahora
figura como *legacy*) a `/interactions`. El Worker **intenta la nueva y cae a la
vieja** si no está disponible, así que sigue andando de los dos lados del cambio.
La respuesta trae un campo `via` que te dice cuál contestó.

---

## Probarlo sin el sitio

```bash
curl https://vestidor-emiliano.TU-USUARIO.workers.dev/cupo
```

Si contesta el JSON del cupo, el Worker está vivo y la lista de orígenes te deja pasar.
