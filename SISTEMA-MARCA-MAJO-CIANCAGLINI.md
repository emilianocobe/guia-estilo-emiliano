# SISTEMA DE MARCA — MAJO CIANCAGLINI · IMAGEN PERSONAL
## Documento rector de identidad. Versión 1.1 — 15 de agosto de 2026

> **Registro de cambios v1.1** (mismo día): el cliente pidió incorporar tres efectos del
> repertorio base del MÉTODO que la v1.0 prohibía (marquesina, cursor de doble masa,
> scramble). Choque resuelto según la regla de cierre: gana lo que la casa pide, y el
> documento se versiona. §4 los admite ahora con argumento y especificación propios.

> **Método declarado.** Todo lo que este documento afirma fue **extraído por código del
> vector real**, no observado de memoria ni de una captura: los trazados provienen de los
> objetos vectoriales del PDF *Informe Emiliano* (portada y página de cierre), los colores
> son los valores de relleno exactos de esos objetos, las tipografías son las fuentes
> embebidas reales del archivo, y cada número (superficies, contrastes, interlineados,
> ratios) fue computado y es re-computable. Fuente de verdad según §1.1 del MÉTODO: la
> gráfica real de la casa — el isologotipo tal como la marca lo dibujó.

---

# 0. LA TESIS — Una sola línea

El isologotipo es un rostro dibujado **sin levantar el lápiz**. No es una metáfora
elegida a posteriori: es un hecho geométrico del archivo. El trazado vectorial del rostro
es **un único subtrazado continuo** — un solo `M` inicial, cero interrupciones — de
**2.299,9 pt de longitud**, que arranca en la sien derecha, dibuja la corona, los ojos,
el óvalo, la nariz, la boca, y termina en el tabique. Detrás de esa línea flotan dos
manchas de color que **no tienen contorno**: no están dibujadas, están *apoyadas*.

De ahí sale toda la identidad:

> **La asesora traza; la persona es el color.**
> La línea continua es el método — un solo gesto que recorre todo el rostro sin
> fragmentarlo. Las manchas son la identidad del asesorado — orgánicas, sin borde,
> imposibles de encerrar en el contorno. La línea no contiene al color: **convive** con
> él. Eso es una asesoría de imagen que se describe a sí misma: estructura que no
> encierra.

**Consecuencia de diseño (el test del MÉTODO §4):** todo efecto, layout o pieza gráfica
de la casa debe poder justificarse con una de estas dos palabras: *trazo* (lo que la
línea hace: recorrer, subrayar, contar, medir) o *mancha* (lo que el color hace: aparecer
detrás, sin borde, en silencio). Lo que no sea trazo ni mancha, no pertenece.

---

# 1. PALETA — Cinco tintas, y la ley del 2%

## 1.1 Los valores exactos

| Rol | Nombre | HEX | Origen verificado |
|---|---|---|---|
| **Papel** | Papel | `#FFFFFF` | Fondo de portada y cierre |
| **Tinta de línea** | Tinta Lápiz | `#231F20` | Color de trazo del rostro (rich black de imprenta, levemente cálido) |
| **Tinta de texto** | Tinta Texto | `#202020` | Color de todos los textos de portada |
| **Acento frío** | Menta | `#29C4A6` | Relleno exacto de la mancha corona |
| **Acento profundo** | Ultramar | `#1A02AF` | Relleno exacto de la mancha mejilla |

Dos tintas negras distintas — `#231F20` para lo dibujado, `#202020` para lo escrito — a
0,01 de distancia perceptual. Se conservan **ambas**, cada una en su rol: es la clase de
detalle que nadie ve y todos sienten.

## 1.2 Grises de servicio (derivados, no nuevos colores)

Para UI e infografía se autorizan exactamente **cuatro** grises, derivados de Tinta
Texto por interpolación con Papel:

`#4A4A4A` (75% tinta) · `#8C8C8C` (50%) · `#C6C6C6` (25%) · `#F0F0EF` (6%, fondos de tarjeta)

**Prohibición verificable:** fuera de estas 9 tintas (5 + 4 grises), ningún color puede
aparecer en la interfaz de la casa. La única excepción son los **contenidos del
asesorado** (fotos de producto, muestras de SU paleta personal), que traen su propio
color y se tratan como contenido, jamás como decoración del marco.

## 1.3 La ley del 2% (medida, no estimada)

Superficie de la portada real, contada píxel por píxel:

| Tinta | Superficie |
|---|---|
| Papel | **92,49%** |
| Tinta (texto + línea) | 5,31% |
| Ultramar | 1,32% |
| Menta | 0,87% |
| **Acento total** | **2,19%** |

**Ley:** en cualquier pieza de la casa, la suma de Menta + Ultramar ocupa entre **1% y
5%** de la superficie. Nunca 0% (la pieza queda muda), nunca más de 5% (la mancha se
vuelve fondo y muere la tesis). El blanco no es ausencia: es la decisión dominante, y se
protege como tal.

## 1.4 Jerarquía interna de los acentos

- **Ultramar manda, Menta acompaña** (1,32% vs 0,87% en el original — proporción ≈ 3:2).
- Nunca se mezclan: **sin degradados entre acentos**, sin superposición con
  transparencia. Cada mancha es opaca y está sola en su zona.
- Ultramar = profundidad, ancla, dato fuerte. Menta = corona, apertura, respiro.
  (Derivado de su posición en el rostro: la menta corona arriba, el ultramar sostiene
  abajo.)

## 1.5 Contrastes medidos (WCAG 2.x) y sus leyes

| Par | Ratio | Veredicto |
|---|---|---|
| Tinta Texto / Papel | **16,29:1** | AAA. El par por defecto de todo texto |
| Ultramar / Papel | **12,56:1** | AAA. Único acento apto para texto sobre blanco |
| Papel / Ultramar | 12,56:1 | AAA. Texto blanco sobre mancha ultramar: permitido |
| Menta / Tinta Texto | 7,40:1 | AA+. La menta **solo brilla sobre tinta** |
| Menta / Ultramar | 5,71:1 | AA grande. Par permitido solo en gráfica, no en texto |
| Menta / Papel | **2,20:1** | **PROHIBIDO para texto en cualquier cuerpo.** Solo manchas y trazos decorativos ≥3px |

**Ley derivada:** la Menta jamás escribe sobre blanco. Sobre fondo tinta (secciones
invertidas), la Menta es la voz de acento; sobre papel, esa voz es el Ultramar. Esta
asimetría — cada acento dueño de un fondo — ES el sistema cromático de la casa.

---

# 2. TIPOGRAFÍA — Tres voces, con números

Las tres familias embebidas en el archivo real, cada una con un rol que ya estaba en uso
y aquí se vuelve ley:

## 2.1 Voz MARCA — Antonio (Regular)

- Uso real: el nombre `MAJO CIANCAGLINI` en portada, 33pt, caja alta.
- Rol: **solo para el nombre de la casa y rótulos de sección monumentales.** Condensada,
  vertical, económica — la voz que firma.
- Caja alta siempre. Tracking normal a leve (0–0.02em). Nunca en cuerpo de texto.
- Disponible libre (Google Fonts) → sin sustitución en web.

## 2.2 Voz DISPLAY y CUERPO — Poppins (Regular + Bold)

- Uso real: display de portada a **139,1pt** con interlineado **0,863** (medido:
  120pt de avance para 139pt de cuerpo — el display respira apretado, geométrico,
  casi lógico); cuerpo de texto a 30pt con interlineado **1,40**.
- Rol display: titulares grandes, siempre en Regular (la portada NO usa bold en el
  título: la monumentalidad la da el cuerpo, no el peso). Regla dura: display ≥ 56px
  en desktop, interlineado 0,86–0,95, tracking −0.01em.
- Rol cuerpo: párrafos en Regular 16–19px, interlineado 1,4–1,6; los énfasis en Bold
  dentro del párrafo (patrón real de todo el informe).
- Geométrica, redonda, cercana — el contrapeso amable de Antonio.

## 2.3 Voz FIRMA/DATOS — TT Chocolates Bold → sustituto declarado

- Uso real: el bloque de firma del cierre (`G R A C I A S !`, teléfono, @) a 22,8pt con
  **espaciado extremo** (en el archivo original el espaciado está hecho a mano, con
  espacios entre caracteres — aquí se normaliza como `letter-spacing`).
- Rol: **la voz chica de los datos** — rótulos, contadores, metadatos de esquina, pies.
  Caja alta, cuerpo 10–13px, `letter-spacing: 0.32em`.
- TT Chocolates es una fuente licenciada (TypeType) que no puede embeberse libremente →
  **sustitución declarada** en web: Poppins SemiBold en caja alta con el mismo
  espaciado. La voz se define por *tratamiento* (chico + espaciado + caja alta), no por
  el dibujo de la letra; la sustitución preserva la voz. (Regla del MÉTODO §2.2:
  familias cerradas y enumeradas — en web viven exactamente DOS archivos de fuente:
  Antonio y Poppins.)

## 2.4 El clash, medido

- Ratio real de portada/cierre: 139,1pt display vs 21,7pt de datos = **6,4:1**.
- **Ley: ratio de choque ≥ 6:1** entre el display más grande y el dato más chico de una
  misma pantalla. La tensión display-enorme / dato-mínimo-espaciado ES la página.
- Piso absoluto de texto: 10px. Datos transaccionales/lectura: ≥13px.

## 2.5 Metadatos de esquina (patrón de layout tipográfico)

La portada real ancla información en las **cuatro esquinas**: marca (sup. izq.),
descriptor (sup. der.), fecha (inf. izq.), contacto (inf. der.) — todo en la voz de
datos, con el centro de la página libre para display + isologo. Este patrón de
**esquinas habladas, centro respirado** es reutilizable en cualquier pieza de la casa y
reemplaza al header/footer convencional en piezas editoriales.

---

# 3. EL ISOLOGO — Geometría y leyes de uso

## 3.1 Geometría verificada

| Propiedad | Valor |
|---|---|
| Proporción del rostro | **0,6427** (ancho:alto = 1 : 1,556) |
| Longitud de la línea continua | **2.299,9 pt** (un único trazado, cero cortes) |
| Grosor de trazo | 1,84pt a 305pt de ancho = **0,60% del ancho de render** |
| Terminaciones | `round cap` + `round join` (lápiz, no pluma) |
| Manchas | 2 béziers cerradas **sin contorno**, `fill-rule: evenodd` |
| Peso del vector | 2,7 KB completo |

## 3.2 Anatomía nombrada

- **LA LÍNEA** (`#231F20`): el rostro entero. Nunca se corta, nunca se rellena, nunca
  cambia de grosor dentro de una misma pieza.
- **MANCHA CORONA** (`#29C4A6`, menta): flota sobre la frente, cruza la línea por
  detrás. Siempre arriba.
- **MANCHA MEJILLA** (`#1A02AF`, ultramar): sostiene el pómulo izquierdo. Siempre abajo
  a la izquierda.
- Orden de apilado innegociable: **papel → manchas → línea**. La línea siempre pasa por
  delante del color (así está construido el original: el trazo cruza visiblemente ambas
  manchas).

## 3.3 Variantes autorizadas (y ninguna más)

1. **Positivo** (uso maestro): tinta + manchas sobre papel.
2. **Nocturno**: sobre fondo Tinta Texto `#202020`, la línea pasa a Papel; las manchas
   **conservan sus valores exactos** (ambas verificadas legibles sobre tinta: 7,40:1 y
   2,04:1 de diferencia luminosa — la mejilla ultramar se oscurece elegantemente, es
   aceptado y deseado).
3. **Monocromo**: todo en una sola tinta (línea + manchas al 12% de opacidad de esa
   tinta). Para sellos, marcas de agua, papelería de un color.
4. **Sello**: el rostro solo, sin wordmark, para tamaños chicos y favicon.

**Escala mínima:** 48px de alto para el sello (a esa escala el trazo se fija en 1,5px y
no baja de ahí); 120px de alto para el positivo completo. Debajo de eso, no se usa.

**Zona de respeto:** 12% del ancho del rostro, en los cuatro lados, libre de todo.

**Prohibiciones:** no rotar; no espejar (la asimetría corona-derecha / mejilla-izquierda
es identidad); no recolorear manchas; no contornear manchas; no rellenar la línea; no
animar las manchas por separado de la línea; el nombre de la casa **nunca se recompone
con otra tipografía** (MÉTODO §2.3: el logo es un vector, no un texto).

## 3.4 El lockup

En el original, wordmark e isologo **no se tocan**: `MAJO CIANCAGLINI` (Antonio, caja
alta) ancla la esquina superior izquierda y el rostro flota debajo, a la izquierda del
display. Esa relación suelta — nombre como metadato, rostro como presencia — es el
lockup de la casa. No existe versión "logo centrado con nombre debajo".

---

# 4. MOTION — El repertorio de la casa

Cada efecto con su argumento (test §4 del MÉTODO). Lo que no tiene argumento, no entra.

| Efecto | Argumento de marca | Especificación |
|---|---|---|
| **La línea se dibuja** | El logo ES una línea continua de 2.299,9pt; verla trazarse es ver el método | `stroke-dasharray: 2300; stroke-dashoffset: 2300 → 0`; ease-out; 1,6–2,4s; una sola vez por vista |
| **Subrayados que se trazan** | Extensión del gesto del lápiz | `scaleX(0→1)` con `transform-origin: left`; 2–3px de grosor, color según fondo (ley §1.5) |
| **Manchas que emergen** | Las manchas se *apoyan* detrás | `opacity 0→1` + `scale 0.92→1`, SIEMPRE después de que la línea/texto ya está; nunca antes que el trazo |
| **Contadores que suben** | El informe es diagnóstico: los números son su evidencia | `IntersectionObserver`, una vez, 900ms, ease-out |
| **Barras que se llenan** | Trazo que mide | igual que subrayados |
| Revelado suave de secciones | Respiración editorial (aire 92%) | `opacity + translateY(12px)`, 500ms, stagger 60ms |
| **El portón** *(v1.1)* | El informe es un guardarropas: se entra abriéndolo | Dos hojas `#F0F0EF` con la línea dibujándose al centro; se abren a los 2,4s y el overlay se retira del DOM. Solo CSS; en RM no existe |
| **Marquesina de datos** *(v1.1)* | El perchero gira: la cinta muestra la paleta/el léxico | Voz de datos 11px/.32em, loop lento (≥38s), pausa en hover, `aria-hidden` |
| **Cursor de doble masa** *(v1.1)* | El punto es la tinta; el anillo, la mano que la sigue | Lerp .55/.13, `mix-blend-mode: difference`, crece sobre interactivos; solo `(hover:hover) and (pointer:fine)`, jamás en táctil ni RM |
| **Scramble de rótulos** *(v1.1)* | El dato también se dibuja: se revela de a poco | Solo voz de datos, charset de la casa `>#/:·.-01`, una vez por elemento, 14 cuadros |
| **Gris→color al tacto** *(v1.1)* | El color como recompensa: la paleta se descubre al tocarla | `grayscale(1)→0` en fotos de referencia/producto; solo puntero fino; en táctil el color se muestra directo (renuncia declarada) |

**Prohibidos** (sin argumento en esta marca): parallax, partículas, glitch, tilt 3D,
scroll-hijacking, snap, texto que se desarma en pedazos, Ken Burns.
La casa dibuja, apoya y abre; no sacude.

**`prefers-reduced-motion: reduce` desactiva TODO lo anterior** — la línea aparece
dibujada, los contadores nacen en su valor final, las manchas ya están. Guard doble:
media query CSS + chequeo JS antes de inicializar observers.

---

# 5. VOZ VERBAL

- **Voseo rioplatense**, segunda persona, directo: *"Sos comunicador y docente"*.
- Frases cortas. El énfasis va en **bold dentro del párrafo**, nunca en mayúsculas
  dentro del cuerpo.
- Tono declarado por la propia marca: *"No es un manual de reglas"* — se afirma, no se
  ordena. **Cero instrucciones de interfaz** (premisa 3 del MÉTODO): nada de "hacé
  click", "deslizá", "mirá abajo". El dato puro está permitido (`01 / 09`, `56 TONOS`).
- Léxico propio de la casa (se usa, no se traduce): *base / puente / expresión plena*,
  *bloques corporales*, *focos de atención*, *invierno profundo*, *placard*, *prendas
  de inversión*.
- Los tecnicismos de imagen (visagismo, colorimetría) se usan con naturalidad y se
  definen una sola vez, en glosario, no en el flujo.

---

# 6. DIALECTO DEL PROTAGONISTA (§2.4 del MÉTODO)

La casa habla el sistema de este documento. Pero el asesorado trae su propio universo —
city pop, estética japonesa, anime — que el informe trata como **contenido**, no como
marco. Reglas de convivencia:

1. El marco (navegación, títulos, datos, manchas) habla SOLO el sistema de la casa.
2. El universo del protagonista aparece **dentro** del contenido: su paleta personal de
   56 tonos, sus referencias, sus tableros. Con todo su color — tratado como las fotos
   de producto: contenido pleno, jamás decoración del marco.
3. Se autoriza el rotulado bilingüe ES/JA como **dato** (ej.: `基 BASE · 橋 PUENTE ·
   表現 EXPRESIÓN`) únicamente en las secciones que hablan del sistema de niveles del
   protagonista, con `lang="ja"` y `aria-hidden` en el ideograma (es eco visual, no
   contenido). Fuera de esas secciones, prohibido.

---

# 7. LAYOUT

- **Grilla**: 12 columnas; márgenes laterales 6,5% del ancho (medido de la portada:
  x=94/1440); gutter 24px.
- **Aire como material**: toda sección apunta a ≥60% de superficie vacía. Ante la duda,
  se saca, no se agrega.
- **Esquinas habladas** (§2.5): los metadatos viven en esquinas, en voz de datos.
- **Secciones nocturnas**: la inversión papel→tinta marca fronteras semánticas (cambio
  de acto), no ritmo decorativo. Máximo un cambio de tema cada 3 secciones. En nocturno,
  el acento de texto es Menta (7,40:1); en diurno, Ultramar (12,56:1).
- **Tarjetas**: fondo `#F0F0EF` o borde 1px `#C6C6C6`, radio 2px (casi recto: la casa
  es lápiz, no burbuja), sin sombras difusas — si hay sombra, es dura y de 2–4px, como
  papel apilado.
- **La mancha como fondo local**: un bloque destacado puede sentarse sobre una mancha
  orgánica (bezier sin contorno, uno de los dos acentos, respetando la ley del 5% de
  superficie total).

---

# 8. REGLAS INNEGOCIABLES (verificables una por una)

1. **Paleta cerrada de 9 tintas** (§1.1–1.2). Prohibido cualquier otro valor en el
   marco. Verificación: grep de todos los colores computados del CSS.
2. **Menta jamás escribe sobre Papel** (§1.5). Verificación: pares computados.
3. **Acentos entre 1% y 5% de superficie** (§1.3).
4. **Isologo solo vectorial**, orden papel→manchas→línea, sin espejar ni rotar (§3.3).
5. **Dos archivos de fuente: Antonio y Poppins**; voz de datos = tratamiento, no fuente
   nueva (§2.3).
6. **Clash ≥6:1** display/dato por pantalla; piso 10px; lectura ≥13px (§2.4).
7. **Cero instrucciones al usuario** (§5). Dato puro permitido.
8. **Motion solo del repertorio §4**, con `prefers-reduced-motion` total.
9. **El color ajeno es contenido**: fotos y paleta del asesorado nunca tiñen el marco (§6).
10. **Un `<h1>` por página; HTML semántico; `alt` en toda imagen; foco visible;
    targets ≥44px; cero desborde horizontal** (herencia directa del MÉTODO §6).

---

# 9. APLICACIÓN INMEDIATA — el informe HTML

Mapa de decisión para *Informe Emiliano 2.0* (el entregable que sigue a este documento):

| Elemento del informe | Regla aplicada |
|---|---|
| Hero | Display Poppins ≥ clamp 56–128px, interlineado 0,86; isologo dibujándose (2.300pt); esquinas habladas |
| Navegación de actos | Numeración `01/09` en voz datos; sin instrucciones |
| Dashboard cuantitativo | Contadores + barras (trazo que mide); tarjetas `#F0F0EF`; cifras display, unidades en voz datos |
| Paleta 56 tonos | Contenido del protagonista: swatches a todo color dentro del marco neutro |
| Contradicciones/hallazgos | Tarjetas con borde; severidad con Ultramar (texto) — nunca semáforos rojo/verde ajenos a la paleta |
| Niveles base/puente/expresión | Rotulado bilingüe autorizado (§6); barras de intensidad |
| Productos | Fotos = contenido pleno; precio/talle en voz datos; links subrayado-trazo |
| Cierre | Sección nocturna con acento Menta; firma en voz datos espaciada |

---

*Este documento manda sobre gustos de ejecución. Si una pieza contradice una regla
numerada de §8, la pieza está mal aunque guste. Si la marca real de la casa (nueva
gráfica de Majo) contradijera este documento, gana la marca real y este documento se
versiona — el choque se registra, no se silencia.*
