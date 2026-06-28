import { test, expect } from '@playwright/test';

test.describe('Playwright assertion variations for UI interactions', () => {
  test('dropdown assertions', async ({ page }) => {
    await page.setContent(`
      <select id="options">
        <option value="one">One</option>
        <option value="two" selected>Two</option>
        <option value="three">Three</option>
      </select>
      <p id="result"></p>
      <script>
        const select = document.querySelector('#options');
        select.addEventListener('change', () => {
          document.querySelector('#result').textContent = select.value;
        });
      </script>
    `);

    const dropdown = page.locator('#options');
    await expect(dropdown).toBeVisible();
    await expect(dropdown).toHaveValue('two');
    await expect(dropdown.locator('option:checked')).toHaveText('Two');
    await dropdown.selectOption('three');
    await expect(dropdown).toHaveValue('three');
    await expect(page.locator('#result')).toHaveText('three');
  });

  test('dialog assertions', async ({ page }) => {
    await page.setContent(`
      <button id="alert">Alert</button>
      <button id="confirm">Confirm</button>
      <button id="prompt">Prompt</button>
      <script>
        document.querySelector('#alert').addEventListener('click', () => alert('Alert message'));
        document.querySelector('#confirm').addEventListener('click', () => {
          const result = confirm('Confirm message');
          document.body.dataset.confirm = result;
        });
        document.querySelector('#prompt').addEventListener('click', () => {
          const result = prompt('Enter value', 'default');
          document.body.dataset.prompt = result;
        });
      </script>
    `);

    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('Alert message');
      await dialog.accept();
    });
    await page.click('#alert');

    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toContain('Confirm');
      await dialog.dismiss();
    });
    await page.click('#confirm');
    await expect(page.locator('body')).toHaveAttribute('data-confirm', 'false');

    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.defaultValue()).toBe('default');
      await dialog.accept('hello');
    });
    await page.click('#prompt');
    await expect(page.locator('body')).toHaveAttribute('data-prompt', 'hello');
  });

  test('wait statements', async ({ page }) => {
    await page.setContent(`
      <div id="status">loading</div>
      <script>
        setTimeout(() => document.querySelector('#status').textContent = 'ready', 300);
      </script>
    `);

    await expect(page.locator('#status')).toHaveText('loading');
    await page.waitForSelector('#status:text("ready")', { timeout: 2000 });
    await expect(page.locator('#status')).toHaveText('ready');

    await page.setContent('<div id="counter">0</div><script>let i=0; setInterval(()=>document.querySelector("#counter").textContent=++i,100);</script>');
    await page.waitForFunction(() => document.querySelector('#counter').textContent === '3', null, { timeout: 2000 });
    await expect(page.locator('#counter')).toHaveText('3');

    await page.goto('data:text/html,<button id="nav">Navigate</button><script>document.querySelector("#nav").addEventListener("click",()=>location.href="about:blank")</script>');
    await Promise.all([
      page.waitForNavigation(),
      page.click('#nav'),
    ]);
    await expect(page).toHaveURL('about:blank');
  });

  test('tabs and window assertions', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setContent('<button id="popup" onclick="window.open(\'about:blank\', \'_blank\')">Popup</button>');
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.click('#popup'),
    ]);
    await popup.waitForLoadState('domcontentloaded');
    await expect(popup).toHaveURL('about:blank');
    await popup.close();
    await page.close();
    await context.close();
  });

  test('frames assertions', async ({ page }) => {
    await page.setContent(`
      <iframe id="frame" srcdoc="<button id='inner'>click</button><span id='inner-text'>hello</span>"></iframe>
    `);
    const frame = page.frameLocator('#frame');
    await expect(frame.locator('#inner')).toBeVisible();
    await frame.locator('#inner').click();
    await expect(frame.locator('#inner-text')).toHaveText('hello');
    const embeddedFrame = page.frame({ url: /about:srcdoc/ });
    await expect(embeddedFrame).not.toBeNull();
  });

  test('notification assertions', async ({ browser }) => {
    const context = await browser.newContext();
    await context.grantPermissions(['notifications']);
    const page = await context.newPage();
    await page.setContent('<script>window.notifyResult = Notification.permission;</script>');
    const permission = await page.evaluate(() => Notification.permission);
    expect(permission).toBe('granted');
    const result = await page.evaluate(() => {
      const notification = new Notification('Title', { body: 'Body text' });
      return notification.body === 'Body text' && Notification.permission === 'granted';
    });
    expect(result).toBeTruthy();
    await page.close();
    await context.close();
  });

  test('mouse and keyboard actions', async ({ page }) => {
    await page.setContent(`
      <input id="input" value="">
      <div id="drag" style="width:50px;height:50px;background:blue;position:absolute;left:0;top:0;"></div>
      <div id="target" style="width:50px;height:50px;background:red;position:absolute;left:100px;top:0;"></div>
    `);
    const input = page.locator('#input');
    await input.click();
    await page.keyboard.type('Playwright');
    await expect(input).toHaveValue('Playwright');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.type('JS');
    await expect(input).toHaveValue('PlaywriJSght');

    const box = page.locator('#drag');
    const target = page.locator('#target');
    const boxBox = await box.boundingBox();
    const targetBox = await target.boundingBox();
    if (boxBox && targetBox) {
      await page.mouse.move(boxBox.x + boxBox.width / 2, boxBox.y + boxBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2);
      await page.mouse.up();
    }
    await expect(box).toBeVisible();
    await expect(target).toBeVisible();
  });
});
