import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const OUT = resolve(process.argv[2] ?? 'insta/screenshots');
const PORT = 9333;
mkdirSync(OUT, { recursive: true });

const chrome = spawn('google-chrome', [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`,
  '--user-data-dir=/tmp/rava-capture-profile',
  'about:blank',
]);

const wait = (ms) => new Promise((done) => setTimeout(done, ms));

async function connect() {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      const page = targets.find((target) => target.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await wait(200);
  }
  throw new Error('Chrome did not start');
}

const socket = new WebSocket(await connect());
await new Promise((done) => socket.addEventListener('open', done, { once: true }));
let sequence = 0;
const pending = new Map();
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { done, fail } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? fail(new Error(message.error.message)) : done(message.result);
  }
});
const send = (method, params = {}) =>
  new Promise((done, fail) => {
    const id = ++sequence;
    pending.set(id, { done, fail });
    socket.send(JSON.stringify({ id, method, params }));
  });
const run = async (expression) =>
  (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result
    ?.value;

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
});

const desktop = { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false };
const mobile = { width: 390, height: 844, deviceScaleFactor: 3, mobile: true };

async function open(path, device) {
  await send('Emulation.setDeviceMetricsOverride', device);
  await send('Emulation.setTouchEmulationEnabled', { enabled: device.mobile });
  await send('Page.navigate', { url: BASE + path });
  await wait(2500);
  await run(`(async () => {
    await document.fonts.ready;
    const step = innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += step) { scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); }
    scrollTo(0, 0);
    await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    await new Promise(r => setTimeout(r, 900));
  })()`);
}

async function shot(name, { full = false } = {}) {
  const params = { format: 'png' };
  if (full) {
    const { cssContentSize } = await send('Page.getLayoutMetrics');
    params.captureBeyondViewport = true;
    params.clip = { x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1 };
  }
  const { data } = await send('Page.captureScreenshot', params);
  writeFileSync(`${OUT}/${name}.png`, Buffer.from(data, 'base64'));
  console.log('saved', name);
}

const scrollToSelector = (selector, offset = 0) =>
  run(`(async () => { const el = document.querySelector(${JSON.stringify(selector)}); if (el) scrollTo(0, el.getBoundingClientRect().top + scrollY - ${offset}); await new Promise(r => setTimeout(r, 800)); return !!el; })()`);

const clickText = (text, scope = 'button') =>
  run(`(async () => { const el = [...document.querySelectorAll(${JSON.stringify(scope)})].find(e => e.textContent.trim() === ${JSON.stringify(text)} || e.textContent.trim().includes(${JSON.stringify(text)})); if (el) el.click(); await new Promise(r => setTimeout(r, 1000)); return !!el; })()`);

await open('/', desktop);
await shot('desktop-home-hero');
await shot('desktop-home-full', { full: true });
await scrollToSelector('.product-tabs', 190);
await shot('desktop-home-arrivals');

await open('/products', desktop);
await shot('desktop-products');
await scrollToSelector('.catalog-main', 30);
await shot('desktop-products-grid');

await open('/products/linen-blazer', desktop);
await shot('desktop-product');

console.log('size', await clickText('M', '.size-options button'));
console.log('color', await run(`(async () => { const el = document.querySelector('.color-options button'); if (el) el.click(); await new Promise(r => setTimeout(r, 600)); return !!el; })()`));
console.log('add', await clickText('افزودن به سبد خرید'));
await wait(1200);
await shot('desktop-product-added');
await run(`(async () => { document.querySelector('[aria-label="بستن پیام"]')?.click(); await new Promise(r => setTimeout(r, 600)); })()`);
console.log('cart', await run(`(async () => { const el = document.querySelector('[aria-label^="سبد خرید"]'); if (el) el.click(); await new Promise(r => setTimeout(r, 1500)); return !!el; })()`));
await run(`(async () => { document.querySelector('[aria-label="بستن پیام"]')?.click(); await new Promise(r => setTimeout(r, 600)); })()`);
await shot('desktop-cart');

await open('/checkout', desktop);
await shot('desktop-checkout');

await open('/', mobile);
await shot('mobile-home');
await scrollToSelector('.product-tabs', 90);
await shot('mobile-home-arrivals');
await open('/products', mobile);
await scrollToSelector('.catalog-main', 0);
await shot('mobile-products');
await open('/products/linen-blazer', mobile);
await shot('mobile-product');
await open('/checkout', mobile);
await shot('mobile-checkout');

socket.close();
chrome.kill();
process.exit(0);
