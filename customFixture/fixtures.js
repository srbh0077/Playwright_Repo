import { test as base } from '@playwright/test';
import { PageManager } from '../page_object/pageManager.js';

// Extend the base Playwright test to include our custom fixture
export const test = base.extend({
  pageManager: async ({ page }, use) => {
    // 1. Initialize the Page Manager with the current page instance
    const pm = new PageManager(page);
    
    // 2. Pass the page manager instance to the test execution
    await use(pm);
  }
});

// Export expect so you can use it directly from this file
export { expect } from '@playwright/test';
