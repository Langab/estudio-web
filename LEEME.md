# Página del estudio · `pagina_web/`

Sitio estático (HTML + CSS + JavaScript, sin dependencias ni build) para vender el servicio completo: web + identidad visual + fotos + pagos + mantención. Pensado para publicarse en **Cloudflare Pages** (gratis) siguiendo las políticas de `../temas_tecnicos_webs/04_Politicas_Seguridad_Privacidad_y_Operacion.md`.

## Qué hay

| Archivo | Para qué |
|---|---|
| `index.html` | La página completa: hero con el computador interactivo, casos, por qué nosotros, el cruce (diseño · informática · datos), etapas, **cotizador**, preguntas y contacto. Los relatos de los casos van en los `<dialog>` al final. |
| `privacidad.html` | Aviso de privacidad (Ley 21.719). Rellena los `[corchetes]`. |
| `js/config.js` | **El único archivo que hace falta tocar para cambiar datos**: nombre del estudio, WhatsApp, correo, Instagram, equipo, rubros de demostración y **todas las tarifas** (mismos códigos y precios que `02_Plantilla_Presupuestos.xlsx`). |
| `js/cotizador.js` | Motor del cotizador: base + fijos + extras → redondeo a $10.000 → anticipo/saldo, IVA opcional, mantención. Arma el mensaje de WhatsApp. |
| `js/main.js` | Interacciones: menú, apertura del computador, cambio de rubro, reveals al hacer scroll, scrollytelling del cruce, modales. |
| `css/estilos.css` | Todo el estilo. Tokens al inicio (`:root`). |
| `img/casos/` | Pantallazos reales de salacrisol.cl y entrecomillas.cl (escritorio y móvil). Vuelve a capturarlos cuando esos sitios cambien. |
| `_headers` | Cabeceras de seguridad que Cloudflare Pages aplica solo. |

## Antes de publicar (rellenar)

1. `js/config.js`: `nombre` (hoy "Estudio Lang" es un supuesto), `whatsapp`, `email`, `instagram`, nombres de la diseñadora y del fotógrafo.
2. `index.html`: el `<title>`, la `meta description` y el pie con razón social, RUT y dirección.
3. `privacidad.html`: responsable y domicilio.
4. Si cambias precios en la planilla, cámbialos también en `js/config.js` (bloques `bases`, `fijos`, `extras`, `mantencion`).

## Cómo verlo en el computador

```bash
python3 -m http.server 8765 --directory pagina_web
```

y abre `http://localhost:8765`.

## Cómo publicarlo

Cloudflare Pages → "Upload assets" o conectar un repositorio con esta carpeta como raíz. Sin comando de build. Luego apuntar el dominio y forzar HTTPS (checklist de la sección 8.4 de las políticas).

## Notas de diseño

- Lenguaje visual: fondos blanco y gris claro, tipografía Geist (con SF Pro como respaldo en dispositivos Apple), botones tipo píldora, animaciones suaves y `prefers-reduced-motion` respetado.
- El computador del hero se dibuja con CSS (sin imágenes). El mini sitio de la pantalla usa unidades de contenedor (`cqw`), así que escala solo.
- Las marcas del computador (Luma Joyas, Greda Taller, Casa Lino, Estudio Pulso, Café Ladera) son de ejemplo, no clientes.
