import {expect, test} from '@playwright/test'

// priority - label > value > index
test.only('Single select Dropdown', async({page}) => {
    await page.goto('https://demoapps.qspiders.com/ui/dropdown?sublist=0')

    await page.locator('#select3').selectOption({label: 'India'})    // select via value
    await page.waitForTimeout(1500)
    await page.locator('#select3').selectOption({value: 'Poland'})  // select via visible text
    await page.waitForTimeout(1500)
    await page.locator('#select3').selectOption({index: 1})         // select via index
    await page.waitForTimeout(1500)
    await page.locator('#select3').selectOption('India')    // validate with value and visible text both should be passed
    await page.waitForTimeout(1500)
    let allOptions = await page.locator('#select3').textContent()
    console.log('All Countries available:\n', allOptions);

    await expect(allOptions.includes('United Kingdom')).toBeTruthy()

    let dropdown = await page.$('#select3')
    let options = await dropdown.$$('option')

    console.log('\nlist of options:');
    for(let option of options) {
        console.log(await option.textContent());
        await dropdown.selectOption(option)
    }

    let countryStatus = false
    for(let option of options) {
        let value = await option.textContent()

        if(value.includes('United Arab Emirates')) {
            console.log(value);
            await dropdown.selectOption(option)
            countryStatus = true
            break
        }
    }
    await expect(countryStatus).toBeTruthy()
})


test('Multi select Dropdown', async({page}) => {
    await page.goto('https://demoapps.qspiders.com/ui/dropdown/multiSelect?sublist=1')

    // select via [{value1}, {value2}...]
    await page.locator('#select-multiple-native').selectOption([{value: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops'}, {value: 'Mens Casual Slim Fit'}])
    await page.getByText('Add').click()
    await page.waitForTimeout(1500)

    //await expect()
    // select via [{label1}, {label2}...] visible text
    await page.locator('#select-multiple-native').selectOption([{label: 'Fjallraven - Foldsac...'}, {label: 'Mens Casual Premium ...'}])
    await page.getByText('Add').click()
    await page.waitForTimeout(1500)

    // select via [{index1}, {index2}...]
    await page.locator('#select-multiple-native').selectOption([{index: 12, index: 20}])
    await page.getByText('Add').click()
    await page.waitForTimeout(1500)

    /** also possible
     * await page.locator('#select-multiple-native').selectOption([
     *          { index: 12 }, { value: 'India' }, { label: 'USA' }]);
     * 
     * wait page.locator('#select-multiple-native').selectOption(['USA',  'India', 'UAE']);  value attributes
     */
})


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


test('Dynamic/Auto-suggestion Dropwown', async({page}) => {
    await page.goto('https://www.amazon.in/')

    await page.locator('#twotabsearchtextbox').fill('tshirt')
    await page.waitForTimeout(1500)

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
    await page.waitForTimeout(3000)

    // Approch 2 vis keyboard action
    await page.locator('#twotabsearchtextbox').fill('tshirt')

    await page.waitForSelector(`(//div[@class = 's-suggestion-container'])[1]`)   //1st element
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(1500)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(1500)
})