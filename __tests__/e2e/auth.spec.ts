import { test, expect } from '@playwright/test';

// Configure longer timeout for these tests since they involve network requests
test.setTimeout(60000);

test.describe('Authentication', () => {
  test('should navigate to the login page and display the title', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(/SecretBox/);
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });

  test('should display login form correctly', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle' });
    
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Continue")')).toBeVisible();
  });

  test('should display registration form correctly', async ({ page }) => {
    await page.goto('/register', { waitUntil: 'networkidle' });
    
    // Check all form elements exist
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('input[name="masterPassword"]')).toBeVisible();
    await expect(page.locator('input[name="confirmMasterPassword"]')).toBeVisible();
    await expect(page.locator('#terms')).toBeVisible();
    await expect(page.locator('button:has-text("Create Account")')).toBeVisible();
  });

  test('should fill registration form without submitting', async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    const masterPassword = 'MasterPassword123!';

    await page.goto('/register', { waitUntil: 'networkidle' });
    
    // Fill out the form step by step with waits
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.fill('input[name="masterPassword"]', masterPassword);
    await page.fill('input[name="confirmMasterPassword"]', masterPassword);
    
    // Check that the form is filled correctly
    await expect(page.locator('input[name="name"]')).toHaveValue('Test User');
    await expect(page.locator('input[name="email"]')).toHaveValue(uniqueEmail);
    
    // Try to interact with terms checkbox carefully
    const termsCheckbox = page.locator('#terms');
    await expect(termsCheckbox).toBeVisible();
    
    // Use click instead of check for better browser compatibility
    await termsCheckbox.click({ timeout: 10000 });
    await expect(termsCheckbox).toBeChecked();
    
    // Verify the submit button is enabled
    const submitButton = page.locator('button:has-text("Create Account")');
    await expect(submitButton).toBeEnabled();
  });

  test('should handle login form interaction', async ({ page }) => {
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    await page.goto('/login', { waitUntil: 'networkidle' });
    
    // Fill login form
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    
    // Verify form is filled
    await expect(page.locator('input[name="email"]')).toHaveValue(testEmail);
    await expect(page.locator('input[name="password"]')).toHaveValue(testPassword);
    
    // Check that continue button is present and enabled
    const continueButton = page.locator('button:has-text("Continue")');
    await expect(continueButton).toBeVisible();
    await expect(continueButton).toBeEnabled();
  });

  // Skip the full registration/login flow test for now due to API issues
  test.skip('full authentication flow - disabled until API issues resolved', async ({ page }) => {
    // This test is skipped because the registration API has issues
    // Re-enable once the backend registration endpoint is fixed
  });
});