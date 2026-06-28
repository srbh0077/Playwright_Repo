import {test} from '@playwright/test'

// just to pass within local testing
test('Hard coded Wait', async({page}) => {
    await page.goto('https://practicetestautomation.com/practice-test-login/')

    await page.waitForTimeout(2000)
    await page.getByText('Username', {exact:true}).fill('student');
    await page.waitForTimeout(2000)
    await page.getByText('Password', {exact:true}).fill('Password123');
    await page.waitForTimeout(2000)
    await page.getByRole('button', {id : '#submit'}).click();
    await page.waitForTimeout(2000)
})


test.only('Auto Suggestions', async({page}) => {
    await page.goto('https://www.amazon.in/')

    await page.locator('input#twotabsearchtextbox').fill('shoes')
    await page.waitForTimeout(1000) // sometimes it will fetch or not
    const allSuggestions = await page.getByRole('row').allTextContents()
    console.log(allSuggestions);
})