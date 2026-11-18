import {animationScope, motion, responsiveMotion, reducedMotion, keyboardGroup, revealTitle} from './motion.js';
const controllers = new WeakMap();
export function initEnergy(api) {
  const scene = document.querySelector('#energy-scene');
  if (!scene || controllers.has(scene)) return controllers.get(scene) || (() => {});
  const lifetime = new AbortController(), transition = animationScope();
  const products = api.catalog.filter(p => p.category === 'energeticos');
  const tabs = document.querySelector('#energy-tabs'), photo = document.querySelector('#energy-photo');
  const buy = document.querySelector('#promo-energy-add');
  let selected = products.find(p => p.image === photo.lastElementChild?.getAttribute('src')) || products[0], version = 0, disposed = false;
  const swatches = ['#f45143','#f46b91','#ffb13c','#c9e94f','#bc85e9'];
  const flavor = p => p.name.split('|')[1].trim();
  const controls = products.map((p, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'energy-tab';
    b.style.setProperty('--swatch', swatches[i]); b.setAttribute('aria-pressed', String(i === 0)); b.dataset.id = p.id;
    const dot = document.createElement('i'); dot.setAttribute('aria-hidden', 'true');
    b.append(dot, document.createTextNode(flavor(p)));
    b.addEventListener('click', () => choose(p), {signal: lifetime.signal}); tabs.append(b); return b;
  });
  function update(p) {
    selected = p; const index = products.indexOf(p);
    scene.style.setProperty('--flavor', swatches[index]);
    document.querySelector('#energy-flavor').textContent = flavor(p);
    document.querySelector('#energy-description').textContent = p.description;
    document.querySelector('#energy-price').textContent = api.money(p.price);
    document.querySelector('#energy-volume').textContent = p.volume;
    document.querySelector('#energy-edition').textContent = `0${index + 1} / 05`;
    buy.setAttribute('aria-label', `Adicionar Brasa Energy ${flavor(p)} ao pedido`);
    controls.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === p.id)));
  }
  async function choose(p) {
    if (p === selected && scene.getAttribute('aria-busy') !== 'true') { update(p); return; }
    const token = ++version;
    scene.setAttribute('aria-busy', 'true'); buy.disabled = true;
    const img = new Image(); img.src = p.image; img.alt = `Brasa Energy ${flavor(p)} em cenário com gelo`;
    img.width = 1122; img.height = 1402;
    try {
      await img.decode();
      if (token !== version || disposed) return;
      transition.settle();
      // The outgoing photo stays painted underneath the decoded replacement.
      // Rapid choices commit only the latest request, never a blank photo stage.
      const previous = photo.lastElementChild;
      if (previous) { photo.replaceChildren(previous); previous.removeAttribute('id'); previous.alt = ''; previous.setAttribute('aria-hidden', 'true'); }
      img.id = 'energy-image'; photo.append(img); update(p);
      const {duration, distance} = responsiveMotion();
      transition.play(img, [{opacity: 0, transform: `translate3d(${distance}px,0,0) scale(1.035)`}, {opacity: 1, transform: 'none'}], {duration});
      revealTitle(transition, document.querySelector('#energy-flavor'), 0, duration);
      transition.play(document.querySelector('#energy-description'), [{opacity: .35}, {opacity: 1}], {duration: motion.swap});
      await transition.finished();
      if (token === version && !disposed) photo.replaceChildren(img);
    } catch {
      if (token === version && !disposed) document.querySelector('#energy-description').textContent = 'Não foi possível carregar este sabor. Tente novamente.';
    } finally {
      if (token === version && !disposed) { scene.setAttribute('aria-busy', 'false'); buy.disabled = false; }
    }
  }
  update(selected);
  const stopKeys = keyboardGroup(tabs, '.energy-tab', b => choose(products.find(p => p.id === b.dataset.id)));
  buy.addEventListener('click', () => api.addToCart(selected.id), {signal: lifetime.signal});
  const settle = () => transition.settle();
  reducedMotion.addEventListener('change', settle, {signal: lifetime.signal});
  document.addEventListener('visibilitychange', settle, {signal: lifetime.signal});
  function dispose() {
    if (disposed) return;
    disposed = true; version++; transition.settle(); stopKeys(); lifetime.abort(); controllers.delete(scene);
    photo.replaceChildren(photo.lastElementChild); tabs.replaceChildren();
  }
  controllers.set(scene, dispose);
  return dispose;
}
