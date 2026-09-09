# Página del estudio · `pagina_web/`

Sitio estático (HTML + CSS + JavaScript, sin dependencias ni build) para vender el servicio completo: web + identidad visual + fotos + pagos + mantención. Pensado para publicarse en **Cloudflare Pages** (gratis) siguiendo las políticas de `../temas_tecnicos_webs/04_Politicas_Seguridad_Privacidad_y_Operacion.md`.

## Qué hay

| Archivo | Para qué |
|---|---|
| `index.html` | La portada comercial: hero con el computador interactivo, marquesina de servicios, los **tres casos**, las fotos, los **5 pasos** y la **agenda**. Los relatos de los casos van en los `<dialog>` al final. |
| `cotizador.html` | El cotizador, las preguntas frecuentes y la agenda. Vive aparte a propósito: la cotización es el enganche para pedir la reunión, no el primer plato. |
| `nosotros.html` | Quiénes somos: garantías, el equipo, el cruce (diseño · informática · datos), las seis etapas y el detalle de por qué costamos la mitad con IA. |
| `privacidad.html` | Aviso de privacidad (Ley 21.719). Rellena los `[corchetes]`. |
| `js/config.js` | **El único archivo que hace falta tocar para cambiar datos**: nombre del estudio, WhatsApp, correo, Instagram, equipo, rubros de demostración y **todas las tarifas** (mismos códigos y precios que `02_Plantilla_Presupuestos.xlsx`). |
| `js/cotizador.js` | Motor del cotizador: base + fijos + extras → redondeo a $10.000 → anticipo/saldo, IVA opcional, mantención. Arma el mensaje de WhatsApp. |
| `js/main.js` | Interacciones: menú, apertura del computador, cambio de rubro, reveals al hacer scroll, scrollytelling del cruce, modales, el carrusel de los 5 pasos y la carga de Calendly. |
| `css/estilos.css` | Todo el estilo. Tokens al inicio (`:root`). |
| `img/casos/` | Pantallazos reales de salacrisol.cl, entrecomillas.cl e inhospitajoyas.com (escritorio y móvil). Vuelve a capturarlos cuando esos sitios cambien. |
| `img/fotos/` | Tres fotos de producto de Inhóspita Joyas (sección "Las fotos las sacamos nosotros"). Si los derechos quedaron cedidos a la clienta, confirma con ella antes de mantenerlas o reemplázalas por otras de tu fotógrafo. |
| `_headers` | Cabeceras de seguridad que Cloudflare Pages aplica solo. |

## Antes de publicar (rellenar)

1. `js/config.js`: `whatsapp`, `email`, `instagram`. El equipo son Benjamín Lang (programación y datos) y Andrea Ortega (diseño y fotografía), con sus enlaces. El nombre comercial es **Blikk** ("mirada" en noruego; el 9 de septiembre de 2026 dejó de llamarse Blikk); el logo es un ojo negro que mira desde abajo de una persiana de tres lamas (rosa, violeta, azul). Está en el menú, el pie, el favicon y el arranque de la pantalla del computador; el SVG vive inline en `index.html`. Los enlaces de correo muestran "Mándanos un correo" (la dirección va solo en el `mailto:`).
2. `index.html`: el `<title>`, la `meta description` y el pie con razón social, RUT y dirección.
3. `privacidad.html`: responsable y domicilio.
3.b **`js/config.js` → `agenda.calendly`: pega tu enlace de Calendly** (por ejemplo `https://calendly.com/blikk-estudio/conversemos`). Mientras esté vacío, la sección "Cuéntanos tu idea" muestra el respaldo por WhatsApp y correo. Al pegarlo aparecen el calendario incrustado y el globo flotante abajo a la derecha (oculto en celular, donde ya está la barra fija). El `_headers` ya permite los dominios de Calendly.
4. Precios: en `js/config.js` cada ítem tiene `precio` (con IA, la mitad) y `precioSinIA` (el de la planilla). El cotizador muestra ambos y el ahorro. Fotografía, dominio y mantención no bajan. Si cambias la planilla, actualiza los dos valores.

## Cómo verlo en el computador

```bash
python3 -m http.server 8765 --directory pagina_web
```

y abre `http://localhost:8765`.

## Dónde está publicada (para compartir)

- Enlace público: **https://langab.github.io/estudio-web/**
- Repositorio: https://github.com/Langab/estudio-web (esta carpeta es el repositorio; rama `main`).
- Para publicar cambios, desde esta carpeta:

```bash
git add -A && git commit -m "Describe el cambio" && git push
```

GitHub Pages tarda entre 30 segundos y 2 minutos en reflejarlos. El archivo `.nojekyll` evita que GitHub procese la carpeta; `_headers` solo aplica en Cloudflare Pages.

## Cuando tenga dominio propio

Cloudflare Pages → conectar el repositorio `Langab/estudio-web` sin comando de build (o "Upload assets" con esta carpeta). Luego apuntar el dominio y forzar HTTPS (checklist de la sección 8.4 de las políticas). GitHub Pages sirve para compartir el borrador; el sitio definitivo, según tus propias políticas, va en Cloudflare.

## Notas de diseño

- **Rediseño de septiembre de 2026** (referencia: quinastudio.cl): menos texto y más aire, fondo de papel gris cálido (`#efeeea`) con tarjetas blancas, palabras clave de los titulares en **Instrument Serif itálica** (`<span class="acento">`), casos en rejilla asimétrica con leve rotación, marquesina de servicios y una sola acción repetida en todas las páginas: *Agenda una reunión*.
- **Los 5 pasos y el ojo**: `#pasos` es un carrusel horizontal con flechas. Arriba, el ojo del logo va abriendo sus lamas a medida que alcanzas a leer más pasos (`#ojo-guia`, atributo `data-paso` de 1 a 5). Las cinco ilustraciones son SVG hechos a mano, en línea dentro de `index.html`: ojo con burbuja, lupa sobre el rubro, ventana con el ojo asomándose, persiana que se abre sobre las barras, y una llave cuya cabeza es el ojo.
- Identidad visual propia (no Apple): Bricolage Grotesque para títulos, Instrument Sans para texto, Instrument Serif itálica para los acentos, JetBrains Mono para precios, etiquetas y números. Textura de persiana (lamas horizontales) en el hero, el pie y las tarjetas oscuras. Botones rectos con el degradé tricolor al pasar el mouse, tarjetas con borde fino sin sombras, encabezados de sección alineados a la izquierda. Paleta de acento: rosa (diseño), azul (informática), verde (datos). `css/estilos.apple.bak` guarda la versión anterior por si quieres comparar.
- El computador: se abre, la pantalla arranca con el logo y las lamas se abren, el sitio se construye por partes y un cursor recorre la página y hace clic en el botón principal antes de cambiar de rubro. Sigue al mouse, flota solo, se arrastra en el celular, y las flechas del teclado cambian de rubro cuando la pantalla tiene el foco. Cualquier interacción tuya detiene la demo automática.
- El computador del hero se dibuja con CSS (sin imágenes). El mini sitio de la pantalla usa unidades de contenedor (`cqw`), así que escala solo.
- Las marcas del computador (Luma Joyas, Greda Taller, Casa Lino, Estudio Pulso, Café Ladera) son de ejemplo, no clientes.
