// IntelliSense Autocomplete: Typing pageManager. will instantly show you all 5 pages available to use.
// Zero Boilerplate: No need to create POM class objects in every tests
// Isolated State: Playwright completely recreates the PageManager (and all 5 pages) freshly for every single test execution, ensuring zero cross-test data leaks.

// PageManager Getter Methods: This file utilizes getter methods from the PageManager class such as:
//   - pageManager.landingPage
//   - pageManager.signupPage
//   - pageManager.signinPage
//   - pageManager.homePage
//   - pageManager.createTicketPage
// These getters provide lazy-loaded instances of page objects for clean and maintainable test code.
//  modify accordingly
import { test, expect } from '../../customFixture/fixtures.js'

import testdata from "../../testData/end2End.json"


function generateDynamicEmail() {
  const timestamp = Date.now()
  return `amit_${timestamp}@xyz.com`
}

function generateDynamicScreenshot() {
  const timestamp = Date.now()
  return `end2End_${timestamp}`
}

test.describe('Data driven multiple testing', () => 
{
  for (let index = 0; index < testdata.length; index++) 
  {
    const data = testdata[index]

    test(`End to End scenario [${index}]`, async({pageManager, context}) => {
      const dynamicEmail = generateDynamicEmail()
      const dynamicScreenshot = generateDynamicScreenshot()

      await pageManager.landingPage.page.on('dialog', async (dialog) => {
        console.log('popup message:', dialog.message())
        await dialog.accept()
      })

      await pageManager.landingPage.page.goto(data.url)
      await pageManager.landingPage.sinupLink.click()

      await pageManager.signupPage.name.fill(data.name)
      await pageManager.signupPage.email.fill(dynamicEmail)
      await pageManager.signupPage.password.fill(data.password)
      await pageManager.signupPage.cpassword.fill(data.password)
      await pageManager.signupPage.contact.fill(data.contactNumber)
      await pageManager.signupPage.maleRadio.click()
      await pageManager.signupPage.submitButton.click()

      await pageManager.signinPage.signinMail.fill(dynamicEmail)
      await pageManager.signinPage.signinPassword.fill(data.password)
      await pageManager.signinPage.loginButton.click()
      // await context.storageState()

      await expect(pageManager.homePage.greeting).toContainText('Welcome')
      await expect(pageManager.homePage.user).toContainText(data.name)

      console.log(await pageManager.homePage.getGreetingText(data.name));
      await pageManager.homePage.createTicketLink.click()

      await pageManager.createTicketPage.subject.fill(data.subject)
      await pageManager.createTicketPage.tasktypeDD.selectOption({ value: 'billing' })
      await pageManager.createTicketPage.priorityDD.selectOption({ value: 'non-urgent' })
      await pageManager.createTicketPage.descriptiontextArea.fill(data.description)
      await pageManager.createTicketPage.sendButton.click()

      await pageManager.homePage.viewTicketLink.click()
      await pageManager.page.screenshot({ path: `./screenshot/${dynamicScreenshot}.png` })
      await pageManager.page.screenshot({ path: `./screenshot/${dynamicScreenshot}_fullpage.png`, fullPage: true })
      

      const ticketText = await pageManager.viewTicketPage.createdTicket.textContent()
      if(ticketText.includes(data.subject)) {
        await pageManager.viewTicketPage.createdTicket.screenshot( { path: `./screenshot/${dynamicScreenshot}_TicketCreated.png`} )
      } else {
        console.log(`Ticket with subject "${data.subject}" not found.`)
      }
    })
  }
})