// Chiara Iermano — molecules.js
// Sfondo hero: "molecole" dorate che si compongono e si scompongono di continuo.
(function () {
  const canvas = document.getElementById("hero-molecules");
  if (!canvas) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d");
  const GOLD = "217,195,154";
  const GOLD_DEEP = "184,147,79";

  let W = 0, H = 0, dpr = 1, atoms = [], clusters = [], last = 0;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function build() {
    atoms = []; clusters = [];
    const nClusters = Math.max(5, Math.min(11, Math.round((W * H) / 130000)));
    for (let c = 0; c < nClusters; c++) {
      const cl = newCluster(c);
      clusters.push(cl);
      const n = Math.round(rand(4, 8));
      for (let i = 0; i < n; i++) {
        atoms.push({
          x: cl.x + rand(-160, 160), y: cl.y + rand(-160, 160),
          vx: rand(-0.15, 0.15), vy: rand(-0.15, 0.15),
          r: rand(1.8, 4.2), cluster: c, bond: rand(0.5, 1)
        });
      }
    }
  }

  function newCluster(id, x, y) {
    return {
      id, x: x != null ? x : rand(W * 0.05, W * 0.95), y: y != null ? y : rand(H * 0.05, H * 0.95),
      vx: rand(-0.08, 0.08), vy: rand(-0.06, 0.06),
      radius: rand(55, 110),
      phase: "gather", t: rand(0, 4000),
      gatherT: rand(6000, 11000), holdT: rand(3000, 6000), burstT: rand(2500, 4000)
    };
  }

  function step(dt) {
    for (const cl of clusters) {
      cl.t += dt;
      cl.x += cl.vx * dt * 0.06; cl.y += cl.vy * dt * 0.06;
      if (cl.x < 0 || cl.x > W) cl.vx *= -1;
      if (cl.y < 0 || cl.y > H) cl.vy *= -1;
      if (cl.phase === "gather" && cl.t > cl.gatherT) { cl.phase = "hold"; cl.t = 0; }
      else if (cl.phase === "hold" && cl.t > cl.holdT) { cl.phase = "burst"; cl.t = 0;
        for (const a of atoms) if (a.cluster === cl.id) {
          const ang = Math.atan2(a.y - cl.y, a.x - cl.x) + rand(-0.4, 0.4);
          const sp = rand(0.5, 1.3);
          a.vx = Math.cos(ang) * sp; a.vy = Math.sin(ang) * sp;
        }
      }
      else if (cl.phase === "burst" && cl.t > cl.burstT) {
        // nuova molecola altrove: gli atomi vengono riattratti verso un nuovo centro
        const n = newCluster(cl.id, rand(W * 0.1, W * 0.9), rand(H * 0.1, H * 0.9));
        n.t = 0; clusters[clusters.indexOf(cl)] = n;
      }
    }
    for (const a of atoms) {
      const cl = clusters[a.cluster];
      if (cl.phase !== "burst") {
        // attrazione morbida verso una posizione orbitale intorno al centro
        const dx = cl.x - a.x, dy = cl.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const target = cl.radius * a.bond;
        const pull = (d - target) * 0.00025 * dt;
        a.vx += (dx / d) * pull; a.vy += (dy / d) * pull;
        // leggera rotazione orbitale
        a.vx += (-dy / d) * 0.0006 * dt * 0.1; a.vy += (dx / d) * 0.0006 * dt * 0.1;
        a.vx *= 0.985; a.vy *= 0.985;
      } else {
        a.vx *= 0.995; a.vy *= 0.995;
      }
      a.x += a.vx * dt * 0.06; a.y += a.vy * dt * 0.06;
      if (a.x < -50) a.x = W + 50; if (a.x > W + 50) a.x = -50;
      if (a.y < -50) a.y = H + 50; if (a.y > H + 50) a.y = -50;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // legami
    ctx.lineCap = "round";
    for (let i = 0; i < atoms.length; i++) {
      const a = atoms[i];
      for (let j = i + 1; j < atoms.length; j++) {
        const b = atoms[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        const same = a.cluster === b.cluster;
        const max = same ? 150 : 90;
        if (d2 > max * max) continue;
        const d = Math.sqrt(d2);
        const k = 1 - d / max;
        const cl = clusters[a.cluster];
        const fade = same && cl.phase === "burst" ? Math.max(0, 1 - cl.t / cl.burstT) : 1;
        ctx.strokeStyle = "rgba(" + GOLD + "," + (k * (same ? 0.55 : 0.18) * fade).toFixed(3) + ")";
        ctx.lineWidth = same ? 1.1 : 0.7;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    // atomi
    for (const a of atoms) {
      const g = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.r * 4);
      g.addColorStop(0, "rgba(" + GOLD + ",0.55)");
      g.addColorStop(1, "rgba(" + GOLD_DEEP + ",0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r * 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(" + GOLD + ",0.95)";
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  function frame(ts) {
    const dt = Math.min(50, ts - (last || ts)); last = ts;
    step(dt); draw();
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  if (reduce) { for (let i = 0; i < 200; i++) step(16); draw(); }
  else requestAnimationFrame(frame);
})();
