const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err));

  let timestamps = [];
  let url = "https://news.ycombinator.com/newest";

  while (timestamps.length < 100) {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Delay to avoid rate-limiting

    const pageTimestamps = await page.$$eval(".subtext > span.age", spans =>
      spans.map(span => span.title)
    );
    if (pageTimestamps.length === 0) {
      console.error("No timestamps found on page, stopping.");
      break;
    }

    const dates = pageTimestamps.map(ts => new Date(ts));
    timestamps.push(...dates);

    const moreLink = await page.$("a.morelink");
    if (!moreLink) {
      console.error("No 'more' link found, stopping navigation.");
      break;
    }
    url = await moreLink.evaluate(el => el.href);
  }

  timestamps = timestamps.slice(0, 100);

  const sorted = [...timestamps].sort((a, b) => b - a);
  const isSorted = timestamps.every((val, i) => val.getTime() === sorted[i].getTime());

  if (isSorted) {
    console.log("✅ The first 100 articles are sorted from newest to oldest.");
  } else {
    console.error("❌ The articles are NOT sorted correctly.");
  }

  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();