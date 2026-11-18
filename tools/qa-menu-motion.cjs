const {launchBrowser} = require('./browser.cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.QA_URL || 'http://127.0.0.1:5173';
const out = 'docs/qa/premium';
fs.mkdirSync(out, {recursive:true});
(async () => {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}});
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.addInitScript(() => {
      window.menuStarts = {};
      new MutationObserver(records => records.forEach(({target}) => {
        if (target.matches?.('#menu-groups .product-card') && target.dataset.motionState === 'entering') {
          const id = target.dataset.productId; window.menuStarts[id] = (window.menuStarts[id] || 0) + 1;
        }
      })).observe(document, {subtree:true, attributes:true, attributeFilter:['data-motion-state']});
    });
    await page.goto(base, {waitUntil:'networkidle'});
    await page.evaluate(() => document.documentElement.style.scrollBehavior = 'auto');
    const cards = page.locator('#menu-groups .product-card');
    assert.equal(await cards.count(), 50);
    const card = cards.first();
    await card.evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight - 100));
    await card.locator('img').evaluate(img => img.decode());
    await card.evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight - 12));
    await page.waitForFunction(() => document.querySelector('#menu-groups .product-card').dataset.motionState === 'entering');
    const choreography = await card.evaluate(el => ({
      imageOpacity: getComputedStyle(el.querySelector('img')).opacity,
      running: el.getAnimations({subtree:true}).map(a => ({fill:a.effect.getTiming().fill, duration:a.effect.getComputedTiming().endTime})),
      outer: el.getAnimations().length,
    }));
    assert(choreography.running.length >= 1, 'bounded content entrance');
    assert.equal(await card.locator('img').evaluate(el=>el.getAnimations().length),0,'photographs never participate in scroll motion');
    assert.equal(await card.locator('.media-curtain').count(),0,'no photo occlusion');
    assert.equal(choreography.imageOpacity, '1', 'photo itself never fades');
    assert.equal(choreography.outer, 0, 'layout card is not animated');
    assert(choreography.running.every(a => a.fill === 'backwards' && a.duration < 1100));
    await page.waitForTimeout(1000);
    assert.equal(await card.getAttribute('data-motion-state'), 'settled');
    assert.equal(await card.evaluate(el => el.getAnimations({subtree:true}).length), 0);
    // Scroll through every category, then reverse and revisit at high speed.
    for (const group of await page.locator('#menu-groups .menu-group').all()) {
      await group.evaluate(el => el.scrollIntoView({behavior:'instant',block:'start'}));
      await page.waitForTimeout(90);
      const groupCards = group.locator('.product-card');
      for (let i = 0; i < await groupCards.count(); i += 3) {
        await groupCards.nth(i).evaluate(el => el.scrollIntoView({behavior:'instant',block:'center'}));
        await page.waitForTimeout(40);
      }
    }
    for (let pass = 0; pass < 3; pass++) {
      for (const i of [49,0,36,7,44,15,0]) {
        await cards.nth(i).evaluate(el => el.scrollIntoView({behavior:'instant',block:'center'}));
        await page.waitForTimeout(30);
      }
    }
    await page.waitForTimeout(1050);
    const stable = await cards.evaluateAll(els => els.every(el => {
      const img = el.querySelector('img'), text = el.querySelector('.motion-text');
      return getComputedStyle(el).opacity === '1' && getComputedStyle(img).opacity === '1'
        && getComputedStyle(img).transform === 'none' && getComputedStyle(img).translate === 'none'
        && getComputedStyle(text).transform === 'none' && !el.getAnimations({subtree:true}).length;
    }));
    assert(stable, 'all products stable after fast scroll in both directions');
    const starts = await page.evaluate(() => window.menuStarts);
    assert(Object.values(starts).every(n => n === 1), 'entrances run at most once');
    assert(Object.keys(starts).length >= 1, 'exercise the full entrance near the viewport');
    assert.equal(await cards.evaluateAll(els => els.filter(el => el.dataset.motionState === 'settled').length),50,'all 50 cards settle, including skipped fast-jump entrances');
    await page.evaluate(() => window.savedCards = new Map([...document.querySelectorAll('#menu-groups .product-card')].map(el => [el.dataset.productId,el])));
    await page.locator('[data-filter=burgers]').click();
    assert.equal(await cards.count(), 8);
    await page.locator('#menu-search').fill('potterhead'); await page.waitForTimeout(180);
    assert.equal(await cards.count(), 1);
    await page.locator('#menu-search').fill(''); await page.waitForTimeout(180);
    await page.locator('#menu-sort').selectOption('price-asc');
    const sorted = await cards.evaluateAll(els => els.map(el => window.Brasa.getProduct(el.dataset.productId).price));
    assert.deepEqual(sorted, [...sorted].sort((a,b) => a-b));
    await page.locator('#menu-sort').selectOption('featured');
    await page.locator('[data-filter=todos]').click();
    assert(await cards.evaluateAll(els => els.every(el => window.savedCards.get(el.dataset.productId) === el)), 'same nodes after search/sort/filter');
    await card.focus(); assert.equal(await card.evaluate(el => el.getAnimations({subtree:true}).filter(a => !(a instanceof CSSTransition)).length), 0);
    await card.locator('.add-button').click();
    assert(await page.evaluate(() => JSON.parse(sessionStorage.getItem('brasa-cart')).length === 1));
    // Responsive composition, complete descriptions, stable photos and both themes.
    const burger = page.locator('[data-category=burgers] .product-card').first();
    for (const width of [360,390,768,1024,1440]) {
      await page.setViewportSize({width,height:900});
      for (const light of [false,true]) {
        await page.evaluate(light => document.body.classList.toggle('light-theme',light), light);
        await burger.evaluate(el => el.scrollIntoView({behavior:'instant',block:'center'}));
        await page.waitForTimeout(450);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${width}/${light}`);
        const sizes = await cards.evaluateAll(els => els.map(el => {
          const desc = el.querySelector('.card-description');
          return {w:el.clientWidth,sw:el.scrollWidth,desc:desc.clientHeight,sh:desc.scrollHeight};
        }));
        assert(sizes.every(s => s.sw <= s.w + 1 && s.sh <= s.desc + 1), `uncropped copy ${width}`);
        if ([390,1440].includes(width)) await page.screenshot({path:`${out}/menu-${width}-${light?'light':'dark'}.png`});
      }
    }
    // Dynamic preference: stop a fresh active entry, don't replay on opt-back-in.
    await page.evaluate(async () => {
      const {initMenuMotion} = await import('/js/menu-motion.js');
      const host = document.createElement('div'); host.id = 'motion-fixture'; host.style.marginBottom = `${innerHeight}px`;
      const sample = document.querySelector('#menu-groups .product-card').cloneNode(true);
      delete sample.dataset.motionState; host.append(sample); document.body.append(host);
      window.stopFixture = initMenuMotion(host);
      if (window.stopFixture !== initMenuMotion(host)) throw Error('Duplicate controller');
      scrollTo(0,host.getBoundingClientRect().top+scrollY-innerHeight-12);
    });
    await page.waitForFunction(() => document.querySelector('#motion-fixture .product-card').dataset.motionState === 'entering');
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForTimeout(60);
    assert.equal(await page.locator('#motion-fixture').evaluate(el => el.getAnimations({subtree:true}).length), 0);
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.evaluate(() => { window.stopFixture(); window.stopFixture(); document.querySelector('#motion-fixture').remove(); });
    assert.equal(await page.locator('.ribbon-group').first().textContent(), await page.locator('.ribbon-group').last().textContent());
    await page.locator('#ribbon-toggle').click();
    assert.equal(await page.locator('.ribbon-track').evaluate(el => getComputedStyle(el).animationPlayState), 'paused');
    await page.locator('#ribbon-toggle').click();
    const groups = await page.locator('.ribbon-group').evaluateAll(els => els.map(el => el.getBoundingClientRect().width));
    assert(Math.abs(groups[0] - groups[1]) < .1, 'identical loop width');
    // Latest Energy request wins, including switching back to the outgoing flavor.
    await page.evaluate(() => { const t = document.querySelectorAll('.energy-tab'); t[2].click(); t[4].click(); t[0].click(); });
    await page.waitForFunction(() => document.querySelector('#energy-scene').getAttribute('aria-busy') === 'false');
    assert.equal(await page.locator('.energy-tab').first().getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#energy-photo img').count(), 1);
    // Deferred media cannot reinitialize an already settled card.
    const late = await browser.newPage({viewport:{width:390,height:844}});
    let release; const gate = new Promise(resolve => release = resolve);
    await late.route('**/assets/entradas/**', async route => { await gate; await route.continue(); });
    await late.goto(base, {waitUntil:'domcontentloaded'});
    await late.locator('#menu-groups .product-card').first().evaluate(el => el.scrollIntoView({behavior:'instant',block:'center'}));
    await late.waitForTimeout(950);
    const rectBefore = await late.locator('#menu-groups .card-media').first().boundingBox();
    release(); await late.locator('#menu-groups .card-media img').first().evaluate(img => img.decode());
    await late.waitForTimeout(70);
    const rectAfter = await late.locator('#menu-groups .card-media').first().boundingBox();
    assert.equal(rectAfter.height, rectBefore.height);
    assert.equal(await late.locator('#menu-groups .product-card').first().getAttribute('data-motion-state'), 'settled');
    assert.equal(await late.locator('#menu-groups .product-card').first().evaluate(el => el.getAnimations({subtree:true}).length), 0);
    await late.close();
    for (const module of ['menu-motion.js','motion.js']) {
      const fallback = await browser.newPage();
      await fallback.route(`**/js/${module}`, route => route.abort());
      await fallback.goto(base);
      assert.equal(await fallback.locator('#menu-groups .product-card').count(), 50);
      assert.equal(await fallback.locator('#menu-groups .motion-text').first().evaluate(el => getComputedStyle(el).transform), 'none');
      await fallback.close();
    }
    const disabled = await browser.newPage({javaScriptEnabled:false});
    await disabled.goto(base);
    assert.equal(await disabled.locator('noscript .product-card').count(), 50);
    assert(await disabled.locator('noscript .product-card').first().isVisible()); await disabled.close();
    const reduced = await browser.newPage({reducedMotion:'reduce'});
    await reduced.goto(base, {waitUntil:'networkidle'});
    await reduced.locator('#menu-groups').evaluate(el => el.scrollIntoView({behavior:'instant'}));
    await reduced.waitForTimeout(1200);
    assert.equal(await reduced.evaluate(() => document.getAnimations().length), 0, 'reduced-motion page has no active animation');
    await reduced.close();
    assert.deepEqual(errors, []);
    const result = {products:50,settledProducts:50,entrancesAnimated:Object.keys(starts).length,maxEntrancesPerProduct:Math.max(...Object.values(starts)),fastJumps:'skip directly to visible final state',widths:[360,390,768,1024,1440],themes:2,rapidScrollPasses:3,lateImages:'passed',fallback:'module failures + no JS',reducedMotion:'initial + live changes',filterSortSearch:'retained nodes',cleanup:'idempotent',runtimeErrors:errors};
    fs.writeFileSync(path.join(out,'motion-results.json'),JSON.stringify(result,null,2));
    console.log('PASS', JSON.stringify(result));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
