const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Navigate to templates page
  await page.goto('https://24slides.com/templates/featured');

  // 2. Click on Login (adjust selector if needed)
  await page.click('text=Login');

  // 3. Fill in login credentials
  await page.fill('input[name="email"]', 'your_test_email@example.com');
  await page.fill('input[name="password"]', 'your_test_password');
  await page.click('button[type="submit"]');

  // 4. Wait for successful login (adjust selector to a post-login element)
  await page.waitForSelector('text=My Templates'); // Update if needed

  // 5. Click to download a template
  await page.click('text=Download'); // You may need to refine this selector

  // Optional: wait to confirm download
  await page.waitForTimeout(2000);

  console.log('Test completed: Login and download');

  await browser.close();
})();
