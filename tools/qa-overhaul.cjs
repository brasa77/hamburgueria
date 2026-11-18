const {launchBrowser}=require('./browser.cjs');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const out='docs/qa/overhaul';fs.mkdirSync(out,{recursive:true});
const url=process.env.QA_URL||'http://127.0.0.1:5173';
(async()=>{
 const browser=await launchBrowser();
 const report={widths:[],screenshots:[],errors:[],checks:[]};
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.on('pageerror',e=>report.errors.push(e.message));
  await page.addInitScript(()=>{
   window.starts={};window.shifts=0;
   new MutationObserver(records=>records.forEach(r=>{
    if(r.target.matches?.('#menu-groups .product-card')&&r.target.dataset.motionState==='entering'){
     const id=r.target.dataset.productId;window.starts[id]=(window.starts[id]||0)+1;
    }
   })).observe(document,{subtree:true,attributes:true,attributeFilter:['data-motion-state']});
   new PerformanceObserver(list=>list.getEntries().forEach(e=>{if(!e.hadRecentInput)window.shifts+=e.value})).observe({type:'layout-shift',buffered:true});
  });
  await page.goto(url,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
  await page.waitForFunction(()=>document.querySelector('#burger-stage').dataset.startedAt);
  const heroDelay=await page.locator('#burger-stage').evaluate(el=>Number(el.dataset.startedAt)-Number(el.dataset.readyAt));
  assert(heroDelay>=980&&heroDelay<1600,`hero delay: ${heroDelay}`);report.heroDelayMs=heroDelay;
  await page.locator('#hero-pause').click();
  assert.equal(await page.locator('#burger-stage').getAttribute('data-motion'),'paused');
  await page.locator('#hero-pause').click();
  await page.waitForFunction(()=>document.querySelector('#burger-stage').dataset.motion==='complete');
  assert.equal(await page.locator('.burger-slice').first().evaluate(el=>el.getAnimations().length),0);
  report.checks.push('hero readiness, pause/resume, final CSS state and released animation effects');
  report.initialCLS=await page.evaluate(()=>window.shifts);
  await page.screenshot({path:`${out}/desktop-dark.png`});
  await page.locator('#hero-replay').click();
  await page.waitForTimeout(2450);
  await page.screenshot({path:`${out}/hero-layers.png`});
  await page.locator('#hero-pause').click();
  const cards=page.locator('#menu-groups .product-card');assert.equal(await cards.count(),50);
  assert.equal(await page.locator('.media-curtain').count(),0);
  // Slow approach then reverse the observer boundary several times: no photo occlusion.
  await page.locator('#menu-groups .product-card').first().evaluate(el=>scrollTo(0,scrollY+el.getBoundingClientRect().top-innerHeight-80));
  await cards.first().locator('img').evaluate(img=>img.decode());
  for(const delta of [50,50,-35,45,300,-300,350]){
   await page.evaluate(y=>scrollBy(0,y),delta);await page.waitForTimeout(70);
   assert(await cards.first().evaluate(el=>getComputedStyle(el.querySelector('img')).opacity==='1'&&getComputedStyle(el.querySelector('img')).transform==='none'));
  }
  await page.waitForTimeout(700);
  await page.evaluate(()=>window.retainedCard=document.querySelector('#menu-groups .product-card'));
  for(const category of ['burgers','energeticos','todos'])await page.locator(`[data-filter="${category}"]`).click();
  assert(await page.evaluate(()=>document.querySelector('#menu-groups .product-card')===window.retainedCard));
  await page.locator('#menu-search').fill('Potter');await page.waitForTimeout(200);assert.equal(await cards.count(),1);
  await page.locator('#menu-search').fill('qzznothing');await page.waitForTimeout(200);assert.equal(await cards.count(),0);
  await page.locator('#clear-search').click();assert.equal(await cards.count(),50);
  await page.locator('[data-filter="burgers"]').click();
  await page.locator('#menu-sort').selectOption('price-asc');
  assert.equal(await cards.first().getAttribute('data-product-id'),'triplo-burger');
  await page.locator('[data-filter="todos"]').click();await page.locator('#menu-sort').selectOption('featured');
  for(let pass=0;pass<2;pass++)for(const index of [0,10,25,49,25,10,0]){
   await cards.nth(index).scrollIntoViewIfNeeded();await page.waitForTimeout(40);
  }
  await page.waitForTimeout(700);
  assert(await page.evaluate(()=>Object.values(window.starts).every(n=>n===1)),JSON.stringify(await page.evaluate(()=>window.starts)));
  assert(await cards.evaluateAll(nodes=>nodes.every(el=>getComputedStyle(el).opacity==='1'&&getComputedStyle(el.querySelector('img')).opacity==='1')));
  report.checks.push('50 products; observer reversals, repeated scroll, node reuse, filters, search and sorting');
  for(let i=0;i<50;i++){
   await cards.nth(i).click({position:{x:20,y:20}});
   await page.locator('#modal-image').evaluate(img=>img.decode());
   assert(await page.locator('#modal-image').evaluate(img=>img.naturalWidth>0&&Math.abs(img.getBoundingClientRect().height-img.parentElement.getBoundingClientRect().height)<2));
   await page.keyboard.press('Escape');
  }
  await cards.first().locator('.add-button').click();await page.locator('#cart-trigger').click();
  assert(await page.locator('#cart-panel').evaluate(el=>el.contains(document.activeElement)));
  await page.locator('[data-cart-action="increase"]').click();assert.equal(await page.locator('#cart-count').textContent(),'2');
  await page.locator('#checkout').click();assert(await page.locator('#checkout-modal').evaluate(el=>el.classList.contains('is-open')));
  await page.keyboard.press('Escape');
  report.checks.push('all 50 modal photographs; add to cart, quantity, checkout and focus return');
  const tabs=page.locator('.explorer-tab');
  for(const tab of await tabs.all()){
   await tab.click();await page.waitForFunction(()=>document.querySelector('#burger-explorer').getAttribute('aria-busy')==='false');
   const id=await tab.getAttribute('data-id');
   assert.equal(await page.locator('#explorer-description').textContent(),await page.evaluate(id=>Brasa.getProduct(id).description,id));
  }
  await tabs.first().focus();await page.keyboard.press('End');
  await page.waitForFunction(()=>document.querySelector('.explorer-tab:last-child').getAttribute('aria-selected')==='true');
  await page.locator('.explorer-ingredient').last().click();
  assert.equal(await page.locator('.explorer-ingredient').last().getAttribute('aria-pressed'),'true');
  for(const tab of await page.locator('.energy-tab').all()){
   await tab.click();await page.waitForFunction(()=>document.querySelector('#energy-scene').getAttribute('aria-busy')!=='true');
   assert.equal(await tab.getAttribute('aria-pressed'),'true');
   assert.equal(await page.locator('#energy-photo img').count(),1);
  }
  await page.evaluate(()=>{const tabs=document.querySelectorAll('.energy-tab');tabs[1].click();tabs[3].click();tabs[2].click()});
  await page.waitForFunction(()=>document.querySelector('#energy-flavor').textContent==='MANGA'&&document.querySelector('#energy-scene').getAttribute('aria-busy')==='false');
  report.checks.push('12 anatomy recipes, exact descriptions, keyboard selection; 5 energy flavors and rapid changes');
  // Complete layout matrix, both palettes. Check actual content bounds, not just body clipping.
  for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:width<721?844:1000});
   for(const light of [false,true]){
    await page.evaluate(light=>{document.body.classList.toggle('light-theme',light);document.documentElement.dataset.theme=light?'light':'dark'},light);
    const problems=await page.evaluate(()=>[...document.querySelectorAll('.hero-copy,.hero-visual,.weekly-card,.energy-scene,.menu-tools,.category-heading,.card-content,.explorer-panel,.review-form,.contact-form,.energy-tab')].filter(el=>{
     const r=el.getBoundingClientRect();return r.width&&(r.left < -1 || r.right>innerWidth+1 || el.scrollWidth>el.clientWidth+2);
    }).map(el=>({class:el.className,w:el.clientWidth,sw:el.scrollWidth})));
    assert.deepEqual(problems,[],`overflow width ${width}, light ${light}: ${JSON.stringify(problems)}`);
    if(width===390||width===1440){
     await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(300);
     const path=`${out}/${width}-${light?'light':'dark'}-hero.png`;await page.screenshot({path});report.screenshots.push(path);
     for(const selector of ['.weekly-card','#energy-scene','#burger-explorer']){
      await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(850);
      const path=`${out}/${width}-${light?'light':'dark'}-${selector.replace(/[.#]/g,'')}.png`;
      await page.locator(selector).screenshot({path});report.screenshots.push(path);
     }
     await page.locator('#menu-groups .product-card').first().scrollIntoViewIfNeeded();await page.waitForTimeout(600);
     await page.screenshot({path:`${out}/${width}-${light?'light':'dark'}-menu.png`});
    }
   }
   report.widths.push(width);
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('.menu-toggle').click();
  assert(await page.locator('main').evaluate(el=>el.inert));
  await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  assert(await page.locator('.menu-toggle').evaluate(el=>el===document.activeElement));
  await page.locator('.menu-toggle').click();await page.locator('.nav-link[href="#cardapio"]').click();
  assert(!await page.locator('main').evaluate(el=>el.inert));
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  await page.locator('.menu-toggle').click();await page.setViewportSize({width:1440,height:1000});
  assert(!await page.locator('main').evaluate(el=>el.inert));assert(!await page.locator('#nav-links').evaluate(el=>el.inert));
  report.checks.push('responsive matrix; mobile drawer, Escape, return focus, anchor and breakpoint cleanup');
  // Reduced motion: no moving timeline and no hidden products, on initial load as well.
  await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});await page.waitForTimeout(1200);
  assert.equal(await page.locator('.burger-slice').first().evaluate(el=>el.getAnimations().length),0);
  assert.equal(await page.locator('.ribbon-track').evaluate(el=>getComputedStyle(el).animationName),'none');
  await cards.last().scrollIntoViewIfNeeded();assert(await cards.last().isVisible());
  const fallback=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
  await fallback.goto(url);assert.equal(await fallback.locator('noscript .product-card').count(),50);assert(await fallback.locator('.hero-fallback').isVisible());await fallback.close();
  const failed=await browser.newPage();await failed.route('**/layer-2.webp',r=>r.abort());await failed.goto(url,{waitUntil:'networkidle'});
  assert(await failed.locator('.hero-fallback').isVisible());assert.equal(await failed.locator('#menu-groups .product-card').count(),50);await failed.close();
  report.checks.push('reduced motion, JavaScript disabled catalog, failed hero image fallback');
  assert.deepEqual(report.errors,[]);
  fs.writeFileSync(`${out}/results.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
