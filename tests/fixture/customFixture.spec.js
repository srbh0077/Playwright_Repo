import { test, expect }from '@playwright/test'

// Custom fixtures are created with test.extend().
// Use this pattern when you need shared setup or custom helpers.
const customTest = test.extend({
  // Simple custom fixture providing a reusable value.
  customGreeting: ['Hello from fixture', { option: true }],

  apiClient: async ({ request }, use) => {
    const client = {
      get: (url, options = {}) => request.get(
        `https://jsonplaceholder.typicode.com${url}`,
        {
          headers: {
            Accept: 'application/json',
            ...options.headers,
          },
          ...options,
        }
      ),
    };
    await use(client);
  },

  // Custom fixture that sets up authenticated data for a test. // custom fixture chaining
  authToken: async ({ apiClient }, use) => {
    const response = await apiClient.get('/todos/1');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    const token = `token-for-${data.id}`;
    await use(token);
  },
});

customTest('custom fixture example', async ({ page, customGreeting, apiClient, authToken }) => {
  // `customGreeting` is a simple custom fixture value.
  expect(customGreeting).toBe('Hello from fixture');

  // `apiClient` is a custom request context fixture with baseURL configured.
  const response = await apiClient.get('/todos/1');
  expect(response.ok()).toBeTruthy();

  // `authToken` is derived from apiClient and reused in the test.
  expect(authToken).toContain('token-for-');

  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
});

// Custom fixture override example.
const overrideTest = test.extend({
  baseURL: 'https://example.com',
});

overrideTest('override fixture example', async ({ request, baseURL }) => {
  const response = await request.get(baseURL);
  expect(response.ok()).toBeTruthy();
});
