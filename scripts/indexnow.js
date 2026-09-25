// Submits every URL from the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver) in one
// request — run once after a deploy that changed many pages: `npm run indexnow`.
// Needs the same INDEXNOW_KEY as the deployed server (which serves /<key>.txt to prove
// ownership). Google isn't part of IndexNow: resubmit the sitemap in Search Console instead.
require('dotenv').config();

const SITE_URL = 'https://www.frigidere-reparatii.ro';
const key = (process.env.INDEXNOW_KEY || '').trim();

(async () => {
  if (!key) { console.error('INDEXNOW_KEY is not set (.env)'); process.exit(1); }

  const keyRes = await fetch(`${SITE_URL}/${key}.txt`);
  if (!keyRes.ok || (await keyRes.text()).trim() !== key) {
    console.error(`${SITE_URL}/${key}.txt doesn't return the key — set INDEXNOW_KEY on the deployed server first`);
    process.exit(1);
  }

  const xml = await (await fetch(`${SITE_URL}/sitemap.xml`)).text();
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  if (!urlList.length) { console.error('No URLs found in the sitemap'); process.exit(1); }

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITE_URL).host, key, keyLocation: `${SITE_URL}/${key}.txt`, urlList }),
  });
  console.log(`IndexNow: ${res.status} ${res.statusText} — ${urlList.length} URLs submitted`);
  if (res.status >= 300) process.exit(1);
})();
