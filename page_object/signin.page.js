class signin {
    constructor(page) {
        this.page = page
        this.signinMail = page.locator('#txtusername')
        this.signinPassword = page.locator('#txtpassword')
        this.loginButton = page.getByRole('button', {name: 'Login'})
    }
}

export default signin