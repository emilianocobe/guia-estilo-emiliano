#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VERIFICADOR DEL GUARDARROPA — Guía de Estilo de Emiliano
========================================================

Relee la ficha real de cada prenda publicada, compara precio y disponibilidad del
talle objetivo contra lo que dice la guía, y deja el informe. Con --aplicar además
actualiza index.html: corrige precios, actualiza el stock, marca lo agotado y lo caído.

Es idempotente: correrlo dos veces seguidas sin cambios en las tiendas no toca nada.

    python tools/verificar-guardarropa.py --elegidas   # solo la primera selección (27)
    python tools/verificar-guardarropa.py --desde 0 --cuantas 60   # por tandas, para no golpear las tiendas
    python tools/verificar-guardarropa.py --aplicar   # además actualiza index.html
    python tools/verificar-guardarropa.py --lento     # 1 pedido por vez (si una tienda te bloquea)

Fuente de verdad: las propias fichas de index.html. Cada <article class="prod">
lleva data-talle con el talle objetivo (44, L, 3, "42,43", "U" para talle único).

Plataformas que entiende: Tienda Nube (LS.variants), Shopify (/products/<x>.json),
WooCommerce (data-product_variations) y, como último recurso, JSON-LD.
"""
import argparse, concurrent.futures as fut, html as H, json, os, re, sys, time, urllib.error, urllib.request
from datetime import datetime, timezone

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOC = os.path.join(RAIZ, "index.html")
REGISTRO = os.path.join(RAIZ, "data")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) verificador-guardarropa/1.0"


# ─────────────────────────────── red ───────────────────────────────
def bajar(url, timeout=30, intentos=3):
    """GET con reintento y espera creciente ante 429/503 (tiendas que limitan el ritmo)."""
    espera = 2
    for n in range(intentos):
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "es-AR,es;q=0.9"})
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.status, r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and n < intentos - 1:
                time.sleep(espera)
                espera *= 2.5
                continue
            raise


# ──────────────────────── lectura de la guía ────────────────────────
# Las prendas viven en el bloque de datos `var PC={...};` que la guía usa para armar
# los percheros. Cada una es una fila: [0]nombre [1]url [2]imagen [3]precio [4]categoría
# [5]bloque [6]nivel [7]texto de talle [8]por qué [9]elegida [10]agotada [11]marca [12]talle objetivo
DATOS = re.compile(r'var PC=(\{.*?\});\n', re.S)


def a_entero(v):
    """Precio a entero de pesos, venga como venga.

    Los tres formatos que aparecen en estas tiendas, y por qué importan:
      '$125.000,00'  Tienda Nube, formato argentino: el punto separa miles, la coma decimales
      '150000.00'    Shopify: el punto ES el decimal
      '$ 125.000'    lo que escribe la propia guía
    Barrer todo lo que no sea dígito multiplica por 100 cuando hay decimales: hay que mirar el formato.
    """
    if v is None:
        return None
    s = re.sub(r"[^\d.,]", "", str(v))
    if not s:
        return None
    if "," in s:                                   # hay coma: es el decimal, los puntos son miles
        s = s.replace(".", "").replace(",", ".")
    elif not (s.count(".") == 1 and re.search(r"\.\d{2}$", s)):
        s = s.replace(".", "")                     # sin coma y sin decimal de 2 dígitos: puntos = miles
    try:
        return int(round(float(s)))
    except ValueError:
        return None


a_entero_decimal = a_entero  # mismo criterio para los campos numéricos de JSON


def pesos(n):
    return "$ " + f"{n:,}".replace(",", ".")


def leer_guia(doc, solo_elegidas=False):
    m = DATOS.search(doc)
    if not m:
        return [], None, None
    pc = json.loads(m.group(1))
    fichas = []
    for i, f in enumerate(pc["items"]):
        if solo_elegidas and not f[9]:
            continue
        fichas.append({
            "i": i, "marca": f[11], "nombre": f[0], "precio_pub": f[3] or None,
            "talle_txt": f[7], "url": f[1],
            "objetivo": [s.strip().upper() for s in (f[12] if len(f) > 12 else "").split(",") if s.strip()],
        })
    return fichas, pc, m.span()


# ───────────────────── lectura de la tienda ─────────────────────
def norm(v):
    return re.sub(r"\s+", " ", str(v or "")).strip().upper()


UNICO = {"", "U", "UNICO", "ÚNICO", "TALLE UNICO", "TALLE ÚNICO", "UNIQUE", "ONE SIZE", "DEFAULT TITLE", "NONE"}


def variantes_tiendanube(html):
    m = re.search(r"LS\.variants\s*=\s*(\[.*?\]);", html, re.S)
    if not m:
        return None
    try:
        vs = json.loads(m.group(1))
    except Exception:
        return None
    out = []
    for v in vs:
        ops = [norm(v.get(k)) for k in ("option0", "option1", "option2") if v.get(k) not in (None, "")]
        stock = v.get("stock")
        # Tienda Nube sí afirma: available es booleano de verdad y stock un entero.
        if isinstance(v.get("available"), bool):
            disp = v["available"]
        elif isinstance(stock, (int, float)):
            disp = stock > 0
        else:
            disp = None  # sin stock declarado: ilimitado o desconocido, no lo damos por agotado
        # price_number ya viene entero y limpio; price_short es el formateado ("$125.000,00");
        # price_number_raw está en centavos, no sirve.
        precio = v.get("price_number")
        if not isinstance(precio, (int, float)):
            precio = a_entero(v.get("price_short"))
        else:
            precio = int(round(precio))
        out.append({"ops": ops or [""], "disp": disp,
                    "stock": stock if isinstance(stock, int) else None, "precio": precio})
    return out


def variantes_shopify(url):
    base = url.split("?")[0].rstrip("/")
    try:
        st, txt = bajar(base + ".json")
        if st != 200:
            return None
        p = json.loads(txt).get("product") or {}
    except Exception:
        return None
    out = []
    for v in p.get("variants", []):
        ops = [norm(v.get(k)) for k in ("option1", "option2", "option3") if v.get(k)]
        # algunas tiendas no publican "available" en products.json: eso es no saber, no agotado
        out.append({"ops": ops or [""],
                    "disp": v["available"] if isinstance(v.get("available"), bool) else None,
                    "stock": v.get("inventory_quantity") if isinstance(v.get("inventory_quantity"), int) else None,
                    "precio": a_entero_decimal(v.get("price"))})
    return out or None


def variantes_woo(html):
    m = re.search(r'data-product_variations="(.*?)"', html, re.S)
    if not m:
        return None
    try:
        vs = json.loads(H.unescape(m.group(1)))
    except Exception:
        return None
    out = []
    for v in vs:
        ops = [norm(x) for x in (v.get("attributes") or {}).values() if x]
        pr = v.get("display_price")
        out.append({"ops": ops or [""], "disp": bool(v.get("is_in_stock")),
                    "stock": None, "precio": int(round(float(pr))) if pr else None})
    return out


def jsonld(html):
    """Último recurso: precio y disponibilidad global, sin talles."""
    for m in re.finditer(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S):
        try:
            data = json.loads(m.group(1))
        except Exception:
            continue
        for nodo in (data if isinstance(data, list) else [data]):
            of = (nodo or {}).get("offers")
            if not of:
                continue
            of = of[0] if isinstance(of, list) else of
            av = str(of.get("availability", ""))
            hay = True if "InStock" in av else (False if "OutOfStock" in av or "SoldOut" in av else None)
            return [{"ops": [""], "disp": hay, "stock": None, "precio": a_entero_decimal(of.get("price"))}]
    return None


def consultar(url):
    """Devuelve (estado, variantes|None, con_talles).

    estado: ok | caida | ilegible
    con_talles: False cuando la tienda solo publica disponibilidad global y no por talle
                (temas a medida). Ahí el stock del talle no se puede afirmar ni negar.
    """
    try:
        st, html = bajar(url)
    except urllib.error.HTTPError as e:
        # 429/503 es la tienda pidiendo que aflojes, no una ficha dada de baja
        if e.code in (429, 503):
            return (f"ocupada ({e.code})", None, False)
        return (f"caida ({e.code})", None, False)
    except Exception as e:
        return (f"error ({type(e).__name__})", None, False)
    if st != 200:
        return (f"caida ({st})", None, False)
    for parser, con_talles in ((lambda: variantes_tiendanube(html), True),
                               (lambda: variantes_woo(html), True),
                               (lambda: variantes_shopify(url), True),
                               (lambda: jsonld(html), False)):
        vs = parser()
        if vs:
            return ("ok", vs, con_talles)
    return ("ilegible", None, False)


def calza(variante, objetivo):
    """¿Esta variante corresponde al talle objetivo?"""
    ops = variante["ops"]
    if objetivo == "U":
        return any(o in UNICO for o in ops)
    return any(o == objetivo or o.replace("TALLE ", "") == objetivo for o in ops)


def evaluar(ficha, variantes, con_talles=True):
    """Precio vigente + qué talles objetivo siguen comprables.

    Devuelve (precio, disponibles, faltantes, sin_dato). `sin_dato` es el caso honesto:
    la tienda no publica stock por talle, así que no se puede afirmar ni negar.
    """
    if not variantes:
        return None, [], [], False
    pr_todos = [v["precio"] for v in variantes if v["precio"]]
    if not con_talles:
        # la tienda solo dice si el producto existe, no por talle: nunca afirmamos agotado
        if all(v["disp"] is False for v in variantes):
            return (min(pr_todos) if pr_todos else None), [], ficha["objetivo"], False
        return (min(pr_todos) if pr_todos else None), [], [], True

    disponibles, faltantes, precios, dudosos = [], [], [], False
    objetivos = ficha["objetivo"] or ["U"]
    for obj in objetivos:
        vs = [v for v in variantes if calza(v, obj)]
        # producto de una sola variante: esa variante ES el producto, calce o no el rótulo
        # (piezas únicas de vintage, talle único, o tiendas que rotulan la opción con otra cosa)
        if not vs and len(variantes) == 1:
            vs = variantes
        if any(v["disp"] is True for v in vs):
            v = next(v for v in vs if v["disp"] is True)
            disponibles.append((obj, v["stock"]))
            if v["precio"]:
                precios.append(v["precio"])
        elif vs and all(v["disp"] is False for v in vs):
            faltantes.append(obj)          # la tienda lo dice: agotado
        else:
            dudosos = True                 # nadie lo afirma: no inventamos una baja
    if dudosos and not disponibles:
        return (min(precios or pr_todos) if (precios or pr_todos) else None), [], faltantes, True
    if not precios:
        precios = [v["precio"] for v in variantes if v["precio"]]
    return (min(precios) if precios else None), disponibles, faltantes, False


def etiqueta(disponibles, faltantes, estado, sin_dato=False):
    if estado.startswith("caida"):
        return "Ficha no disponible"
    if sin_dato:
        return "En la tienda · confirmá el talle"
    if not disponibles:
        return "Sin tu talle hoy"
    partes = []
    for obj, stock in disponibles:
        t = obj if obj != "U" else "T. único"
        t = t if t.startswith("T.") or t.isdigit() else "T. " + t
        if obj.isdigit() and len(obj) == 2 and int(obj) >= 35:
            t = obj  # calzado: "42"
        partes.append(f"{t}: {stock} u." if isinstance(stock, int) else t)
    txt = " · ".join(partes)
    if faltantes:
        txt += " · sin " + "/".join(faltantes)
    return txt


# ──────────────────────────── informe ────────────────────────────
def main():
    ap = argparse.ArgumentParser(description="Verifica precios y stock del guardarropa.")
    ap.add_argument("--aplicar", action="store_true", help="actualiza index.html con lo verificado")
    ap.add_argument("--lento", action="store_true", help="un pedido por vez")
    ap.add_argument("--elegidas", action="store_true", help="solo las de la primera selección")
    ap.add_argument("--desde", type=int, default=0, help="empezar en la prenda N (para ir por tandas)")
    ap.add_argument("--cuantas", type=int, default=0, help="verificar sólo N prendas desde ahí")
    args = ap.parse_args()

    doc = open(DOC, encoding="utf-8").read()
    fichas, pc, span = leer_guia(doc, args.elegidas)
    if not fichas:
        print("No encontré el bloque de datos de prendas en index.html.")
        return 1
    if args.desde or args.cuantas:
        fichas = fichas[args.desde: (args.desde + args.cuantas) if args.cuantas else None]
    print(f"Verificando {len(fichas)} prendas · {datetime.now().strftime('%d/%m/%Y %H:%M')}\n")

    def trabajo(f):
        estado, vs, con_talles = consultar(f["url"])
        precio, disp, falt, sin_dato = evaluar(f, vs, con_talles)
        return {**f, "estado": estado, "precio_hoy": precio,
                "disponibles": disp, "faltantes": falt, "sin_dato": sin_dato}

    if args.lento:
        res = [trabajo(f) for f in fichas]
    else:
        # de a 4: varias de estas tiendas cortan con 429 si se las apura
        with fut.ThreadPoolExecutor(max_workers=4) as ex:
            res = list(ex.map(trabajo, fichas))

    cambios, bajas, dudas, ok = [], [], [], 0
    for r in res:
        motivos = []
        if r["estado"] != "ok":
            motivos.append(r["estado"])
        else:
            if r["precio_hoy"] and r["precio_pub"] and r["precio_hoy"] != r["precio_pub"]:
                d = r["precio_hoy"] - r["precio_pub"]
                pct = round(d / r["precio_pub"] * 100)
                motivos.append(f"precio {pesos(r['precio_pub'])} → {pesos(r['precio_hoy'])} ({pct:+d}%)")
            if r["sin_dato"]:
                motivos.append("la tienda no publica stock por talle")
            elif not r["disponibles"]:
                motivos.append("sin talle objetivo")
            elif r["faltantes"]:
                motivos.append("falta " + "/".join(r["faltantes"]))
        r["motivos"] = motivos
        indeciso = r["sin_dato"] or r["estado"].startswith(("ocupada", "error", "ilegible"))
        if not motivos:
            ok += 1
        elif indeciso and len(motivos) == 1:
            dudas.append(r)
        elif r["estado"].startswith("caida") or (not r["disponibles"] and not indeciso):
            bajas.append(r)
        else:
            cambios.append(r)

    an = len(str(max((len(x["nombre"]) for x in res), default=10)))
    def linea(r, marca_col=22):
        return f"  {r['marca'][:marca_col]:<{marca_col}} {r['nombre'][:40]:<40} " + " · ".join(r["motivos"])

    print(f"SIN CAMBIOS ................ {ok}")
    if cambios:
        print(f"\nCON CAMBIOS ................ {len(cambios)}")
        for r in cambios:
            print(linea(r))
    if dudas:
        print(f"\nNO VERIFICABLE ............. {len(dudas)}")
        for r in dudas:
            print(linea(r))
    if bajas:
        print(f"\nYA NO DISPONIBLES .......... {len(bajas)}")
        for r in bajas:
            print(linea(r))
    print()

    os.makedirs(REGISTRO, exist_ok=True)
    sello = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    snap = os.path.join(REGISTRO, f"verificacion-{sello}.json")
    with open(snap, "w", encoding="utf-8") as fh:
        json.dump(res, fh, ensure_ascii=False, indent=1)
    print(f"Registro: {os.path.relpath(snap, RAIZ)}")

    if not args.aplicar:
        if cambios or bajas:
            print("Informe nada más. Para actualizar la guía: --aplicar")
        return 0

    # ── aplicar sobre el bloque de datos ──
    tocadas = 0
    for r in res:
        # sin lectura confiable no se toca la prenda: mejor el dato viejo que uno inventado
        if r["estado"].startswith(("ilegible", "ocupada", "error")):
            continue
        f = pc["items"][r["i"]]
        antes = list(f)
        if r["precio_hoy"]:
            f[3] = r["precio_hoy"]
        # si hoy no se puede verificar el talle, se conserva lo que sí se verificó al relevar
        if not r["sin_dato"]:
            f[7] = etiqueta(r["disponibles"], r["faltantes"], r["estado"])
        f[10] = 0 if ((r["disponibles"] or r["sin_dato"]) and r["estado"] == "ok") else 1
        if f != antes:
            tocadas += 1

    bloque = "var PC=" + json.dumps(pc, ensure_ascii=False, separators=(",", ":")) + ";\n"
    nuevo = doc[:span[0]] + bloque + doc[span[1]:]
    if nuevo != doc:
        open(DOC, "w", encoding="utf-8").write(nuevo)
        print(f"index.html actualizado · {tocadas} prendas tocadas")
    else:
        print("index.html ya estaba al día · nada que escribir")
    return 0


if __name__ == "__main__":
    sys.exit(main())
