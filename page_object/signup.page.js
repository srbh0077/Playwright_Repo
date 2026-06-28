class signup {
    constructor(page) {
        this.page = page
        this.name = page.locator('#name')
        this.email = page.locator('#email')
        this.password = page.locator('#password')
        this.cpassword = page.locator('#cpassword')
        this.contact = page.locator('#txtpassword')
        this.maleRadio = page.locator(`//input[@value = 'm']`)
        this.femaleRadio = page.locator(`//input[@value = 'f']`)
        this.submitButton = page.getByRole('button', { name: /Submit/ })    // as value attribute is present
    }
}
export default signup