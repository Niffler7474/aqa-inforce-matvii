import { test, expect } from '@playwright/test';
const { chromium } = require('playwright');

test('valid_data', async ({ page }) => {
    const browser = await chromium.launch({ headless: true });

    await page.goto('https://automationintesting.online/');
    await page.getByRole('button', { name: 'Book this room' }).click();

    await page.waitForSelector('.rbc-calendar');
    const calendarVisible = await page.isVisible('.rbc-calendar');
    expect(calendarVisible).toBe(true); // Verify calendar is visible

    const firstDate = await page.locator('button:has-text("15")');
    const firstDateBox = await firstDate.boundingBox();

    const lastDate = await page.locator('button:has-text("18")');
    const lastDateBox = await lastDate.boundingBox();

    await page.mouse.move(firstDateBox.x + firstDateBox.width / 2, firstDateBox.y + firstDateBox.height / 2);
    await page.mouse.down();

    await page.mouse.move(lastDateBox.x + lastDateBox.width / 2, lastDateBox.y + lastDateBox.height / 2, { steps: 10 });

    await page.mouse.up();

    const calendarElement = await page.$('.rbc-calendar');
    await calendarElement.screenshot({ path: 'img\\valid_name\\calendar_screenshot.png' });

    await page.getByPlaceholder('Firstname').fill('John');
    await page.getByPlaceholder('Lastname').fill('Doe');
    await page.locator('input[name="email"]').fill('test@test.com');
    await page.locator('input[name="phone"]').fill('12345678911');

    const formElement = await page.$('.col-sm-4');
    await formElement.screenshot({ path: 'img\\valid_name\\form_screenshot.png' });

    await page.getByRole('button', { name: 'Book' }).click();

    const modal = page.locator('.confirmation-modal');
    await expect(modal).toBeVisible();
    await page.screenshot({ path: 'img\\valid_name\\confirmation_modal_screenshot.png' });

    await browser.close();
});

test('invalid_firstname', async ({ page }) => {
    const browser = await chromium.launch({ headless: true });

    await page.goto('https://automationintesting.online/');
    await page.getByRole('button', { name: 'Book this room' }).click();

    await page.waitForSelector('.rbc-calendar');
    const calendarVisible = await page.isVisible('.rbc-calendar');
    expect(calendarVisible).toBe(true);

    const firstDate = await page.locator('button:has-text("20")');
    const firstDateBox = await firstDate.boundingBox();

    const lastDate = await page.locator('button:has-text("24")');
    const lastDateBox = await lastDate.boundingBox();

    await page.mouse.move(firstDateBox.x + firstDateBox.width / 2, firstDateBox.y + firstDateBox.height / 2);
    await page.mouse.down();

    await page.mouse.move(lastDateBox.x + lastDateBox.width / 2, lastDateBox.y + lastDateBox.height / 2, { steps: 10 });

    await page.mouse.up();

    const calendarElement = await page.$('.rbc-calendar');
    await calendarElement.screenshot({ path: 'img\\invalid_name\\calendar_screenshot.png' });

    await page.getByPlaceholder('Firstname').fill('Jo');
    await page.getByPlaceholder('Lastname').fill('Doe');
    await page.locator('input[name="email"]').fill('test@test.com');
    await page.locator('input[name="phone"]').fill('12345678911');

    const formElement = await page.$('.col-sm-4');
    await formElement.screenshot({ path: 'img\\invalid_name\\form_screenshot.png' });

    await page.getByRole('button', { name: 'Book' }).click();

    try {
        const alertDanger = page.locator('.alert-danger');
        await expect(alertDanger).toBeVisible({ timeout: 10000 });
        await page.screenshot({ path: 'img\\invalid_name\\fullpage.png' });

    } catch (error) {
        console.error(error.message);
        await page.screenshot({ path: 'img\\invalid_name\\fullpage.png' });
    } finally {
        await browser.close();
    }
});

test('invalid_lastname', async ({ page }) => {
    const browser = await chromium.launch({ headless: true });

    await page.goto('https://automationintesting.online/');
    await page.getByRole('button', { name: 'Book this room' }).click();

    await page.waitForSelector('.rbc-calendar');
    const calendarVisible = await page.isVisible('.rbc-calendar');
    expect(calendarVisible).toBe(true);

    const firstDate = await page.locator('button:has-text("20")');
    const firstDateBox = await firstDate.boundingBox();

    const lastDate = await page.locator('button:has-text("24")');
    const lastDateBox = await lastDate.boundingBox();

    await page.mouse.move(firstDateBox.x + firstDateBox.width / 2, firstDateBox.y + firstDateBox.height / 2);
    await page.mouse.down();

    await page.mouse.move(lastDateBox.x + lastDateBox.width / 2, lastDateBox.y + lastDateBox.height / 2, { steps: 10 });

    await page.mouse.up();

    const calendarElement = await page.$('.rbc-calendar');
    await calendarElement.screenshot({ path: 'img\\invalid_lastname\\calendar_screenshot.png' });

    await page.getByPlaceholder('Firstname').fill('John');
    await page.getByPlaceholder('Lastname').fill('D');
    await page.locator('input[name="email"]').fill('test@test.com');
    await page.locator('input[name="phone"]').fill('12345678911');

    const formElement = await page.$('.col-sm-4');
    await formElement.screenshot({ path: 'img\\invalid_lastname\\fullpage.png' });

    await page.getByRole('button', { name: 'Book' }).click();

    try {
        const alertDanger = page.locator('.alert-danger');
        await expect(alertDanger).toBeVisible({ timeout: 10000 });
        await page.screenshot({ path: 'img\\invalid_lastname\\fullpage.png' });

    } catch (error) {
        console.error(error.message);
        await page.screenshot({ path: 'img\\invalid_lastname\\fullpage.png' });
    } finally {
        await browser.close();
    }
});

test('invalid_mail', async ({ page }) => {
    const browser = await chromium.launch({ headless: true });

    await page.goto('https://automationintesting.online/');
    await page.getByRole('button', { name: 'Book this room' }).click();

    await page.waitForSelector('.rbc-calendar');
    const calendarVisible = await page.isVisible('.rbc-calendar');
    expect(calendarVisible).toBe(true);

    const firstDate = await page.locator('button:has-text("20")');
    const firstDateBox = await firstDate.boundingBox();

    const lastDate = await page.locator('button:has-text("24")');
    const lastDateBox = await lastDate.boundingBox();

    await page.mouse.move(firstDateBox.x + firstDateBox.width / 2, firstDateBox.y + firstDateBox.height / 2);
    await page.mouse.down();

    await page.mouse.move(lastDateBox.x + lastDateBox.width / 2, lastDateBox.y + lastDateBox.height / 2, { steps: 10 });

    await page.mouse.up();

    const calendarElement = await page.$('.rbc-calendar');
    await calendarElement.screenshot({ path: 'img\\invalid_mail\\calendar_screenshot.png' });

    await page.getByPlaceholder('Firstname').fill('Jo');
    await page.getByPlaceholder('Lastname').fill('Doe');
    await page.locator('input[name="email"]').fill('test');
    await page.locator('input[name="phone"]').fill('12345678911');

    const formElement = await page.$('.col-sm-4');
    await formElement.screenshot({ path: 'img\\invalid_mail\\form_screenshot.png' });

    await page.getByRole('button', { name: 'Book' }).click();

    try {
        const alertDanger = page.locator('.alert-danger');
        await expect(alertDanger).toBeVisible({ timeout: 10000 });
        await page.screenshot({ path: 'img\\invalid_mail\\fullpage.png' });

    } catch (error) {
        console.error(error.message);
        await page.screenshot({ path: 'img\\invalid_mail\\fullpage.png' });
    } finally {
        await browser.close();
    }
});

test('invalid_number', async ({ page }) => {
    const browser = await chromium.launch({ headless: true });

    await page.goto('https://automationintesting.online/');
    await page.getByRole('button', { name: 'Book this room' }).click();

    await page.waitForSelector('.rbc-calendar');
    const calendarVisible = await page.isVisible('.rbc-calendar');
    expect(calendarVisible).toBe(true);

    const firstDate = await page.locator('button:has-text("20")');
    const firstDateBox = await firstDate.boundingBox();

    const lastDate = await page.locator('button:has-text("24")');
    const lastDateBox = await lastDate.boundingBox();

    await page.mouse.move(firstDateBox.x + firstDateBox.width / 2, firstDateBox.y + firstDateBox.height / 2);
    await page.mouse.down();

    await page.mouse.move(lastDateBox.x + lastDateBox.width / 2, lastDateBox.y + lastDateBox.height / 2, { steps: 10 });

    await page.mouse.up();

    const calendarElement = await page.$('.rbc-calendar');
    await calendarElement.screenshot({ path: 'img\\invalid_number\\calendar_screenshot.png' });

    await page.getByPlaceholder('Firstname').fill('Jo');
    await page.getByPlaceholder('Lastname').fill('Doe');
    await page.locator('input[name="email"]').fill('test@test.com');
    await page.locator('input[name="phone"]').fill('12');

    const formElement = await page.$('.col-sm-4');
    await formElement.screenshot({ path: 'img\\invalid_number\\form_screenshot.png' });

    await page.getByRole('button', { name: 'Book' }).click();

    try {
        const alertDanger = page.locator('.alert-danger');
        await expect(alertDanger).toBeVisible({ timeout: 10000 }); // Check if alert-danger is visible
        await page.screenshot({ path: 'img\\invalid_number\\fullpage.png' });

    } catch (error) {
        console.error(error.message);
        await page.screenshot({ path: 'img\\invalid_number\\fullpage.png' });
    } finally {
        await browser.close();
    }
});
