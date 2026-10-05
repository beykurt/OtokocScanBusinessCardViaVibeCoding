// promo.html animasyonunu kare kare kaydeder: node record.mjs [fps] [tekKareSaniye]
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const fps = Number(process.argv[2] ?? 25);
const single = process.argv[3];
const framesDir = path.join(here, 'frames');
fs.rmSync(framesDir, { recursive: true, force: true });
fs.mkdirSync(framesDir);

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--hide-scrollbars', '--force-color-profile=srgb'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto('file:///' + path.join(here, 'promo.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);

if (single !== undefined) {
  for (const s of single.split(',')) {
    await page.evaluate((t) => window.render(t), Number(s));
    await page.screenshot({ path: path.join(here, `preview-${s}.png`) });
  }
} else {
  const duration = await page.evaluate(() => window.DURATION);
  const total = Math.round(duration * fps);
  for (let i = 0; i < total; i++) {
    await page.evaluate((t) => window.render(t), i / fps);
    await page.screenshot({ path: path.join(framesDir, `${String(i).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
  }
  console.log(`${total} frames`);
}
await browser.close();
