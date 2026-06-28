import {test, expect } from '@playwright/test'
import excel from 'exceljs'     // run npm install exceljs 1st
import path from 'path'
import fs from 'fs'

test.only('Read Single Data', async({page}) => {
    let book = new excel.Workbook() // can't directly access worksheet without obj of the Workbook()
    await book.xlsx.readFile(path.join(__dirname, "../../testData/excelData.xlsx")) // must be asynchronous

    let sheet = book.getWorksheet('Sheet1')
    let data = sheet.getRow(1).getCell(1).toString() // convert cell obj to string
    console.log(data);
    data = sheet.getRow(2).getCell(1).value     // Value of the cell (Number/String/Boolean) with actual Datatype
    console.log(data);
})


test('Read multiple data', async({page}) => {
    let book = new excel.Workbook()
    await book.xlsx.readFile(path.join(__dirname, '../../testData/excelData.xlsx'))

    let sheet = book.getWorksheet('Sheet1')

    // produce row-wise data
    for(let row = 1; row <= sheet.actualRowCount; row++) {
        console.log("Row: ", row);
        for(let cell = 1; cell <= sheet.actualColumnCount; cell++) {
            let data = sheet.getRow(row).getCell(cell).toString()
            console.log(data);
        }
        console.log("\n");
        
    }

    // produce cell-wise data
    console.log();
    for(let cell = 1; cell <= sheet.actualColumnCount; cell++) {
        console.log("Column: ", cell);
        for(let row = 1; row <= sheet.actualRowCount; row++) {
            let data = sheet.getRow(row).getCell(cell).toString()
            console.log(data);
        }
        console.log("\n");
    }
})


test('Pass testdata to the Application', async({context, page}) => {
    let book = new excel.Workbook()
    await book.xlsx.readFile(path.join(__dirname, '../../testData/excelData.xlsx'))

    let sheet = book.getWorksheet('Sheet1')

    let allData = []
    for(let rindex = 1; rindex <= sheet.actualRowCount; rindex++) {
        let row = sheet.getRow(rindex)
        let url = row.getCell(1).toString()
        let urname = row.getCell(2).toString()
        let urpassword = row.getCell(3).toString()

        allData.push({url: url, username: urname, userpassword: urpassword})
    }
    console.log(allData);

    // execute with all objects present in the spreedsheet
    for(let data of allData) {
        await page.goto(data.url)

        // as new tab will be opened
        let page2 = page.waitForEvent('popup')
        await page.getByRole('link', {name: 'Small CRM'}).click()
        let newTab = await page2

        await newTab.getByRole('link', {name: 'Admin'}).click()
        await newTab.locator('#txtusername').fill(data.username)
        await newTab.locator('#txtpassword').fill(data.userpassword)

        await newTab.waitForTimeout(2500)
        await newTab.getByRole('button', {name: 'Login'}).click()

        await newTab.close()

        // will get error after complete execution -> Test timeout of 30000ms exceeded.
        /**
         * The Cumulative Loop Bottleneck: If you wrote a for...of loop inside a single test() block,
         * Playwright treats all 5 iterations as one continuous test. If each iteration takes 7 seconds, 
         * 5 iterations take 35 seconds total, causing the 30-second limit to fail the whole block
         */
    }
})


// 1. Create a placeholder array at the global level (No await used here!)
const allData = [];

test.describe('DDT Suite via exceljs', () => {

    // 2. Read the Excel data asynchronously inside beforeAll
    test.beforeAll( async() => {
        // 3. Read the Excel file synchronously at the file level before generating tests
        const book = new excel.Workbook();
        await book.xlsx.load((fs.readFileSync(path.join(__dirname, '../../testData/excelData.xlsx'))));   // SyntaxError: await is only valid in async functions and the top level bodies of modules
        const sheet = book.getWorksheet('Sheet1');

        for (let rindex = 1; rindex <= sheet.actualRowCount; rindex++) {
            const row = sheet.getRow(rindex);
            const url = row.getCell(1).toString();
            const urname = row.getCell(2).toString();
            const urpassword = row.getCell(3).toString();

            allData.push({ url: url, username: urname, userpassword: urpassword });
        }
        console.log('Generated DDT Matrix:', allData);
    })

    // 4. Loop outside the test block to create 5 distinct, independent test cases
        //const [index, data] (Array Destructuring)
    for (const [index, data] of allData.entries()) {    // .entries() Instead of returning just dataObject, it returns [0, dataObject], [1, dataObject], etc.
        test(`DDT Profile [Row ${index + 1}]: Pass testdata to the Application for ${data.username}`, async ({ page }) => {

            // Skip the test automatically if the Excel sheet had fewer rows than expected
            test.skip(!data, 'No data row available for this test execution slot.');

            // Navigate to the unique URL for this dataset
            await page.goto(data.url);

            // Start waiting for the popup before triggering the click action
            const page2Promise = page.waitForEvent('popup');
            await page.getByRole('link', { name: 'Small CRM' }).click();
            const newTab = await page2Promise;

            // Perform interactions inside the newly opened tab
            await newTab.getByRole('link', { name: 'Admin' }).click();
            await newTab.locator('#txtusername').fill(data.username);
            await newTab.locator('#txtpassword').fill(data.userpassword);

            // Robust dynamic web assertion instead of hard waitForTimeout
            const loginButton = await newTab.getByRole('button', { name: 'Login' });
            await expect(loginButton).toBeVisible();
            await loginButton.click();
            
            await newTab.close()
        });
    }
})    