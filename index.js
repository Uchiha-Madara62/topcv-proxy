const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/topcv/jobs', async (req, res) => {
  const keyword = req.query.q || 'java';
  const city = req.query.city || 'ha-noi';
  const url = `https://www.topcv.vn/tim-viec-lam-${keyword}-tai-${city}-kl1?sba=1&locations=l1`;

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle2',
    });

    // Đợi thẻ chứa job render ra
    await page.waitForSelector('.job-list .job-item');

    const jobs = await page.evaluate(() => {
      const jobEls = document.querySelectorAll('.job-list .job-item');
      return Array.from(jobEls).map(el => {
        const title = el.querySelector('.job-title a')?.innerText || '';
        const company = el.querySelector('.company-name a')?.innerText || '';
        const location = el.querySelector('.address')?.innerText || '';
        const url = el.querySelector('.job-title a')?.href || '';
        return { title, company, location, url };
      });
    });

    await browser.close();
    res.json({ jobs });
  } catch (err) {
    console.error('❌ Crawl error:', err.message);
    res.status(500).json({ error: 'Failed to crawl jobs' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running at http://localhost:${PORT}`);
});
