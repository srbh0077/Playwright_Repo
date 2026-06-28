import {test} from '@playwright/test'

test(`Mouse Action`, async({page}) => {
    // await page.goto('https://demoapps.qspiders.com/ui/button?sublist=0')

    // // Left click
    // await page.locator('#btn').click()
    // await page.locator('#btn').click({modifiers: ['Control', 'Shift']})

    // // Right click
    // await page.goto('https://demoapps.qspiders.com/ui/button/buttonRight?sublist=1')
    // await page.locator('#btn_a').click({button: 'right'});
    // await page.waitForTimeout(1500)

    // // Double click
    // await page.goto('https://demoapps.qspiders.com/ui/button/buttonDouble?sublist=2')
    // await page.waitForTimeout(1500)
    // await page.click('#btn_a', {clickCount: 2})
    // await page.waitForTimeout(1500)
    // await page.locator('#btn_b').dblclick()
    // await page.waitForTimeout(1500)

    // // Click Hold and Release
    // // 1st need to hover over the found element then perform next action
    // await page.goto('https://demoapps.qspiders.com/ui/clickHold?sublist=0')
    // await page.locator('#circle').hover()
    // await page.mouse.down()
    // await page.waitForTimeout(3000)
    // await page.mouse.up()
    // await page.waitForTimeout(1500)

    // // Force click on Disabled/Hidden buttons [Mouse click on playwright dev page]
    // await page.goto('https://demoapps.qspiders.com/ui/button/buttonDisabled?sublist=4')
    // await page.getByRole('checkbox').click({ force: true })
    // await page.waitForTimeout(1500)
    // await page.getByRole('checkbox').dispatchEvent('click')
    // await page.waitForTimeout(1500)

    // // Mouse Hover and then move it
    // await page.goto('https://demoapps.qspiders.com/ui/mouseHover?sublist=0')

    // await page.locator(`//h1[contains(text(),'Password')]/following-sibling::div//img[2]`).hover()
    // page.waitForTimeout(1500)

    // await page.mouse.move(100, 500)
    // await page.waitForTimeout(1500)

    /** scroll via wheel [doesn't have auto wait]
     * (-x) --> left and (-y) --> up
     * 
     */

    // await page.goto('https://demoapps.qspiders.com/ui/scroll/newTabHorizontal')
    // await page.waitForTimeout(1500) // wait before scrolling is required
    // await page.mouse.wheel(3000, 300)   // other scrolling is not present then it will neglect it (y-axis)
    // await page.waitForTimeout(1500)
    // await page.mouse.wheel(-1000, 0)
    // await page.waitForTimeout(1500)


    await page.goto('https://demoapps.qspiders.com/ui/scroll/newTabVertical')

    await page.waitForTimeout(1500) // wait before scrolling is required
    await page.mouse.wheel(0, 1000)
    await page.waitForTimeout(1500)
    await page.mouse.wheel(0, -500)
    await page.waitForTimeout(1500)

    // Manual scrolling to the element [ playwright handle the scrolling by default ]
    await page.getByRole('checkbox').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1500)
})

test.only('Drag and Drop', async({page}) => {
    // Drag and Drop
    await page.goto('https://demoapps.qspiders.com/ui/dragDrop?sublist=0')

    await page.getByText('Drag Me').hover()
    await page.waitForTimeout(1500)
    await page.mouse.down()
    await page.waitForTimeout(1500)
    await page.mouse.move(200, 400)
    await page.waitForTimeout(1500)
    await page.mouse.up()
    await page.waitForTimeout(1500)

    // Drag and Drop to another element
    await page.goto('https://demoapps.qspiders.com/ui/dragDrop/dragToCorrect?sublist=2')

    await page.getByText('Mobile Charger').hover()
    await page.mouse.down()
    await page.waitForTimeout(1500)
    await page.locator(`//div[text() = 'Mobile Accessories']/parent::div`).hover()
    await page.waitForTimeout(1500)
    await page.mouse.up()
    await page.waitForTimeout(1500)

    /** Drag and Drop to Element location (using Bounding box)
    * boundingBox()
    *   - Returns the position and size of an element relative to the viewport
    *   - Useful for getting element coordinates for mouse actions,
    *     drag-and-drop, visual validations, screenshots, etc.
    *   - Returns null if the element is not visible
    *   - Returns Promise<{
    *         x: number,
    *         y: number,
    *         width: number,
    *         height: number
    *     } | null>
    *
    *   Properties:
    *     x
    *       - Horizontal position of the element's top-left corner
    *
    *     y
    *       - Vertical position of the element's top-left corner
    *
    *     width
    *       - Width of the element in pixels
    *
    *     height
    *       - Height of the element in pixels
    *
    *   Example:
    *       const box = await page.locator('#submit').boundingBox();
    *       console.log(box);
    */

    await page.locator(`//div[text() = 'Laptop Charger']`).hover()
    await page.mouse.down()
    await page.waitForTimeout(1500)
    let box = await page.locator(`//div[text() = 'Mobile Accessories']/parent::div`).boundingBox()
    console.log(box);

    await page.mouse.move(box.x, box.y)
    // await page.mouse.move(box.x + box.width/2, box.y + box.height/2) // [to the centre of the Drop element]
    await page.mouse.up()
    await page.waitForTimeout(1500)

    // assertions with size
        // expect(box.width).toBeGreaterThan(100);
        // expect(box.height).toBeGreaterThan(100);

})