# El vestidor

Guarda la clave de Google, cuida la factura y le habla a Nano Banana Pro
(`gemini-3-pro-image`). El sitio nunca ve la clave: manda las fotos, recibe la imagen.

Corre en el plan gratuito de Cloudflare. Lo que se gasta se gasta en la cuenta
de Google, y tiene un techo diario en dólares.

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

## El techo de la factura

El freno está puesto en **US$1 por día**, y el Worker lo traduce a generaciones
solo: divide el presupuesto por lo que cuesta cada imagen.

| dial | qué hace | por defecto |
|---|---|---|
| `TECHO_USD_DIARIO` | Cuánto podés gastar por día, en dólares. | 1 |
| `COSTO_IMAGEN_USD` | Lo que Google cobra por imagen. A 2K son 0.134; a 4K, 0.24. | 0.134 |
| `TOPE_DIARIO` | Generaciones por visitante por día. | 7 |
| `ORIGENES` | Qué sitios pueden pedirle. Vacío = cualquiera. | el sitio publicado y `localhost:8123` |

Con US$1 y el modelo en 2K, salen **7 generaciones por día**. Si algún día
subís a 4K, cambiás `COSTO_IMAGEN_USD` a `0.24` y el Worker recalcula solo:
pasan a ser 4. El presupuesto no se toca.

Después de cambiar cualquier dial: `npx wrangler deploy`.

El contador se reinicia a las **00 UTC**, no a la medianoche argentina.

---

## Qué contesta

**`GET /cupo`**

```json
{ "quedan": 5, "tope": 7, "usadas": 2, "gastado": 0.27, "bolsillo": 1, "costo": 0.134 }
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

`rot` puede ser `capa`, `arriba`, `pantalon`, `calzado` o `foco`. El Worker las
ordena del cuerpo hacia afuera antes de mandarlas, así los números de imagen del
encargo coinciden con el orden real de las capas.

Devuelve `{ "imagen": "<base64>", "mime": "image/jpeg", "quedan": 4, ... }`, o un
`error` en castellano: `429` si se acabó el cupo o el presupuesto, `502` si Google
falló o no devolvió imagen, `403` si el pedido viene de un origen que no está en
la lista.

---

## El encargo

El texto del prompt está en `vestidor.js` y es el que escribiste vos, palabra por
palabra. Lo único que se arma en el momento son tres partes, porque dependen de
qué casilleros llenaste en la percha:

- **cuántas imágenes van** — "Five reference images" o las que sean;
- **la lista de trabajos** — qué es cada imagen;
- **el orden de capas** — la frase de `THE TASK`.

Tu versión original describía cuatro prendas y no incluía pantalón. Como el
armador tiene un casillero de pantalón, esa frase ahora sale de la percha: si
armás capa + arriba + pantalón + calzado, dice cinco imágenes y ubica cada prenda
donde corresponde. El candado de inventario cuenta las prendas reales, así que
sigue prohibiendo cualquier quinta prenda inventada.

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
