import { test, expect } from '@playwright/test';

test('homepage has title and basic elements', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Breakups');
  await expect(page.locator('h1')).toContainText('Breakups');
  await expect(page.locator('input[name="noOfPeople"]')).toBeVisible();
  await expect(page.locator('input[type="submit"]')).toBeVisible();
});

test('can add people and calculate payment chain', async ({ page }) => {
  await page.goto('/');

  await page.fill('input[name="noOfPeople"]', '3');
  await page.click('input[type="submit"]');

  await expect(page.locator('.Peoples')).toBeVisible();

  const nameInputs = page.locator('input[placeholder="Name"]');
  const amountInputs = page.locator('input[placeholder="Amount"]');

  await nameInputs.nth(0).fill('Alice');
  await amountInputs.nth(0).fill('100');

  await nameInputs.nth(1).fill('Bob');
  await amountInputs.nth(1).fill('-50');

  await nameInputs.nth(2).fill('Charlie');
  await amountInputs.nth(2).fill('-50');

  await page.click('input[value="Get Payment Chain"]');

  await expect(page.locator('input[value="Loading..."]')).toBeVisible();

  await page.waitForSelector('.PaymentChain', { timeout: 2000 });
  await expect(page.locator('.PaymentChain')).toBeVisible();
});

test('validates input for number of people', async ({ page }) => {
  await page.goto('/');

  page.on('dialog', dialog => dialog.accept());

  await page.fill('input[name="noOfPeople"]', '2');
  await page.click('input[type="submit"]');

  await expect(page.locator('.Peoples')).not.toBeVisible();
});

test('validates person info before calculating payment chain', async ({ page }) => {
  await page.goto('/');

  await page.fill('input[name="noOfPeople"]', '3');
  await page.click('input[type="submit"]');

  await expect(page.locator('.Peoples')).toBeVisible();

  const nameInputs = page.locator('input[placeholder="Name"]');
  await nameInputs.nth(0).fill('Alice');

  page.on('dialog', dialog => dialog.accept());

  await page.click('input[value="Get Payment Chain"]');

  await expect(page.locator('input[value="Get Payment Chain"]')).toBeVisible();
});