import {test, expect} from '@playwright/test'
import fs from 'fs'

// JSON.parse --> Converts a JavaScript Object Notation (JSON) string into an object.

let dataFile = fs.readFileSync('C:/Users/Pc/playwright-workspace/testData/testdata.json')
// data contains array of JS objects
let data = JSON.parse(dataFile)

/**
 * [
    {"greet": "Hello"},
    {"greet": "Hii"},
    {"greet": "Byee"},
    {"greet": "No worry"},
    {"greet": "Tata"}
 * ]
 */
test.skip('Get greet from JSON', async({page}) => {
    // console.log(data[0].greet);  // fetch the first one only 'Hello'
    // element is obj
    data.forEach(element => {
        console.log(element.greet);
    });
})

/**
 * {
        "url": "https://practicetestautomation.com/practice-test-login/",
        "username": "student",
        "password": "Password123"
    }
 */
test.skip('Get single set of data from JSON and pass in Application', async({page}) => {
    await page.goto(data.url)
    await page.locator('input#username').fill(data.username)
    await page.locator('input#password').fill(data.password)

    await page.getByRole('button', {name: 'Submit'}).click()

    let title = await page.title()
    await expect(title.includes('Logged In Successfully')).toBe(true)
})


test('Get Multiple set of JSON data and pass in Application', async({page}) => {
    // data.forEach(element => {
    //     let url = element.url
    //     let usn = element.username
    //     let pwd = element.password
    //     await page.goto() // await will throw error so go for for of loop
    // });

    for(let key of data) {
        let url = key.url
        let usn = key.username
        let pwd = key.password

        await page.goto(url)
        await page.locator('input#username').fill(usn)
        await page.locator('input#password').fill(pwd)

        await page.getByRole('button', {name: 'Submit'}).click()

        let title = await page.title()
        
        if(title.includes('Logged In Successfully | Practice Test Automation'))
            console.log(title);
        else
            console.log('Your username is invalid!');
            
    }
})