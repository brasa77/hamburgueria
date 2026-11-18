import {anatomyProducts} from './anatomy-data.js';
import {animationScope, keyboardGroup, reducedMotion, responsiveMotion, revealTitle, motion} from './motion.js';
const controllers = new WeakMap();
const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
function icon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(svg.namespaceURI, 'path');
  path.setAttribute('d', 'm3 8 9-4 9 4-9 4Zm0 5 9 4 9-4M3 18l9 4 9-4'); svg.append(path); return svg;
}
export function initAnatomy(api) {
  const products = anatomyProducts(api.catalog), root = document.querySelector('#burger-explorer');
  if (!root || !products.length) return () => {};
  if (controllers.has(root)) return controllers.get(root);
  const lifetime = new AbortController(), transition = animationScope(), detail = animationScope();
  const get = id => root.querySelector(`#explorer-${id}`);
  const tabs = get('tabs'), ingredients = get('ingredients'), image = get('image');
  let current = null, selected = -1, sequence = 0, disposed = false;
  const number = n => String(n + 1).padStart(2, '0');
  get('count').textContent = `${products.length} RECEITAS`;
  products.forEach((product, index) => {
    const tab = element('button', 'explorer-tab'); tab.type = 'button'; tab.id = `explorer-tab-${product.id}`;
    tab.dataset.id = product.id; tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', 'explorer-panel');
    tab.setAttribute('aria-selected', String(index === 0)); tab.tabIndex = index === 0 ? 0 : -1;
    const thumb = element('img'); thumb.src = product.image; thumb.alt = ''; thumb.loading = 'lazy'; thumb.width = 64; thumb.height = 64;
    tab.append(thumb, element('span', '', product.name), element('small', '', number(index))); tabs.append(tab);
  });
  function select(index, moving = true) {
    if (index === selected || !current?.ingredients[index]) return;
    selected = index; detail.settle();
    [...ingredients.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    get('focus').textContent = current.ingredients[index];
    get('position').textContent = `${number(index)} / ${String(current.ingredients.length).padStart(2, '0')}`;
    root.style.setProperty('--ingredient-progress', (index + 1) / current.ingredients.length);
    if (moving) detail.play(get('focus'), [{transform: 'translate3d(4px,0,0)', opacity: .45}, {transform: 'none', opacity: 1}], {duration: motion.swap});
  }
  async function choose(id) {
    if (current?.id === id && root.getAttribute('aria-busy') !== 'true') return;
    const product = products.find(p => p.id === id); if (!product) return;
    const request = ++sequence;
    root.setAttribute('aria-busy', 'true');
    const preload = new Image(); preload.src = product.image;
    let failed = false;
    try { await preload.decode(); } catch { failed = true; }
    if (request !== sequence || disposed) return;
    const previous = current; current = product; selected = -1; transition.settle(); detail.settle();
    image.hidden = failed; get('image-error').hidden = !failed;
    image.src = product.image; image.alt = `${product.name} — fotografia do catálogo`;
    get('title').textContent = product.name;
    get('category').textContent = product.category === 'combos' ? 'BURGER + COMBO' : 'ASSINATURA BRASA77';
    get('description').textContent = product.description; get('price').textContent = api.money(product.price);
    get('order').firstChild.textContent = product.category === 'combos' ? 'Quero esse combo ' : 'Quero esse burger ';
    get('index').textContent = `${number(products.indexOf(product))} / ${products.length}`;
    get('panel').setAttribute('aria-labelledby', `explorer-tab-${id}`);
    [...tabs.children].forEach(tab => {
      const active = tab.dataset.id === id; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
    });
    ingredients.replaceChildren(...product.ingredients.map((name, index) => {
      const button = element('button', 'explorer-ingredient'); button.type = 'button'; button.dataset.index = index;
      button.append(element('small', '', number(index)), icon(), element('span', '', name)); return button;
    }));
    select(0, false); root.setAttribute('aria-busy', 'false');
    if (previous) {
      const {duration, distance, stagger} = responsiveMotion();
      transition.play(image, [{transform: `translate3d(${-distance}px,0,0) scale(1.025)`}, {transform: 'none'}], {duration});
      revealTitle(transition, get('title'), 0, duration);
      [...ingredients.children].forEach((button, i) => {
        // Animate inner labels; CSS selection exclusively owns the row transform.
        transition.play(button.querySelector('span'), [{opacity: .4, transform: 'translate3d(4px,0,0)'}, {opacity: 1, transform: 'none'}], {duration: motion.swap, delay: Math.min(i, 5) * stagger});
      });
    }
  }
  tabs.addEventListener('click', event => { const tab = event.target.closest('.explorer-tab'); if (tab) choose(tab.dataset.id); }, {signal: lifetime.signal});
  const stopKeys = keyboardGroup(tabs, '.explorer-tab', tab => {
    tab.scrollIntoView({block: 'nearest', inline: 'nearest', behavior: reducedMotion.matches ? 'instant' : 'smooth'}); choose(tab.dataset.id);
  });
  for (const type of ['click', 'focusin']) ingredients.addEventListener(type, event => {
    if (type === 'pointerover' && !matchMedia('(hover:hover)').matches) return;
    const button = event.target.closest('.explorer-ingredient'); if (button) select(Number(button.dataset.index));
  }, {signal: lifetime.signal});
  ingredients.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) || !current) return;
    event.preventDefault();
    const index = [...ingredients.children].indexOf(event.target);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? current.ingredients.length - 1 :
      (index + (event.key === 'ArrowDown' ? 1 : -1) + current.ingredients.length) % current.ingredients.length;
    ingredients.children[next].focus();
  }, {signal: lifetime.signal});
  get('order').addEventListener('click', () => { if (current) api.addToCart(current.id); }, {signal: lifetime.signal});
  const settle = () => { transition.settle(); detail.settle(); };
  reducedMotion.addEventListener('change', settle, {signal: lifetime.signal});
  document.addEventListener('visibilitychange', settle, {signal: lifetime.signal});
  choose(products[0].id);
  function dispose() {
    if (disposed) return;
    disposed = true; sequence++; stopKeys(); settle(); lifetime.abort(); controllers.delete(root); tabs.replaceChildren();
  }
  controllers.set(root, dispose); return dispose;
}
