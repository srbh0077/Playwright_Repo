import {test} from '@playwright/test'

test.slow('Slow Scenario execution', async({page}) => {
    // Mark this test as slow so Playwright knows it may take longer
    test.slow();
    console.log('slow annotation');
})

test.skip('Demo Test3', async() => {
    // Skip this test completely; it will be reported as skipped
    console.log('test 1');
})

test('Only This test should run', async({page}) => {
    // Run only this test and ignore all others in this file
    console.log('Only annotation used');
})

test.fail('Failing this scenario', async({page}) => {
    // Expect this test to fail; if it passes, Playwright marks it as an unexpected pass
    console.log('fail annotation');
    await page.goto('efe4343fds');
});

test('check will test fil or not', async ({browserName, page}) => {
    console.log("Happy Happy");
    if(browserName === 'chromium') {    // chromium -> fail, firefox/webkit -> pass
        test.fail();
    }
})

test.fixme('fix the provide Scenario', async({page}) => {
    // Mark this test as fixme; it will be skipped until it is fixed
    console.log('fixme annotation');
    await page.goto('sdfdsfd');
})

// Combined annotation example: slow and fail used together
test.only('Slow and failing scenario', async({page}) => {
    test.slow();    // in config timeout: 1000 added,
    test.fail();    // passed even after assertion failed
    await page.goto('https://google.com')
    await page.waitForTimeout(1000); // Just to make it slow
    await expect(page.url()).toBe('https://facebook.com'); // Fails
});

test('Conditional Skip', async({browserName}) => {
    // Skip this test only when running in Chromium
    test.skip(browserName === 'chromium');
})

test.describe('login', async() => {   // describe groups multiple tests together
    console.log('grouping the Tests');
    test('valid cred', async() => {
        // Normal test with a custom timeout inside the test body
        console.log('test 1...');
        test.setTimeout(5000)
    })
    test('invalid cred', async() => {
        // Normal test in the group
        console.log('test 2...');
    })
});

// Combined annotation example: focus on this describe block only
// test.describe.only('Focused describe group', () => {
//     test('only test within focused describe', async() => {
//         console.log('test inside describe.only');
//     });
// });

// More examples of combined annotations in a describe block
test.describe('combined annotations', () => {
    test.fixme('fixme inside describe', async() => {
        // This test is skipped because it is marked fixme
        console.log('fixme in describe');
    });

    test.skip('skip inside describe', async() => {
        // This test is skipped at runtime
        console.log('skip in describe');
    });
});