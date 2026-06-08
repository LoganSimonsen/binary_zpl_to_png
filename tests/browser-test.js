const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const indexPath = path.join(__dirname, '..', 'index.html');
  await page.route('https://api.labelary.com/v1/printers/*', async (route) => {
    const pngBase64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(pngBase64, 'base64');
    await route.fulfill({
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
      body: buffer,
    });
  });

  await page.goto(`file://${indexPath}`);
  await page.setInputFiles('#zplFile', path.join(__dirname, 'fixtures', 'test.zpl'));
  await page.click('button[type="submit"]');
  await page.waitForSelector('#image', { timeout: 5000 });

  const transformBefore = await page.$eval('#image', (img) => img.style.transform);
  if (transformBefore !== '') {
    throw new Error(`Expected no rotation before clicking rotate, got ${transformBefore}`);
  }

  await page.click('#rotate-button');
  const transformAfter = await page.$eval('#image', (img) => img.style.transform);
  if (!transformAfter.includes('rotate(90deg)')) {
    throw new Error(`Expected rotation to be 90deg, got ${transformAfter}`);
  }

  await browser.close();
  console.log('Browser smoke test passed');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
