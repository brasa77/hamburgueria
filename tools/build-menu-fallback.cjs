// Keep the read-only, no-JavaScript menu synchronized with the existing catalog.
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('script.js', 'utf8').split('const money=')[0];
const {catalog, groups} = vm.runInNewContext(`${source}\n({catalog, groups})`);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const menu = Object.entries(groups).map(([key, group]) => `<section class="menu-group"><div class="category-heading"><h3>${escape(group.title)}</h3><p>${escape(group.subtitle)}</p></div><div class="product-grid">${catalog.filter(p => p.category === key).map(p => `<article class="product-card"><div class="card-media image-slot"><img src="${escape(p.image)}" alt="${escape(p.name)}" loading="lazy" /></div><div class="card-content"><h3>${escape(p.name)}</h3><p>${escape(p.description)}</p>${p.volume ? `<p>${escape(p.volume)}</p>` : ''}<div class="card-footer">${p.originalPrice ? `<del>${p.originalPrice.toLocaleString('pt-BR', {style:'currency',currency:'BRL'})}</del>` : ''}<strong class="price">${p.price.toLocaleString('pt-BR', {style:'currency',currency:'BRL'})}</strong></div></div></article>`).join('')}</div></section>`).join('\n');
const fallback = `<!-- menu-fallback:start -->\n<noscript><p>Cardápio para consulta. Ative JavaScript para buscar produtos e montar seu pedido.</p>${menu}</noscript>\n<!-- menu-fallback:end -->`;
let html = fs.readFileSync('index.html', 'utf8');
if (html.includes('<!-- menu-fallback:start -->')) html = html.replace(/<!-- menu-fallback:start -->[\s\S]*?<!-- menu-fallback:end -->/, fallback);
else html = html.replace('<div class="menu-groups" id="menu-groups" aria-live="polite"></div>', match => `${match}\n${fallback}`);
fs.writeFileSync('index.html', html);
console.log(`Generated read-only fallback: ${catalog.length} products.`);
