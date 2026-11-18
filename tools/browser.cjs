// Tests use an isolated, disposable profile, never the user's browser session.
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
exports.launchBrowser = () => chromium.launch({headless: true,
  ...(process.env.BROWSER_EXECUTABLE ? {executablePath: process.env.BROWSER_EXECUTABLE} : {}),
});
