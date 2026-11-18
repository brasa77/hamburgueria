import {animationScope, reducedMotion, compactMotion, responsiveMotion, motion} from './motion.js';
const controllers = new WeakMap();
// Cards have two states: entering -> settled. Photos never conceal or replay.
export function initMenuMotion(root = document.querySelector('#menu-groups')) {
  if (!root || !window.IntersectionObserver) return () => {};
  if (controllers.has(root)) return controllers.get(root);
  const lifetime = new AbortController(), observed = new Set(), running = new Map();
  let disposed = false;
  function settle(el) {
    running.get(el)?.settle(); running.delete(el);
    el.dataset.motionState = 'settled'; observer.unobserve(el); observed.delete(el);
  }
  function enter(el, delay) {
    if (el.dataset.motionState || reducedMotion.matches || document.hidden || el.contains(document.activeElement)) {
      settle(el); return;
    }
    el.dataset.motionState = 'entering';
    const scope = animationScope(); running.set(el, scope);
    const {duration, distance} = responsiveMotion();
    scope.play(el.querySelector('.card-content') || el.querySelector('h3'),
      [{transform:`translate3d(0,${distance}px,0)`}, {transform:'none'}], {duration, delay});
    scope.play(el.querySelector('.card-rule,.category-rule'),
      [{transform:'scaleX(.15)'}, {transform:'scaleX(1)'}], {duration, delay});
    scope.finished().then(() => { if (!disposed && running.get(el) === scope) settle(el); });
  }
  const observer = new IntersectionObserver(entries => {
    let row = -Infinity, column = 0;
    entries.sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
    for (const {target, isIntersecting, boundingClientRect: rect} of entries) {
      if (!isIntersecting || running.has(target)) continue;
      // Anchor jumps, restored scroll and filter changes land immediately at rest.
      if (rect.top < innerHeight - motion.threshold || reducedMotion.matches) { settle(target); continue; }
      if (Math.abs(row - rect.top) > 24) { row = rect.top; column = 0; }
      enter(target, Math.min(column++, 2) * responsiveMotion().stagger);
    }
  }, {rootMargin:`0px 0px ${motion.threshold}px 0px`, threshold:0});
  function scan() {
    for (const el of observed) if (!root.contains(el)) settle(el);
    root.querySelectorAll('.product-card,.category-heading').forEach(el => {
      if (!el.dataset.motionState && !observed.has(el)) { observed.add(el); observer.observe(el); }
    });
  }
  const settleRunning = () => [...running.keys()].forEach(settle);
  const mutations = new MutationObserver(scan); mutations.observe(root, {childList:true});
  root.addEventListener('brasa:menu-update', settleRunning, {signal:lifetime.signal});
  root.addEventListener('focusin', e => { const card = e.target.closest('.product-card'); if (card) settle(card); }, {signal:lifetime.signal});
  reducedMotion.addEventListener('change', () => {
    settleRunning(); if (reducedMotion.matches) [...observed].forEach(settle);
  }, {signal:lifetime.signal});
  compactMotion.addEventListener('change', settleRunning, {signal:lifetime.signal});
  document.addEventListener('visibilitychange', settleRunning, {signal:lifetime.signal});
  scan();
  function dispose() {
    if (disposed) return;
    disposed = true; settleRunning(); observer.disconnect(); mutations.disconnect();
    observed.clear(); lifetime.abort(); controllers.delete(root);
  }
  controllers.set(root, dispose); return dispose;
}
