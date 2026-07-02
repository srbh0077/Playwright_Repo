import {expect, test} from '@playwright/test'

// priority - label > value > index
test('Single select Dropdown', async({page}) => {
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

    const allOptions = await page.locator(`#select-multiple-native option`) // returns an element locator

    console.log(`Previous: Found ${await allOptions.count()} options for Multi-select dropdown`); // as count() is immediate method
    await expect(allOptions).toHaveCount(20)    // toHaveCount() can be only used with Locator object not Array[]
    console.log(`Later: Found ${await allOptions.count()} options for Multi-select dropdown`);
                                //OR//
    const options = await page.$$('#select-multiple-native option')  // as $$ is async method return [] of elements
    console.log(`Found ${options.length} options for Multi-select dropdown`);
    await expect(options).toHaveLength(20)    // toHaveLength() can be only used with Array[] not Locator object
    await expect(options.length).toBe(20)

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