import {test} from '@playwright/test'
/**
 * PLAYWRIGHT ELEMENT CONTROL METHODS
 * ====================================
 * 
 * fill(value)
 *   - Clears and fills the input field with the provided value
 *   - Automatically focuses the element before filling
 *   - Works with input, textarea, and contenteditable elements
 *   - Example: await page.fill('input[name="email"]', 'test@example.com');
 * 
 * type(text, options)
 *   - Types text character by character with optional delay between keystrokes
 *   - Does NOT clear the field before typing, appends to existing text
 *   - Supports delay option: { delay: milliseconds }
 *   - Example: await page.type('input[id="search"]', 'hello', { delay: 100 });
 * 
 * click(options)
 *   - Clicks on an element
 *   - Supports options: { button: 'left'|'middle'|'right', clickCount: number, delay: ms }
 *   - Automatically waits for element to be actionable
 *   - Example: await page.click('button#submit', { clickCount: 2, delay: 500 });
 * 
 * getAttribute(name)
 *   - Gets the value of the specified attribute from an element
 *   - Returns the attribute value as a string
 *   - Returns null if the attribute does not exist
 *   - Useful for validating href, src, class, id, value, data-* attributes, etc.
 *   - Does not return the element's property value; it returns the HTML attribute value
 *   - Example:
 *       const href = await page.getAttribute('a.link', 'href');
 * 
 * inputValue()
 *   - Gets the current value of an <input>, <textarea>, or <select> element
 *   - Returns the value entered by the user or set programmatically
 *   - Does not return inner text or HTML
 *   - Throws an error if used on a non-form element
 *   - Commonly used for validating form field values
 *   - Example:
 *       const value = await page.inputValue('#username');
 */
test('fill()', async({page}) => {
    await page.goto('https://demoapps.qspiders.com/ui?scenario=1')

    let attributeName = await page.locator('#name').getAttribute('placeholder');
    await page.locator('#name').fill('amit');
    let name = await page.locator('#name').inputValue();

    let attributeEmail = await page.locator('#email').getAttribute('placeholder');
    await page.fill('#email', 'aa@qwerty.com');
    let mail = await page.locator('#email').inputValue();

    let attributePwd = await page.locator('#password').getAttribute('placeholder');
    await page.type('#password', 'qwerty1234', { delay : 100 });
    let password = await page.locator('#password').inputValue();

    console.log('\nName:', name, '\nEmail:', mail, '\nPassword:', password);
    //await page.pause(1500);

    let attributeButton = await page.locator("//button[text() = 'Register']").getAttribute('type');
    console.log("\nPlaceHolders: ", '\nName:', attributeName, '\nEmail:', attributeEmail, '\nPassword:', attributePwd, '\nattributeRegister:', attributeButton);

    await page.locator("//button[text() = 'Register']").click();

})


/**
 * innerText()
 *   - Gets the inner text content of an element
 *   - Returns visible text only present on view port area
 *   - Example: const text = await page.innerText('div.message');
 * 
 * textContent()
 *   - Gets the text content of an element and all its child nodes
 *   - Returns both visible and hidden text
 *   - Preserves whitespace and line breaks as present in the DOM
 *   - Faster than innerText() because it does not perform layout/render calculations
 *   - Returns null if the element is not found
 *   - Example:
 *       const text = await page.textContent('div.message');
 *
 *   HTML:
 *       <div class="message">
 *           Hello  <-- inner text                          -|
 *           <span style="display:none">Hidden Text</span>  -| text content
 *       </div>
 * 
 * textContent() directly reads the DOM node content, whereas 
 * innerText() calculates rendered text after considering CSS styles, visibility, and layout, making it slower
 * 
 * all()
 *   - Returns an array of Locator objects matching the selector
 *   - Used when multiple elements match and you want to work with each element individually
 *   - Does NOT return element text or values directly; returns Locator instances
 *   - Useful for iteration, filtering, and performing actions on multiple elements
 *   - Returns Promise<Locator[]>
 *
 *   Example:
 *       const items = await page.locator('.item').all();
 *
 *       for (const item of items) {
 *           console.log(await item.textContent());
 *       } 
 * 
 * first()
 *   - Returns a Locator pointing to the first matching element
 *   - Useful when multiple elements match but only the first one is needed
 *   - Does not return an element directly; returns a Locator
 *
 *   Example:
 *       const firstItem = page.locator('.item').first();
 *       await firstItem.click();
 * 
 * nth(index)
 *   - Returns a Locator pointing to the element at the specified zero-based index
 *   - Index starts from 0
 *   - Useful for selecting a specific element from multiple matches
 *   - Does not return an element directly; returns a Locator
 *
 *   Example:
 *       const thirdItem = page.locator('.item').nth(2);
 *       await thirdItem.click();
 * 
 * last()
 *   - Returns a Locator pointing to the last matching element
 *   - Useful when the number of matching elements is dynamic
 *   - Does not return an element directly; returns a Locator
 *
 *   Example:
 *       const lastItem = page.locator('.item').last();
 *       await lastItem.click();
 * 
 * allTextContents()
 *   - Returns textContent of all matching elements as an array
 *   - all() doesn't have its autowait mechanism
 *   - Includes both visible and hidden text
 *   - Similar to calling textContent() on multiple elements
 *   - Preserves whitespace as present in the DOM
 *   - Returns an [] if no elements match
 *   - Example:
 *       const texts = await page.locator('.item').allTextContents();
 */

test('fetching the text from DOM', async({page}) => {
   
    await page.goto('https://www.flipkart.com/')

    const allLocators = await page.locator("//div[@class ='css-g5y9jx r-18u37iz']/div").all();
    console.log('All Locators:\n', allLocators);

    await page.goto('https://demoapps.qspiders.com/ui?scenario=1')

    await page.locator("//section[text() = 'Web Elements']/parent::li/following-sibling::div//li").first().waitFor()
    const textContents = await page.locator("//section[text() = 'Web Elements']/parent::li/following-sibling::div//li").allTextContents();
    console.log(textContents);

    await page.locator("//section[text() = 'Web Elements']/parent::li/following-sibling::div//li").first().waitFor()
    const fastLocators = await page.locator('//section[@class="poppins text-[14px]"]').all();
    console.log(fastLocators);     
    // Empty [] because playwright wait for all() to return an array thats it either empty or filled 

    
})


/**
 * All these method doesn't follow auto wait so either use waitFor() or use other method that use auto wait
 * isChecked()
 *   - Checks whether a checkbox or radio button is checked
 *   - Returns true if checked, otherwise false
 *   - Applicable only for checkbox and radio input elements
 *   - Returns Promise<boolean>
 *
 *   Example:
 *       const checked = await page.isChecked('#agree');
 *       console.log(checked);
 * 
 * isVisible()
 *   - Checks whether an element is visible to the user
 *   - Returns true if the element is visible, otherwise false
 *   - Considers CSS properties such as:
 *       - display: none
 *       - visibility: hidden
 *       - hidden attribute
 *   - Returns Promise<boolean>
 *
 *   Example:
 *       const visible = await page.isVisible('.message');
 *       console.log(visible);
 * 
 * isEnabled()
 *   - Checks whether an element is enabled and can be interacted with
 *   - Returns true if the element is enabled, otherwise false
 *   - Commonly used for buttons, inputs, dropdowns, etc.
 *   - Checks for the disabled attribute
 *   - Returns Promise<boolean>
 *
 *   Example:
 *       const enabled = await page.isEnabled('#submit');
 *       console.log(enabled);
 * 
 * isDisabled()
 *   - Checks whether an element is disabled
 *   - Returns true if the element has the disabled attribute
 *   - Returns false if the element is enabled
 *   - Opposite of isEnabled()
 *   - Returns Promise<boolean>
 *
 *   Example:
 *       const disabled = await page.isDisabled('#submitBtn');
 *       console.log(disabled);
 * 
 * isEditable()
 *   - Checks whether an input, textarea, or editable element can be edited
 *   - Returns true if the element accepts user input
 *   - Returns false for disabled, readonly, or non-editable elements(radio, check box)
 *   - Returns Promise<boolean>
 *
 *   Example:
 *       const editable = await page.locator('#username').isEditable();
 *       console.log(editable);
 */

test('is methods', async({page}) => {
    await page.goto('https://demoapps.qspiders.com/ui/dropdown?sublist=0')

    await page.locator("#phone").waitFor({ state : 'visible' })

    const visibiltyOfPone = await page.locator("#phone").isVisible()
    console.log('is Phone text field visible: ', visibiltyOfPone);

    const canEditPhone = await page.locator("#phone").isEditable()
    console.log('can Edit Phone text field: ', canEditPhone);

    const enabledMaleBtn = await page.locator('#male').isEnabled
    console.log('is Male radio button enabled: ', enabledMaleBtn);

    const isBtnDisabled = await page.locator('#continuebtn').isDisabled
    console.log('is Male radio button enabled: ', isBtnDisabled);

    await page.goto('https://demoapps.qspiders.com/ui/checkbox?sublist=0')
    await page.locator("//h1[text() = 'Checkout Page']").waitFor({ state : 'visible' })

    let isEmailChecked = await page.locator("//span[text() = 'Email']/preceding-sibling::input").isChecked()
    console.log('Before click:', isEmailChecked);
    await page .locator("//span[text() = 'Email']/preceding-sibling::input").click();
    isEmailChecked = await page.locator("//span[text() = 'Email']/preceding-sibling::input").isChecked()
    console.log('After click:', isEmailChecked);


    await page.locator().waitFor()
})
