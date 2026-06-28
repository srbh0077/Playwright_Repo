import {test} from '@playwright/test'

// Notification popups are Browser level feature so always use Browser fixture
// Playwright by default DENY any notification popup
test('Notifications denied by default', async({browser}) => {
    let context = await browser.newContext()
    //let context = await browser.newContext({ permissions:[] })    same as above
    let page = await context.newPage()

    await page.goto('https://demoapps.qspiders.com/ui/browserNot?sublist=0')
    await page.getByRole('button', {name: 'Notification'}).click()

    // till above Launch URl and perform action on pages is executing in Node js
    // evaluate() returns promise is used to get the permission status of the browser
    // for this need to pass the control to javascript executor
    let result = await page.evaluate(() => { return Notification.requestPermission() })
    console.log(`permission: ${result}`);   // by default : denied 
})


// as these permission are restricted to the pages created with that context
// the test-level configuration completely overrides the project-level configuration[config.js] for this specific test
test.only('Notification popup handling', async({browser}) => {
    let context = await browser.newContext({ permissions:['notifications', 'camera', 'microphone', 'geolocation'] })
    let page = await context.newPage()

    await page.goto('https://demoapps.qspiders.com/ui/browserNot?sublist=0')
    await page.getByRole('button', {name: 'Notification'}).click()

    // till above Launch URl and perform action on pages is executing in Node js
    // evaluate() returns promise is used to get the permission status of the browser
    // for this need to pass the control to javascript exeecutor
    let result = await page.evaluate(() => { return Notification.requestPermission() })
    console.log(`permission: ${result}`);   // granted

    // to revoke all the given permissions
    await context.clearPermissions()
    result = await page.evaluate(() => { return Notification.requestPermission() })
    console.log(`permission: ${result}`);   // denied
})

/**
 * A string can also be passed in instead of a function:
 * console.log(await page.evaluate('1 + 2')); // prints "3"
 * const x = 10;
 * console.log(await page.evaluate(`1 + ${x}`)); // prints "11"
 */