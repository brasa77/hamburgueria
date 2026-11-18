import {initAnatomy} from './anatomy.js';
import {initHero} from './hero.js';
import {initEnergy} from './energy.js';
import {initMenuMotion} from './menu-motion.js';
import {initMarquee} from './ambience.js';
import {revealContent, animationScope, reducedMotion, keyboardGroup, motion} from './motion.js';
const api = window.Brasa, lifetime = new AbortController(), feedback = animationScope(), timers = new Map();
initHero();
const cleanup = [initEnergy(api), initAnatomy(api), revealContent(), initMenuMotion(), initMarquee()];
const weekly = api.getProduct('potterhead');
document.querySelector('#weekly-price').textContent = api.money(weekly.price);
document.querySelector('#weekly-old').textContent = api.money(weekly.originalPrice);
document.querySelector('#weekly-save').textContent = `${api.money(weekly.originalPrice - weekly.price)} OFF`;
const filters = [...document.querySelectorAll('.filter')];
filters.forEach(b => b.setAttribute('aria-pressed', String(b.classList.contains('is-active'))));
cleanup.push(keyboardGroup(document.querySelector('.filters'), '.filter', button => button.click()));
document.addEventListener('click', e => {
  const filter = e.target.closest('.filter');
  if (filter) filters.forEach(b => b.setAttribute('aria-pressed', String(b === filter)));
  const add = e.target.closest('.add-button');
  if (add) {
    const card = add.closest('.product-card'); card.classList.add('is-added');
    clearTimeout(timers.get(card));
    timers.set(card, setTimeout(() => { card.classList.remove('is-added'); timers.delete(card); }, 600));
    feedback.settle();
    feedback.play(document.querySelector('#cart-count'), [{transform: 'scale(.85)'}, {transform: 'scale(1)'}], {duration: motion.fast});
  }
}, {signal: lifetime.signal});
reducedMotion.addEventListener('change', () => feedback.settle(), {signal: lifetime.signal});
addEventListener('pagehide', event => {
  if (event.persisted) return;
  cleanup.forEach(stop => stop?.()); feedback.settle();
  timers.forEach((timer, card) => { clearTimeout(timer); card.classList.remove('is-added'); }); timers.clear(); lifetime.abort();
}, {signal: lifetime.signal});
