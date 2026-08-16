# Guía de Estilo de Emiliano · 2.0

Asesoría de imagen de **Majo Ciancaglini** — versión web de la guía: color, rostro,
silueta, niveles de intensidad y un guardarropas con prendas reales verificadas en talle.

**→ [Ver la guía](https://emilianocobe.github.io/guia-estilo-emiliano/)** · **[Tu shop a medida](https://emilianocobe.github.io/guia-estilo-emiliano/shop.html)** · se abren con clave.

---

## Qué hay acá

| Archivo | Qué es |
|---|---|
| `index.html` | La guía: color, rostro, silueta, niveles, universo, el mapa de marcas y la ruta de compra. |
| `shop.html` | El shop a medida: 553 prendas en nueve percheros, con filtros de bloque y nivel. |
| `tools/verificar-guardarropa.py` | Relee cada ficha real y actualiza precios y stock. Idempotente. |
| `assets/` | 44 imágenes de referencia del proceso de asesoría. |
| `SISTEMA-MARCA-MAJO-CIANCAGLINI.md` | El sistema de identidad de la casa, extraído del vector real del isologotipo. |
| `robots.txt` · `<meta robots>` | Fuera de buscadores. |

## Los instrumentos

Cinco gráficos del proceso dejaron de ser ilustraciones y se volvieron instrumentos que se operan,
con los colores y los datos extraídos del material original:

- **La rueda** — las 12 estaciones sobre sus dos ejes, y los 24 tonos del invierno con sus 6 neutros.
  El hueco de la rueda es el visor: devuelve el código de cada tono.
- **El probador** — siete marcos de anteojos que se dibujan sobre el óvalo del rostro, con su veredicto.
- **Un solo foco** — los cuatro bloques del cuerpo, donde solo uno puede encenderse a la vez:
  la restricción de la interfaz *es* la regla de estilo.
- **El regulador** — los seis contextos de la semana contra los tres niveles: la aguja se
  desliza al nivel recomendado, y moverla a otro cuenta qué pasa si mostrás de más o de menos.
- **La proporción** — los 56 tonos como una sola cinta; cada familia se aísla y dice qué hace
  y dónde va.
- **Los rieles** — un riel por eje con tus marcas del núcleo, las afines donde comprás hoy y la
  periferia con el motivo por el que todavía no cierra.

Los cinco funcionan con teclado (flechas, Inicio, Fin) y se apagan enteros con `prefers-reduced-motion`.

## El portón

La guía se abre con una clave: el isologotipo se dibuja, se pide la palabra y las dos
hojas del guardarropas se corren. Queda recordada por dispositivo.

**Es una cortina, no una cerradura.** Sirve para que el enlace no quede a la vista de
cualquiera ni de los buscadores; no protege contra alguien con conocimientos técnicos,
porque el contenido viaja dentro de la misma página.

Para cambiar la clave: calculá el SHA-256 de la palabra nueva en minúsculas y reemplazá
la constante `CLAVE` en `index.html`.

```bash
python -c "import hashlib;print(hashlib.sha256('tu-clave-nueva'.encode()).hexdigest())"
```

## Sistema

Paleta cerrada de 9 tintas, dos tipografías, y todo el motion derivado de una sola idea:
el isologotipo es un rostro trazado **sin levantar el lápiz** — 2.299,9 pt de línea
continua — con dos manchas de color apoyadas detrás. La línea recorre; la mancha apoya.
Las reglas completas, en `SISTEMA-MARCA-MAJO-CIANCAGLINI.md`.

| | |
|---|---|
| Papel | `#FFFFFF` |
| Tinta | `#202020` · línea `#231F20` |
| Menta | `#29C4A6` |
| Ultramar | `#1A02AF` |

## Mantener el shop al día

```bash
python tools/verificar-guardarropa.py --aplicar
```

Relee la ficha real de cada prenda, corrige precios, actualiza el stock por talle y marca lo
agotado. Es idempotente: dos corridas seguidas sin cambios en las tiendas no escriben nada.
Con `--elegidas` verifica solo las 27 destacadas y con `--desde N --cuantas M` va por tandas.

Distingue tres cosas que no son lo mismo: **agotado** (la tienda lo dice), **no verificable**
(la tienda no publica stock por talle, así que no se afirma nada y se conserva el dato del
relevamiento) y **429** (la tienda pide que aflojes: reintenta y, si insiste, no toca la ficha).

## Notas

- Los precios y talles del guardarropas fueron relevados el **15/08/2026**. El stock de
  esas marcas es chico y rota: tomalos como referencia, no como promesa.
- Las fotos de producto se sirven desde el CDN de cada tienda.
- Las imágenes de referencia pertenecen a sus autores y se usan con fines de asesoría.

---

**Majo Ciancaglini** · Imagen Personal · [@majocian](https://instagram.com/majocian)
