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
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('.job-list .job-item');

    const jobs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.job-list .job-item')).map(el => ({
        title: el.querySelector('.job-title a')?.innerText || '',
        company: el.querySelector('.company-name a')?.innerText || '',
        location: el.querySelector('.address')?.innerText || '',
        url: el.querySelector('.job-title a')?.href || ''
      }));
    });

    await browser.close();
    res.json({ jobs });
  } catch (err) {
    console.error('❌ Crawl error:', err.message);
    res.status(500).json({ error: 'Failed to crawl jobs' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
