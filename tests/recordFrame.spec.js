import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.redbus.in/');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Help' }).click();
  const page1 = await page1Promise;
  await page1.locator('iframe').contentFrame().getByRole('button', { name: 'Login to your account' }).click();
  await page1.locator('iframe').contentFrame().getByRole('textbox').click();
  await page1.locator('iframe').contentFrame().getByRole('textbox').fill('7004748392');
  await page1.locator('iframe').contentFrame().locator('iframe[name="a-clp8v81r22cu"]').contentFrame().getByRole('checkbox', { name: 'I\'m not a robot' }).click();
  await page1.locator('iframe').contentFrame().getByRole('button', { name: 'Generate OTP' }).click();
});

