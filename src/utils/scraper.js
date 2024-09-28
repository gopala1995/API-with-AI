const puppeteer = require('puppeteer');
const aiHelper = require('./aiHelper');

async function scrapeReviews(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle0' });

    // Use AI to dynamically identify review CSS selectors
    const { reviewTitleSelector, reviewBodySelector, reviewRatingSelector, reviewerNameSelector, paginationSelector } = await aiHelper.getReviewSelectors(url);

    let reviews = [];
    let reviewsCount = 0;
    let nextPageExists = true;

    while (nextPageExists) {
        // Extract reviews on the current page
        const currentReviews = await page.evaluate((reviewTitleSelector, reviewBodySelector, reviewRatingSelector, reviewerNameSelector) => {
            const reviewElements = document.querySelectorAll(reviewTitleSelector);
            return Array.from(reviewElements).map((_, index) => ({
                title: document.querySelectorAll(reviewTitleSelector)[index].innerText,
                body: document.querySelectorAll(reviewBodySelector)[index].innerText,
                rating: document.querySelectorAll(reviewRatingSelector)[index].innerText,
                reviewer: document.querySelectorAll(reviewerNameSelector)[index].innerText
            }));
        }, reviewTitleSelector, reviewBodySelector, reviewRatingSelector, reviewerNameSelector);

        reviews = reviews.concat(currentReviews);
        reviewsCount += currentReviews.length;

        // Check if there's a next page button and click it
        const nextPageButton = await page.$(paginationSelector);
        if (nextPageButton) {
            await nextPageButton.click();
            await page.waitForTimeout(1000);  // Give the page time to load
        } else {
            nextPageExists = false;
        }
    }

    await browser.close();

    return {
        reviews_count: reviewsCount,
        reviews
    };
}

module.exports = { scrapeReviews };
