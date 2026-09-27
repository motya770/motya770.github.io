// ============================================================
//  Edit this block to make the site yours.
// ============================================================
const PROFILE = {
  name: "Matthew Kudelin",
  handle: "kudelin",
  role: "Data Scientist / AI Engineer / Software Developer",
  location: "Tel Aviv, Israel",
  about: [
    "Senior Data Scientist at QuantHealth. 17+ years building software, mostly in Python and Java.",
    "",
    "Right now I work on LLM pre-training and fine-tuning, foundation model training, and making deep learning training and inference faster, alongside backend, MLOps and DevOps for AI.",
    "",
    "I've built and optimized high-load systems at a bank, on a ship collision-avoidance system, and on trading platforms. I like leading teams, mentoring engineers, and taking projects from idea to delivery.",
  ],
  skills: {
    "ai / ml": ["PyTorch", "DeepSpeed", "MosaicML", "TensorFlow", "Keras", "LangChain", "LLaMA", "Transformers", "Ray", "MLflow"],
    data: ["Databricks", "PySpark", "Postgres", "MongoDB", "MySQL", "InfluxDB", "Redis"],
    languages: ["Python", "Java", "JavaScript", "Go", "C++", "Delphi"],
    backend: ["FastAPI", "Sanic", "Flask", "Spring / Spring Boot", "JPA / Hibernate", "Hasura"],
    devops: ["Docker", "Kubernetes", "Helm", "Terraform", "Jenkins", "GitLab CI", "AWS (EKS, S3, EC2, Lambda)"],
  },
  experience: [
    { role: "Senior Data Scientist", org: "QuantHealth", when: "Jan 2024 – present",
      notes: ["LLM pre-training and fine-tuning, foundation model training", "Deep learning training & inference optimization"] },
    { role: "Senior Software Engineer", org: "QuantHealth", when: "Aug 2022 – present",
      notes: ["Backend, MLOps and DevOps for AI", "FastAPI, Databricks, MLflow, EKS, Terraform, PySpark, Ray, GPU training"] },
    { role: "Senior Python Developer", org: "Orca AI", when: "Nov 2020 – Aug 2022",
      notes: ["Collision-avoidance navigation system for ships", "Sensor integration: camera, RADAR, AIS, GPS, IMU, gyro, wind, depth"] },
    { role: "Senior Java / Infrastructure Developer", org: "Bank Hapoalim", when: "Jan 2015 – Nov 2020",
      notes: ["Distributed, highly available, fault-tolerant applications", "Architecture consulting and teaching for Java developers", "DevOps for 500+ developers"] },
    { role: "Java Developer", org: "Scipiosoft (trading platforms)", when: "Feb 2013 – Jan 2015",
      notes: ["Trading platform, web & mobile API (Spring MVC)", "Autonomous tournament system (Groovy + Grails)"] },
    { role: "Java Developer", org: "finchmoscow", when: "Feb 2011 – Feb 2013",
      notes: ["High-load media websites (filmpro.ru, strana.ru)"] },
    { role: "Delphi Developer", org: "TPO Reserve", when: "Jun 2009 – Dec 2010",
      notes: ["Accounting systems (Delphi, Firebird, FastReport)"] },
  ],
  education: [
    { what: "Artificial Intelligence Professional Program", where: "Stanford University", when: "2026 – 2027" },
    { what: "Master's degree, Computer Science", where: "International Jewish Institute of Economics, Finance and Law", when: "2007 – 2012" },
  ],
  certifications: [
    "XCS224N – Natural Language Processing with Deep Learning",
    "Pragmatic System Design",
    "Enhancing your Java R&D with Scala",
    "Latest Java – Java 8 streams & Java 9",
    "Shaping up with Angular.js",
  ],
  spoken: [
    { lang: "Russian", level: "native" },
    { lang: "English", level: "full professional" },
    { lang: "Hebrew", level: "full professional" },
  ],
  projects: [
    { name: "jenbina", url: "https://github.com/motya770/jenbina",
      desc: "Open-source AGI research sim: an agent with its own personality, motivation and long-term memory.",
      stack: "LangChain, OpenAI / Ollama, Neo4j, ChromaDB, Streamlit" },
    { name: "midnightstar", url: "https://github.com/motya770/midnightstar",
      desc: "Gene–disease discovery platform: explore gene networks and 3D protein structures, and train graph neural nets to predict new links.",
      stack: "PyTorch Geometric, NetworkX, GWAS / GTEx / STRING data, Streamlit" },
    { name: "t500", url: "https://github.com/motya770/t500",
      desc: "Econ Express: an economic dashboard that pulls World Bank, market and news data, then runs correlation and ML analysis.",
      stack: "PyTorch, scikit-learn, Plotly, Streamlit" },
    { name: "diamonds-ml-calculator", url: "https://github.com/motya770/diamonds-ml-calculator",
      desc: "Predicts a diamond's market price from its parameters.",
      stack: "scikit-learn, Flask" },
    { name: "qworld", url: "https://github.com/motya770/qworld",
      desc: "Desktop quantum state visualizer: apply gates and watch one- and two-qubit states, including entanglement, update live.",
      stack: "QuTiP, PyQt5, matplotlib" },
    { name: "dtrade", url: "https://github.com/motya770/dtrade",
      desc: "Multi-asset exchange engine that can be configured on the fly as a stock, diamond or wine exchange.",
      stack: "Java" },
    { name: "group_options", url: "https://github.com/motya770/group_options",
      desc: "Group options trading platform where users bid against each other.",
      stack: "Java" },
    { name: "lafood_ui", url: "https://bitbucket.org/DovGri/lafood_ui/src/master/",
      desc: "Volunteering project: the mobile app front end.",
      stack: "Flutter" },
  ],
  contact: [
    { label: "email", value: "matvei.kudelin@gmail.com", url: "mailto:matvei.kudelin@gmail.com" },
    { label: "github", value: "github.com/motya770", url: "https://github.com/motya770" },
    { label: "linkedin", value: "linkedin.com/in/matthew-kudelin-38465235", url: "https://www.linkedin.com/in/matthew-kudelin-38465235" },
  ],
};
// ============================================================

const output = document.getElementById("output");
const input = document.getElementById("cmd");
const typed = document.getElementById("typed");
const inputLine = document.getElementById("input-line");
const terminal = document.getElementById("terminal");

const PROMPT_HTML = `<span class="user">guest@${PROFILE.handle}</span>:<span class="path">~</span>$ `;
document.querySelector(".input-line .prompt").innerHTML = PROMPT_HTML;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const link = (text, url) => (url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(text)}</a>` : esc(text));
const cmdLink = (c) => `<span class="cmd-link" data-cmd="${esc(c)}">${esc(c)}</span>`;

function print(html = "", cls = "") {
  const div = document.createElement("div");
  if (cls) div.className = cls;
  div.innerHTML = html;
  output.appendChild(div);
  return div;
}

// label/value row whose value wraps with a hanging indent
const kv = (label, valueHtml, width = 11) =>
  print(`<span class="accent-2">${esc(label)}</span><span>${valueHtml}</span>`, "kv").style.setProperty("--kv", `${width}ch`);

// ---------- commands ----------
const COMMANDS = {
  help: {
    desc: "list available commands",
    run() {
      print("Available commands:", "accent");
      for (const [name, c] of Object.entries(COMMANDS)) {
        if (c.hidden) continue;
        print(`  ${cmdLink(name)}${" ".repeat(12 - name.length)}<span class="dim">${esc(c.desc)}</span>`);
      }
      print(`<span class="dim">Tip: Tab autocompletes, ↑/↓ browse history. Click the rabbit!</span>`);
    },
  },
  about: {
    desc: "who am I",
    run() {
      print(`<span class="big">${esc(PROFILE.name)}</span>`);
      print(`<span class="accent-2">${esc(PROFILE.role)}</span> <span class="dim">· ${esc(PROFILE.location)}</span>`);
      print("");
      PROFILE.about.forEach((l) => print(esc(l)));
    },
  },
  projects: {
    desc: "things I've built",
    run() {
      PROFILE.projects.forEach((p, i) => {
        if (i) print("");
        print(`<span class="accent">▸</span> ${link(p.name, p.url)}`);
        print(esc(p.desc), "indent");
        if (p.stack) print(esc(p.stack), "indent dim");
      });
    },
  },
  skills: {
    desc: "languages & tools",
    run() {
      for (const [k, v] of Object.entries(PROFILE.skills)) {
        kv(k, v.map(esc).join(", "));
      }
    },
  },
  experience: {
    desc: "where I've worked",
    run() {
      PROFILE.experience.forEach((e, i) => {
        if (i) print("");
        print(`<span class="accent">▸</span> <span class="accent-2">${esc(e.role)}</span> @ ${esc(e.org)}  <span class="dim">${esc(e.when)}</span>`);
        e.notes.forEach((n) => print(`  <span class="dim">- ${esc(n)}</span>`));
      });
    },
  },
  education: {
    desc: "degrees & programs",
    run() {
      PROFILE.education.forEach((e) => {
        print(`<span class="accent">▸</span> ${esc(e.what)}  <span class="dim">${esc(e.when)}</span>`);
        print(`  <span class="dim">${esc(e.where)}</span>`);
      });
    },
  },
  certs: {
    desc: "certifications",
    run() { PROFILE.certifications.forEach((c) => print(`<span class="accent">▸</span> ${esc(c)}`)); },
  },
  languages: {
    desc: "languages I speak",
    run() { PROFILE.spoken.forEach((l) => kv(l.lang, `<span class="dim">${esc(l.level)}</span>`, 10)); },
  },
  contact: {
    desc: "how to reach me",
    run() {
      PROFILE.contact.forEach((c) => kv(c.label, link(c.value, c.url), 10));
    },
  },
  ls: {
    desc: "list files",
    run() {
      print(Object.keys(FILES).map((f) => `<span class="cmd-link" data-cmd="cat ${esc(f)}">${esc(f)}</span>`).join("   "));
    },
  },
  cat: {
    desc: "read a file (cat about.txt)",
    run(args) {
      const f = args[0];
      if (!f) return print("usage: cat &lt;file&gt;", "warn");
      if (!FILES[f]) return print(`cat: ${esc(f)}: No such file or directory`, "err");
      FILES[f]();
    },
  },
  hop: { desc: "make the rabbit hop", run() { print(window.Rabbit.hop() ? "*boing*" : "the rabbit is busy.", "dim"); } },
  feed: { desc: "give the rabbit a carrot", run() { print(window.Rabbit.feed() ? "🥕 a carrot falls from the sky..." : "there's already a carrot out there.", "dim"); } },
  pet: { desc: "pet the rabbit", run() { window.Rabbit.pet(); print("the rabbit loves you ♥", "dim"); } },
  theme: {
    desc: "theme green | amber | white",
    run(args) {
      const t = args[0];
      if (!["green", "amber", "white"].includes(t)) return print("usage: theme green | amber | white", "warn");
      document.body.className = t === "green" ? "" : `theme-${t}`;
      try { localStorage.setItem("theme", t); } catch {}
      print(`theme set to ${t}`, "dim");
    },
  },
  whoami: { desc: "print current user", run() { print("guest"); } },
  date: { desc: "print the date", run() { print(new Date().toString()); } },
  echo: { desc: "print text", run(args) { print(esc(args.join(" "))); } },
  history: { desc: "command history", run() { history.forEach((h, i) => print(`<span class="dim">${String(i + 1).padStart(4)}</span>  ${esc(h)}`)); } },
  clear: { desc: "clear the screen", run() { output.innerHTML = ""; } },
  banner: { desc: "show the welcome banner", run() { banner(); } },
  sudo: { hidden: true, run() { print("guest is not in the sudoers file. This incident will be reported to the rabbit.", "err"); } },
  rm: { hidden: true, run() { print("nice try.", "err"); } },
  exit: { hidden: true, run() { print("there is no escape. try 'help'.", "dim"); } },
  vim: { hidden: true, run() { print("you are now trapped in vim. just kidding. type 'help'.", "dim"); } },
};

const FILES = {
  "about.txt": () => COMMANDS.about.run(),
  "projects.md": () => COMMANDS.projects.run(),
  "experience.log": () => COMMANDS.experience.run(),
  "contact.txt": () => COMMANDS.contact.run(),
  "rabbit.txt": () => {
    print(`<span class="accent">  (\\_/)\n  (='.'=)\n  (")_(")</span>`);
    print(`<span class="dim">try: hop, feed, pet</span>`);
  },
};

// ---------- input handling ----------
const history = [];
let histIdx = 0;

function renderInput() {
  const v = input.value;
  const pos = input.selectionStart ?? v.length;
  const at = v[pos] ?? " ";
  typed.innerHTML = `${esc(v.slice(0, pos))}<span class="cursor">${esc(at)}</span>${esc(v.slice(pos + 1))}`;
}

function run(line) {
  print(`<span class="prompt">${PROMPT_HTML}</span>${esc(line)}`);
  const trimmed = line.trim();
  if (trimmed) {
    history.push(trimmed);
    const [name, ...args] = trimmed.split(/\s+/);
    const cmd = COMMANDS[name.toLowerCase()];
    if (cmd) cmd.run(args);
    else print(`command not found: ${esc(name)}. Type ${cmdLink("help")} for a list of commands.`, "err");
  }
  histIdx = history.length;
  inputLine.scrollIntoView({ block: "end" });
}

function complete() {
  const v = input.value;
  const parts = v.split(/\s+/);
  const pool = parts.length > 1 && parts[0] === "cat" ? Object.keys(FILES) : Object.keys(COMMANDS).filter((c) => !COMMANDS[c].hidden);
  const word = parts[parts.length - 1];
  const matches = pool.filter((p) => p.startsWith(word));
  if (matches.length === 1) {
    parts[parts.length - 1] = matches[0];
    input.value = parts.join(" ") + " ";
  } else if (matches.length > 1) {
    print(`<span class="prompt">${PROMPT_HTML}</span>${esc(v)}`);
    print(matches.join("   "), "dim");
  }
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    run(input.value);
    input.value = "";
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (histIdx > 0) input.value = history[--histIdx];
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    histIdx = Math.min(history.length, histIdx + 1);
    input.value = history[histIdx] ?? "";
  } else if (e.key === "Tab") {
    e.preventDefault();
    complete();
  } else if (e.key === "l" && e.ctrlKey) {
    e.preventDefault();
    output.innerHTML = "";
  }
  requestAnimationFrame(renderInput);
});
["input", "keyup", "click", "select"].forEach((ev) => input.addEventListener(ev, renderInput));
input.addEventListener("focus", () => inputLine.classList.remove("blurred"));
input.addEventListener("blur", () => inputLine.classList.add("blurred"));

terminal.addEventListener("click", (e) => {
  const c = e.target.closest(".cmd-link");
  if (c) { run(c.dataset.cmd); return; }
  if (e.target.closest("a")) return;
  if (!window.getSelection().toString()) input.focus();
});

// ---------- boot ----------
function banner() {
  print(`<span class="big">${esc(PROFILE.name)}</span>`);
  print(`<span class="accent-2">${esc(PROFILE.role)}</span>`);
  print("");
  print(`Welcome! Type ${cmdLink("help")} to see what you can do, or try ${cmdLink("about")}, ${cmdLink("experience")}, ${cmdLink("projects")}, ${cmdLink("contact")}.`);
  print("");
}

async function boot() {
  try {
    const t = localStorage.getItem("theme");
    if (t && t !== "green") document.body.className = `theme-${t}`;
  } catch {}
  const lines = [
    "booting rabbitOS v1.0 ...",
    "loading carrots ............ ok",
    "waking up the rabbit ....... ok",
  ];
  const fast = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  for (const l of lines) {
    print(esc(l), "dim");
    if (!fast) await new Promise((r) => setTimeout(r, 180));
  }
  print("");
  banner();
  renderInput();
  input.focus({ preventScroll: true });
}

boot();
