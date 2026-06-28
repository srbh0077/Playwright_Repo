import {test} from '@playwright/test'

/**
 * actionTimeout() works for below actions
 * await page.click();
 * await page.fill();
 * await page.check();
 * await page.selectOption();
 */
// Global timeout for all test functions in one js file OR put in config file for all tests file
// test.use({actionTimeout : 5000})

// Playwright Dev Doc search Auto Wait
test('Auto-Wait statement: Default Timeout', async({page}) => {
    await page.goto('https://demoapps.qspiders.com/ui/radio?sublist=0')

    await page.locator('#attended_').click()    // wrong locator instead of attended_e
    // TimeoutError: locator.click: Timeout 30000ms exceeded.
})

/** 
 * Method timeout parameter(click timeout) (5 sec) > actionTimeout (10 sec) > defaultTimeout (30 sec)
 */
test.only('Auto-Wait statement: Specified Timeout', async({page}) => {
    //page.setDefaultTimeout(3000)

    await page.goto('https://demoapps.qspiders.com/ui/checkbox?sublist=0')
    await page.click("#domain_c", {delay : 800, clickCount : 2});   // double click


    await page.goto('https://demoapps.qspiders.com/ui/formValidation?sublist=0')
    //await page.locator('#mobileqwwq').fill('34323242343')
    // TimeoutError: locator.click: Timeout 3000ms exceeded.

    await page.locator('#alert_1').click({clickCount : 2, timeout : 1000})
    // TimeoutError: locator.click: Timeout 1000ms exceeded.
})