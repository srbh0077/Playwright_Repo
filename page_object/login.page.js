class login {
    constructor(page) {     // passing fixture as paramenter
        this.page = page
        this.usernameTextfield = page.locator('input#username')
        this.passwordTextField = page.locator('input#password')
        this.submitButton = page.getByRole('button', {name: 'Submit'})
    }
}
// DiFFERENT wala hai 

export default login