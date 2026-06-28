class landing {
    constructor(page) {
        this.page = page
        this.sinupLink = page.getByRole('link', {name: 'User Signup'})
    }
}

export default landing