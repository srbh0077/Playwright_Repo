// pages/page-manager.js
import landing from './landing.page.js'
import signup from './signup.page.js'
import signin from './signin.page.js'
import home from './home.page.js'
import createTicket from './createTicket.page.js'

// export class PageManager {
//   constructor(page) {
//     this.page = page;
//     this.landingPage = new landing(this.page);
//     this.signupPage = new signup(this.page);
//     this.signinPage = new signin(this.page);
//     this.homePage = new home(this.page);
//     this.createTicketPage = new createTicket(this.page);
//   }
// }

export class PageManager {
  constructor(page) {
    this.page = page;
    this._landingPage = undefined;
    this._signupPage = undefined;
    this._signinPage = undefined;
    this._homePage = undefined;
    this._createTicketPage = undefined;
  }

  get landingPage() {
    return this._landingPage ??= new landing(this.page);
  }

  get signupPage() {
    return this._signupPage ??= new signup(this.page);
  }

  get signinPage() {
    return this._signinPage ??= new signin(this.page);
  }

  get homePage() {
    return this._homePage ??= new home(this.page);
  }

  get createTicketPage() {
    return this._createTicketPage ??= new createTicket(this.page);
  }
}



// Prefer a single PageManager fixture over separate fixtures for each page object.
// A PageManager keeps page object creation centralized and reduces fixture boilerplate,
// while still allowing you to access each POM via pageManager.landingPage, pageManager.signupPage, etc.


// Note: this implementation creates page objects lazily, only when first accessed.
// Example: if a test only needs signinPage, it can use pageManager.signinPage and the
// signin page object will be instantiated on demand, while other page objects remain uncreated.
// This avoids creating unnecessary POM instances for tests that only use one page object.



