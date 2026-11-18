import {reducedMotion} from './motion.js';
export function initMarquee() {
  const track = document.querySelector('.ribbon-track'), button = document.querySelector('#ribbon-toggle');
  if (!track || !button) return () => {};
  const lifetime = new AbortController(); let visible = true, paused = false, disposed = false;
  button.hidden = false;
  function sync() {
    track.style.animationPlayState = visible && !paused && !document.hidden && !reducedMotion.matches ? 'running' : 'paused';
    button.textContent = paused ? 'Retomar faixa' : 'Pausar faixa';
    button.setAttribute('aria-pressed', String(paused));
  }
  function measure() {
    if (disposed) return;
    const animation = track.getAnimations()[0];
    const timing = animation?.effect.getComputedTiming();
    const progress = animation && timing.duration ? Number(animation.currentTime) / timing.duration : 0;
    const duration = track.firstElementChild.getBoundingClientRect().width / 48 * 1000;
    track.style.setProperty('--marquee-duration', `${duration}ms`);
    if (animation) animation.currentTime = progress * duration;
  }
  button.addEventListener('click', () => { paused = !paused; sync(); }, {signal: lifetime.signal});
  document.addEventListener('visibilitychange', sync, {signal: lifetime.signal});
  reducedMotion.addEventListener('change', () => { measure(); sync(); }, {signal: lifetime.signal});
  const observer = window.IntersectionObserver ? new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }) : null;
  observer?.observe(track.parentElement);
  const resize = window.ResizeObserver ? new ResizeObserver(measure) : null;
  resize?.observe(track.firstElementChild);
  document.fonts?.ready.then(measure); measure(); sync();
  return () => { disposed = true; lifetime.abort(); observer?.disconnect(); resize?.disconnect(); track.style.animationPlayState = 'paused'; };
}
