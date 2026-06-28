import {test} from '@playwright/test'

/**
 * press()
 *   - Presses a key or key combination on the keyboard
 *   - Performs keydown → keypress/input (if applicable) → keyup
 *   - Useful for shortcuts and special keys
 *   - Returns Promise<void>
 *
 *   Example:
 *       await page.keyboard.press('Enter');
 *       await page.keyboard.press('Tab');
 *       await page.keyboard.press('Control+A');
 *       await page.keyboard.press('Shift+ArrowRight');
 * 
 * down()
 *   - Dispatches a keydown event
 *   - Keeps the key pressed until keyup() is called
 *   - Useful for keyboard shortcuts involving multiple keys
 *   - Returns Promise<void>
 *
 *   Example:
 *       await page.keyboard.down('Shift');
 *       await page.keyboard.press('ArrowRight');
 *       await page.keyboard.up('Shift');
 * 
 * up()
 *   - Dispatches a keyup event
 *   - Releases a key previously pressed with down()
 *   - Returns Promise<void>
 *
 *   Example:
 *       await page.keyboard.down('Control');
 *       await page.keyboard.press('S');
 *       await page.keyboard.up('Control');
 * 
 * insertText()
 *   - Inserts text directly into the focused element
 *   - Does NOT generate keydown, keypress, or keyup events
 *   - Ignores keyboard shortcuts and modifiers
 *   - Faster than type()
 *   - Useful for entering large text blocks
 *   - Returns Promise<void>
 *   - It also not removing previous text present as fill()
 *
 *   Example:
 *       await page.keyboard.insertText('Hello World');
 * 
 * type() [Deprecated]
 *   - Types text character by character
 *   - Simulates real user typing
 *   - Generates keyboard events for each character
 *   - Supports typing delay
 *   - Returns Promise<void>
 *
 *   Example:
 *       await page.keyboard.type('Hello World');
 *       await page.keyboard.type('Hello', { delay: 100 });
 * 
 * 
 * // only press() and type() works with both keyboard and locator()
 */

test('Keyboard Actions', async({page}) => {
    await page.goto('https://demoapps.qspiders.com/ui?scenario=1')

    // type() with locator
    await page.locator('#name').type('Amit')
    await page.locator('#name').clear
    await page.type('#name', 'Amit');
    await page.waitForTimeout(1500)


    // type() with keyboard property
    await page.locator('#name').clear
    await page.locator('#name').click()
    await page.keyboard.type('Amit')
    await page.waitForTimeout(1500)

    // insertText()
    await page.locator('#email').click()
    await page.keyboard.insertText('Amit')
    await page.waitForTimeout(1500)

    // down()  and up()
    await page.locator('#password').click()
    await page.keyboard.down('Shift');
    await page.keyboard.down('A');
    await page.waitForTimeout(1500)
    await page.keyboard.up('Shift');
    await page.keyboard.up('Amit')
    await page.waitForTimeout(1500)
})

// press(Name of the key to press or a character to generate) [dont use space when combining multiple Keys]
test('Press action', async({page}) => {
    await page.goto('https://demoapps.qspiders.com/ui?scenario=1')

    await page.locator('#name').click()
    await page.keyboard.press('Shift+a')
    await page.keyboard.press('m')
    await page.keyboard.press('i')
    await page.keyboard.press('t')
    await page.waitForTimeout(1500)
    await page.keyboard.press('Control+A')
    await page.keyboard.press('Control+C')
    await page.waitForTimeout(1500)
    await page.keyboard.press('Tab')
    await page.keyboard.press('Control+V')
    await page.waitForTimeout(1500)
})

test.only('Press action for Scrolling', async({page}) => {
    await page.goto('https://www.amazon.in/')

    for(let index = 1; index < 50; index++) {
        await page.keyboard.press('ArrowDown')
    }
    await page.waitForTimeout(1500)

    for(let index = 1; index < 30; index++) {
        await page.keyboard.press('ArrowUp')
    }
    await page.waitForTimeout(1500)
})