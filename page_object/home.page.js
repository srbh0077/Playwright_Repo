class home {
    constructor(page) {
        this.page = page
        this.greeting = page.locator('//div[@class="greeting"]')
        this.user = page.locator('//div[@class="username"]')
        this.createTicketLink = page.locator(`//a[@href="create-ticket.php" and contains(text(), 'Create Ticket')]`)
        this.viewTicketLink = page.locator(`//a[@href="view-tickets.php" and contains(text(), 'View Ticket')]`)
    }
}
export default home