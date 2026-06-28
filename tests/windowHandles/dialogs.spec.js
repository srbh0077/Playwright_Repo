import {expect, test} from '@playwright/test'
import { log } from 'console'

/**
 * alert('Amit'), confirm('Hi Amit'), prompt('Amit, Please enter text') in console of dev tool
 */

test('Auto Dismissed Dialogues[Default by Playwright]', async({context}) => {
    let page = await context.newPage()

    await page.goto('https://testautomationpractice.blogspot.com/')

    await page.getByRole('button', {name: 'Simple Alert'}).click()
    await page.waitForTimeout(1500)

    await page.getByRole('button', {name: 'Confirmation Alert'}).click()
    await expect(await page.locator('#demo')).toContainText('Cancel')
    console.log('Text present in Confirmation:', await page.locator('#demo').textContent());
    await page.waitForTimeout(1500)

    await page.getByRole('button', {name: 'Prompt Alert'}).click()
    await expect(await page.locator('#demo')).toContainText(/CanceLLed/i)   // new thing learned
    console.log('Text present in Prompt:', await page.locator('#demo').textContent());
    await page.waitForTimeout(1500)
})

/**
 * as Dialogs are auto-dismissed by Playwright, but we can register a dialog handler 
 * before the action that triggers the dialog to either dialog.accept()/dismiss()
 * 
 * Playwright provides an dialog event that is happening at page object
 * listened/captured via Event Listener (page.on()/once())
 * now utilize accept(),dismiss(), message()
 * 
 * it can handle any dialog present in the test when it is called one time
 */

test.only('Dialogs handling via PAGE.ON()', async({context, page}) => {
    let name = 'Harry Potter'

    await page.goto('https://testautomationpractice.blogspot.com/')

    // on(event, listerner callback ()) Dialog handler should written before the action happens
    page.on('dialog', async(dialog) => {

        if(dialog.type() == 'alert' || dialog.type() == 'confirm') {
            const message = dialog.message();
            console.log('Alert message:', message);
            // Use a regex with the | (OR) pipe operator
            await expect(message).toMatch(/alert box!|Press a button!/i)
                    //OR//
            // const isValid = message.includes('alert box!') || message.includes('Press a button!');
            // expect(isValid).toBe(true);

            await dialog.accept()
        }
        else if(dialog.type() == 'prompt') {
            if(dialog.defaultValue() == name) {
                console.log('Default value in Prompt popup:', await dialog.defaultValue());
                await dialog.accept(dialog.defaultValue())
            }
            else {
                await dialog.accept(name)
            }
        } 
    })
    //actions
    await page.getByRole('button', {name: 'Simple Alert'}).click()  

    await page.getByRole('button', {name: 'Confirmation Alert'}).click()
    console.log('Text present in Confirmation:', await page.locator('#demo').textContent());
    await expect(await page.locator('#demo')).toContainText('OK')
    // toContainText() Ensures the Locator points to an element that contains the given text.

    await page.getByRole('button', {name: 'Prompt Alert'}).click()
    console.log('Text present in Prompt:', await page.locator('#demo').textContent());
    await expect( page.locator('#demo')).toHaveText(`Hello ${name}! How are you today?`)
    // toBe() Compares value with expected by calling Object (similer strict equality operator ===)
})



// once()- If only 1-2 dialogs in the whole scenario then need to write separate dialog handler for each dialogs to handle
test('Dialogs handling via PAGE.ONCE()', async({context}) => {
    let name = 'Harry'

    let page = await context.newPage()

    await page.goto('https://testautomationpractice.blogspot.com/')

    await page.getByRole('button', {name: 'Simple Alert'}).click()  

    await page.getByRole('button', {name: 'Confirmation Alert'}).click()
    console.log('Text present in Confirmation:', await page.locator('#demo').textContent());
    await expect(await page.locator('#demo')).toContainText(/Cancel/i)
    // toContainText() Ensures the Locator points to an element that contains the given text.

    page.once('dialog', async(dialog) => { dialog.accept(name) })
    await page.getByRole('button', {name: 'Prompt Alert'}).click()
    console.log('Text present in Prompt:', await page.locator('#demo').textContent());
    await expect(await page.locator('#demo')).toHaveText(`Hello ${name}! How are you today?`)

    await page.reload()

    await page.getByRole('button', {name: 'Prompt Alert'}).click()
    console.log('Text present in Prompt after reload:', await page.locator('#demo').textContent());
    await expect(await page.locator('#demo')).toContainText(/CanceLLed/i)   // new thing learned
})