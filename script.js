// Shared chrome + all repeated-structure rendering for every page.
// Each HTML file supplies only: <body data-page="...">, a #page-data
// JSON block (for pages with a repeated list), and an empty
// #page-mount element sitting where that content belongs.

const PAGES = [
  ['index.html', 'Home'], ['projects.html', 'Projects'], ['about.html', 'About'],
  ['resources.html', 'Resources'], ['connect.html', 'Connect'],
];

const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ext = (u, t, cls = 'el') => `<a href="${u}" target="_blank" rel="noopener" class="${cls}">${esc(t)}</a>`;

function renderNav(current) {
  const links = PAGES.map(([href, label]) =>
    `<li><a href="${href}"${href === current ? ' class="act"' : ''}>${label}</a></li>`).join('');
  return `<div id="prog"></div><div id="nav"><div class="ni">
    <a class="nlogo" href="index.html">Shaon Ahmed Ronok</a>
    <ul class="nlinks">${links}</ul></div></div>`;
}

function renderFooter() {
  return `<footer><div class="w"><p class="fc">© 2026 Shaon Ahmed Ronok</p></div></footer>
    <button id="st" aria-label="Back to top" onclick="scrollTo({top:0,behavior:'smooth'})">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
    </button>`;
}

// ---- projects.html: cards inside the existing .pgrid mount ----
function renderProjects(data) {
  return data.map(p => `
    <div class="pc">
      <span class="pstat">${esc(p.stat)}</span>
      <p class="pct">${esc(p.name)}</p>
      <p class="pcd">${esc(p.desc)}</p>
      <div class="ptags">${p.tags.map(t => `<span class="ptag">${esc(t)}</span>`).join('')}</div>
      ${ext(p.url, 'View on GitHub →', 'plink el')}
    </div>`).join('');
}

// ---- connect.html: tiles inside the existing .clinks mount ----
function renderConnect(data) {
  return data.map(c => `
    <a href="${c.url}" target="_blank" rel="noopener" class="cl">
      <img src="${c.icon}" alt="${esc(c.name)}">
      <div><p class="clp">${esc(c.name)}</p><p class="clh el">${esc(c.handle)}</p></div>
    </a>`).join('');
}

// ---- index.html: icons inside the existing .techstack mount ----
function renderTech(data) {
  return data.map(t => `<img src="${t.src}" alt="${esc(t.alt)}">`).join('');
}

// ---- resources.html: full sections inside the <main> mount ----
function renderList(items) {
  let html = '<ul class="alist">';
  for (const it of items) {
    html += it[0] === '__sub__'
      ? `</ul><br><p class="sl">${esc(it[1])}</p><ul class="alist">`
      : `<li><span class="atext">${esc(it[0])}</span> ${ext(it[1], it[1])}</li>`;
  }
  return html + '</ul>';
}
function renderResources(data) {
  return data.map((sec, i) => `
    ${i ? '<hr class="dv">' : ''}
    <section><div class="w">
      <p class="sl">${esc(sec.cat)}</p>
      ${i ? `<h2 class="stitle">${esc(sec.title)}</h2>` : `<h1 class="stitle">${esc(sec.title)}</h1>`}
      ${sec.parts.map(p => 'h3' in p ? `<h3 class="shd">${esc(p.h3)}</h3>` : renderList(p.ul)).join('')}
    </div></section>`).join('');
}

// ---- about.html: trait paragraphs with inline accent links ----
function renderTraits(data) {
  return data.map(seg => `<p class="trait-text">${
    seg.map(s => Array.isArray(s) ? ext(s[2], s[1]) : esc(s)).join('')
  }</p>`).join('');
}

const RENDERERS = { about: renderTraits, projects: renderProjects, connect: renderConnect, index: renderTech, resources: renderResources };

function mount() {
  const page = document.body.dataset.page;
  document.getElementById('nav-mount').outerHTML = renderNav(page + '.html');
  document.getElementById('footer-mount').outerHTML = renderFooter();

  const dataEl = document.getElementById('page-data');
  if (dataEl) {
    document.getElementById('page-mount').innerHTML = RENDERERS[page](JSON.parse(dataEl.textContent));
  }

  const nav = document.getElementById('nav'), st = document.getElementById('st'), prog = document.getElementById('prog');
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const sy = scrollY, sh = document.body.scrollHeight - innerHeight;
      nav.classList.toggle('sc', sy > 40);
      st.classList.toggle('vi', sy > 100);
      prog.style.width = (sy / (sh || 1) * 100) + '%';
      ticking = false;
    });
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', mount);
