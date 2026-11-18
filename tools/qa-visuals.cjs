const {launchBrowser}=require('./browser.cjs');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const output='docs/qa/premium';
(async()=>{
 const browser=await launchBrowser();
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto(process.env.QA_URL||'http://127.0.0.1:5173',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
  // Screen inspection targets use settled, decoded images, never a loading frame.
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:width===1440?1000:844});
   for(const light of [false,true]){
    await page.evaluate(value=>document.body.classList.toggle('light-theme',value),light);
    for(const [selector,name] of [['.hero','hero'],['.weekly-card','weekly'],['.energy-scene','energy'],['#burger-explorer','anatomy']]){
     await page.locator(selector).evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));
     await page.locator(selector+' img').first().evaluate(img=>img.decode());
     await page.waitForTimeout(1000);
     if(name==='hero'){await page.locator('#hero-replay').evaluate(el=>el.click());await page.waitForTimeout(2100);}
     const path=`${output}/${name}-${width}-${light?'light':'dark'}.png`;
     if(name==='hero'){
      // Capture the fixed header with the hero in one viewport; avoid a
      // beyond-viewport element capture being clipped by Chromium compositing.
      const viewport=page.viewportSize(),bounds=await page.locator(selector).boundingBox();
      await page.setViewportSize({...viewport,height:Math.max(viewport.height,Math.ceil(bounds.height))});
      await page.screenshot({path});await page.setViewportSize(viewport);
     }else await page.locator(selector).screenshot({path,style:'.site-header,.back-top{visibility:hidden}'});
    }
    await page.locator('[data-category=burgers]').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));
    await page.waitForTimeout(950);
    await page.screenshot({path:`${output}/menu-${width}-${light?'light':'dark'}.png`});
   }
  }
  // Separate fresh page: observe layout stability during first-time reveals.
  const motion=await browser.newPage({viewport:{width:1440,height:1000}});
  await motion.goto('http://127.0.0.1:5173',{waitUntil:'networkidle'});
  await motion.evaluate(()=>document.fonts.ready);
  await motion.evaluate(()=>{
   document.documentElement.style.scrollBehavior='auto';window.motionShifts=[];
   new PerformanceObserver(list=>list.getEntries().forEach(e=>{if(!e.hadRecentInput)window.motionShifts.push(e.value)})).observe({type:'layout-shift'});
  });
  for(const selector of ['#promocao','#energy','#cardapio','[data-category=burgers]','[data-category=combos]','#anatomia']){
   await motion.locator(selector).evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));await motion.waitForTimeout(1000);
  }
  const shifts=await motion.evaluate(()=>window.motionShifts);
  assert.equal(shifts.length,0,'entry effects must not move layout');
  // Inspect the actual finite timeline at three points, on a fresh retained card.
  await motion.reload({waitUntil:'networkidle'});
  await motion.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
  const card=motion.locator('[data-category=burgers] .product-card').nth(1);
  await card.evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-innerHeight-150));
  await card.locator('img').evaluate(img=>img.decode());
  await card.evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-innerHeight-12));
  await motion.waitForFunction(()=>document.querySelector('[data-category=burgers] .product-card:nth-child(2)').dataset.motionState==='entering');
  await card.evaluate(el=>{window.inspectedAnimations=el.getAnimations({subtree:true});window.inspectedAnimations.forEach(a=>a.pause())});
  await card.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));
  for(const time of [120,340,610]){
   await motion.evaluate(time=>window.inspectedAnimations.forEach(a=>a.currentTime=time),time);
   await motion.waitForTimeout(30);
   await motion.screenshot({path:`${output}/menu-sequence-${time}.png`});
  }
  await motion.evaluate(()=>window.inspectedAnimations.forEach(a=>a.finish()));
  await motion.waitForTimeout(60);
  await motion.screenshot({path:`${output}/menu-sequence-settled.png`});
  fs.writeFileSync(`${output}/visual-results.json`,JSON.stringify({widths:[390,1440],themes:2,sections:['hero','weekly','energy','menu','anatomy'],entryLayoutShifts:shifts,sequenceSamplesMs:[120,340,610,'settled'],note:'Layout-shift measurement starts after fonts load. Not a full-page Core Web Vitals or physical-device FPS measurement.'},null,2));
  console.log('PASS: responsive captures, 0 reveal layout shifts, finite timeline samples.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
