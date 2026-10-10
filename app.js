(() => {
  "use strict";

  /* ================= Configurazione ================= */
  const params = new URLSearchParams(location.search);
  const slug = (params.get("s") || "").toLowerCase();
  const fallbackKind = params.get("tipo") === "parrucchiere" ? "parrucchiere" : "estetica";
  const salon = window.SALONS[slug] || window.SALONS[fallbackKind];
  const key = window.SALONS[slug] ? slug : fallbackKind;
  const KIND = salon.kind;
  const SIRO_WA = "393452106846";

  const SERVICES = {
    estetica: [
      { cat: "Viso", items: [
        ["Pulizia del viso", 60, 45], ["Trattamento idratante", 50, 50], ["Trattamento anti-age", 60, 65] ] },
      { cat: "Mani e piedi", items: [
        ["Manicure", 30, 18], ["Semipermanente mani", 60, 30], ["Ricostruzione in gel", 120, 55],
        ["Pedicure estetico", 50, 32], ["Semipermanente piedi", 60, 35] ] },
      { cat: "Ceretta", items: [
        ["Sopracciglia", 15, 8], ["Mezza gamba", 20, 13], ["Gambe complete", 30, 20],
        ["Inguine", 15, 10], ["Ceretta completa", 60, 42] ] },
      { cat: "Ciglia e sopracciglia", items: [
        ["Laminazione ciglia", 60, 45], ["Laminazione sopracciglia", 45, 35], ["Tinta sopracciglia", 15, 10] ] }
    ],
    parrucchiere: [
      { cat: "Donna", items: [
        ["Piega", 30, 20], ["Taglio e piega", 60, 40], ["Colore e piega", 90, 58],
        ["Schiariture o balayage", 150, 95], ["Trattamento ristrutturante", 30, 18] ] },
      { cat: "Uomo", items: [
        ["Taglio uomo", 30, 20], ["Taglio e barba", 45, 28], ["Barba", 20, 12] ] },
      { cat: "Bambini", items: [ ["Taglio bambino", 30, 14] ] }
    ],
    barbiere: [
      { cat: "Capelli", items: [
        ["Taglio", 30, 18], ["Taglio e shampoo", 40, 22], ["Sfumatura", 30, 18], ["Taglio bambino", 20, 13] ] },
      { cat: "Barba", items: [
        ["Taglio e barba", 45, 28], ["Barba", 20, 12], ["Rasatura tradizionale", 30, 18] ] }
    ],
    unghie: [
      { cat: "Mani", items: [
        ["Manicure", 30, 18], ["Semipermanente", 60, 30], ["Ricostruzione in gel", 120, 55],
        ["Refill", 90, 40], ["Nail art", 30, 10] ] },
      { cat: "Piedi", items: [
        ["Pedicure estetico", 50, 32], ["Semipermanente piedi", 60, 35] ] }
    ]
  }[salon.menu || KIND];
  const MENU = salon.menu || KIND;
  const ALL = SERVICES.flatMap(g => g.items.map(([name, dur, price]) => ({ cat: g.cat, name, dur, price })));
  ALL.forEach((s, i) => s.id = i);

  // 0 = domenica
  const HOURS = {
    estetica: { 0: [], 1: [], 2: [["09:00","12:30"],["14:30","19:00"]], 3: [["09:00","12:30"],["14:30","19:00"]],
                4: [["09:00","12:30"],["14:30","20:00"]], 5: [["09:00","12:30"],["14:30","19:00"]], 6: [["09:00","13:00"]] },
    parrucchiere: { 0: [], 1: [], 2: [["08:30","12:30"],["14:30","19:00"]], 3: [["08:30","12:30"],["14:30","19:00"]],
                4: [["09:00","19:00"]], 5: [["08:30","12:30"],["14:30","19:00"]], 6: [["08:00","17:00"]] }
  }[KIND];
  const DAY_NAMES = ["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"];
  const DAY_SHORT = ["dom","lun","mar","mer","gio","ven","sab"];
  const MONTHS = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
  const CLIENTS = ["Martina R.","Giulia B.","Chiara F.","Elena C.","Sara E.","Valentina G.","Francesca M.","Alessia B.",
                   "Anna P.","Laura D.","Federica S.","Silvia T.","Marta Z.","Ilaria V.","Paola N.","Roberta L."];
  const CLIENTS_M = ["Marco R.","Luca B.","Davide F.","Andrea C.","Matteo G."];

  /* ================= Utilità ================= */
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const pad = n => String(n).padStart(2, "0");
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const parseYmd = s => { const [y,m,d] = s.split("-").map(Number); return new Date(y, m-1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const toMin = t => { const [h,m] = t.split(":").map(Number); return h*60 + m; };
  const toHm = m => `${pad(Math.floor(m/60))}:${pad(m%60)}`;
  const euro = n => `${n} €`;
  const durLabel = m => m < 60 ? `${m} min` : (m % 60 ? `${Math.floor(m/60)} h ${m%60} min` : `${m/60} h`);
  const longDate = d => `${DAY_NAMES[d.getDay()].toLowerCase()} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  const today = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
  const isOpen = d => HOURS[d.getDay()].length > 0 && !sets().closures.includes(ymd(d));
  const nowMin = () => { const d = new Date(); return d.getHours()*60 + d.getMinutes(); };

  // Numeri pseudo-casuali ripetibili (stessa agenda a ogni apertura)
  function rng(seedStr) {
    let h = 1779033703 ^ seedStr.length;
    for (let i = 0; i < seedStr.length; i++) { h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    return () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
  }

  const store = {
    get(k, def) { try { const v = localStorage.getItem(`demo:${key}:${k}`); return v ? JSON.parse(v) : def; } catch { return def; } },
    set(k, v) { try { localStorage.setItem(`demo:${key}:${k}`, JSON.stringify(v)); } catch {} },
    clear() { try { ["bookings","status","last","settings"].forEach(k => localStorage.removeItem(`demo:${key}:${k}`)); } catch {} }
  };

  // Impostazioni che la titolare può cambiare dal pannello (come nel prodotto vero)
  const DEFAULT_SET = { closures: [], leadH: 2, allowCancel: true, cancelH: 24 };
  const sets = () => ({ ...DEFAULT_SET, ...store.get("settings", {}) });
  const saveSets = patch => store.set("settings", { ...sets(), ...patch });

  /* ================= Agenda ================= */
  const seedCache = {};
  function seededFor(dateStr) {
    if (seedCache[dateStr]) return seedCache[dateStr];
    const d = parseYmd(dateStr), out = [];
    const r = rng(`${key}|${dateStr}`);
    const fill = 0.45 + r() * 0.3;
    const t0 = today();
    for (const [a, b] of HOURS[d.getDay()]) {
      let t = toMin(a);
      const end = toMin(b);
      while (t < end) {
        if (r() < fill) {
          const svc = ALL[Math.floor(r() * ALL.length)];
          if (t + svc.dur <= end) {
            const male = MENU === "barbiere" || (KIND === "parrucchiere" && svc.cat === "Uomo");
            const pool = male ? CLIENTS_M : CLIENTS;
            const online = r() < 0.62;
            const createdH = online ? [7, 8, 12, 13, 20, 21, 22, 23, 10, 15][Math.floor(r()*10)] : 10 + Math.floor(r()*8);
            out.push({
              id: `s-${dateStr}-${t}`, date: dateStr, start: t, end: t + svc.dur, svc: svc.id,
              who: pool[Math.floor(r() * pool.length)], source: online ? "online" : (r() < .5 ? "telefono" : "in salone"),
              createdH, status: d < t0 ? "fatta" : (r() < 0.15 ? "da confermare" : "confermata")
            });
            t += svc.dur + (r() < .3 ? 30 : 0);
            continue;
          }
        }
        t += 30;
      }
    }
    return (seedCache[dateStr] = out);
  }
  const userBookings = () => store.get("bookings", []);
  function bookingsOn(dateStr) {
    const st = store.get("status", {});
    return [...seededFor(dateStr), ...userBookings().filter(b => b.date === dateStr)]
      .map(b => st[b.id] ? { ...b, status: st[b.id] } : b)
      .sort((a, b) => a.start - b.start);
  }
  function freeSlots(dateStr, dur) {
    const d = parseYmd(dateStr);
    if (d < today() || !isOpen(d)) return [];
    const busy = bookingsOn(dateStr).filter(b => b.status !== "rifiutata");
    const earliest = Date.now() + sets().leadH * 3600e3;
    const out = [];
    for (const [a, b] of HOURS[d.getDay()]) {
      for (let t = toMin(a); t + dur <= toMin(b); t += 30) {
        if (new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, t).getTime() < earliest) continue;
        if (!busy.some(x => t < x.end && t + dur > x.start)) out.push(t);
      }
    }
    return out;
  }

  /* ================= Sito ================= */
  function renderSite() {
    const kindLabel = { estetica: "Centro estetico", parrucchiere: "Parrucchiere", barbiere: "Barbiere", unghie: "Centro unghie" }[MENU];
    document.documentElement.dataset.kind = KIND;
    document.title = `${salon.name} · Prenota online`;
    $("#brand-small").textContent = salon.name;
    $("#hero-name").textContent = salon.name;
    $("#hero-kicker").textContent = salon.city ? `${kindLabel} a ${salon.city}` : kindLabel;
    $("#hero-lead").textContent = {
      estetica: "Prenota il tuo trattamento quando vuoi, anche mentre siamo in cabina.",
      parrucchiere: "Prenota taglio, colore e piega quando vuoi, senza telefonare.",
      barbiere: "Prenota taglio e barba quando vuoi, senza telefonare e senza attese.",
      unghie: "Prenota manicure, gel e semipermanente quando vuoi, anche mentre siamo al lavoro."
    }[MENU];
    $("#foot-name").textContent = salon.name;
    $("#admin-name").textContent = salon.name;

    $("#ribbon-text").textContent = salon.generic
      ? "Sito dimostrativo: prova pure a prenotare, è tutto finto."
      : `Anteprima creata per ${salon.name}. Non è il sito ufficiale.`;
    $("#pitch-title").textContent = salon.generic
      ? "Ti piacerebbe un sito così?"
      : `Ti piacerebbe questo sito per ${salon.name}?`;
    const waText = salon.generic ? "Ciao Siro, ho visto la demo del sito con le prenotazioni." : `Ciao Siro, ho visto la demo per ${salon.name}.`;
    $("#pitch-wa").href = `https://wa.me/${SIRO_WA}?text=${encodeURIComponent(waText)}`;

    // Prossimi orari liberi (servizio più breve, per mostrare disponibilità reale)
    const minDur = 30, chips = [];
    for (let i = 0; i < 21 && chips.length < 6; i++) {
      const d = addDays(today(), i), ds = ymd(d);
      const free = freeSlots(ds, minDur);
      free.filter((_, j) => j % 3 === 0).slice(0, 2).forEach(t => chips.push({ ds, d, t }));
    }
    $("#next-slots").innerHTML = chips.slice(0, 6).map(c => {
      const label = c.ds === ymd(today()) ? "Oggi" : c.ds === ymd(addDays(today(), 1)) ? "Domani" : `${DAY_SHORT[c.d.getDay()]} ${c.d.getDate()}`;
      return `<button class="slot-chip" data-slot="${c.ds}|${c.t}"><small>${label}</small><strong>${toHm(c.t)}</strong></button>`;
    }).join("");

    $("#menu").innerHTML = SERVICES.map(g => `
      <div class="menu-cat"><h3>${esc(g.cat)}</h3>
        ${ALL.filter(s => s.cat === g.cat).map(s => `
          <button class="menu-row" data-svc="${s.id}">
            <span class="menu-name">${esc(s.name)}</span><span class="menu-price">${euro(s.price)}</span>
            <span class="menu-dur">${durLabel(s.dur)}</span>
          </button>`).join("")}
      </div>`).join("");

    const todayIdx = new Date().getDay();
    $("#hours").innerHTML = [2,3,4,5,6,0,1].map(i => {
      const r = HOURS[i];
      const txt = r.length ? r.map(([a,b]) => `${a}–${b}`).join("<br>") : `<span class="closed">Chiuso</span>`;
      return `<tr class="${i === todayIdx ? "today" : ""}"><td>${DAY_NAMES[i]}</td><td>${txt}</td></tr>`;
    }).join("");

    const upcoming = sets().closures.filter(c => parseYmd(c) >= today()).sort();
    $("#closures-note").textContent = upcoming.length
      ? `Chiusure straordinarie: ${upcoming.map(c => longDate(parseYmd(c))).join(", ")}.` : "";
  }

  /* ================= Prenotazione ================= */
  let bk = {};
  const sheet = $("#sheet");
  function openBooking(pre = {}) {
    bk = { step: 1, ...pre };
    if (bk.svc != null) bk.step = 2;
    sheet.hidden = false;
    document.body.style.overflow = "hidden";
    renderStep();
  }
  function closeBooking() { sheet.hidden = true; document.body.style.overflow = ""; }

  function renderStep() {
    const body = $("#sheet-body");
    $("#sheet-back").style.visibility = bk.step > 1 && bk.step < 4 ? "visible" : "hidden";
    $("#sheet-steps").textContent = bk.step < 4 ? `Passo ${bk.step} di 3` : "";

    if (bk.step === 1) {
      $("#sheet-title").textContent = "Cosa vuoi prenotare?";
      body.innerHTML = SERVICES.map(g => `<p class="pick-group">${esc(g.cat)}</p>` +
        ALL.filter(s => s.cat === g.cat).map(s => `
          <button class="pick-row" data-pick="${s.id}"><span>${esc(s.name)}</span><strong>${euro(s.price)}</strong><small>${durLabel(s.dur)}</small></button>`).join("")
      ).join("");
    }

    if (bk.step === 2) {
      const svc = ALL[bk.svc];
      $("#sheet-title").textContent = "Quando ti va bene?";
      const days = [];
      for (let i = 0; i < 28; i++) {
        const d = addDays(today(), i), ds = ymd(d);
        days.push({ d, ds, n: freeSlots(ds, svc.dur).length });
      }
      if (!bk.date || !days.find(x => x.ds === bk.date && x.n)) bk.date = (days.find(x => x.n) || days[0]).ds;
      const slots = freeSlots(bk.date, svc.dur);
      if (bk.time != null && !slots.includes(bk.time)) bk.time = null;
      const morning = slots.filter(t => t < 13*60), afternoon = slots.filter(t => t >= 13*60);
      const timeBtns = arr => arr.map(t => `<button class="time ${t === bk.time ? "sel" : ""}" data-time="${t}">${toHm(t)}</button>`).join("");
      body.innerHTML = `
        <div class="summary"><strong>${esc(svc.name)}</strong>${durLabel(svc.dur)} · ${euro(svc.price)}</div>
        <div class="days" id="days">${days.map(x => `
          <button class="day ${x.ds === bk.date ? "sel" : ""}" data-day="${x.ds}" ${x.n ? "" : "disabled"} aria-label="${longDate(x.d)}">
            <small>${DAY_SHORT[x.d.getDay()]}</small><strong>${x.d.getDate()}</strong><span class="dot"></span></button>`).join("")}
        </div>
        ${slots.length ? `
          ${morning.length ? `<p class="times-label">Mattina</p><div class="times">${timeBtns(morning)}</div>` : ""}
          ${afternoon.length ? `<p class="times-label">Pomeriggio</p><div class="times">${timeBtns(afternoon)}</div>` : ""}`
        : `<p class="empty">Nessun orario libero in questo giorno.</p>`}
        <div class="sticky-cta"><button class="btn btn-primary btn-wide" id="to-step3" ${bk.time == null ? "disabled" : ""}>
          ${bk.time == null ? "Scegli un orario" : `Continua con ${toHm(bk.time)}`}</button></div>`;
      const sel = body.querySelector(".day.sel");
      if (sel) sel.scrollIntoView({ inline: "center", block: "nearest" });
    }

    if (bk.step === 3) {
      const svc = ALL[bk.svc];
      $("#sheet-title").textContent = "Ultimo passo";
      body.innerHTML = `
        <div class="summary"><strong>${esc(svc.name)}</strong>${longDate(parseYmd(bk.date))}, ore ${toHm(bk.time)}</div>
        <form id="form" novalidate>
          <label class="field"><span>Nome e cognome</span><input name="name" autocomplete="name" value="${esc(bk.name || "")}" required></label>
          <label class="field"><span>Cellulare</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" value="${esc(bk.phone || "")}" required>
            <p class="fineprint" style="margin-top:4px">Ti arriva il promemoria su WhatsApp il giorno prima.</p></label>
          <label class="field"><span>Note per il salone (facoltative)</span><textarea name="notes">${esc(bk.notes || "")}</textarea></label>
          <div class="sticky-cta"><button class="btn btn-primary btn-wide" type="submit">Conferma la prenotazione</button></div>
        </form>`;
    }

    if (bk.step === 4) {
      const b = bk.saved, svc = ALL[b.svc];
      $("#sheet-title").textContent = "Richiesta inviata";
      body.innerHTML = `
        <div class="done-mark" aria-hidden="true">✓</div>
        <div class="summary">
          <strong>${esc(svc.name)}</strong>
          ${longDate(parseYmd(b.date))}, ore ${toHm(b.start)}<br>
          ${esc(salon.name)}${salon.city ? `, ${esc(salon.city)}` : ""}<br>
          Codice <span class="code">${b.code}</span>
        </div>
        <p class="fineprint" style="margin-top:10px">L'orario è già tenuto per te. Il salone ti conferma a breve su WhatsApp.</p>
        <div class="stack">
          <button class="btn btn-ghost" id="ics">Aggiungi al calendario</button>
          <button class="btn btn-ghost" data-close>Chiudi</button>
        </div>
        <div class="callout">
          <p><strong>Adesso guardala dalla parte del salone.</strong> La richiesta è già arrivata in agenda, senza una telefonata, e decidi tu se confermarla.</p>
          <a class="btn btn-primary btn-wide" href="#pannello" id="to-admin">Apri il pannello del salone</a>
        </div>`;
    }
    $("#sheet-body").scrollTop = 0;
  }

  sheet.addEventListener("click", e => {
    const t = e.target.closest("button, a, [data-close]");
    if (!t) return;
    if (t.matches("[data-close]")) return closeBooking();
    if (t.id === "sheet-back") { bk.step = Math.max(1, bk.step - 1); return renderStep(); }
    if (t.dataset.pick != null) { bk.svc = +t.dataset.pick; bk.step = 2; return renderStep(); }
    if (t.dataset.day) { bk.date = t.dataset.day; bk.time = null; return renderStep(); }
    if (t.dataset.time) { bk.time = +t.dataset.time; return renderStep(); }
    if (t.id === "to-step3") { bk.step = 3; return renderStep(); }
    if (t.id === "ics") return downloadIcs(bk.saved);
    if (t.id === "to-admin") closeBooking();
  });

  sheet.addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target, name = f.name.value.trim(), phone = f.phone.value.trim(), notes = f.notes.value.trim();
    f.querySelectorAll(".err").forEach(x => x.remove());
    let ok = true;
    const err = (input, msg) => { ok = false; input.insertAdjacentHTML("afterend", `<p class="err">${msg}</p>`); };
    if (name.length < 2) err(f.name, "Scrivi il tuo nome, così il salone sa chi arriva.");
    if (phone.replace(/\D/g, "").length < 8) err(f.phone, "Serve un numero di cellulare valido per il promemoria.");
    if (!ok) return;
    Object.assign(bk, { name, phone, notes });
    const svc = ALL[bk.svc];
    if (!freeSlots(bk.date, svc.dur).includes(bk.time)) { bk.step = 2; bk.time = null; renderStep(); return toast("Quell'orario è appena stato preso: scegline un altro."); }
    const code = Array.from({ length: 6 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random()*32)]).join("");
    const saved = { id: `u-${Date.now()}`, date: bk.date, start: bk.time, end: bk.time + svc.dur, svc: svc.id,
      who: name, phone, notes, source: "online", createdH: new Date().getHours(), status: "da confermare", code, isNew: true };
    store.set("bookings", [...userBookings(), saved]);
    store.set("last", saved.id);
    bk.saved = saved; bk.step = 4;
    renderStep();
    renderSite();
  });

  function downloadIcs(b) {
    const svc = ALL[b.svc], d = b.date.replace(/-/g, "");
    const t = m => `${d}T${pad(Math.floor(m/60))}${pad(m%60)}00`;
    const ics = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Demo prenotazioni//IT","BEGIN:VEVENT",
      `UID:${b.code}@demo`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,"").slice(0,15)}Z`,
      `DTSTART:${t(b.start)}`, `DTEND:${t(b.end)}`, `SUMMARY:${svc.name} - ${salon.name}`,
      `LOCATION:${salon.name}${salon.city ? ", " + salon.city : ""}`, "BEGIN:VALARM","TRIGGER:-PT2H","ACTION:DISPLAY","DESCRIPTION:Promemoria","END:VALARM",
      "END:VEVENT","END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "appuntamento.ics";
    document.body.appendChild(a); a.click(); a.remove();
  }

  /* ================= Pannello del salone ================= */
  let adminDay = null;
  function renderAdmin() {
    const lastId = store.get("last", null);
    const last = userBookings().find(b => b.id === lastId);
    if (!adminDay) {
      if (last) adminDay = last.date;
      else { let d = today(); while (!isOpen(d)) d = addDays(d, 1); adminDay = ymd(d); }
    }

    const banner = $("#admin-new");
    if (last) {
      const st = store.get("status", {})[last.id] || last.status;
      const head = st === "da confermare" ? "Nuova richiesta online: decidi tu se confermarla"
        : st === "rifiutata" ? "Richiesta rifiutata: l'orario è di nuovo libero" : "Prenotazione online confermata";
      banner.hidden = false;
      banner.innerHTML = `<strong>${head}</strong>${esc(last.who)}, ${esc(ALL[last.svc].name).toLowerCase()}, ${longDate(parseYmd(last.date))} alle ${toHm(last.start)}`;
    } else banner.hidden = true;

    // Statistiche della settimana corrente (lun-dom)
    const t0 = today(), monday = addDays(t0, -((t0.getDay() + 6) % 7));
    let week = [];
    for (let i = 0; i < 7; i++) week = week.concat(bookingsOn(ymd(addDays(monday, i))).filter(b => b.status !== "rifiutata"));
    const online = week.filter(b => b.source === "online");
    const offHours = online.filter(b => b.createdH < 9 || b.createdH >= 19).length;
    $("#admin-stats").innerHTML = `
      <div class="stat"><strong>${week.length}</strong><span>appuntamenti questa settimana</span></div>
      <div class="stat"><strong>${week.length ? Math.round(online.length / week.length * 100) : 0}%</strong><span>prenotati online, senza telefonate</span></div>
      <div class="stat"><strong>${offHours}</strong><span>arrivati a salone chiuso, di sera o all'alba</span></div>`;

    const d = parseYmd(adminDay);
    $("#agenda-day").textContent = ymd(d) === ymd(t0) ? `Oggi, ${d.getDate()} ${MONTHS[d.getMonth()]}` : longDate(d);
    const list = bookingsOn(adminDay);
    $("#agenda-list").innerHTML = !isOpen(d)
      ? `<li class="empty">${DAY_NAMES[d.getDay()]}: salone chiuso.</li>`
      : list.length ? list.map(b => {
          const svc = ALL[b.svc];
          const isNew = b.id === lastId;
          return `<li class="appt ${isNew ? "is-new" : ""} ${b.status === "rifiutata" ? "is-off" : ""}">
            <div class="appt-time">${toHm(b.start)}<small>${toHm(b.end)}</small></div>
            <div>
              <p class="appt-who">${esc(b.who)}</p>
              <p class="appt-what">${esc(svc.name)}</p>
              ${b.notes ? `<p class="appt-what">“${esc(b.notes)}”</p>` : ""}
              <div class="appt-tags">
                ${b.source === "online" ? `<span class="tag online">Online${b.createdH < 9 || b.createdH >= 19 ? `, alle ${b.createdH}:${pad((b.start * 7) % 60)}` : ""}</span>` : `<span class="tag">${esc(b.source)}</span>`}
                ${b.status === "da confermare" ? `<span class="tag pending">Da confermare</span>`
                  : b.status === "rifiutata" ? `<span class="tag">Rifiutata</span>`
                  : b.status === "fatta" ? `<span class="tag">Fatto</span>` : ""}
              </div>
              ${b.status === "da confermare" && parseYmd(b.date) >= t0 ? `<div class="appt-actions">
                <button class="mini mini-main" data-confirm="${b.id}" data-who="${esc(b.who)}">Conferma e scrivi su WhatsApp</button>
                <button class="mini" data-refuse="${b.id}">Rifiuta</button>
              </div>`
              : b.status === "confermata" && parseYmd(b.date) >= t0 ? `<div class="appt-actions">
                <button class="mini" data-remind="${esc(b.who)}">Promemoria WhatsApp</button>
              </div>` : ""}
            </div></li>`;
        }).join("")
      : `<li class="empty">Nessun appuntamento.</li>`;
  }

  $("#day-prev").onclick = () => { adminDay = ymd(addDays(parseYmd(adminDay), -1)); renderAdmin(); };
  $("#day-next").onclick = () => { adminDay = ymd(addDays(parseYmd(adminDay), 1)); renderAdmin(); };
  const setStatus = (id, s) => { const st = store.get("status", {}); st[id] = s; store.set("status", st); };
  $("#agenda-list").addEventListener("click", e => {
    const c = e.target.closest("[data-confirm]"), x = e.target.closest("[data-refuse]"), r = e.target.closest("[data-remind]");
    if (c) { setStatus(c.dataset.confirm, "confermata"); renderAdmin(); toast(`Confermata. Nella versione reale si apre WhatsApp con la conferma per ${c.dataset.who} già scritta: premi solo invio.`); }
    if (x) { setStatus(x.dataset.refuse, "rifiutata"); renderAdmin(); renderSite(); toast("Rifiutata. L'orario torna libero sul sito."); }
    if (r) toast(`Nella versione reale si apre WhatsApp con il promemoria per ${r.dataset.remind} già scritto: premi solo invio.`);
  });
  $("#reset-demo").onclick = () => { store.clear(); adminDay = null; location.hash = ""; renderSite(); toast("Demo azzerata."); };

  /* ================= Lo decidi tu (impostazioni) ================= */
  function renderSettings() {
    const s = sets();
    $("#set-hours").innerHTML = [2,3,4,5,6,0,1].map(i => {
      const r = HOURS[i];
      return `<li><span>${DAY_NAMES[i]}</span><span>${r.length ? r.map(([a,b]) => `${a}–${b}`).join(", ") : "Chiuso"}</span></li>`;
    }).join("");
    const upcoming = s.closures.filter(c => parseYmd(c) >= today()).sort();
    $("#set-closures").innerHTML = upcoming.length
      ? upcoming.map(c => `<li><span>${longDate(parseYmd(c))}</span><button class="linklike" data-unclose="${c}">Riapri</button></li>`).join("")
      : `<li class="fineprint">Nessuna chiusura straordinaria in programma.</li>`;
    const inp = $("#close-date");
    inp.min = ymd(today()); inp.max = ymd(addDays(today(), 90));
    $("#set-lead").value = String(s.leadH);
    $("#set-cancel").checked = s.allowCancel;
    $("#set-cancel-h").value = String(s.cancelH);
    $("#set-cancel-h").disabled = !s.allowCancel;
  }
  $("#close-add").onclick = () => {
    const v = $("#close-date").value;
    if (!v) return toast("Scegli prima il giorno da chiudere.");
    const s = sets();
    if (!s.closures.includes(v)) saveSets({ closures: [...s.closures, v] });
    $("#close-date").value = "";
    renderSettings(); renderSite();
    toast(`Chiuso ${longDate(parseYmd(v))}: sul sito quel giorno non si può più prenotare.`);
  };
  $("#set-closures").addEventListener("click", e => {
    const b = e.target.closest("[data-unclose]");
    if (!b) return;
    saveSets({ closures: sets().closures.filter(c => c !== b.dataset.unclose) });
    renderSettings(); renderSite();
    toast("Giorno riaperto alle prenotazioni.");
  });
  $("#set-lead").onchange = e => {
    saveSets({ leadH: +e.target.value }); renderSite();
    toast(+e.target.value >= 24 ? "Ora si prenota solo dal giorno dopo in poi." : `Ora si prenota con almeno ${e.target.value} ${+e.target.value === 1 ? "ora" : "ore"} di preavviso.`);
  };
  $("#set-cancel").onchange = e => { saveSets({ allowCancel: e.target.checked }); renderSettings(); toast(e.target.checked ? "Le clienti possono annullare da sole." : "Per annullare, le clienti devono scriverti."); };
  $("#set-cancel-h").onchange = e => { saveSets({ cancelH: +e.target.value }); toast(`Annullamento possibile fino a ${e.target.value} ore prima.`); };

  /* ================= Navigazione ================= */
  function route() {
    const admin = location.hash === "#pannello";
    $("#site").hidden = admin;
    $("#admin").hidden = !admin;
    $("#ribbon-link").hidden = admin;
    if (admin) { renderAdmin(); renderSettings(); }
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  document.addEventListener("click", e => {
    const t = e.target.closest("[data-open-booking], [data-svc], [data-slot], [data-fake]");
    if (!t) return;
    if (t.dataset.svc != null) return openBooking({ svc: +t.dataset.svc });
    if (t.dataset.slot) { const [date, time] = t.dataset.slot.split("|"); return openBooking({ date, time: +time }); }
    if (t.dataset.fake) return toast(t.dataset.fake === "whatsapp" ? "Nella versione reale si apre la chat WhatsApp del salone." : "Nella versione reale parte la chiamata al salone.");
    openBooking();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !sheet.hidden) closeBooking(); });

  const top = $(".top");
  addEventListener("scroll", () => top.classList.toggle("scrolled", scrollY > 160), { passive: true });

  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg; el.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.hidden = true, 3200);
  }

  renderSite();
  route();
})();
