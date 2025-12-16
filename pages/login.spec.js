import { test, expect } from '@playwright/test';

test('Safeway login', async ({ page }) => {
  await page.goto('https://www.safeway.com/');
  await page.getByRole('button', { name: 'Account menu' }).click();
  await page.waitForTimeout(2000); // Wait for menu to open
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.waitForTimeout(2000); // Wait for sign-in modal
  await page.getByText('Email or mobile number').click();
  await page.getByRole('textbox', { name: 'Email or mobile number' }).fill('test.pre.dep@outlook.com');
  await page.getByRole('button', { name: 'Sign in with password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('sample123');
  await page.getByRole('button', { name: 'Show Password' }).click();
  await page.getByRole('button', { name: 'Show Password' }).click();
});
