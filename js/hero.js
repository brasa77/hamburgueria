import {reducedMotion, compactMotion, motion, animationScope, splitText, responsiveMotion} from './motion.js';

export async function initHero() {
  const stage = document.querySelector('#burger-stage');
  if (!stage || stage.dataset.initialized) return;
  stage.dataset.initialized = 'true';
  const slices = [...stage.querySelectorAll('.burger-slice')];
  const replay = document.querySelector('#hero-replay'), pause = document.querySelector('#hero-pause');
  const label = document.querySelector('#hero-state'), lifetime = new AbortController(), copy = animationScope();
  let animations = [], visible = true, ready = false, disposed = false, timer, generation = 0, manualPause = false;
  stage.dataset.motion = 'static';
  // React Bits SplitText concept, adapted to the native stack: bounded stagger,
  // accessible unsplit text, no dependency on GSAP/React and no scroll replay.
  if (performance.now() < 1800) {
    document.querySelectorAll('#hero-title > span').forEach((el, i) => splitText(copy, el, i * motion.stagger));
    ['.hero-slogan','.hero-description','.hero-actions'].forEach((selector, i) =>
      copy.play(document.querySelector(selector), [{opacity:.65,transform:`translate3d(0,${responsiveMotion().distance}px,0)`},{opacity:1,transform:'none'}],
        {duration:motion.enter,delay:(i+2)*motion.stagger}));
  }
  const assembled = [23,9,-3,-13];
  function cancel() { generation++; animations.forEach(a => a.cancel()); animations = []; }
  function sync() {
    const running = animations.some(a => a.playState !== 'finished');
    const play = visible && !document.hidden && !reducedMotion.matches && !manualPause;
    if (running) stage.dataset.motion = play ? 'playing' : 'paused';
    animations.forEach(a => { if (a.playState !== 'finished') play ? a.play() : a.pause(); });
    pause.hidden = !running;
    pause.textContent = manualPause ? 'Retomar' : 'Pausar';
    pause.setAttribute('aria-pressed', String(manualPause));
  }
  function run() {
    if (!ready || disposed || reducedMotion.matches || !stage.animate) return;
    clearTimeout(timer);
    // Sample first; an explicit replay during motion starts where the layers are.
    const initial = slices.map(el => getComputedStyle(el).transform);
    cancel(); const token = generation; manualPause = false;
    stage.classList.remove('is-assembled'); label.textContent = 'Cada camada tem seu lugar.';
    const clock = document.timeline.currentTime;
    animations = slices.map((el, i) => {
      const rest = `translate3d(0,${assembled[i]}%,0)`;
      const tilt = compactMotion.matches ? 0 : [-2,1,-1,.5][i];
      const drift = compactMotion.matches ? 0 : [-8,5,-4,3][i];
      const open = `translate3d(${drift}px,0,0) rotate(${tilt}deg)`;
      // Gather -> release from the top -> hold -> settle from the base.
      const frames = [
        {offset:0,transform:initial[i]},
        {offset:.18,transform:rest},
        {offset:.23+i*.014,transform:rest},
        {offset:.48+i*.014,transform:open},
        {offset:.68,transform:open},
        {offset:.73+(3-i)*.018,transform:open},
        {offset:1,transform:rest}
      ].map(frame => ({...frame,easing:motion.ease}));
      const animation = el.animate(frames,{duration:motion.heroDuration,easing:'linear',fill:'both'});
      animation.startTime = clock; return animation;
    });
    stage.dataset.motion = 'playing';
    Promise.all(animations.map(a => a.finished)).then(() => {
      if (token !== generation || disposed) return;
      // Commit the matching CSS rest before removing the animation effects.
      stage.classList.add('is-assembled'); cancel(); stage.dataset.motion = 'complete';
      label.textContent = 'Sua próxima mordida começa aqui.'; pause.hidden = true;
    }).catch(() => {});
    sync();
  }
  const observer = new IntersectionObserver(entries => {visible = entries[0].isIntersecting; sync();}, {threshold:.05});
  observer.observe(stage);
  document.addEventListener('visibilitychange', sync, {signal:lifetime.signal});
  compactMotion.addEventListener('change', () => {
    if (animations.length) { stage.classList.add('is-assembled'); cancel(); stage.dataset.motion = 'complete'; label.textContent = 'Sua próxima mordida começa aqui.'; sync(); }
  }, {signal:lifetime.signal});
  reducedMotion.addEventListener('change', () => {
    clearTimeout(timer); cancel(); copy.settle(); stage.dataset.motion = 'static'; pause.hidden = true;
    label.textContent = 'O sabor em cada detalhe.';
  }, {signal:lifetime.signal});
  replay.addEventListener('click', () => {
    if (reducedMotion.matches) { label.textContent = 'Movimento reduzido ativo. O produto permanece estático.'; return; }
    run();
  }, {signal:lifetime.signal});
  pause.addEventListener('click', () => {manualPause = !manualPause; sync();}, {signal:lifetime.signal});
  window.addEventListener('pagehide', e => {
    if (e.persisted) return;
    disposed = true; clearTimeout(timer); cancel(); copy.settle(); observer.disconnect(); lifetime.abort();
  }, {signal:lifetime.signal});
  try {
    await Promise.all(slices.map(img => img.decode()));
    if (disposed) return;
    ready = true; stage.classList.add('is-ready'); stage.dataset.motion = 'ready';
    stage.dataset.readyAt = String(performance.now());
    // The static exploded photograph and decoded layers have identical bounds.
    // No assembled transform is applied until the timeline actually starts.
    timer = setTimeout(() => {stage.dataset.startedAt=String(performance.now()); run();}, motion.heroWait);
  } catch {
    stage.classList.remove('is-ready'); replay.hidden = true; pause.hidden = true;
    label.textContent = 'O sabor em cada detalhe.';
  }
}
