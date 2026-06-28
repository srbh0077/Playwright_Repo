import {test, expect} from '@playwright/test'
import data from "../../testData/validInvalidData.json"

test('Valid Invalid objects Array', async({page}) => {
    for(let key in data) {
        console.log(key);
        
        for(let d of data[key]) {
            let url = d.url
            let usn = d.username
            let pwd = d.password

            await page.goto(url)
            await page.locator('input#username').fill(usn)
            await page.locator('input#password').fill(pwd)

            await page.getByRole('button', {name: 'Submit'}).click()

            let title = await page.title()
        
            if(title.includes('Logged In Successfully | Practice Test Automation'))
                console.log(title);
            else
                console.log('Your username is invalid!');
        }
    }
})



// 1. Loop through your JSON keys globally (e.g., 'validData', 'invalidData')
for (const key in data) {
    
    // 2. Loop through each specific object array under that key
    for (const [index, d] of data[key].entries()) {
        
        // 3. Dynamically generate isolated tests for every single item
        test.skip(`DDT Matrix - [${key}] Iteration ${index + 1} for ${d.username}`, async ({ page }) => {
            const url = d.url;
            const usn = d.username;
            const pwd = d.password;

            await page.goto(url);
            await page.locator('input#username').fill(usn);
            await page.locator('input#password').fill(pwd);

            await page.getByRole('button', { name: 'Submit' }).click();

            // 4. Corrected conditional statement based on the active JSON group key
            if (key === 'valid') {
                await expect(page).toHaveTitle(/Logged In Successfully/i);
            } else {
                // For invalid runs, target the error alert element on the page
                const errorMessage = page.locator('div#error'); // Or page.getWorksheet / page.getByText('invalid!')
                await expect(errorMessage).toBeVisible();
                await expect(errorMessage).toContainText(/invalid/i);
            }
        });
    }
}