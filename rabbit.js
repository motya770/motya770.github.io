// Pixel rabbit that lives in the meadow canvas.
// Sprites are drawn as strings; each character maps to a palette colour ('.' = transparent).
(() => {
  const PALETTE = {
    W: "#f4f4f4", // fur
    L: "#b9b9c4", // fur shade
    P: "#ff8fb1", // inner ear / nose
    C: "#ffc4d6", // cheek blush
    K: "#111111", // eye
    O: "#ff8a1f", // carrot
    D: "#d86a0c", // carrot shade
    V: "#3ecf5a", // carrot leaves
    H: "#ff4d6d", // heart
    G: "#1f5f2f", // grass
    g: "#2f8f45", // grass light
  };

  const SIT = [
    ".............WW.WW..",
    ".............WP.WP..",
    ".............WP.WP..",
    ".............WP.WP..",
    ".............WW.WW..",
    "............WWWWWWW.",
    "...........WWWWWWWWW",
    "...........WWWWWKWWW",
    "...........WWWCWWWWP",
    "......WWWWWWWWWWWWW.",
    "....WWWWWWWWWWWWWW..",
    "..WWWWWWWWWWWWWWW...",
    ".WWWWWWWWWWWWWWW....",
    "WWWWWWWWWWWWWWWW....",
    "WWWWWWWWWWWWWWLL....",
    ".LWWWWWWWWLWWWWW....",
    "..LLLLLLL..LLLL.....",
  ];

  const LEAP = [
    "................WW.WW.",
    "...............WP.WP..",
    "..............WP.WP...",
    "..............WWWWW...",
    ".............WWWWWWWW.",
    ".............WWWWWKWWW",
    "......WWWWWWWWWWWCWWWP",
    "...WWWWWWWWWWWWWWWWWW.",
    ".WWWWWWWWWWWWWWWWWWW..",
    "WWWWWWWWWWWWWWWWWWWL..",
    "WWWWWWWWWWWWWWWWWWWWW.",
    "WWWWWLLLLLLLLLLL..WWWW",
    "LWWW...............LL.",
    "LL....................",
  ];

  const CARROT = [
    ".....V.V",
    "......V.",
    ".....OO.",
    "....OOD.",
    "...OOD..",
    "..OOD...",
    ".OD.....",
    "O.......",
  ];

  const HEART = [
    ".HH.HH.",
    "HHHHHHH",
    "HHHHHHH",
    ".HHHHH.",
    "..HHH..",
    "...H...",
  ];

  const setPixel = (rows, r, c, ch) =>
    rows.map((row, i) => (i === r ? row.slice(0, c) + ch + row.slice(c + 1) : row));

  const BLINK = setPixel(SIT, 7, 16, "L");
  // front ear flops forward
  const TWITCH = [
    ".............WW.....",
    ".............WP.WWW.",
    ".............WP.WPW.",
    ".............WP.WP..",
    ...SIT.slice(4),
  ];
  const SNIFF = setPixel(SIT, 8, 19, "C");
  const CROUCH = SIT.filter((_, i) => i !== 4 && i !== 10);
  const EAT = setPixel(setPixel(SIT, 8, 19, "W"), 9, 18, "P");

  const mirror = (rows) => rows.map((r) => [...r].reverse().join(""));
  const cache = new Map();
  const frame = (rows, facing) => {
    if (facing > 0) return rows;
    if (!cache.has(rows)) cache.set(rows, mirror(rows));
    return cache.get(rows);
  };

  const canvas = document.getElementById("meadow");
  const ctx = canvas.getContext("2d");
  let SCALE = 4;
  let W = 0, H = 0, GROUND = 0;
  let grass = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    SCALE = rect.width < 500 ? 3 : 4;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr * SCALE, 0, 0, dpr * SCALE, 0, 0);
    ctx.imageSmoothingEnabled = false;
    W = Math.floor(rect.width / SCALE);
    H = Math.floor(rect.height / SCALE);
    GROUND = H - 5;
    grass = [];
    for (let x = 0; x < W; x += 2 + Math.floor(Math.random() * 5)) {
      grass.push({ x, h: 1 + Math.floor(Math.random() * 3), light: Math.random() < 0.4 });
    }
    rabbit.x = Math.min(Math.max(rabbit.x, 4), W - 24);
  }

  function drawSprite(rows, x, y) {
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < row.length; c++) {
        const ch = row[c];
        if (ch === ".") continue;
        ctx.fillStyle = PALETTE[ch];
        ctx.fillRect(Math.round(x) + c, Math.round(y) + r, 1, 1);
      }
    }
  }

  // ---------- state ----------
  const rabbit = {
    x: 20,
    facing: 1,
    mode: "idle",   // idle | hop | eat
    t: 0,           // time in current mode
    hopFrom: 0,
    hopTo: 0,
    hopsLeft: 0,
    nextThink: 1.5,
    blinkAt: 2,
    twitchUntil: 0,
    sniffUntil: 0,
    blinkUntil: 0,
  };
  const HOP_TIME = 0.42;
  const CROUCH_TIME = 0.09;
  const HOP_DIST = 16;
  const HOP_HEIGHT = 10;

  let carrot = null;  // { x, y, vy, landed, bites }
  const particles = []; // hearts / crumbs
  let clock = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function walkTo(targetX) {
    targetX = Math.max(2, Math.min(W - 24, targetX));
    const dist = targetX - rabbit.x;
    if (Math.abs(dist) < 3) return false;
    rabbit.facing = dist > 0 ? 1 : -1;
    rabbit.hopsLeft = Math.max(1, Math.round(Math.abs(dist) / HOP_DIST));
    startHop(dist / rabbit.hopsLeft);
    return true;
  }

  function startHop(dx) {
    rabbit.mode = "hop";
    rabbit.t = 0;
    rabbit.hopFrom = rabbit.x;
    rabbit.hopTo = rabbit.x + dx;
    rabbit.hopDx = dx;
  }

  function heart(x, y) {
    particles.push({ kind: "heart", x, y, vy: -10, life: 1.4 });
  }

  function think() {
    const roll = Math.random();
    if (roll < 0.45) {
      walkTo(4 + Math.random() * (W - 30));
    } else if (roll < 0.65) {
      rabbit.sniffUntil = clock + 1.2;
    } else if (roll < 0.8) {
      rabbit.twitchUntil = clock + 0.35;
    } else if (roll < 0.9) {
      rabbit.facing *= -1;
    }
    rabbit.nextThink = clock + 2 + Math.random() * 4;
  }

  function update(dt) {
    clock += dt;
    rabbit.t += dt;

    if (clock > rabbit.blinkAt) {
      rabbit.blinkUntil = clock + 0.13;
      rabbit.blinkAt = clock + 2 + Math.random() * 4;
    }

    if (rabbit.mode === "hop") {
      const total = CROUCH_TIME * 2 + HOP_TIME;
      if (rabbit.t >= total) {
        rabbit.x = rabbit.hopTo;
        rabbit.hopsLeft--;
        if (rabbit.hopsLeft > 0) {
          startHop(rabbit.hopDx);
        } else {
          rabbit.mode = "idle";
          rabbit.t = 0;
          if (carrot && carrot.landed && Math.abs(carrotMouthDist()) < 6) {
            rabbit.mode = "eat";
            rabbit.t = 0;
          }
        }
      } else if (rabbit.t > CROUCH_TIME && rabbit.t < CROUCH_TIME + HOP_TIME) {
        const p = (rabbit.t - CROUCH_TIME) / HOP_TIME;
        rabbit.x = rabbit.hopFrom + (rabbit.hopTo - rabbit.hopFrom) * p;
      }
    } else if (rabbit.mode === "eat") {
      if (rabbit.t > 0.45) {
        rabbit.t = 0;
        carrot.bites++;
        particles.push({ kind: "crumb", x: carrot.x + 2, y: GROUND - 3, vx: (Math.random() - 0.5) * 20, vy: -18, life: 0.6 });
        if (carrot.bites >= 5) {
          carrot = null;
          rabbit.mode = "idle";
          heart(rabbit.x + 8, GROUND - 22);
          rabbit.nextThink = clock + 2;
        }
      }
    } else if (rabbit.mode === "idle") {
      if (carrot && carrot.landed) {
        const d = carrotMouthDist();
        if (!walkTo(rabbit.x + d)) { rabbit.mode = "eat"; rabbit.t = 0; }
      } else if (clock > rabbit.nextThink && !reduceMotion) {
        think();
      }
    }

    if (carrot && !carrot.landed) {
      carrot.vy += 160 * dt;
      carrot.y += carrot.vy * dt;
      if (carrot.y >= GROUND - 8) {
        carrot.y = GROUND - 8;
        carrot.landed = true;
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life -= dt;
      if (p.kind === "crumb") { p.vy += 80 * dt; p.x += p.vx * dt; }
      p.y += p.vy * dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  // horizontal distance from the rabbit's mouth to the carrot
  function carrotMouthDist() {
    const mouth = rabbit.facing > 0 ? rabbit.x + 17 : rabbit.x + 3;
    const target = rabbit.facing > 0 ? carrot.x : carrot.x + 7;
    return target - mouth;
  }

  function currentSprite() {
    if (rabbit.mode === "hop") {
      const t = rabbit.t;
      if (t < CROUCH_TIME || t > CROUCH_TIME + HOP_TIME) return { rows: CROUCH, lift: 0 };
      const p = (t - CROUCH_TIME) / HOP_TIME;
      const lift = Math.sin(p * Math.PI) * HOP_HEIGHT;
      return { rows: p > 0.12 && p < 0.88 ? LEAP : SIT, lift };
    }
    if (rabbit.mode === "eat") {
      return { rows: rabbit.t % 0.45 < 0.22 ? EAT : SIT, lift: 0 };
    }
    if (clock < rabbit.blinkUntil) return { rows: BLINK, lift: 0 };
    if (clock < rabbit.twitchUntil) return { rows: TWITCH, lift: 0 };
    if (clock < rabbit.sniffUntil && Math.floor(clock * 8) % 2) return { rows: SNIFF, lift: 0 };
    return { rows: SIT, lift: 0 };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // ground + grass
    ctx.fillStyle = PALETTE.G;
    for (let x = 0; x < W; x += 2) ctx.fillRect(x, GROUND + 1, 1, 1);
    for (const g of grass) {
      ctx.fillStyle = g.light ? PALETTE.g : PALETTE.G;
      ctx.fillRect(g.x, GROUND + 1 - g.h, 1, g.h);
    }

    if (carrot) {
      const rows = carrot.bites ? CARROT.slice(0, CARROT.length - carrot.bites) : CARROT;
      drawSprite(rows, carrot.x, carrot.y);
    }

    const { rows, lift } = currentSprite();
    const sprite = frame(rows, rabbit.facing);
    // keep the rabbit's body roughly anchored when the sprite width changes
    const xOff = rows === LEAP && rabbit.facing < 0 ? -2 : 0;
    // soft shadow
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    const shadowW = Math.max(6, 16 - lift);
    ctx.fillRect(Math.round(rabbit.x + 10 - shadowW / 2), GROUND, Math.round(shadowW), 1);
    drawSprite(sprite, rabbit.x + xOff, GROUND - rows.length - lift);

    for (const p of particles) {
      if (p.kind === "heart") {
        ctx.globalAlpha = Math.min(1, p.life);
        drawSprite(HEART, p.x, p.y);
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = PALETTE.O;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
      }
    }
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  // ---------- public API (used by terminal commands) ----------
  window.Rabbit = {
    hop() {
      if (rabbit.mode !== "idle") return false;
      const dir = rabbit.x > W - 44 ? -1 : rabbit.x < 20 ? 1 : rabbit.facing;
      rabbit.facing = dir;
      rabbit.hopsLeft = 1;
      startHop(dir * HOP_DIST);
      return true;
    },
    pet() {
      heart(rabbit.x + (rabbit.facing > 0 ? 10 : 3), GROUND - 24);
      rabbit.blinkUntil = clock + 0.5;
    },
    feed() {
      if (carrot) return false;
      carrot = { x: 6 + Math.random() * (W - 20), y: -10, vy: 0, landed: false, bites: 0 };
      rabbit.nextThink = clock + 999;
      return true;
    },
    come(side) {
      rabbit.mode = "idle";
      walkTo(side === "left" ? 4 : W - 26);
    },
  };

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / SCALE;
    if (x > rabbit.x - 4 && x < rabbit.x + 26) {
      window.Rabbit.pet();
      window.Rabbit.hop();
    } else if (rabbit.mode === "idle") {
      walkTo(x - 10);
    }
  });

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(loop);
})();
