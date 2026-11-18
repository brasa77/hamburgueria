// CSS tokens are shared by native transitions and finite timelines.
export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
export const compactMotion = matchMedia('(max-width: 720px)');
const css = getComputedStyle(document.documentElement);
const number = name => parseFloat(css.getPropertyValue(`--motion-${name}`));
export const ease = css.getPropertyValue('--ease-out').trim();
export const motion = Object.freeze({
  ease, sceneEase: css.getPropertyValue('--ease-scene').trim(),
  micro: number('micro'), fast: parseFloat(css.getPropertyValue('--duration-fast')), swap: parseFloat(css.getPropertyValue('--duration-quick')), enter: number('enter'), product: number('product'),
  compact: number('compact'), stagger: number('stagger'), compactStagger: number('compact-stagger'),
  distance: number('distance'), compactDistance: number('compact-distance'), threshold: number('threshold'),
  heroWait: number('hero-wait'), heroDuration: number('hero-duration'),
});
export function responsiveMotion() {
  return compactMotion.matches
    ? {duration: motion.compact, distance: motion.compactDistance, stagger: motion.compactStagger}
    : {duration: motion.enter, distance: motion.distance, stagger: motion.stagger};
}
export function animate(element, frames, options = {}) {
  if (reducedMotion.matches || !element?.animate) return null;
  return element.animate(frames, {duration: motion.enter, easing: ease, fill: 'backwards', ...options});
}
// Cancel exposes the final CSS state. No inline opacity, fill:forwards,
// commitStyles, or permanent will-change survives an animation.
export function animationScope() {
  const active = new Set();
  return {
    play(element, frames, options) {
      const animation = animate(element, frames, options);
      if (!animation) return null;
      active.add(animation);
      const forget = () => active.delete(animation);
      animation.finished.then(forget, forget);
      return animation;
    },
    finished() { return Promise.all([...active].map(a => a.finished.catch(() => {}))); },
    settle() { active.forEach(a => a.cancel()); active.clear(); },
    get size() { return active.size; },
  };
}
// Preserve the original accessible text; split wrappers are purely visual.
export function maskText(element) {
  if (!element) return null;
  if (element.firstElementChild?.classList.contains('motion-text')) return element.firstElementChild;
  const text = document.createElement('span');
  text.className = 'motion-text'; text.append(...element.childNodes);
  element.classList.add('motion-mask'); element.append(text);
  return text;
}
export function revealTitle(scope, element, delay = 0, duration = responsiveMotion().duration) {
  return scope.play(maskText(element), [
    {transform: `translate3d(0,${responsiveMotion().distance}px,0)`, opacity: .65}, {transform: 'none', opacity: 1},
  ], {delay, duration});
}
// SplitText's once-only stagger adapted for a static page. Screen readers get one text node.
export function splitText(scope, element, delay = 0) {
  if (!element || reducedMotion.matches) return;
  const original = element.textContent;
  const accessible = document.createElement('span'); accessible.className = 'sr-only'; accessible.textContent = original;
  const visual = document.createElement('span'); visual.className = 'split-visual'; visual.setAttribute('aria-hidden','true');
  [...original].forEach((letter, i) => {
    const mask = document.createElement('span'); mask.className = 'split-mask';
    const char = document.createElement('span'); char.className = 'split-char'; char.textContent = letter;
    mask.append(char); visual.append(mask);
    scope.play(char, [{transform:'translate3d(0,105%,0)'},{transform:'none'}],
      {duration:motion.enter,delay:delay + Math.min(i,5)*motion.stagger});
  });
  element.replaceChildren(accessible,visual);
  scope.finished().then(() => visual.querySelectorAll('.split-mask').forEach(mask => mask.classList.add('is-settled')));
}
export function revealContent() {
  if (!window.IntersectionObserver) return () => {};
  const lifetime = new AbortController(), running = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const {target:el,isIntersecting,boundingClientRect:rect} of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(el); el.dataset.revealed = 'true';
      if (reducedMotion.matches || document.hidden || rect.bottom < 100 || rect.top < 0) continue;
      const scope = animationScope(); running.add(scope);
      const title = el.querySelector(el.matches('.reason-card') ? 'strong' : 'h2,h3');
      if (title) revealTitle(scope,title);
      // Campaigns get a single photographic movement. All ordinary photos stay still.
      const art = el.matches('.weekly-card') ? el.querySelector('.weekly-art img') : null;
      if (art) scope.play(art,[{transform:'scale(1.025)'},{transform:'none'}],{duration:motion.product});
      scope.finished().then(() => {scope.settle(); running.delete(scope);});
    }
  }, {threshold:0,rootMargin:'0px 0px -24px 0px'});
  document.querySelectorAll('.reveal:not(.filters):not(.menu-tools),.reason-card,.timeline-item').forEach(el=>observer.observe(el));
  const settle = () => {running.forEach(scope=>scope.settle()); running.clear();};
  reducedMotion.addEventListener('change',settle,{signal:lifetime.signal});
  document.addEventListener('visibilitychange',settle,{signal:lifetime.signal});
  return () => {settle(); observer.disconnect(); lifetime.abort();};
}
export function keyboardGroup(container, selector, activate) {
  const onKey = event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const items = [...container.querySelectorAll(selector)];
    const current = items.indexOf(document.activeElement);
    if (current < 0) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
      : (current + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
    items[next].focus(); activate?.(items[next]);
  };
  container.addEventListener('keydown', onKey);
  return () => container.removeEventListener('keydown', onKey);
}
