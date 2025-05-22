const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/topcv/jobs', async (req, res) => {
  const keyword = req.query.q || 'java';
  const cityId = req.query.city_id || '1'; // Hà Nội

  try {
    const response = await axios.get('https://www.topcv.vn/viec-lam/api/job-search', {
      params: {
        q: keyword,
        city_ids: cityId,
        page: 1,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://www.topcv.vn',
        'Origin': 'https://www.topcv.vn',
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
