import {test, expect} from '@playwright/test'

test('Bootstrap Dropdown', async({page}) => {
    await page.goto('https://demoapps.qspiders.com/ui/dropdown/bootstrap?sublist=3')
})