import {expect, test} from '@playwright/test'

test('Radio btn', async({page}) => {
    await page.goto('https://demoapps.qspiders.com/ui/radio?sublist=0')

    await page.locator('#attended_a').check()
    await page.waitForTimeout(1500)

    await expect(await page.locator('#attended_a')).toBeChecked() // ASSERTION void return
    await expect(await page.locator('#attended_a').isChecked()).toBeTruthy()    // +ve ASSERTION void return
    console.log(await page.locator('#attended_a').isChecked)    // to print only boolean return

    // for not checked condition
    await page.locator('#attended_b')
    await expect(await page.locator('#attended_b').isChecked()).toBeFalsy() // +ve ASSERTION void
    await expect(await page.locator('#attended_b').isChecked()).toBeTruthy() // -ve ASSERTION void should FAIL here
})

// check() and uncheck() always works with checkbox and radio buttons
test.only('Checkbox', async({page}) => {
    await page.goto('https://demoapps.qspiders.com/ui/checkbox?sublist=0')

    await page.locator('#domain_c').check()
    await page.waitForTimeout(1500)
    // await expect(await page.locator('#domain_c').toBeChecked())

    await page.locator('#domain_c').uncheck()
    await page.waitForTimeout(1500)
    await expect(await page.locator('#domain_c').isChecked()).toBeFalsy()   // +ve ASSERTION
    await expect(await page.locator('#domain_c').isChecked()).toBeTruthy()   // -ve ASSERTION Fail here
})