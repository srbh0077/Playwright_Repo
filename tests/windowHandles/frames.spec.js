import {expect, test} from '@playwright/test'
import { log } from 'console'

test('Frames', async({browser}) => {
    let context = await browser.newContext()
    let page = await context.newPage()

    await page.goto('https://ui.vision/demo/iframes')

    // returns all frame objects[Main page(1) + other frames]
    let frames = await page.frames()
    
    console.log(frames.length);
    for(let frame of frames) {
        console.log(await frame.title());   // 1st title is of main page
    }
})

test.only('Multiple ways to handle frames', async({browser}) => {
    let context = await browser.newContext()
    let page = await context.newPage()

    await page.goto('https://ui.vision/demo/iframes')


// Get frame using the framelocator()
    let frameRadio = await page.frameLocator(`//iframe[contains(@src, 'embedded=true')]`).getByLabel('I am a human')
    await frameRadio.check()
    
    await expect(await frameRadio.isChecked()).toBeTruthy()
    console.log('I am a human radio button is checked: ', await frameRadio.isChecked());

// Get frame using frame's URL
    const frame = await page.frame({ url: 'https://forum.ocr.space//embed/topics?discourse_embed_id=de-ulaykf8jy&allow_create=true&template=complete&per_page=3' });
    let frameBtn = await frame.locator('span.new-topic-btn__text')
    const [newTab] = await Promise.all([
                                context.waitForEvent('page'),
                                frameBtn.click()
                            ])

    await newTab.fill('#login-account-name', 'infinity')
    await newTab.keyboard.press('Tab')
    await newTab.fill('Password')

// Get frame using contentFrame() [ISSUE need to be addressed]
    // let frame2 = await page.locator('#de-ulaykf8jy').contentFrame()
    // const text = await frame2.locator("//a[@class = 'title raw-link raw-topic-link']").textContent()

    // console.log("text from frame:", text);
})

test.skip('Multiple nested frame at once', async({browser}) => {
    // 1. Interacting inside the deep 3-layer nested frame
    // frameLocator() is a synchronous method that returns a definition, not a promise.
    // No data is fetched from the browser here. Synchronous definition: Stores the path to the nested frame.
    const frame3 = page
                    .frameLocator('#frame1')
                    .frameLocator('#frame2')
                    .frameLocator('#frame3');
    
    // 2. Asynchronous execution: Playwright resolves the entire 3-layer chain 
    // and clicks the element. This requires network activity, so it must be awaited.                
    await frame3.locator('#inner-submit').click();

    // 2. Switch back completely to the main page
    // You don't need a "switch" command. Just use the top-level page object.
    await page.locator('#main-page-header').click(); 
})

test('Frames variations including new-tab from child frame', async({browser}) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto('https://ui.vision/demo/iframes')

    // Variation 1: use frameLocator to interact with an element inside a frame
    const radio = page.frameLocator("//iframe[contains(@src, 'embedded=true')]").getByLabel('I am a human')
    await radio.check().catch(() => {}) // ignore if not present in demo

    // Variation 2: get frame by URL (if available) and open new tab from it
    const frameById = await page.locator('#de-ulaykf8jy').contentFrame()
    if (frameById) {
        // try to click a button inside the frame that opens a new tab
        const frameBtn = frameById.locator('.new-topic-btn__text')
        if (await frameBtn.count() > 0) {
            const [newTab] = await Promise.all([
                                    context.waitForEvent('page'),
                                    frameBtn.first().click()
            ])
            await newTab.waitForLoadState()
            // fill login fields in the newly opened tab (selectors may vary)
            await newTab.fill('#login-account-name', 'user@example.com').catch(() => {})
            await newTab.fill('#login-account-password', 'P@ssw0rd').catch(() => {})
        }
    }

    // Variation 3: retrieve frames array and print titles (demonstration)
    const frames = await page.frames()
    for (const f of frames) {
        // safe call to avoid throwing on frames without titles
        await f.title().then(t => console.log('frame title:', t)).catch(() => {})
        /**
         * f.title() returns a Promise for the frame title.
            .then(t => console.log('frame title:', t)) registers a callback to log the title when the Promise fulfills.
            .catch(() => {}) registers an error handler that ignores any rejection.
            await waits for the whole promise chain to finish.
         */
    }

    await context.close()
})




