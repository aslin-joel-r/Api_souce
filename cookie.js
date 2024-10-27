const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to Flipkart
    await page.goto('https://www.github.com');

    // Get cookies for the page
    const cookies = await page.cookies();

    // Filter cookies related to Flipkart (or any specific cookie name)
    const flipkartCookies = cookies.filter(cookie => cookie.domain.includes('flipkart'));

    // Save cookies to a JSON file
    fs.writeFileSync('flipkartCookies.json', JSON.stringify(flipkartCookies, null, 2));
    console.log('Cookies saved to flipkartCookies.json');

    // Close the browser
    await browser.close();
})();
