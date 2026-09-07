/* =====================================================================
   COTIZADOR · calcula en vivo con los datos de config.js
   Lógica idéntica a la hoja "Cotizador" de la plantilla:
   total = base + fijos + extras → redondeado hacia arriba a $10.000
   anticipo 50% · saldo 50% · IVA solo si factura · mantención aparte.
   ===================================================================== */
(function () {
  const S = window.SITIO;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const CLP = (n) => "$" + Math.round(n).toLocaleString("es-CL");
  const fmtCLP = (n) => CLP(n).replace(/ /g, "");

  const estado = {
    base: "emprendedor",
    extras: {},            // codigo -> true | cantidad
    mantencion: "M2",
    factura: false,
    marca: "",
    instagram: "",
    rubro: ""
  };

  const extraPorCodigo = Object.fromEntries(S.extras.map((e) => [e.codigo, e]));
  const basePorId = Object.fromEntries(S.bases.map((b) => [b.id, b]));
  const mantPorCodigo = Object.fromEntries(S.mantencion.map((m) => [m.codigo, m]));
  const fijosTotal = S.fijos.reduce((a, f) => a + f.precio, 0);

  /* ---------- Cálculo ---------- */
  function calcular() {
    const base = basePorId[estado.base];
    let extras = 0;
    const lineas = [];
    let semanas = base.semanas;
    let hayFoto = false;

    S.extras.forEach((e) => {
      const v = estado.extras[e.codigo];
      if (!v) return;
      const cant = e.tipo === "cantidad" ? Number(v) : 1;
      if (cant <= 0) return;
      const sub = e.precio * cant;
      extras += sub;
      lineas.push({ codigo: e.codigo, nombre: e.nombre + (cant > 1 ? ` × ${cant}` : ""), monto: sub });
      if (e.codigo === "D1") semanas += 1;
      if (e.foto) hayFoto = true;
    });
    if (hayFoto) semanas += 1;

    const bruto = base.precio + fijosTotal + extras;
    const neto = Math.ceil(bruto / S.tarifas.redondeo) * S.tarifas.redondeo;
    const iva = estado.factura ? neto * S.tarifas.iva : 0;
    const total = neto + iva;
    const anticipo = total * S.tarifas.anticipo;
    const mant = mantPorCodigo[estado.mantencion];
    const mantMes = mant ? mant.precio * (estado.factura ? 1 + S.tarifas.iva : 1) : 0;

    return {
      base, lineas, extras, neto, iva, total, anticipo, saldo: total - anticipo,
      mant, mantMes,
      plazo: semanas <= 3 ? `${semanas} semanas` : `${semanas - 1} a ${semanas + (estado.base === "tienda" ? 1 : 0)} semanas`
    };
  }

  /* ---------- Render del panel ---------- */
  let totalMostrado = 0, animId = null, animTimer = null;
  function animarNumero(el, hasta) {
    if (animId) cancelAnimationFrame(animId);
    if (animTimer) clearTimeout(animTimer);
    const desde = totalMostrado;
    totalMostrado = hasta;
    const fin = () => { el.textContent = fmtCLP(hasta); };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || desde === 0 || document.hidden) { fin(); return; }
    const t0 = performance.now(), dur = 420;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmtCLP(desde + (hasta - desde) * e);
      if (p < 1) animId = requestAnimationFrame(tick); else fin();
    };
    animId = requestAnimationFrame(tick);
    animTimer = setTimeout(fin, dur + 80); // garantiza el valor final aunque la pestaña esté en segundo plano
  }

  function render() {
    const r = calcular();
    animarNumero($("#res-total"), r.total);
    const barTotal = $("#res-bar-total"); if (barTotal) barTotal.textContent = fmtCLP(r.total);
    $("#res-base").textContent = `${r.base.nombre} · ${fmtCLP(r.base.precio + fijosTotal)}`;
    const ul = $("#res-extras");
    ul.innerHTML = "";
    if (r.lineas.length === 0) {
      ul.innerHTML = `<li class="res__item res__item--muted"><span>Sin extras</span><span>—</span></li>`;
    } else {
      r.lineas.forEach((l) => {
        const li = document.createElement("li");
        li.className = "res__item";
        li.innerHTML = `<span>${l.nombre}</span><span>${fmtCLP(l.monto)}</span>`;
        ul.appendChild(li);
      });
    }
    $("#res-iva").hidden = !estado.factura;
    $("#res-iva-monto").textContent = fmtCLP(r.iva);
    $("#res-anticipo").textContent = fmtCLP(r.anticipo);
    $("#res-saldo").textContent = fmtCLP(r.saldo);
    $("#res-plazo").textContent = r.plazo;
    $("#res-mant").textContent = r.mant ? `${r.mant.nombre} · ${fmtCLP(r.mantMes)} / mes` : "Sin plan por ahora";
    $("#res-doc").textContent = estado.factura ? "Factura (IVA incluido)" : "Boleta de honorarios (sin IVA)";

    // Resaltar tarjetas activas
    $$("[data-base]").forEach((c) => c.classList.toggle("is-active", c.dataset.base === estado.base));
    $$("[data-mant]").forEach((c) => c.classList.toggle("is-active", c.dataset.mant === estado.mantencion));
    $$(".opt[data-extra]").forEach((row) => {
      const v = estado.extras[row.dataset.extra];
      row.classList.toggle("is-on", !!v && Number(v) > 0);
    });
    const wa = $("#res-wa");
    wa.href = linkWhatsApp(r);
  }

  /* ---------- Resumen en texto (WhatsApp / copiar) ---------- */
  function resumenTexto(r) {
    const L = [];
    L.push(`Hola Benjamín, armé una cotización en ${S.nombre}:`);
    if (estado.marca) L.push(`Marca: ${estado.marca}${estado.instagram ? " (@" + estado.instagram.replace(/^@/, "") + ")" : ""}`);
    if (estado.rubro) L.push(`Rubro: ${estado.rubro}`);
    L.push(`Base: ${r.base.nombre}`);
    if (r.lineas.length) L.push(`Extras: ${r.lineas.map((l) => l.nombre).join(", ")}`);
    L.push(`Total estimado: ${fmtCLP(r.total)} (${estado.factura ? "con IVA" : "boleta de honorarios"})`);
    L.push(`Anticipo ${fmtCLP(r.anticipo)} · saldo ${fmtCLP(r.saldo)}`);
    if (r.mant) L.push(`Mantención: plan ${r.mant.nombre}, ${fmtCLP(r.mantMes)} al mes`);
    L.push(`Plazo estimado: ${r.plazo}`);
    L.push(`¿Conversamos?`);
    return L.join("\n");
  }
  function linkWhatsApp(r) {
    return `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(resumenTexto(r))}`;
  }

  /* ---------- Construcción del formulario ---------- */
  function construir() {
    // Bases
    const bases = $("#cfg-bases");
    S.bases.forEach((b) => {
      const precioPaquete = Math.ceil((b.precio + fijosTotal + b.incluye.reduce((a, c) => a + extraPorCodigo[c].precio, 0)) / S.tarifas.redondeo) * S.tarifas.redondeo;
      const card = document.createElement("button");
      card.type = "button";
      card.className = "base" + (b.destacado ? " base--destacada" : "");
      card.dataset.base = b.id;
      card.setAttribute("role", "radio");
      card.innerHTML = `
        ${b.destacado ? '<span class="base__tag">El más elegido</span>' : ""}
        <span class="base__nombre">${b.nombre}</span>
        <span class="base__para">${b.para}</span>
        <ul class="base__trae">${b.trae.map((t) => `<li>${t}</li>`).join("")}</ul>
        <span class="base__precio"><span class="mono">${fmtCLP(precioPaquete)}</span><small>${b.incluye.length ? "con marca, fotos y funciones incluidas" : "con dominio, puesta en marcha y SEO incluidos"}</small></span>`;
      card.addEventListener("click", () => elegirBase(b.id));
      bases.appendChild(card);
    });

    // Extras
    const grupos = { marca: $("#cfg-marca"), funciones: $("#cfg-funciones") };
    S.extras.forEach((e) => {
      const row = document.createElement("div");
      row.className = "opt";
      row.dataset.extra = e.codigo;
      if (e.tipo === "cantidad") {
        row.innerHTML = `
          <div class="opt__txt"><span class="opt__nombre">${e.nombre}</span><span class="opt__desc">${e.desc}</span></div>
          <div class="opt__der">
            <span class="opt__precio mono">${fmtCLP(e.precio)} c/u</span>
            <div class="stepper" role="group" aria-label="${e.nombre}">
              <button type="button" class="stepper__btn" data-dir="-1" aria-label="Quitar uno">−</button>
              <output class="stepper__val">0</output>
              <button type="button" class="stepper__btn" data-dir="1" aria-label="Agregar uno">+</button>
            </div>
          </div>`;
        const out = $(".stepper__val", row);
        $$(".stepper__btn", row).forEach((btn) => btn.addEventListener("click", () => {
          const actual = Number(estado.extras[e.codigo] || 0);
          const nuevo = Math.max(0, Math.min(e.max, actual + Number(btn.dataset.dir)));
          estado.extras[e.codigo] = nuevo;
          out.textContent = nuevo;
          render();
        }));
      } else {
        row.innerHTML = `
          <div class="opt__txt"><span class="opt__nombre">${e.nombre}</span><span class="opt__desc">${e.desc}</span></div>
          <div class="opt__der">
            <span class="opt__precio mono">${fmtCLP(e.precio)}</span>
            <label class="switch"><input type="checkbox" data-codigo="${e.codigo}" aria-label="${e.nombre}"><span class="switch__pista"></span></label>
          </div>`;
        const chk = $("input", row);
        chk.addEventListener("change", () => { estado.extras[e.codigo] = chk.checked; render(); });
        row.addEventListener("click", (ev) => {
          if (ev.target.closest(".switch")) return;
          chk.checked = !chk.checked; chk.dispatchEvent(new Event("change"));
        });
      }
      grupos[e.grupo].appendChild(row);
    });

    // Mantención
    const mant = $("#cfg-mant");
    S.mantencion.forEach((m) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "plan";
      card.dataset.mant = m.codigo;
      card.innerHTML = `
        <span class="plan__nombre">${m.nombre}</span>
        <span class="plan__para">${m.para}</span>
        <span class="plan__precio"><span class="mono">${fmtCLP(m.precio)}</span><small>/ mes</small></span>
        <ul class="plan__trae">${m.trae.map((t) => `<li>${t}</li>`).join("")}</ul>`;
      card.addEventListener("click", () => { estado.mantencion = m.codigo; render(); });
      mant.appendChild(card);
    });
    const sin = document.createElement("button");
    sin.type = "button"; sin.className = "plan plan--sin"; sin.dataset.mant = "";
    sin.innerHTML = `<span class="plan__nombre">Después decido</span><span class="plan__para">Puedes sumar un plan cuando el sitio esté en vivo. Recomendamos 6 meses mínimo.</span>`;
    sin.addEventListener("click", () => { estado.mantencion = ""; render(); });
    mant.appendChild(sin);

    // Fijos (lista informativa)
    $("#cfg-fijos").innerHTML = S.fijos.map((f) => `<li>${f.nombre}</li>`).join("");

    // Rubro select
    const sel = $("#cfg-rubro");
    S.rubros.forEach((r) => { const o = document.createElement("option"); o.value = r.nombre; o.textContent = r.nombre; sel.appendChild(o); });
    const otro = document.createElement("option"); otro.value = "Otro"; otro.textContent = "Otro rubro"; sel.appendChild(otro);
    sel.addEventListener("change", () => { estado.rubro = sel.value; render(); });

    $("#cfg-marca-input").addEventListener("input", (e) => { estado.marca = e.target.value.trim(); render(); });
    $("#cfg-ig-input").addEventListener("input", (e) => { estado.instagram = e.target.value.trim(); render(); });
    $$("input[name='doc']").forEach((r) => r.addEventListener("change", () => { estado.factura = r.value === "factura" && r.checked; render(); }));

    // Copiar
    $("#res-copiar").addEventListener("click", async (ev) => {
      const btn = ev.currentTarget;
      try {
        await navigator.clipboard.writeText(resumenTexto(calcular()));
        btn.textContent = "Copiado";
        setTimeout(() => (btn.textContent = "Copiar resumen"), 1800);
      } catch (_) { btn.textContent = "No se pudo copiar"; }
    });
  }

  function elegirBase(id) {
    estado.base = id;
    const b = basePorId[id];
    // Reinicia extras a los que trae el paquete (como la hoja Paquetes)
    estado.extras = {};
    b.incluye.forEach((c) => (estado.extras[c] = true));
    estado.mantencion = b.mantencion;
    $$(".opt input[type=checkbox]").forEach((chk) => (chk.checked = !!estado.extras[chk.dataset.codigo]));
    $$(".stepper__val").forEach((o) => (o.textContent = "0"));
    render();
  }

  // API pública para el hero (rubro elegido en el computador)
  window.COTIZADOR = {
    setRubro(nombre) { estado.rubro = nombre; const sel = $("#cfg-rubro"); if (sel) sel.value = nombre; render(); },
    elegirBase
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (!$("#cotizador")) return;
    construir();
    elegirBase(estado.base);
  });
})();
