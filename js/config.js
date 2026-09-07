/* =====================================================================
   CONFIGURACIÓN DEL SITIO · edita SOLO este archivo para cambiar datos
   del negocio, precios, rubros de demostración y textos de contacto.
   Todo lo demás (index.html, css, js) lee desde aquí.
   ===================================================================== */

window.SITIO = {
  // ---------- Identidad ----------
  nombre: "Estudio Lang",                 // [Supuesto] nombre comercial. Cámbialo.
  ciudad: "Santiago de Chile",
  claim: "Sitios web completos para marcas que hoy viven en Instagram.",

  // ---------- Contacto ----------
  whatsapp: "56963095562",                // solo dígitos, con código de país (sin +)
  whatsappSaludo: "Hola Benjamín, vi la página del estudio y quiero conversar sobre un sitio para mi marca.",
  email: "benjalang1997@gmail.com",
  instagram: "",                          // ej: "estudio.lang" · vacío = se oculta el enlace
  linkedin: "https://www.linkedin.com/in/benjamin-lang-a78229207/",

  // ---------- Equipo ----------
  equipo: [
    { nombre: "Benjamín Lang", rol: "Código y datos", desc: "Sociólogo y analista de datos. Construye el sitio, conecta pagos, planillas y paneles, y mide lo que pasa después." },
    { nombre: "[Nombre de la diseñadora]", rol: "Identidad visual", desc: "Logo, paleta, tipografías y plantillas para Instagram. Lo que hace que tu marca se reconozca en un segundo." },
    { nombre: "[Nombre del fotógrafo]", rol: "Fotografía", desc: "Sesiones de producto, espacio y equipo en Santiago. Fotos que venden porque muestran lo que es." }
  ],

  // ---------- Sitios en vivo (prueba social) ----------
  enVivo: [
    { dominio: "salacrisol.cl", url: "https://salacrisol.cl" },
    { dominio: "entrecomillas.cl", url: "https://entrecomillas.cl" }
  ],

  // ---------- Rubros de demostración (el computador del hero) ----------
  // Marcas de ejemplo: no son clientes reales.
  rubros: [
    {
      id: "joyeria", nombre: "Joyería", marca: "Luma Joyas",
      tagline: "Piezas hechas a mano en plata y piedras naturales.",
      cta: "Ver colección", nav: ["Colección", "Nosotras", "Cuidados"],
      cards: ["Anillos", "Aros", "Collares"], precio: "$32.000",
      font: "joyeria",
      colores: { bg: "#FBF8F3", ink: "#26211C", muted: "#8A7F73", accent: "#8E6F3E", btnInk: "#FFFFFF",
                 t1: "linear-gradient(135deg,#F1E6D3,#E2CFB2)", t2: "linear-gradient(135deg,#E8DCC8,#D5C2A6)", t3: "linear-gradient(135deg,#DED0BB,#C9B393)",
                 hero: "radial-gradient(120% 100% at 80% 20%, #F3E7D4 0%, #E7D6BC 45%, #D9C3A3 100%)" }
    },
    {
      id: "ceramica", nombre: "Cerámica", marca: "Greda Taller",
      tagline: "Vajilla de gres hecha en Santiago, pieza por pieza.",
      cta: "Ver piezas", nav: ["Piezas", "Taller", "Encargos"],
      cards: ["Tazas", "Platos", "Floreros"], precio: "$14.000",
      font: "ceramica",
      colores: { bg: "#F5F1EA", ink: "#3A312B", muted: "#8C8178", accent: "#B4634A", btnInk: "#FFFFFF",
                 t1: "linear-gradient(135deg,#EBD9CB,#D9BFAB)", t2: "linear-gradient(135deg,#DCCBB9,#C4AE97)", t3: "linear-gradient(135deg,#C8B6A2,#A98F77)",
                 hero: "radial-gradient(120% 100% at 75% 25%, #EAD8C8 0%, #D6BBA5 50%, #B99A80 100%)" }
    },
    {
      id: "ropa", nombre: "Ropa", marca: "Casa Lino",
      tagline: "Básicos de lino para todos los días.",
      cta: "Comprar ahora", nav: ["Tienda", "Tallas", "Envíos"],
      cards: ["Camisas", "Pantalones", "Vestidos"], precio: "$39.990",
      font: "ropa",
      colores: { bg: "#FFFFFF", ink: "#111111", muted: "#6B6B6B", accent: "#111111", btnInk: "#FFFFFF",
                 t1: "linear-gradient(135deg,#ECECEC,#D8D8D8)", t2: "linear-gradient(135deg,#E3E3E3,#C9C9C9)", t3: "linear-gradient(135deg,#D9D9D9,#BDBDBD)",
                 hero: "linear-gradient(160deg,#F2F2F2 0%,#DADADA 100%)" }
    },
    {
      id: "danza", nombre: "Danza y movimiento", marca: "Estudio Pulso",
      tagline: "Clases de danza y pilates en grupos pequeños.",
      cta: "Agenda tu primera clase", nav: ["Clases", "Horarios", "La sala"],
      cards: ["Pilates", "Contemporánea", "Yoga"], precio: "$45.000 / mes",
      font: "danza",
      colores: { bg: "#17172A", ink: "#FFFFFF", muted: "#A9A9C2", accent: "#FF5C8A", btnInk: "#17172A",
                 t1: "linear-gradient(135deg,#3B2A5E,#1F1B3D)", t2: "linear-gradient(135deg,#4A2C63,#2A1E48)", t3: "linear-gradient(135deg,#5B2F62,#31204B)",
                 hero: "radial-gradient(120% 100% at 80% 20%, #4A2B70 0%, #2B1F4E 50%, #17172A 100%)" }
    },
    {
      id: "cafe", nombre: "Cafetería", marca: "Café Ladera",
      tagline: "Café de especialidad y masa madre en Providencia.",
      cta: "Ver la carta", nav: ["Carta", "Nosotros", "Eventos"],
      cards: ["Espresso", "Filtrado", "Pastelería"], precio: "$3.200",
      font: "cafe",
      colores: { bg: "#F7F1E8", ink: "#2B1D12", muted: "#8B7A6B", accent: "#3E6B49", btnInk: "#FFFFFF",
                 t1: "linear-gradient(135deg,#E7D6C1,#D2B896)", t2: "linear-gradient(135deg,#D9C4A8,#BFA07A)", t3: "linear-gradient(135deg,#C7AE8E,#A88760)",
                 hero: "radial-gradient(120% 100% at 80% 20%, #E9D9C4 0%, #CDB08C 50%, #A9885F 100%)" }
    }
  ],

  // ---------- Tarifas (mismos códigos y precios que 02_Plantilla_Presupuestos.xlsx) ----------
  tarifas: {
    anticipo: 0.5,           // 50% al aceptar, 50% contra entrega
    iva: 0.19,               // solo si emites factura
    redondeo: 10000,         // total redondeado hacia arriba a $10.000 (como la plantilla)
    validezDias: 15
  },

  // Bases (una por paquete). "incluye" = ítems que se activan por defecto al elegirla.
  bases: [
    {
      id: "vitrina", codigo: "W2", nombre: "Vitrina", precio: 450000, semanas: 3,
      para: "Para negocios que hoy solo tienen Instagram y necesitan un lugar propio con horarios, precios, mapa y WhatsApp.",
      trae: ["Portada + hasta 4 páginas", "Menú y formularios a WhatsApp", "Responsive y rápido"],
      incluye: [], mantencion: "M1"
    },
    {
      id: "emprendedor", codigo: "W3", nombre: "Emprendedor", precio: 750000, semanas: 4, destacado: true,
      para: "Para marcas que quieren verse profesionales de una vez: logo, fotos propias, web con subpáginas e inscripciones.",
      trae: ["Portada + subpáginas (6 a 10)", "Catálogo o grilla de horarios", "Contenido editable por ti"],
      incluye: ["W7", "W10", "D1", "D3", "F2"], mantencion: "M2"
    },
    {
      id: "tienda", codigo: "W5", nombre: "Tienda", precio: 990000, semanas: 5,
      para: "Para quienes venden productos y hoy cierran ventas por DM: catálogo, carrito, pago con tarjeta y páginas legales.",
      trae: ["Hasta 30 productos", "Carrito y checkout con pasarela", "Correo de confirmación y legales"],
      incluye: ["W8", "W10", "D1", "D3", "F1"], mantencion: "M3"
    }
  ],

  // Siempre incluidos en cualquier base (se suman al precio).
  fijos: [
    { codigo: "P1", nombre: "Dominio .cl a tu nombre (1 año, NIC Chile)", precio: 9990 },
    { codigo: "P2", nombre: "DNS, HTTPS y hosting sin costo mensual", precio: 45000 },
    { codigo: "P3", nombre: "Puesta en marcha con checklist y 30 días de garantía", precio: 60000 },
    { codigo: "P4", nombre: "Capacitación y guía para editar tu sitio", precio: 40000 },
    { codigo: "W11", nombre: "SEO básico, ficha de Google y Search Console", precio: 80000 }
  ],

  // Extras (toggles). grupo: "marca" | "funciones". tipo: "toggle" | "cantidad".
  extras: [
    { codigo: "D1", grupo: "marca", nombre: "Identidad visual", desc: "Logo en versiones, paleta y tipografías. Archivos SVG y PNG.", precio: 320000, semanas: 1 },
    { codigo: "D2", grupo: "marca", nombre: "Manual de marca", desc: "PDF con usos correctos, redes y papelería.", precio: 180000 },
    { codigo: "D3", grupo: "marca", nombre: "Plantillas para Instagram", desc: "5 plantillas editables en Canva: productos, horarios, historias.", precio: 90000 },
    { codigo: "D4", grupo: "marca", nombre: "Etiquetas o packaging", desc: "Diseño listo para imprenta (impresión no incluida).", precio: 120000 },
    { codigo: "F1", grupo: "marca", nombre: "Sesión de fotos de producto", desc: "Media jornada, hasta 20 productos, 40 fotos editadas.", precio: 250000, semanas: 1, foto: true },
    { codigo: "F2", grupo: "marca", nombre: "Sesión de marca o espacio", desc: "Media jornada: tu lugar, tu equipo, tu proceso. 40 fotos editadas.", precio: 250000, semanas: 1, foto: true },
    { codigo: "F3", grupo: "marca", nombre: "Jornada completa de fotos", desc: "Producto + marca, hasta 80 fotos y 3 videos cortos para reels.", precio: 450000, semanas: 1, foto: true },
    { codigo: "W10", grupo: "funciones", nombre: "Redacción de textos", desc: "Escribimos los textos a partir de una entrevista contigo.", precio: 120000 },
    { codigo: "W7", grupo: "funciones", nombre: "Inscripciones o pedidos a planilla + panel", desc: "Formulario conectado a tu Google Sheets y panel privado para marcar pagos.", precio: 150000 },
    { codigo: "W8", grupo: "funciones", nombre: "Pagos con link o botón", desc: "Flow, Mercado Pago o Webpay a tu nombre, probado con compra real.", precio: 80000 },
    { codigo: "W9", grupo: "funciones", nombre: "Pagos integrados con confirmación en servidor", desc: "Checkout completo: el pago se confirma en servidor y queda registrado.", precio: 280000 },
    { codigo: "W4", grupo: "funciones", tipo: "cantidad", nombre: "Página adicional", desc: "Una página extra con el mismo diseño.", precio: 45000, max: 10 },
    { codigo: "W6", grupo: "funciones", tipo: "cantidad", nombre: "Producto adicional", desc: "Ficha con fotos, descripción y precio (sobre los 30 incluidos).", precio: 5000, max: 200 }
  ],

  // Planes de mantención (mes a mes, mínimo sugerido 6 meses).
  mantencion: [
    { codigo: "M1", nombre: "Básico", precio: 35000, para: "Sitio informativo", trae: ["2 h de cambios al mes", "Monitoreo de caídas 24/7", "Respaldo mensual", "Renovación de dominio y certificado", "WhatsApp: 48 h hábiles"] },
    { codigo: "M2", nombre: "Estándar", precio: 65000, para: "Contenidos frecuentes", trae: ["4 h de cambios al mes", "Horarios, precios y fotos nuevas", "Informe mensual de visitas", "Reunión trimestral", "WhatsApp: 24 h hábiles"] },
    { codigo: "M3", nombre: "Tienda", precio: 110000, para: "E-commerce", trae: ["6 h de cambios al mes", "Hasta 10 productos nuevos al mes", "Soporte de pagos y conciliación", "Respaldo semanal", "Reunión mensual"] }
  ]
};
