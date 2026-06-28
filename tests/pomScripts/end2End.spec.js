import {expect, test} from '@playwright/test'

import landing from '../../page_object/landing.page.js'
import signup from '../../page_object/signup.page.js'
import signin from '../../page_object/signin.page.js'
import home from '../../page_object/home.page.js'
import createTicket from '../../page_object/createTicket.page.js'

import testdata from "../../testData/end2End.json"

function generateDynamicEmail() {
    const timestamp = Date.now(); // Returns current time in milliseconds
    return `amit_${timestamp}@xyz.com`; 
}

function generatedynamicScreenShot() {
    const timestamp = Date.now(); // Returns current time in milliseconds
    return `end2End_${timestamp}`; 
}


test.describe('Data driven multiple testing', () => 
{
    for (let index = 0; index < testdata.length; index++) 
    {
        const data = testdata[index]

        test(`End to End scenario [${index}]`, async({context, page}) => 
        {
            page.on('dialog', async(dialog) => {
                console.log('popup message:', dialog.message());
                await dialog.accept()
            })

            let landingPage = new landing(page)
            let signupPage = new signup(page)
            let signinPage = new signin(page)
            let homePage = new home(page)
            let createTicketPage = new createTicket(page)

            const dynamicEmail = generateDynamicEmail();
            const dynamicScreenShot = generatedynamicScreenShot();

            //launch Application
            await page.goto(data.url)
            await landingPage.sinupLink.click()
        // Sign up page    
            //pass name
            await signupPage.name.fill(data.name)
            //pass email
            await signupPage.email.fill(dynamicEmail)
            //pass pass
            await signupPage.password.fill(data.password)
            //pass re-password
            await signupPage.cpassword.fill(data.password)
            //pass contact no
            await signupPage.contact.fill(data.contactNumber)
            //select gender radio button
            await signupPage.maleRadio.click()
            //click on submit button
            await signupPage.submitButton.click()
            //Succesful alert popup handling via page.on()

        // Login Page    
            //pass email
            await signinPage.signinMail.fill(dynamicEmail)
            //pass pass
            await signinPage.signinPassword.fill(data.password)
            //click on login button
            await signinPage.loginButton.click()
            await context.storageState()

        // Home Page (Dashboard)    
            // assert user with message
            await expect(homePage.greeting).toContainText('Welcome');
            await expect(homePage.user).toContainText(data.name)
            //click on Create Ticket tab
            await homePage.createTicketLink.click()

        // Create Ticket page    
            //pass subject
            await createTicketPage.subject.fill(data.subject)
            //select tasktype
            await createTicketPage.tasktypeDD.selectOption({ value: 'billing' })
            //select priority
            await createTicketPage.priorityDD.selectOption({ value: 'non-urgent' })
            //pass description
            await createTicketPage.descriptiontextArea.fill(data.description)
            //click on send button
            await createTicketPage.sendButton.click()
            //Ticket Generated popup handling via page.on()
            //click on View Ticket tab
            await homePage.viewTicketLink.click()
            //take screenshot and complete assertion
            await page.screenshot({ path: `./screenshot/${dynamicScreenShot}.png` })  // png
        })
    }
})