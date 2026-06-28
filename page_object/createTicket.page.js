class createTicket {
    constructor(page) {
        this.subject = page.locator('#subject')
        this.tasktypeDD = page.locator(`//select[@name = 'tasktype']`)
        this.priorityDD = page.locator(`//select[@name = 'priority']`)
        this.descriptiontextArea = page.locator(`//textarea[@name = 'description']`)
        this.sendButton = page.locator(`//input[@name = 'send']`)
     }
}
export default createTicket