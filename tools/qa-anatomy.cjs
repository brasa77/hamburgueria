const {launchBrowser}=require('./browser.cjs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await launchBrowser();
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('#burger-explorer').getAttribute('aria-busy')==='false');
 const expected=await page.evaluate(()=>window.Brasa.catalog.filter(p=>p.category==='burgers'||p.category==='combos'));
 assert.equal(await page.locator('.explorer-tab').count(),expected.length);
 for(const product of expected){
  await page.locator(`[data-id="${product.id}"].explorer-tab`).click();
  await page.waitForFunction(name=>document.querySelector('#explorer-title').textContent===name,product.name);
  assert.equal(await page.locator('#explorer-description').textContent(),product.description);
  const labels=await page.locator('.explorer-ingredient span').allTextContents();
  for(const label of labels)assert(product.description.includes(label),`${product.id}: ${label}`);
  await page.locator('.explorer-ingredient').last().click();
  assert.equal(await page.locator('#explorer-focus').textContent(),labels.at(-1));
  await page.locator('#explorer-order').click();
 }
 assert.equal(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('brasa-cart')).length),12);
 await page.locator('.explorer-tab').first().focus();await page.keyboard.press('End');
 await page.waitForFunction(()=>document.querySelector('.explorer-tab:last-child').getAttribute('aria-selected')==='true');
 const image=await page.locator('#explorer-image').getAttribute('src');
 await page.locator('.explorer-tab').last().click();
 assert.equal(await page.locator('#explorer-image').getAttribute('src'),image);
 for(const width of [360,390,768,1024,1440]){
  await page.setViewportSize({width,height:1000});
  for(const light of [false,true]){
   await page.evaluate(light=>document.body.classList.toggle('light-theme',light),light);
   await page.waitForTimeout(450);
   const colors=await page.evaluate(()=>['.weekly-card','.energy-scene'].map(s=>getComputedStyle(document.querySelector(s)).backgroundColor));
   assert.equal(colors[0],colors[1]);
   assert.equal(await page.locator('#energy-title').evaluate(el=>getComputedStyle(el).color),light?'rgb(36, 27, 22)':'rgb(255, 255, 255)');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const overflow=await page.locator('.explorer-panel').evaluate(el=>el.scrollWidth>el.clientWidth+1);assert(!overflow);
   await page.locator('#burger-explorer').scrollIntoViewIfNeeded();
   await page.screenshot({path:`docs/qa/anatomy-${width}-${light?'light':'dark'}.png`});
   if(width===390||width===1440){await page.locator('#energy').scrollIntoViewIfNeeded();await page.screenshot({path:`docs/qa/energy-${width}-${light?'light':'dark'}.png`});}
  }
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.locator('.explorer-tab').first().click();
 await page.waitForFunction(()=>document.querySelector('#explorer-title').textContent==='TRIPLO BURGER');
 assert.equal(await page.locator('#explorer-panel').evaluate(el=>el.getAnimations().length),0);
 // Rapid changes must commit only the last requested recipe.
 await page.evaluate(()=>{const tabs=document.querySelectorAll('.explorer-tab');tabs[3].click();tabs[7].click();tabs[11].click()});
 await page.waitForFunction(()=>document.querySelector('#explorer-title').textContent==='RAGNARÖK');
 assert((await page.locator('#explorer-image').getAttribute('src')).endsWith('ragnarok.webp'));
 const fallback=await browser.newPage();
 await fallback.route('**/ragnarok.webp',route=>route.abort());
 await fallback.goto('http://127.0.0.1:5173',{waitUntil:'domcontentloaded'});
 await fallback.locator('.explorer-tab[data-id="ragnarok"]').click();
 await fallback.waitForFunction(()=>document.querySelector('#explorer-title').textContent==='RAGNARÖK');
 assert(await fallback.locator('#explorer-image-error').isVisible());
 assert.equal(await fallback.locator('.explorer-ingredient').count(),7);
 await fallback.close();
 assert.deepEqual(errors,[]);
 await page.evaluate(()=>sessionStorage.removeItem('brasa-cart'));
 await browser.close();console.log('PASS: 12 recipes, exact catalog text, ingredients, purchases, keyboard, themes, 5 widths, reduced motion, no page errors.');
})().catch(error=>{console.error(error);process.exit(1)});
