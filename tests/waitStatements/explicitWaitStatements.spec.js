import {test} from '@playwright/test'


/**
 * waitFor()
 *   - pauses execution until a specific condition is met or a timeout is reached
 *   - Useful when elements are dynamically loaded, hidden, removed, or rendered
 *   - Throws TimeoutError if the desired state is not reached within the timeout
 *   - Returns Promise<void>
 *
 *   Syntax:
 *       await locator.waitFor({
 *           state: 'visible',
 *           timeout: 5000
 *       });
 *
 *   States:
 *       - 'attached'  : Element is present in the DOM
 *       - 'detached'  : Element is removed from the DOM
 *       - 'visible'   : Element is visible to the user (default)
 *       - 'hidden'    : Element is hidden or removed from the DOM
 *       - 'timeout'
 *          - Maximum waiting time in milliseconds
 *          - Default: Uses Playwright's default timeout (30 seconds)
 *          - Throws TimeoutError if condition is not met
 * 
 * waitFor() --> 30000 millisec Default state is visible
 * waitFor({timeout: 2000})
*/

/**
 * Explicit Waits
 *   1. Element based wait
 *          text(), timeout(), selector(), element state()
 *   2. Page wait
 *          navigation(), loadState(), event()
 *   3. Custom wait
 */

test('Auto Suggestions Explicit', async({page}) => {
    await page.goto('https://www.amazon.in/')

    await page.locator('input#twotabsearchtextbox').fill('shoes')
    await page.locator("//div[@role = 'row']", {hasText: ' for woman'}).waitFor({timeout: 3000, state: 'visible'})
    const allSuggestions = await page.getByRole('row').allTextContents()
    console.log(allSuggestions);
})


test('Auto Suggestions Wait for Selector', async({page}) => {
    await page.goto('https://www.amazon.in/')

    await page.waitForSelector('input#twotabsearchtextbox', {state: 'visible'})
    await page.locator('input#twotabsearchtextbox').fill('shoes')
    await page.locator("//div[@role = 'row']", {hasText: ' for woman'}).waitFor({state: 'visible'})
    const allSuggestions = await page.getByRole('row').allTextContents()
    console.log(allSuggestions);
})

// [ DEPRECATED ] This is essential when your test depends on a new page or URL being loaded, such as after clicking a link or submitting a form
// in same tab navigation from one page to another 
test('Auto Suggestions Wait for Navigation', async({page}) => {
    await page.goto('https://www.amazon.in/')

    // it should listen which action is triggering it till which another action so this should go parallely
    // avoid await keyword here as It pause the execution
    await Promise.all([
        page.waitForNavigation({waitUntil: 'load'}),
        // page.waitForURL({waitUntil: 'load'}),   // not required rely on Web-first Assertion -> The assertion will automatically retry until the navigation completes and the element appears
        // page.waitForLoadState({waitUntil: 'networkidle'}) // or go for loadState only
        page.click('#nav-cart')
    ])
})

// Optional
test('Wait for Load State', async({page}) => {
    await page.goto('https://www.amazon.in/')

    await page.click('#nav-cart')
    await page.waitForLoadState('load', {timeout: 2000})
    // await page.waitForLoadState('domcontentloaded', {timeout: 2000})
})

// Promise.all is mandatory as it needs to listens the action triggering event and till the event shows up
test.only('Wait for Event', async({page}) => {
    await page.goto('https://demoapps.qspiders.com/ui/download?sublist=0')

    await page.fill('#writeArea', 'I will downloading this file')
    await page.fill('#fileName', 'Myself.txt')

    let [downloadFile] = await Promise.all([ 
                                    page.waitForEvent('download'), 
                                    page.click('#downloadButton') 
                                ])
    console.log(await downloadFile.path());
})

test('Wait for Function Auto-suggestion', async({page}) => {
    await page.goto('https://www.amazon.in/')

    await page.locator('input#twotabsearchtextbox').fill('HP laptops')
    await page.waitForFunction(() => {
                    let allElements = document.querySelectorAll('div[role="row"]')
                    return allElements.length > 2;
                })
    const allSuggestions = await page.getByRole('row').allTextContents()
    console.log(allSuggestions);
})


test('Wait for Function', async({page}) => {
    await page.goto('https://www.amazon.in/')

    await page.waitForFunction(() => { return document.readyState === 'complete' }) //
    await page.locator('input#twotabsearchtextbox').fill('HP laptops')
    await page.waitForFunction(() => {
        let allElements = document.querySelectorAll('div[role="row"]')
        return allElements.length > 2;
    })
    const allSuggestions = await page.getByRole('row').allTextContents()
    console.log(allSuggestions);
})