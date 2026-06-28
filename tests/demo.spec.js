import {test} from '@playwright/test'
import console from 'node:console'

// the tests inside a single file are executed sequentially from top to bottom (in the order of declaration) 
// using a single worker process

test('demo1', () => {
    console.log('Hello1');
})

test('demo3', () => {
    console.log('Hello3');
})

test('demo2', () => {
    console.log('Hello2');
})

/**
 * Running 3 tests using 2 workers
[chromium] › tests\demo.spec.js:4:5 › demo1
Hello1
[chromium] › tests\demo.spec.js:8:5 › demo3
Hello3
[chromium] › tests\demo.spec.js:12:5 › demo2
Hello2
 */

// Even if you only run Chromium, Playwright sees 3 individual tests and attempts to speed them up
// by distributing them across all available workers. Here is why you see 2 workers specifically

// or disable fullyParallel config as false


// provde function name as async then only can use await keyword inthe test steps
test('Demo Await and Async keyword usage', async() => {
    await console.log('Launching'); // Lauch
    await console.log('Logged in');// login
    await console.log('Logged out'); // logout
})