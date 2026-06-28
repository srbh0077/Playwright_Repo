import {test} from '@playwright/test'
import excel from 'exceljs'
import path from 'path'

test('write Data in the sheet', async({context, page}) => {
    let book = new excel.Workbook()

    await book.xlsx.readFile(path.join(__dirname, '../../testData/excelData.xlsx'))

    let sheet = book.getWorksheet('Sheet3')     // if present fetch it
    if(!sheet) {
        sheet = book.addWorksheet('Sheet3')     // otherwise create it
    }

    sheet.getRow(1).getCell(1).value = 'Hello'  // assigning/overrding with the given value
    await book.xlsx.writeFile(path.join(__dirname, '../../testData/excelData.xlsx'))
})

test('Add data into excel from Application', async({context, page}) => {
    let book = new excel.Workbook()

    await book.xlsx.readFile(path.join(__dirname, '../../testData/excelData.xlsx'))

    let sheet = book.getWorksheet('AmazonAutoSuggestion')
    if(!sheet) {
        sheet = book.addWorksheet('AmazonAutoSuggestion')
    }

    await page.goto('https://www.amazon.in/')
    await page.locator('input#twotabsearchtextbox').fill('shoes')
    await page.getByRole('gridcell').first().waitFor({state: 'visible'})

    let allText = await page.getByRole('gridcell').allTextContents()

    // 1 row multiple column
    for(let text of allText) {
        let index = allText.indexOf(text)
        sheet.getRow(1).getCell(index + 1).value = text
    }

    // multi row single column
    for(let text of allText) {
        let index = allText.indexOf(text)
        sheet.getRow(index + 3).getCell(1).value = text
    }

    await book.xlsx.writeFile(path.join(__dirname, '../../testData/excelData.xlsx'))
})