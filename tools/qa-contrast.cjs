const {launchBrowser}=require('./browser.cjs');
const fs=require('node:fs');
(async()=>{const browser=await launchBrowser();try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:5173',{waitUntil:'networkidle'});
 const report=[];
 for(const light of [false,true]){
  await page.evaluate(light=>document.body.classList.toggle('light-theme',light),light);await page.waitForTimeout(400);
  const ratios=await page.evaluate(()=>{
   const lum=s=>{const rgb=s.match(/[\d.]+/g).slice(0,3).map(v=>{v=Number(v)/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722};
   return ['.about h2','.about-copy>p:not(.eyebrow)','.review-form-intro h3','.review-form-footer small','.card-tag','.cta-section .eyebrow','.cta-section p:not(.eyebrow)','.button-primary'].map(sel=>{
    const el=document.querySelector(sel);let bg=el;while(bg&&getComputedStyle(bg).backgroundColor==='rgba(0, 0, 0, 0)')bg=bg.parentElement;
    const a=lum(getComputedStyle(el).color),z=lum(getComputedStyle(bg||document.body).backgroundColor);
    return {selector:sel,ratio:Number(((Math.max(a,z)+.05)/(Math.min(a,z)+.05)).toFixed(2))};
   });
  });
  report.push({light,ratios});if(ratios.some(r=>r.ratio<4.5))throw Error(JSON.stringify({light,ratios}));
 }
 fs.writeFileSync('docs/qa/overhaul/contrast-results.json',JSON.stringify(report,null,2));
 console.log('PASS: 8 key text/control pairs, both settled themes, minimum ratio >= 4.5:1. Gradient/photo backgrounds not covered by this check.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
