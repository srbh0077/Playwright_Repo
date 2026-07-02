class viewTicket {
    constructor(page) {
        this.page = page
        this.createdTicket = page.locator(`//h4[@class = 'semi-bold']/parent::div`)
    }
}
export default viewTicket