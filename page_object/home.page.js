class home {
    constructor(page) {
        this.page = page
        this.greeting = page.locator('//div[@class="greeting"]')
        this.user = page.locator('//div[@class="username"]')
        this.createTicketLink = page.locator(`//a[@href="create-ticket.php" and contains(text(), 'Create Ticket')]`)
        this.viewTicketLink = page.locator(`//a[@href="view-tickets.php" and contains(text(), 'View Ticket')]`)
    }

    // Method to locate dynamic elements
    getDynamicElement(selector) {
        return this.page.locator(selector)
    }

    // Example: Get element by text
    getGreetingText(text) {
        return this.page.locator(`//*[contains(text(), '${text}')]`).textContent()
    }

    // Example: Get element by attribute value
    // getElementByAttribute(attribute, value) {
    //     return this.page.locator(`//*[@${attribute}="${value}"]`)
    // }
}
export default home