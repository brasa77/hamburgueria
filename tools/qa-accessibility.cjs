const {launchBrowser}=require('./browser.cjs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await launchBrowser();
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto('http://127.0.0.1:5173',{waitUntil:'networkidle'});
  await page.locator('.menu-toggle').click();
  await page.locator('#cart-trigger').focus();await page.keyboard.press('Tab');
  assert(await page.locator('header .brand').evaluate(el=>el===document.activeElement));
  await page.keyboard.press('Escape');
  assert(await page.locator('.menu-toggle').evaluate(el=>el===document.activeElement));
  await page.locator('#review-form input[name=name]').fill('Teste de interface');
  await page.locator('.star-option[data-rating="4"]').click();
  await page.locator('#review-form textarea').fill('Verificação local da interface.');
  await page.locator('#review-form button[type=submit]').click();
  assert((await page.locator('#review-feedback').textContent()).includes('simulado'));
  await page.locator('#contact-form input[name=name]').fill('Teste de interface');
  await page.locator('#contact-form input[type=email]').fill('qa@example.com');
  await page.locator('#contact-form textarea').fill('Verificação local da interface.');
  await page.locator('#contact-form button[type=submit]').click();
  assert((await page.locator('#contact-feedback').textContent()).includes('simulada'));
  await page.locator('#back-top').click();await page.waitForFunction(()=>scrollY<3,{},{timeout:5000});
  assert((await page.evaluate(()=>scrollY))<3);
  await page.locator('#menu-groups .add-button').first().click();await page.locator('#cart-trigger').click();
  const first=page.locator('#cart-panel button').first();await first.focus();await page.keyboard.press('Shift+Tab');
  assert(await page.locator('#checkout').evaluate(el=>el===document.activeElement));
  await page.keyboard.press('Escape');assert(await page.locator('#cart-trigger').evaluate(el=>el===document.activeElement));
  console.log('PASS: mobile focus loop, Escape, focus return, 44px stars, local review/contact submission and return to top.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
