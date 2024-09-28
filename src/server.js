const express = require('express');
const scraper = require('./utils/scraper');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/reviews', async (req, res) => {
    const url = req.query.page;
    if (!url) {
        return res.status(400).json({ error: "URL parameter 'page' is required" });
    }

    try {
        const reviewsData = await scraper.scrapeReviews(url);
        res.status(200).json(reviewsData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
