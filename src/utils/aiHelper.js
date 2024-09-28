const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getReviewSelectors(url) {
    const prompt = `You are tasked with extracting reviews from a web page. Given a URL like ${url}, identify the CSS selectors for:
    1. Review Title
    2. Review Body
    3. Review Rating
    4. Reviewer Name
    5. Pagination Button`;

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 100,
    });

    
    const selectors = JSON.parse(response.data.choices[0].text);
    
    return {
        reviewTitleSelector: selectors.reviewTitle,
        reviewBodySelector: selectors.reviewBody,
        reviewRatingSelector: selectors.reviewRating,
        reviewerNameSelector: selectors.reviewerName,
        paginationSelector: selectors.pagination
    };
}

module.exports = { getReviewSelectors };
