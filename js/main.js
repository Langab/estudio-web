/* =====================================================================
   INTERACCIONES · nav, computador 3D, cambio de rubro, reveals,
   scrollytelling del cruce, modales de casos, textos desde config.
   ===================================================================== */
(function () {
  const S = window.SITIO;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Textos desde config ---------- */
  function aplicarConfig() {
    $$("[data-cfg]").forEach((el) => {
      const v = el.dataset.cfg.split(".").reduce((o, k) => (o ? o[k] : undefined), S);
      if (v !== undefined) el.textContent = v;
    });
    const wa = `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(S.whatsappSaludo)}`;
    $$("[data-wa]").forEach((a) => (a.href = wa));
    $$("[data-mail]").forEach((a) => { a.href = "mailto:" + S.email; a.textContent = S.email; });
    $$("[data-ig]").forEach((a) => {
      if (!S.instagram) { a.hidden = true; return; }
      a.href = "https://instagram.com/" + S.instagram; a.textContent = "@" + S.instagram;
    });
    $$("[data-linkedin]").forEach((a) => { if (S.linkedin) a.href = S.linkedin; else a.hidden = true; });
    const vivo = $("#en-vivo");
    if (vivo) vivo.innerHTML = S.enVivo.map((s) => `<a class="vivo__item" href="${s.url}" target="_blank" rel="noopener">${s.dominio}</a>`).join("");
    const eq = $("#equipo");
    if (eq) eq.innerHTML = S.equipo.map((p) => `
      <article class="persona reveal">
        <span class="persona__rol">${p.rol}</span>
        <h3 class="persona__nombre">${p.nombre}</h3>
        <p class="persona__desc">${p.desc}</p>
        ${p.stack ? `<div class="persona__stack">${p.stack.map((t) => `<span>${t}</span>`).join("")}</div>` : ""}
        ${p.enlaces ? `<div class="persona__links">${p.enlaces.map((e) => `<a class="link" href="${e.u}" target="_blank" rel="noopener">${e.t}</a>`).join("")}</div>` : ""}
      </article>`).join("");
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* ---------- Nav ---------- */
  function nav() {
    const bar = $(".nav");
    const onScroll = () => bar.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const btn = $(".nav__burger");
    const menu = $(".nav__links");
    btn.addEventListener("click", () => {
      const open = bar.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open);
      document.body.classList.toggle("no-scroll", open);
    });
    $$("a", menu).forEach((a) => a.addEventListener("click", () => {
      bar.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); document.body.classList.remove("no-scroll");
    }));
  }

  /* ---------- Computador 3D + mini sitio ---------- */
  function computador() {
    const stage = $("#mac-stage");
    if (!stage) return;
    const hero = stage.closest(".hero") || stage;
    const mac = $("#mac");
    const flotante = $(".mac__float", mac);
    const mini = $("#mini");
    const chips = $("#rubros");
    let actual = 0;
    let timer = null;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    // Chips
    S.rubros.forEach((r, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = r.nombre; b.dataset.i = i;
      b.addEventListener("click", () => { pintar(i); detenerCiclo(); sacudir(); if (window.COTIZADOR) window.COTIZADOR.setRubro(r.nombre); });
      chips.appendChild(b);
    });

    function pintar(i, instant) {
      const r = S.rubros[i];
      actual = i;
      const c = r.colores;
      const set = () => {
        mini.dataset.font = r.font;
        mini.style.setProperty("--m-bg", c.bg);
        mini.style.setProperty("--m-ink", c.ink);
        mini.style.setProperty("--m-muted", c.muted);
        mini.style.setProperty("--m-accent", c.accent);
        mini.style.setProperty("--m-btn-ink", c.btnInk);
        mini.style.setProperty("--m-t1", c.t1);
        mini.style.setProperty("--m-t2", c.t2);
        mini.style.setProperty("--m-t3", c.t3);
        mini.style.setProperty("--m-hero", c.hero);
        $(".mini__marca", mini).textContent = r.marca;
        $(".mini__url", mini).textContent = r.marca.toLowerCase().replace(/[^a-z0-9]+/g, "") + ".cl";
        $(".mini__tag", mini).textContent = r.tagline;
        $(".mini__cta", mini).textContent = r.cta;
        $$(".mini__nav span", mini).forEach((s, k) => (s.textContent = r.nav[k] || ""));
        $$(".mini__card", mini).forEach((card, k) => {
          $(".mini__card-nombre", card).textContent = r.cards[k] || "";
          $(".mini__card-precio", card).textContent = k === 0 ? r.precio : (k === 1 ? "Ver más" : "Nuevo");
        });
      };
      $$(".chip", chips).forEach((ch) => ch.classList.toggle("is-active", Number(ch.dataset.i) === i));
      if (instant || reduceMotion) { set(); return; }
      mini.classList.add("is-building");
      setTimeout(() => { set(); void mini.offsetWidth; mini.classList.remove("is-building"); }, 240);
    }

    // Demo automática: un cursor recorre el sitio y hace clic en el botón principal, luego cambia el rubro
    const screen = $(".mac__screen");
    const cursor = $(".mac__cursor", screen);
    const espera = (ms) => new Promise((r) => setTimeout(r, ms));
    let demo = false;
    function moverCursorA(el, ox = 0.5, oy = 0.5) {
      const s = screen.getBoundingClientRect(), r = el.getBoundingClientRect();
      if (!s.width || !r.width) return;
      cursor.style.setProperty("--cx", (((r.left + r.width * ox) - s.left) / s.width * 100).toFixed(1) + "%");
      cursor.style.setProperty("--cy", (((r.top + r.height * oy) - s.top) / s.height * 100).toFixed(1) + "%");
    }
    async function demoCiclo() {
      demo = true;
      await espera(900);
      while (demo) {
        const cta = $(".mini__cta", mini);
        cursor.classList.add("is-visible");
        moverCursorA($(".mini__card:nth-child(2) .mini__card-img", mini), 0.5, 0.5);
        await espera(1300); if (!demo) break;
        moverCursorA(cta, 0.55, 0.55);
        await espera(1150); if (!demo) break;
        cursor.classList.add("is-click"); cta.classList.add("is-pressed");
        await espera(180);
        cursor.classList.remove("is-click"); cta.classList.remove("is-pressed");
        await espera(420); if (!demo) break;
        pintar((actual + 1) % S.rubros.length);
        await espera(2200);
      }
      cursor.classList.remove("is-visible");
    }
    function detenerDemo() { demo = false; cursor.classList.remove("is-visible"); }

    function ciclo() { demoCiclo(); }
    function detenerCiclo() { detenerDemo(); if (timer) { clearInterval(timer); timer = null; } }
    function siguiente() { pintar((actual + 1) % S.rubros.length); detenerCiclo(); sacudir(); }
    function anterior() { pintar((actual - 1 + S.rubros.length) % S.rubros.length); detenerCiclo(); sacudir(); }

    // Pequeño impulso al cambiar de rubro
    function sacudir() {
      if (reduceMotion) return;
      mac.classList.remove("is-nudge");
      void mac.offsetWidth;
      mac.classList.add("is-nudge");
    }

    pintar(0, true);

    // Apertura de la tapa, encendido de la pantalla (las lamas se abren) y construcción del sitio
    if (reduceMotion) { screen.classList.add("is-on"); }
    else { mini.classList.add("is-building"); }
    requestAnimationFrame(() => setTimeout(() => {
      mac.classList.add("is-open");
      if (reduceMotion) return;
      setTimeout(() => screen.classList.add("is-boot"), 700);
      setTimeout(() => { screen.classList.add("is-on"); void mini.offsetWidth; mini.classList.remove("is-building"); }, 1900);
      setTimeout(() => { stage.classList.add("is-live"); ciclo(); }, 2700);
    }, 350));

    // Inclinación: sigue al mouse en todo el hero
    const setTilt = (rx, ry) => { mac.style.setProperty("--rx", rx.toFixed(2) + "deg"); mac.style.setProperty("--ry", ry.toFixed(2) + "deg"); };
    const setGlare = (x) => { $(".mac__screen").style.setProperty("--gx", (x * 40).toFixed(1) + "%"); };
    if (!reduceMotion && window.matchMedia("(hover:hover)").matches) {
      hero.addEventListener("mousemove", (e) => {
        const r = stage.getBoundingClientRect();
        const x = clamp((e.clientX - (r.left + r.width / 2)) / r.width, -0.8, 0.8);
        const y = clamp((e.clientY - (r.top + r.height / 2)) / r.height, -0.8, 0.8);
        mac.classList.add("is-hover");
        setTilt(-y * 12, x * 22);
        setGlare(x);
      });
      hero.addEventListener("mouseleave", () => { mac.classList.remove("is-hover"); setTilt(0, 0); setGlare(0); });
    }

    // Arrastrar para girar (celular y también mouse)
    if (!reduceMotion) {
      let arrastrando = false, x0 = 0, y0 = 0, rx0 = 0, ry0 = 0, movido = false;
      const leer = (v) => parseFloat(mac.style.getPropertyValue(v)) || 0;
      stage.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        arrastrando = true; movido = false; x0 = e.clientX; y0 = e.clientY; rx0 = leer("--rx"); ry0 = leer("--ry");
        mac.classList.add("is-drag");
        detenerCiclo();
      });
      window.addEventListener("pointermove", (e) => {
        if (!arrastrando) return;
        const dx = e.clientX - x0, dy = e.clientY - y0;
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) movido = true;
        setTilt(clamp(rx0 - dy * 0.15, -18, 18), clamp(ry0 + dx * 0.25, -35, 35));
      });
      const soltar = () => {
        if (!arrastrando) return;
        arrastrando = false;
        mac.classList.remove("is-drag");
        if (!mac.classList.contains("is-hover")) setTilt(0, 0);
      };
      window.addEventListener("pointerup", soltar);
      window.addEventListener("pointercancel", soltar);
      // Un toque (sin arrastrar) en la pantalla cambia de rubro
      $(".mac__screen").addEventListener("click", () => { if (!movido) siguiente(); });
    } else {
      $(".mac__screen").addEventListener("click", siguiente);
    }

    // Teclado
    screen.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); siguiente(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); anterior(); }
    });

    // Efecto al hacer scroll: se aleja e inclina suavemente
    if (!reduceMotion) {
      let ticking = false;
      const onScroll = () => {
        if (ticking) return; ticking = true;
        requestAnimationFrame(() => {
          const r = stage.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, -r.top / (r.height * 0.9)));
          stage.style.setProperty("--p", p.toFixed(3));
          mac.style.setProperty("--sx", (p * 14).toFixed(2) + "deg");
          ticking = false;
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  /* ---------- Reveals ---------- */
  function reveals() {
    const els = $$(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Scrollytelling: el cruce ---------- */
  function cruce() {
    const sec = $("#cruce");
    if (!sec) return;
    const pasos = $$(".cruce__paso", sec);
    const visual = $(".cruce__visual", sec);
    if (!("IntersectionObserver" in window)) { visual.dataset.step = "4"; return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          visual.dataset.step = en.target.dataset.step;
          pasos.forEach((p) => p.classList.toggle("is-current", p === en.target));
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    pasos[0].classList.add("is-current");
    pasos.forEach((p) => io.observe(p));
  }

  /* ---------- Modales de casos ---------- */
  function modales() {
    $$("[data-abrir]").forEach((btn) => btn.addEventListener("click", () => {
      const dlg = document.getElementById(btn.dataset.abrir);
      if (!dlg) return;
      dlg.showModal();
      document.body.classList.add("no-scroll");
      dlg.scrollTop = 0;
    }));
    $$("dialog").forEach((dlg) => {
      $$("[data-cerrar]", dlg).forEach((b) => b.addEventListener("click", () => dlg.close()));
      dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
      dlg.addEventListener("close", () => document.body.classList.remove("no-scroll"));
    });
  }

  /* ---------- Etapas: barra de progreso horizontal ---------- */
  function etapas() {
    const track = $(".etapas__track");
    if (!track || reduceMotion || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { track.classList.add("is-in"); io.disconnect(); } });
    }, { threshold: 0.3 });
    io.observe(track);
  }

  /* ---------- Barra móvil del cotizador ---------- */
  function barraCotizador() {
    const bar = $("#res-bar"), sec = $("#cotizador"), res = $("#resumen");
    if (!bar || !sec || !("IntersectionObserver" in window)) return;
    let enSeccion = false, resumenVisible = false;
    const pintar = () => bar.classList.toggle("is-visible", enSeccion && !resumenVisible);
    new IntersectionObserver((en) => { enSeccion = en[0].isIntersecting; pintar(); }, { rootMargin: "-30% 0px -10% 0px" }).observe(sec);
    new IntersectionObserver((en) => { resumenVisible = en[0].isIntersecting; pintar(); }, { threshold: 0.2 }).observe(res);
  }

  document.addEventListener("DOMContentLoaded", () => {
    aplicarConfig();
    barraCotizador();
    nav();
    computador();
    reveals();
    cruce();
    modales();
    etapas();
  });
})();
