import {chromium, test} from '@playwright/test'

// test.use({viewport: {width: 1270, height: 550}})

test.only('browser Control 1', async({page}) => {
    let sizeBeforeSet = await page.viewportSize()

    await page.setViewportSize({width: 1000, height: 500})

    let sizeAfterSet = await page.viewportSize()
    console.log('Browser Size: before -> ', sizeBeforeSet, ' after -> ', sizeAfterSet);

    await page.goto('https://playwright.dev/docs/test-annotations')

    let title = await page.title()
    console.log('Title of the current page:', title);
    
    let url = await page.url()
    console.log('Current page URL:', url);
})

test('Data Stored', async({browser}) => {
    let context = await browser.newContext()
    let page = await context.newPage()
    console.log('any Cookies before page launch:', await context.cookies());

    await page.goto('https://google.co.in/')
    console.log('any Cookies after page launch:', await context.cookies());
})

// remove comment for other browsers from config
test('Chromium Instance', async() => {
    let browser = await chromium.launch()     // chromium/webkit/firefox imported from node module works like browser fixture
    let context = await browser.newContext()
    let page = await context.newPage()

    // await browser.close()
    await page.goto('https://www.google.co.in/')

    let page2 = await context.newPage()
    await page2.goto('https://www.google.co.in/')

    await page.screenshot({path: ''})
})  

test('Takes Screenshot', async({browser}) => {
    let context = await browser.newContext()
    // Variable Binding: page was assigned to the first tab (google)
    let page = await context.newPage()

    await page.goto('https://www.google.co.in/')
    await page.screenshot({path: 'screenshot/google.png'})

    let page2 = await context.newPage()
    await page2.goto('https://playwright.dev/docs/test-annotations')

    // take care with page(google) and page2(playwright) reference
    let currentTitle = (await page2.title()).replace('/[^a-z0-9]/gi', '_')
    let time = new Date().getTime()
    await page.screenshot({path: `screenshot/${currentTitle}_${time}.png`})
})