# Guía de Estilo de Emiliano · 2.0

Asesoría de imagen de **Majo Ciancaglini** — versión web de la guía: color, rostro,
silueta, niveles de intensidad y un guardarropas con prendas reales verificadas en talle.

**→ [Ver la guía](https://emilianocobe.github.io/guia-estilo-emiliano/)** · se abre con clave.

---

## Qué hay acá

| Archivo | Qué es |
|---|---|
| `index.html` | La guía completa. Autocontenida: CSS y JS en línea, sin dependencias salvo las tipografías. |
| `assets/` | 44 imágenes de referencia del proceso de asesoría. |
| `SISTEMA-MARCA-MAJO-CIANCAGLINI.md` | El sistema de identidad de la casa, extraído del vector real del isologotipo. |
| `robots.txt` · `<meta robots>` | Fuera de buscadores. |

## Los instrumentos

Tres gráficos del proceso dejaron de ser ilustraciones y se volvieron instrumentos que se operan,
con los colores y los datos extraídos del material original:

- **La rueda** — las 12 estaciones sobre sus dos ejes, y los 24 tonos del invierno con sus 6 neutros.
  El hueco de la rueda es el visor: devuelve el código de cada tono.
- **El probador** — siete marcos de anteojos que se dibujan sobre el óvalo del rostro, con su veredicto.
- **Un solo foco** — los cuatro bloques del cuerpo, donde solo uno puede encenderse a la vez:
  la restricción de la interfaz *es* la regla de estilo.

Los tres funcionan con teclado (flechas, Inicio, Fin) y se apagan enteros con `prefers-reduced-motion`.

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

## Notas

- Los precios y talles del guardarropas fueron relevados el **15/08/2026**. El stock de
  esas marcas es chico y rota: tomalos como referencia, no como promesa.
- Las fotos de producto se sirven desde el CDN de cada tienda.
- Las imágenes de referencia pertenecen a sus autores y se usan con fines de asesoría.

---

**Majo Ciancaglini** · Imagen Personal · [@majocian](https://instagram.com/majocian)
