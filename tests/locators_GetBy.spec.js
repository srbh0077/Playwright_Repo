import { test, expect } from '@playwright/test'

test('login with locators', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('https://practicetestautomation.com/practice-test-login/')

    await page.locator('input#username').fill('student');
    await page.locator('input#password').fill('Password123');

    await page.locator('button#submit').click();

    await test.expect(page).toHaveURL('https://practicetestautomation.com/logged-in-successfully/');

    // await page.getByText('Log out').click();
    await page.getByText('Log out', {exact: true}).click();     // must be exact match

    const page2 = await context.newPage()
    await page2.goto('https://demo.nopcommerce.com/login')

    await page2.getByPlaceholder('Enter your email here', {exact: false}).fill('xyz@zyx.com');

    //await page2.getByText('Electronics').click();
    //await page2.getByRole('link', {name:'Apparel'}).click();
});

test('getBy() examples with variations, return types and DOM hints', async ({ page }) => {
    // Navigate to a simple login page for examples
    await page.goto('https://practicetestautomation.com/practice-test-login/');

    // getByPlaceholder - returns: Locator
    // DOM example: <input placeholder="Username" id="username" />
    const usernameByPlaceholder = page.getByPlaceholder('Username'); // Locator
    await expect(usernameByPlaceholder).toBeVisible();
    await usernameByPlaceholder.fill('student');

    // getByLabel - returns: Locator
    // DOM example: <label for="password">Password</label><input id="password" />
    const passwordByLabel = page.getByLabel('Password'); // Locator
    await expect(passwordByLabel).toBeVisible();
    await passwordByLabel.fill('Password123');

    // getByRole(role,options?) - returns: Locator
    // Allows locating elements by their ARIA role, ARIA attributes and accessible name.
    const submitByRole = page.getByRole('button', { name: '/submit/i' }); // Locator
    await expect(submitByRole).toBeEnabled();
    await submitByRole.click();

    await expect(page).toHaveURL(/logged-in-successfully/);

    // getByText - returns: Locator
    // DOM example: <a href="/logout">Log out</a>
    const logoutByText = page.getByText('Log out', { exact: true }); // Locator
    await expect(logoutByText).toBeVisible();
    await logoutByText.click();

    // Navigate to a demo e-commerce page for other getBy examples
    await page.goto('https://demo.nopcommerce.com/login');

    // getByPlaceholder - returns: Locator
    // DOM example: <input placeholder="Enter your email here" />
    const emailByPlaceholder = page.getByPlaceholder('Enter your email here'); // Locator
    await emailByPlaceholder.fill('xyz@zyx.com');
    await expect(emailByPlaceholder).toHaveValue('xyz@zyx.com');

    // getByAltText - returns: Locator
    // DOM example: <img alt="Electronics" src="..." />
    const imgByAlt = page.getByAltText('Electronics'); // Locator
    if (await imgByAlt.count() > 0) await expect(imgByAlt.first()).toBeVisible();

    // getByTitle - returns: Locator
    // DOM example: <a title="Electronics">Electronics</a>
    const linkByTitle = page.getByTitle('Electronics'); // Locator
    if (await linkByTitle.count() > 0) await linkByTitle.click();

    // getByTestId - returns: Locator
    // DOM example: <div data-testid="custom-id">...</div>
    const byTestId = page.getByTestId('custom-id'); // Locator
    // safe assertion: ensure method returns a Locator (count may be 0)
    await expect(byTestId).toHaveCount(await byTestId.count());

    // getByDisplayValue - returns: Locator
    // DOM example: <input value="prefilled" />
    const byDisplayValue = page.getByDisplayValue('xyz@zyx.com'); // Locator (matches value)
    if (await byDisplayValue.count() > 0) await expect(byDisplayValue).toHaveValue('xyz@zyx.com');
});

