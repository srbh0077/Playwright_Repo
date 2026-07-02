import {test, expect} from '@playwright/test'

test('Custom Dropdown', async({page}) => {
    await page.goto('https://www.amazon.in/s?k=laptop&crid=3370QUUEUV9SR&sprefix=laptop%2Caps%2C276&ref=nb_sb_noss_2')

    await page.waitForTimeout(1500)
    await page.locator('#a-autoid-0-announce').click()

    // 1st approch
    await page.getByRole('presentation').first().waitFor()
    let options = await page.getByRole('presentation').all()  // as all() don't have auto wait

    for(let option of options) {
        let text = await option.textContent()

        if(text.includes('Arrivals')) {
            await option.click()
        }
    }
    await page.waitForTimeout(1500)

    // 2nd approch xpath
    // let text = 'Best Sellers'
    // await page.locator(`//a[@role="option" and text() = '${text}']`).click()
    // await page.waitForTimeout(1500)
})


test.only('Dynamic/Auto-suggestion Dropwown', async({page}) => {
    await page.goto('https://www.amazon.in/')

    await page.locator('#twotabsearchtextbox').fill('tshirt')

    await page.waitForSelector(`(//div[@class = 's-suggestion-container'])[1]`)   //1st element
    let options = await page.locator(`//div[@class = 's-suggestion-container']`).all()

    // Approach 1
    for(let option of options) {
        let text = await option.textContent()

        if(text.includes(' for men')) {
            await option.hover()
            await page.waitForTimeout(1000)
            await option.click()
            break;
        }
    }
    //await page.waitForTimeout(3000)

    // Approch 2 vis keyboard action
    await page.waitForLoadState('load')
    //await page.locator('#twotabsearchtextbox').waitFor( {state: 'visible'} )
    await page.locator('#twotabsearchtextbox').fill('tshirt')

    await page.waitForSelector(`(//div[@class = 's-suggestion-container'])[1]`)   //1st element
    await page.keyboard.press('ArrowDown')
    // await page.waitForTimeout(1500)
    await page.keyboard.press('Enter')
    // await page.waitForTimeout(1500)
})