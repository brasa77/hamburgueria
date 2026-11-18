const {launchBrowser}=require('./browser.cjs');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await launchBrowser();
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.heroTimes={};
  new MutationObserver(records=>{for(const r of records){if(r.target.id==='burger-stage'){const state=r.target.dataset.motion;if(!window.heroTimes[state])window.heroTimes[state]=performance.now()}}}).observe(document,{subtree:true,attributes:true,attributeFilter:['data-motion']});
 });
 await page.goto('http://127.0.0.1:5173',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.heroTimes.playing);
 const timing=await page.evaluate(()=>window.heroTimes.playing-window.heroTimes.ready);
 assert(timing>=980&&timing<1400,`hero delay ${timing}`);
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:'docs/qa/refined-hero-desktop.png'});
 await page.locator('#theme-toggle').click();
 assert.equal(await page.locator('#energy-title').evaluate(el=>getComputedStyle(el).color),'rgb(36, 27, 22)');
 assert.equal(await page.locator('.hero-slogan i').evaluate(el=>getComputedStyle(el).color),'rgb(230, 57, 47)');
 assert.equal(await page.locator('.hero-star').count(),0);
 await page.locator('#energy').scrollIntoViewIfNeeded();
 await page.screenshot({path:'docs/qa/refined-energy-light.png'});
 const cards=page.locator('#menu-groups .product-card');assert.equal(await cards.count(),50);
 await cards.first().scrollIntoViewIfNeeded();
 await page.evaluate(()=>window.retainedCard=document.querySelector('#menu-groups .product-card'));
 await page.locator('[data-filter="burgers"]').click();
 await page.locator('[data-filter="todos"]').click();
 assert(await page.evaluate(()=>document.querySelector('#menu-groups .product-card')===window.retainedCard));
 for(let pass=0;pass<3;pass++){
  await cards.nth(6).scrollIntoViewIfNeeded();await cards.first().scrollIntoViewIfNeeded();
  assert(await cards.first().evaluate(el=>getComputedStyle(el).opacity==='1'&&getComputedStyle(el.querySelector('img')).opacity==='1'&&!el.getAnimations().filter(a=>!(a instanceof CSSTransition)).length));
 }
 await page.screenshot({path:'docs/qa/refined-menu-light.png'});
 // Open every product and compare image and media bounds after decoding.
 for(let i=0;i<50;i++){
  await cards.nth(i).click({position:{x:20,y:20}});
  await page.locator('#modal-image').evaluate(img=>img.decode());
  const fit=await page.locator('#modal-image').evaluate(img=>{const a=img.getBoundingClientRect(),b=img.parentElement.getBoundingClientRect();return {dw:Math.abs(a.width-b.width),dh:Math.abs(a.height-b.height),fit:getComputedStyle(img).objectFit,placeholder:getComputedStyle(img.nextElementSibling).visibility}});
  assert(fit.dw<1&&fit.dh<1&&fit.fit==='cover'&&fit.placeholder==='hidden',JSON.stringify(fit));
  await page.keyboard.press('Escape');
 }
 await page.locator('#anatomia').scrollIntoViewIfNeeded();
 const tabs=page.locator('.explorer-tab');
 await tabs.first().focus();await page.keyboard.press('ArrowRight');
 await page.waitForFunction(()=>document.querySelectorAll('.explorer-tab')[1].getAttribute('aria-selected')==='true');
 assert(await tabs.nth(1).evaluate(el=>el===document.activeElement));
 for(let i=0;i<12;i++){
  await tabs.nth(i).click();
  await page.waitForFunction(()=>document.querySelector('#burger-explorer').getAttribute('aria-busy')==='false');
  const layers=page.locator('.explorer-ingredient');
  await layers.last().click();
  assert.equal(await layers.last().getAttribute('aria-pressed'),'true');
  assert(await layers.last().evaluate(el=>el.getBoundingClientRect().height>=44));
 }
 await page.locator('#burger-explorer').screenshot({style:'.site-header,.back-top,.skip-link{visibility:hidden}',path:'docs/qa/refined-anatomy-desktop.png'});
 const ribbon=await page.locator('.ribbon-track').evaluate(el=>({track:el.getBoundingClientRect().width,group:el.firstElementChild.getBoundingClientRect().width}));
 assert(Math.abs(ribbon.track-2*ribbon.group)<1);
 for(const width of [360,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  for(const light of [false,true]){
   await page.evaluate(light=>document.body.classList.toggle('light-theme',light),light);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width} ${light}`);
   await page.locator('#anatomia').scrollIntoViewIfNeeded();
   await page.locator('.explorer-ingredient').last().click();
   if(width===390){await page.locator('#burger-explorer').screenshot({style:'.site-header,.back-top,.skip-link{visibility:hidden}',path:`docs/qa/refined-anatomy-mobile-${light?'light':'dark'}.png`});}
  }
 }
 // Touch layout: media retains fixed height even for the longest product copy.
 await page.setViewportSize({width:390,height:844});
 await cards.first().click({position:{x:20,y:20}});
 await page.locator('#modal-image').evaluate(img=>img.decode());
 assert(await page.locator('#modal-image').evaluate(img=>Math.abs(img.getBoundingClientRect().height-img.parentElement.getBoundingClientRect().height)<1));
 await page.locator('#product-modal').screenshot({path:'docs/qa/refined-modal-mobile.png'});
 await page.locator('#modal-add').click();
 assert.equal(await page.locator('#cart-count').textContent(),'1');
 await page.locator('#cart-trigger').click();
 assert(await page.locator('#cart-panel').evaluate(el=>el.classList.contains('is-open')));
 await page.keyboard.press('Escape');
 await page.setViewportSize({width:1440,height:1000});
 for(const tab of await page.locator('.energy-tab').all()){
  await tab.click();await page.waitForFunction(()=>document.querySelector('#energy-scene').getAttribute('aria-busy')!=='true');
  assert.equal(await tab.getAttribute('aria-pressed'),'true');
  await page.locator('#promo-energy-add').click();
 }
 assert.equal(await page.locator('#cart-count').textContent(),'6');
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.ribbon-track').evaluate(el=>getComputedStyle(el).animationName),'none');
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForSelector('#burger-stage.is-ready');
 await page.waitForTimeout(1150);
 assert.equal(await page.locator('.burger-slice').first().evaluate(el=>el.getAnimations().length),0);
 assert.deepEqual(errors,[]);
 const result={heroDelayMs:Math.round(timing),products:50,modalImagesChecked:50,widths:[360,390,768,1024,1440],themes:2,repeatedScrollPasses:3,runtimeErrors:errors,reducedMotion:'passed'};
 fs.writeFileSync('docs/qa/refinement-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
