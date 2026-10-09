/* ===== 1. LOADER (runs first, can't get stuck) ===== */
(() => {
  const loader = document.getElementById("loader");
  if (!loader) { document.body.classList.add("ready"); return; }
  const bar = document.getElementById("ldBar");
  const num = document.getElementById("ldNum");
  document.body.style.overflow = "hidden";
  let n = 0, done = false;

  const finish = () => {
    if (done) return;
    done = true;
    loader.classList.add("hide");
    document.body.style.overflow = "";
    document.body.classList.add("ready");
    document.dispatchEvent(new Event("siteready"));
    setTimeout(() => loader.remove(), 1000);
  };

  const t = setInterval(() => {
    n = Math.min(100, n + Math.random() * 9 + 3);
    bar.style.width = n + "%";
    num.textContent = Math.floor(n) + "%";
    if (n >= 100) { clearInterval(t); setTimeout(finish, 250); }
  }, 90);

  setTimeout(finish, 4000); // failsafe
})();

/* =====================================================
   2. EDIT THIS PART: YOUR DETAILS + PROJECTS
   ===================================================== */
const CONFIG = {
  email: "arunshanmukananda@gmail.com",
  github: "Arun-301",
  linkedin: "https://www.linkedin.com/in/arun-shanmukanandam-14b8712b9",
  resume: "resume.pdf"                          // put resume.pdf in the same folder
};

// Your best 2-4 projects. Leave live/code as "" until they're ready.
const FEATURED = [
  {
    title: "Project One",
    problem: "One line: what problem does it solve and for whom?",
    tech: ["HTML", "CSS", "JavaScript"],
    live: "",   // e.g. "https://arun-301.github.io/project-one"
    code: ""    // e.g. "https://github.com/Arun-301/project-one"
  },
  {
    title: "Project Two",
    problem: "One line: what problem does it solve and for whom?",
    tech: ["Java", "DSA"],
    live: "",
    code: ""
  },
  {
    title: "Project Three",
    problem: "One line: what problem does it solve and for whom?",
    tech: ["Python", "Cloud"],
    live: "",
    code: ""
  }
];
/* ===================================================== */

/* ===== 3. SETUP ===== */
const THEMES = {
  spider: {
    tag: "// your friendly neighbourhood",
    roles: ["Full-Stack Developer", "Web Slinger of Code", "Future Founder", "CS Student"],
    sfx: ["THWIP!", "POW!", "ZAP!", "BAM!", "WHAM!"],
    critter: "🕷️", cursor: "🕷️", btn: "🏴‍☠️ pirate mode",
    rain: ["🕷️", "🕸️", "💥"]
  },
  pirate: {
    tag: "// ahoy, captain on deck",
    roles: ["Code Pirate", "Full-Stack Sailor", "Bug Treasure Hunter", "Future Captain"],
    sfx: ["ARRR!", "YO HO!", "SAVVY?", "BOOM!", "AHOY!"],
    critter: "⛵", cursor: "🗡️", btn: "🕷️ spider mode",
    rain: ["🏴‍☠️", "💰", "⚓", "🦜"]
  }
};
let theme = "spider";
const root = document.documentElement;
const $ = id => document.getElementById(id);
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

/* ===== 4. LINKS FROM CONFIG ===== */
const LINKS = {
  resume: CONFIG.resume,
  github: "https://github.com/" + CONFIG.github,
  linkedin: CONFIG.linkedin,
  email: "mailto:" + CONFIG.email
};
document.querySelectorAll("[data-link]").forEach(a => { a.href = LINKS[a.dataset.link]; });

/* ===== 5. NAME: split into letters (simple pop-in) ===== */
document.querySelectorAll(".name .line").forEach((line, li) => {
  line.textContent = "";
  [...line.dataset.text].forEach((ch, i) => {
    const s = el("span", "ch", ch === " " ? "\u00A0" : ch);
    s.style.setProperty("--i", i + li * 4);
    line.appendChild(s);
  });
});

/* ===== 6. TYPING LOOP ===== */
const typed = $("typed");
let r = 0, c = 0, deleting = false;
function type() {
  const roles = THEMES[theme].roles;
  const word = roles[r % roles.length];
  typed.textContent = word.slice(0, deleting ? --c : ++c);
  let delay = deleting ? 45 : 90;
  if (!deleting && c === word.length) { delay = 1500; deleting = true; }
  else if (deleting && c === 0) { deleting = false; r++; delay = 400; }
  setTimeout(type, delay);
}
type();

/* ===== 7. FEATURED PROJECT CARDS ===== */
const htrack = $("htrack");
FEATURED.forEach((p, i) => {
  const card = el("article", "card tilt");
  card.append(el("span", "num", "PROJECT #0" + (i + 1)), el("h3", "", p.title), el("p", "", p.problem));
  const chips = el("div", "chips");
  p.tech.forEach(t => chips.appendChild(el("span", "", t)));
  if (!p.live && !p.code) chips.appendChild(el("span", "warn", "coming soon"));
  card.appendChild(chips);
  const links = el("div", "plinks");
  if (p.live) {
    const a = el("a", "mini", "live demo ↗");
    a.href = p.live; a.target = "_blank"; a.rel = "noopener";
    links.appendChild(a);
  }
  if (p.code) {
    const a = el("a", "mini alt", "source code");
    a.href = p.code; a.target = "_blank"; a.rel = "noopener";
    links.appendChild(a);
  }
  card.appendChild(links);
  htrack.appendChild(card);
});

/* ===== 8. BACKGROUND: spider web  /  pirate sea + treasure ===== */
const cv = $("bg"), ctx = cv.getContext("2d");
let W, H, pts = [], coins = [], t = 0, shipX = 0;
let mouse = { x: -999, y: -999 };
let col1 = "#2f5bff", col2 = "#ff1f3d", col3 = "#ffd60a";

function readColors() {
  const cs = getComputedStyle(root);
  col1 = cs.getPropertyValue("--p2").trim();
  col2 = cs.getPropertyValue("--p1").trim();
  col3 = cs.getPropertyValue("--p3").trim();
}
function resize() {
  W = cv.width = innerWidth; H = cv.height = innerHeight;
  pts = Array.from({ length: Math.min(90, Math.floor(W / 16)) }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .6
  }));
  coins = Array.from({ length: Math.min(60, Math.floor(W / 22)) }, () => ({
    x: Math.random() * W, y: Math.random() * H * .78,
    vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .25,
    r: 2 + Math.random() * 3, tw: Math.random() * 6.28
  }));
  shipX = W / 2;
}
addEventListener("resize", resize);
addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

/* --- spider mode: web network that reaches for the cursor --- */
function drawWeb() {
  ctx.setLineDash([]);
  pts.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.fillStyle = col1; ctx.globalAlpha = .8;
    ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 6.28); ctx.fill();
    for (let j = i + 1; j < pts.length; j++) {
      const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 130) {
        ctx.globalAlpha = (1 - d / 130) * .45; ctx.strokeStyle = col1;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    }
    const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
    if (md < 180) {
      ctx.globalAlpha = (1 - md / 180) * .8; ctx.strokeStyle = col2; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      ctx.lineWidth = 1;
    }
  });
  ctx.globalAlpha = 1;
}

/* --- pirate mode: waves, ship that sails to the cursor, coins caught by a rope --- */
function waveY(x, layer) {
  return H * .84 + layer * 20
    + Math.sin(x * .008 + t * (1 + layer * .35) + layer * 2) * 14
    + Math.sin(x * .021 - t * 1.7) * 4;
}
function waveLayer(layer, alpha) {
  ctx.setLineDash([]);
  ctx.globalAlpha = alpha; ctx.fillStyle = col1;
  ctx.beginPath(); ctx.moveTo(0, H);
  for (let x = 0; x <= W + 12; x += 12) ctx.lineTo(x, waveY(x, layer));
  ctx.lineTo(W + 12, H); ctx.closePath(); ctx.fill();
  ctx.globalAlpha = .28; ctx.strokeStyle = col3; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= W + 12; x += 12) {
    if (x === 0) ctx.moveTo(x, waveY(x, layer)); else ctx.lineTo(x, waveY(x, layer));
  }
  ctx.stroke();
  ctx.lineWidth = 1;
}
function drawSea() {
  t += .016;
  const sky = H * .78;

  // floating gold coins (pulled toward the cursor)
  coins.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = sky; if (p.y > sky) p.y = 0;
    const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
    if (md < 180) { p.x += (mouse.x - p.x) * .012; p.y += (mouse.y - p.y) * .012; }
    const tw = .55 + .45 * Math.sin(t * 2.2 + p.tw);
    ctx.globalAlpha = tw; ctx.fillStyle = col2;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill();
    ctx.globalAlpha = tw * .9; ctx.fillStyle = "#fff6c8";
    ctx.beginPath(); ctx.arc(p.x - p.r * .3, p.y - p.r * .3, p.r * .35, 0, 6.28); ctx.fill();
  });

  // dashed treasure-map trails between nearby coins
  ctx.setLineDash([3, 7]); ctx.lineWidth = 1; ctx.strokeStyle = col2;
  for (let i = 0; i < coins.length; i++) {
    for (let j = i + 1; j < coins.length; j++) {
      const d = Math.hypot(coins[i].x - coins[j].x, coins[i].y - coins[j].y);
      if (d < 120) {
        ctx.globalAlpha = (1 - d / 120) * .35;
        ctx.beginPath(); ctx.moveTo(coins[i].x, coins[i].y); ctx.lineTo(coins[j].x, coins[j].y); ctx.stroke();
      }
    }
  }

  // golden rope from the cursor to nearby coins
  ctx.setLineDash([]); ctx.lineWidth = 1.5; ctx.strokeStyle = col2;
  coins.forEach(p => {
    const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
    if (md < 180) {
      ctx.globalAlpha = (1 - md / 180) * .8;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
    }
  });
  ctx.lineWidth = 1;

  // sea: back wave, ship, then front waves
  waveLayer(0, .22);

  const target = mouse.x > 0 ? mouse.x : W / 2 + Math.sin(t * .35) * W * .35;
  shipX += (target - shipX) * .02;
  const sy = waveY(shipX, 0);
  const tilt = Math.atan2(waveY(shipX + 8, 0) - waveY(shipX - 8, 0), 16);
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.translate(shipX, sy - 6);
  ctx.rotate(tilt * .8);
  ctx.font = "54px serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
  ctx.fillText("⛵", 0, 10);
  ctx.restore();

  waveLayer(1, .3);
  waveLayer(2, .4);
  ctx.globalAlpha = 1;
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  if (theme === "pirate") drawSea(); else drawWeb();
  requestAnimationFrame(draw);
}
resize(); readColors(); draw();

/* ===== 9. THEME SWITCH ===== */
const themeBtn = $("themeBtn"), cur = $("cursor");
function applyTheme(t) {
  theme = t;
  root.dataset.theme = t;
  $("tag").textContent = THEMES[t].tag;
  $("critter").textContent = THEMES[t].critter;
  cur.textContent = THEMES[t].cursor;
  themeBtn.textContent = THEMES[t].btn;
  r = 0; c = 0; deleting = false;
  readColors();
  try { localStorage.setItem("theme", t); } catch (e) {}
}
themeBtn.addEventListener("click", () => applyTheme(theme === "spider" ? "pirate" : "spider"));

/* ===== 10. SCROLL: thread, active nav, horizontal projects ===== */
const thread = $("thread"), critter = $("critter");
const links = [...document.querySelectorAll(".nav ul a")]
  .filter(a => document.querySelector(a.getAttribute("href")));
const sections = links.map(a => document.querySelector(a.getAttribute("href")));
const hs = document.querySelector(".hscroll");
const mobile = matchMedia("(max-width:800px)");

function onScroll() {
  const y = scrollY, max = Math.max(1, document.body.scrollHeight - innerHeight);
  const h = (y / max) * innerHeight;
  thread.style.height = h + "px";
  critter.style.top = h + "px";

  sections.forEach((s, i) => {
    const top = s.offsetTop - 250;
    links[i].classList.toggle("active", y >= top && y < top + s.offsetHeight);
  });

  if (!mobile.matches) {
    const travel = Math.max(0, htrack.scrollWidth - innerWidth);
    hs.style.height = (innerHeight + travel * 1.15) + "px";
    const rect = hs.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, hs.offsetHeight - innerHeight)));
    htrack.style.transform = `translateX(${-p * travel}px)`;
  } else {
    hs.style.height = "";
    htrack.style.transform = "";
  }
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
onScroll();

/* ===== 11. REVEAL + COUNTERS ===== */
function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = 1;
  const to = +el.dataset.to; let n = 0;
  const plus = el.dataset.plus ? "+" : "";
  if (!to) { el.textContent = "0"; return; }
  const step = Math.max(1, Math.ceil(to / 60));
  const t = setInterval(() => {
    n = Math.min(n + step, to);
    el.textContent = n + plus;
    if (n >= to) clearInterval(t);
  }, 25);
}
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target;
    t.classList.add("show");
    t.querySelectorAll(".count").forEach(countUp);
    io.unobserve(t);
  });
}, { threshold: 0.2 });

const heroReveals = [], otherReveals = [];
document.querySelectorAll(".reveal").forEach((node, i) => {
  node.style.transitionDelay = (i % 4) * 0.08 + "s";
  (node.closest(".hero") ? heroReveals : otherReveals).push(node);
});
otherReveals.forEach(n => io.observe(n));
// hero items wait until the loader has left, so you actually see them animate
const startHero = () => heroReveals.forEach(n => io.observe(n));
if (document.body.classList.contains("ready")) startHero();
else document.addEventListener("siteready", startHero, { once: true });

/* ===== 12. 3D TILT ===== */
document.querySelectorAll(".tilt").forEach(card => {
  card.addEventListener("mousemove", e => {
    const b = card.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - .5;
    const y = (e.clientY - b.top) / b.height - .5;
    card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
  });
  card.addEventListener("mouseleave", () => card.style.transform = "");
});

/* ===== 13. GITHUB AUTO-LOADER ===== */
async function loadRepos() {
  const box = $("repos"), note = $("repoNote"), count = $("repoCount");
  if (!CONFIG.github || CONFIG.github === "yourusername") {
    note.textContent = "Add your GitHub username in script.js (CONFIG.github) and your repos will show up here automatically.";
    return;
  }
  try {
    const res = await fetch(`https://api.github.com/users/${CONFIG.github}/repos?sort=updated&per_page=30`);
    if (!res.ok) throw new Error("GitHub " + res.status);
    let data = (await res.json()).filter(x => !x.fork);

    count.dataset.to = data.length;
    if (count.dataset.done) count.textContent = data.length;

    data.sort((a, b) => b.stargazers_count - a.stargazers_count ||
                        new Date(b.pushed_at) - new Date(a.pushed_at));
    data = data.slice(0, 6);
    if (!data.length) { note.textContent = "No public repos yet. Push your first project to GitHub!"; return; }

    note.textContent = "My latest public repositories, pulled live from GitHub.";
    data.forEach(repo => {
      const a = el("a", "repo reveal");
      a.href = repo.html_url; a.target = "_blank"; a.rel = "noopener";
      const meta = el("div", "meta");
      if (repo.language) meta.appendChild(el("span", "", "● " + repo.language));
      meta.appendChild(el("span", "", "★ " + repo.stargazers_count));
      meta.appendChild(el("span", "", "updated " + new Date(repo.pushed_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })));
      a.append(el("h3", "", repo.name), el("p", "", repo.description || "No description yet."), meta);
      box.appendChild(a);
      io.observe(a);
    });
  } catch (err) {
    note.textContent = "Couldn't load repos right now. Visit my GitHub profile using the button in the contact section.";
  }
}
loadRepos();

/* ===== 14. CLICK BURST ===== */
addEventListener("click", e => {
  if (e.target.closest(".theme-btn")) return;
  const list = THEMES[theme].sfx;
  const s = el("span", "burst", list[Math.floor(Math.random() * list.length)]);
  s.style.left = e.clientX + "px";
  s.style.top = e.clientY + "px";
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 800);
});

/* ===== 15. CUSTOM CURSOR ===== */
addEventListener("mousemove", e => { cur.style.left = e.clientX + "px"; cur.style.top = e.clientY + "px"; });
document.addEventListener("mouseover", e =>
  cur.classList.toggle("big", !!(e.target.closest && e.target.closest("a,button,.card,input,textarea"))));

/* ===== 16. SOUND (off by default) ===== */
let sound = false, ac = null;
function beep(freq = 440, dur = .12, wave = "square") {
  if (!sound || !ac) return;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = wave; o.frequency.value = freq;
  g.gain.setValueAtTime(.08, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + dur);
  o.connect(g); g.connect(ac.destination);
  o.start(); o.stop(ac.currentTime + dur);
}
$("soundBtn").addEventListener("click", e => {
  sound = !sound;
  if (sound && !ac) ac = new (window.AudioContext || window.webkitAudioContext)();
  if (ac) ac.resume();
  e.currentTarget.textContent = sound ? "🔊" : "🔇";
  beep(660);
});
addEventListener("click", () => beep(220 + Math.random() * 400, .1));
themeBtn.addEventListener("click", () => beep(120, .3, "sawtooth"));

/* ===== 17. BACK TO TOP + MOBILE MENU ===== */
const toTop = $("toTop"), menu = $("menu");
addEventListener("scroll", () => toTop.classList.toggle("show", scrollY > 600), { passive: true });
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
$("burger").addEventListener("click", () => menu.classList.toggle("open"));
menu.addEventListener("click", () => menu.classList.remove("open"));

/* ===== 18. CONTACT FORM (opens your mail app) ===== */
$("send").addEventListener("click", () => {
  const n = $("fName").value.trim(), m = $("fMail").value.trim(), msg = $("fMsg").value.trim();
  if (!n || !m || !msg) return alert("Fill all fields first!");
  const body = encodeURIComponent(`${msg}\n\n— ${n} (${m})`);
  location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Portfolio message from " + n)}&body=${body}`;
});

/* ===== 19. EASTER EGG: type "arun" anywhere ===== */
let keys = "";
addEventListener("keydown", e => {
  if (e.target.matches && e.target.matches("input,textarea")) return;
  keys = (keys + e.key.toLowerCase()).slice(-4);
  if (keys !== "arun") return;
  const set = THEMES[theme].rain;
  for (let i = 0; i < 40; i++) {
    const s = el("span", "rain", set[i % set.length]);
    s.style.left = Math.random() * 100 + "vw";
    s.style.animationDuration = 2 + Math.random() * 2.5 + "s";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 4800);
  }
});

/* ===== 20. RESTORE SAVED THEME ===== */
try { const t = localStorage.getItem("theme"); if (t && THEMES[t]) applyTheme(t); } catch (e) {}