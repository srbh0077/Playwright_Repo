import {test, expect} from '@playwright/test'

// This suite demonstrates handling authentication popups in Playwright.
// Some applications open a login dialog or require HTTP basic auth in a new page/tab.
// In such cases, create a browser context with httpCredentials so Playwright can
// automatically respond to the auth challenge, or verify the default behavior when
// credentials are not provided.

test.describe('Authentication popup handling', () => {
  const appUrl = 'https://demoapps.qspiders.com/ui/auth?sublist=0';

  test('default Playwright behavior without httpCredentials', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(appUrl);

    const [newPage] = await Promise.all([
                                context.waitForEvent('page'),
                                page.click('#AuthLink')
                            ]);

    await newPage.waitForLoadState('domcontentloaded');

    // Playwright does not automatically supply HTTP basic auth credentials by default.
    // If the site opens an auth popup in a new tab, the page should still hit the auth challenge.
    await expect(newPage.url()).toContain('auth');
    
    await newPage.waitForTimeout(1500)
  });


  
  test.only('handles authentication popup with httpCredentials', async ({ browser }) => {
    const authContext = await browser.newContext({ httpCredentials: {username: 'admin', password: 'admin'} });
    
    const page = await authContext.newPage();
    await page.goto(appUrl);

    const [newPage] = await Promise.all([
                                authContext.waitForEvent('page'),
                                page.click('#AuthLink')
                            ]);

    await newPage.waitForLoadState('domcontentloaded');

    await expect(await newPage.url()).toBe('https://basic-auth-git-main-shashis-projects-4fa03ca5.vercel.app/');
    await expect(await newPage.locator('//h1[text() = "Basic Auth"]').textContent()).toBe("Basic Auth");

    await authContext.close();
  });
});