import {expect, test} from '@playwright/test'

test('New Tab', async({browser}) => {
    let context = await browser.newContext()

    let page1 = await context.newPage()
    await page1.goto('https://www.flipkart.com/')

    let page2 = await context.newPage()
    await page2.goto('https://www.amazon.in/')

    let page = await context.newPage()
    await page.goto('https://www.redbus.in/')
    await page.locator('//a[text()="Contact us"]').click()
    // let links = await page.locator('//a[@class="linkButton"]').all()
    // console.log(links)
    // for(let link of links) {
    //     let text = await link.textContent()
    //     if(text.includes('Agent registration')) {
    //         await page.click(link)
    //     }
        
    // }
})

test.only('Handle Multiple Tabs', async({browser}) => {
    let context = await browser.newContext()
    let page = await context.newPage()

    await page.goto('https://www.redbus.in/')

    let [newTab] = await Promise.all([
                            page.waitForEvent('popup'), 
                            page.locator('//a[text()="Contact us"]').click()
                        ])
    // await newTab.waitForTimeout(1500)
    await newTab.waitForLoadState('load')
    console.log(await newTab.url())

    await expect(page.url()).not.toBe(newTab.url())

    await newTab.click('#account_dd')
    await newTab.waitForTimeout(1500)
    
    // can perform action on parent tab even focused on newTab
    // another way to switch to new tab without Promise.all()
    const page1Promise = context.waitForEvent('page');
    await page.getByRole('link', {name: 'Help'}).click( {button: 'left', clickCount: 1, delay: 1000} );
    const helpTab = await page1Promise;

    await helpTab.waitForLoadState('networkidle')

    let helpFrame = helpTab.locator(`//iframe[contains(@src, 'www.redbus.in/help')]`).contentFrame()
    await helpFrame.getByRole('button', {name: 'Login to your account'} ).click()

    // Bring the Main Tab back to the Front (Visual Focus)
    await page.bringToFront()
})

test('Multiple Windows handle', async({browser}) => {
    let context = await browser.newContext()
    let page = await context.newPage()

    await page.goto('https://demoapps.qspiders.com/ui/browser/multipleWindow?sublist=2')

    let [windows] = await Promise.all([
                            page.waitForEvent('popup'),
                            page.click('//button[text() = "Shop Now"]')
                        ])
    
    let windowUrl = await windows.url()                   
    console.log(windowUrl)

    await expect(await windowUrl).not.toBe(await page.url())

    let cartCount = await windows.locator(`//section[@class = 'relative']/article`).textContent();
    console.log("Before Click:", cartCount);
    
    await windows.click(`//button[text() = 'Add to Cart']`)

    cartCount = await windows.locator(`//section[@class = 'relative']/article`).textContent();
    console.log("After Click:", cartCount);
})