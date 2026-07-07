import {test, expect} from '@playwright/test'

test.use({baseURL: `https://testautomationpractice.blogspot.com/`})

test('Date picker with working Prev/Next button', async({ page }) => {
    await page.goto('/')

    let datePicker1 = await page.locator('input#datepicker')
    datePicker1.click()

    await expect(page.locator('#ui-datepicker-div')).toBeVisible()

    // 1. Get current Month and Year from the local system
    const systemDate = new Date();
    const systemMonthLong = systemDate.toLocaleString('en-US', { month: 'long' }); // e.g., "July"
    const systemYear = systemDate.getFullYear(); // e.g., 2026

    // Combine them to match your website's typical header format (e.g., "July 2026")
    const expectedMonthYear = `${systemMonthLong} ${systemYear}`;

    let calendarHeader = await page.locator(`div.ui-datepicker-title`)
    await expect(calendarHeader).toHaveText(expectedMonthYear)

    const previousButton = page.locator(`//span[text() = 'Prev']`)
    const nextButton = page.locator(`//span[text() = 'Next']`)

    const initialUiText = await calendarHeader.textContent()
    // Extracts the items from the newly created array and assigns first to currentMonthStr and 2nd to currentYearStr.
    // // \s+ splits by any whitespace character, including non-breaking spaces
    let [currentMonthStr, currentYearStr] = initialUiText.trim().split(/\s+/);  // as ' ' will not work with &nbsp(hidden space)
    
    let trackingDate = new Date(`${currentMonthStr} 1, ${currentYearStr}`);

    console.log('<===============NEXT Button===============>');   
    // 3. Loop 12 times to validate a full calendar year cycle
    for (let i = 1; i <= 12; i++) {
        // Step A: Calculate what the NEXT month and year should be
        trackingDate.setMonth(trackingDate.getMonth() + 1); 
        
        // JS Date automatically increments the year if the month moves past December
        const expectedMonth = trackingDate.toLocaleString('en-US', { month: 'long' });
        const expectedYear = trackingDate.getFullYear();
        const expectedUiText = `${expectedMonth} ${expectedYear}`;

        // Step B: Action - Click the next button in the UI
        await nextButton.click();

        // Step C: Assert - Read the updated UI and verify it matches calculations
        const updatedUiText = await calendarHeader.textContent();
        
        console.log(`Step ${i} -> Expected: "${expectedUiText}" | Found: "${updatedUiText?.trim()}"`);
        await expect(calendarHeader).toHaveText(expectedUiText);
    }

    console.log('\n<===============PREV Button===============>'); 
    for (let i = 12; i >= 1; i--) {
        // Step A: Calculate what the NEXT month and year should be
        trackingDate.setMonth(trackingDate.getMonth() - 1); 
        
        // JS Date automatically increments the year if the month moves past December
        const expectedMonth = trackingDate.toLocaleString('en-US', { month: 'long' });
        const expectedYear = trackingDate.getFullYear();
        const expectedUiText = `${expectedMonth} ${expectedYear}`;

        await previousButton.click();
        const updatedUiText = await calendarHeader.textContent();
        
        console.log(`Step ${i} -> Expected: "${expectedUiText}" | Found: "${updatedUiText?.trim()}"`);
        await expect(calendarHeader).toHaveText(expectedUiText);
    }
})



test('Week and Days count', async({page}) => {
    await page.goto('/')

    let datePicker1 = await page.locator('input#datepicker')
    datePicker1.click()

    // > operator for Strict Child Matching
    // .all() is NOT used because below evaluateAll() already handles multiple elements and returns a JavaScript array
    const weekDays = page.locator('table.ui-datepicker-calendar > thead > tr > th > span')
    await expect(weekDays).toHaveCount(7)

    // evaluateAll() executes JavaScript in the browser context and returns results to Node.js
    // It retrieves ALL matched elements (7 <span> elements) and maps over them
    // The .map() transforms the NodeList into an array of title strings: ['Sunday','Monday',...,'Saturday']
    // .all() is NOT used because evaluateAll() already handles multiple elements and returns a JavaScript array
    const titles = await weekDays.evaluateAll(nodes => nodes.map(span => span.getAttribute('title')))

    const expected = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    expect(titles).toEqual(expected)

// Dates comparing   
// Notes on selectors when multiple elements match:
    // - page.locator(selector): returns a Locator object that can match multiple elements. You can call
    //   methods like count(), nth(index), first(), last(), evaluateAll(), elementHandles(), etc.
    //   Locator operations are lazy and robust (auto-waiting).
    // - locator().all(): NOT a Playwright API. To get an array of element handles or values, use
    const dates = await page.locator(`table.ui-datepicker-calendar > tbody td[data-handler="selectDay"]`)
    const currentCount = await dates.count()
    expect([28, 29, 30, 31]).toContain(currentCount)
            //OR//
    const lastDayofMonth = dates.last()
    // textContent() returns a string (may include whitespace). Convert to number
    // before comparing with numeric array values.
    const lastDayText = (await lastDayofMonth.textContent())?.trim();
    const lastDayNumber = Number.parseInt(lastDayText, 10);
    expect([28, 29, 30, 31]).toContain(lastDayNumber)

    const daysTextList = await dates.allTextContents()
    console.log('DATES:', daysTextList);
    await expect(lastDayofMonth).toHaveText(daysTextList[daysTextList.length-1])


    let listOfDays = await dates.all()
    
    for (let day of listOfDays) {
        await expect(day).toBeEnabled()
        await day.hover()
    }
})

test.only('DATE PICKER 1', async({ page }) => {
    await page.goto('/')

    // always in String in DOM
    const date = 31
    const month = 'July'
    const year = 2024

    let datepicker = page.locator('input#datepicker')
    await datepicker.click()

    const testDate = new Date(`${month} ${date}, ${year}`);

    if (testDate.getDate() !== date || 
        testDate.toLocaleString('default', { month: 'long' }) !== month ||
        testDate.getFullYear() !== year) // year as number otherwise pass Number(year)
    {
        throw new Error(`Invalid date: ${date}-${month}-${year}`);
    }

    const targetDate = new Date(`${month} 1, ${year}`)
    while (true) {
        const monthYearText = (await page.locator('.ui-datepicker-title').textContent())?.trim() || ''

        const [currentMonthStr, currentYearStr] = monthYearText.split(/\s+/)
        const currentDate = new Date(`${currentMonthStr} 1, ${currentYearStr}`)

        if (currentDate.getFullYear() === targetDate.getFullYear() && currentDate.getMonth() === targetDate.getMonth()) {
            break;
        }

        if (currentDate < targetDate) {
            await page.getByTitle('Next').click()
        } else {
            await page.getByTitle('Prev').click()
        }
    }
    await expect(page.locator('.ui-datepicker-title')).toHaveText(`${month} ${year}`);

    let allDates = await page.locator(`td[data-handler="selectDay"]`).all()
    for(let onlyDate of allDates) {
        if(await onlyDate.textContent() === date.toString()) {
            await onlyDate.click()
            break;
        }
    }
    const monthDate = new Date(`${month} 1, ${year}`)
    const numericMonth = (monthDate.getMonth() + 1).toString().padStart(2, '0') // add leading 0 -> 02
    
    await expect(datepicker).toHaveValue(new RegExp(`${numericMonth}.*${date}.*${year}`))
})


test('DATE PICKER 2', async({ page }) => {
    await page.goto('/')

    // always in String in DOM
    let date = 28
    let month = 'Feb'
    let year = '2027'

    let datePicker1 = await page.locator('input#txtDate')
    datePicker1.click()

//MONTH    
    let monthDD = await page.locator('.ui-datepicker-month')
    await monthDD.selectOption(month)

    // Explanation: 'option:checked' is a CSS selector that matches the currently selected
    // <option> element within a <select>. In Playwright, monthDD.locator('option:checked')
    // returns a Locator pointing to that selected <option>, so we can assert it has the 'selected' attribute.
    await expect(monthDD.locator('option:checked')).toHaveText(month)
    await expect(monthDD.locator('option:checked')).toHaveAttribute('selected', 'selected')

//YEAR    
    let yearDD = await page.locator('.ui-datepicker-year')
    await yearDD.selectOption({ label: year })

    await expect(yearDD.locator('option:checked')).toHaveText(year)
    await expect(yearDD.locator('option:checked')).toHaveAttribute('selected', 'selected')

//DATE
    let dates = await page.locator(`table > tbody td[data-handler='selectDay']`)
    dates.locator(`a[data-date="${date}"]`).click()

    const dateInput = await page.locator('input#txtDate')
    // The displayed value format may vary (e.g., numeric month vs. short name).
    // Assert that the input contains the day and year to avoid brittle exact-format checks.
    
    // Convert short month name to numeric month
    const monthDate = new Date(`${month} 1, ${year}`)
    const numericMonth = (monthDate.getMonth() + 1).toString().padStart(2, '0') // add leading 0 -> 02
    
    await expect(dateInput).toHaveValue(new RegExp(`${date}.*${numericMonth}.*${year}`))
})