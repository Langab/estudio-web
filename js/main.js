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
    const mac = $("#mac");
    const mini = $("#mini");
    const chips = $("#rubros");
    let actual = 0;
    let timer = null;

    // Chips
    S.rubros.forEach((r, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.textContent = r.nombre; b.dataset.i = i;
      b.addEventListener("click", () => { pintar(i); detenerCiclo(); if (window.COTIZADOR) window.COTIZADOR.setRubro(r.nombre); });
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
      mini.classList.add("is-switching");
      setTimeout(() => { set(); mini.classList.remove("is-switching"); }, 260);
    }

    function ciclo() { timer = setInterval(() => pintar((actual + 1) % S.rubros.length), 4200); }
    function detenerCiclo() { if (timer) { clearInterval(timer); timer = null; } }

    pintar(0, true);

    // Apertura de la tapa
    requestAnimationFrame(() => setTimeout(() => {
      mac.classList.add("is-open");
      if (!reduceMotion) setTimeout(ciclo, 2200);
    }, 350));

    // Inclinación con el mouse
    if (!reduceMotion && window.matchMedia("(hover:hover)").matches) {
      stage.addEventListener("mousemove", (e) => {
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        mac.style.setProperty("--ry", (x * 10).toFixed(2) + "deg");
        mac.style.setProperty("--rx", (-y * 6).toFixed(2) + "deg");
      });
      stage.addEventListener("mouseleave", () => { mac.style.setProperty("--ry", "0deg"); mac.style.setProperty("--rx", "0deg"); });
    }

    // Clic en la pantalla: siguiente rubro
    const screen = $(".mac__screen");
    screen.addEventListener("click", () => { pintar((actual + 1) % S.rubros.length); detenerCiclo(); });
    screen.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); screen.click(); } });

    // Efecto al hacer scroll: se aleja suavemente
    if (!reduceMotion) {
      let ticking = false;
      const onScroll = () => {
        if (ticking) return; ticking = true;
        requestAnimationFrame(() => {
          // Empieza a alejarse solo cuando el borde superior del computador pasa el borde de la ventana
          const r = stage.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, -r.top / (r.height * 0.9)));
          stage.style.setProperty("--p", p.toFixed(3));
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
