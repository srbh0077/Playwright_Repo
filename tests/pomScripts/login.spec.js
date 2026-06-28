import {test} from '@playwright/test'
import loginPage from '../../page_object/login.page'     // add .js at last
import loginData from "../../testData/loginData.json"      // use "" here only

let urn = loginData.url
let usn = loginData.username
let pwd = loginData.password


test('login to the Application', async({page}) => {
    let loginpage = new loginPage(page)

    await page.goto(urn)

    await loginpage.usernameTextfield.fill(usn)
    await loginpage.passwordTextField.fill(pwd)

    await loginpage.submitButton.click()
})