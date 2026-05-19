import { test, expect } from '@playwright/test';

test.describe('E-commerce Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
    });

    test('complete purchase flow', async ({ page }) => {
        // Navigate to products
        await page.click('text=Products');
        await expect(page).toHaveURL(/\/products/);

        // Search for a product
        await page.fill('[placeholder="Search products..."]', 'laptop');
        await page.press('[placeholder="Search products..."]', 'Enter');

        // Click on first product
        await page.click('.product-card >> nth=0');
        await expect(page).toHaveURL(/\/products\/.+/);

        // Add to cart
        await page.click('text=Add to Cart');
        await expect(page.locator('.cart-notification')).toBeVisible();

        // Go to cart
        await page.click('[aria-label="Cart"]');
        await expect(page).toHaveURL(/\/cart/);

        // Verify product in cart
        await expect(page.locator('.cart-item')).toBeVisible();

        // Proceed to checkout
        await page.click('text=Proceed to Checkout');
        await expect(page).toHaveURL(/\/checkout/);

        // Fill shipping information
        await page.fill('[name="name"]', 'John Doe');
        await page.fill('[name="email"]', 'john@example.com');
        await page.fill('[name="address"]', '123 Main St');
        await page.fill('[name="city"]', 'New York');
        await page.fill('[name="zipCode"]', '10001');

        // Select payment method
        await page.click('text=Credit Card');

        // Complete purchase
        await page.click('text=Complete Order');

        // Verify success
        await expect(page).toHaveURL(/\/checkout\/success/);
        await expect(page.locator('text=Order Confirmed')).toBeVisible();
    });

    test('add product to wishlist', async ({ page }) => {
        await page.click('text=Products');

        // Click wishlist icon on first product
        await page.click('.product-card >> nth=0 >> [aria-label="Add to Wishlist"]');

        // Verify wishlist notification
        await expect(page.locator('text=Added to wishlist')).toBeVisible();

        // Go to wishlist
        await page.click('[aria-label="Wishlist"]');
        await expect(page).toHaveURL(/\/wishlist/);

        // Verify product in wishlist
        await expect(page.locator('.wishlist-item')).toBeVisible();
    });

    test('search and filter products', async ({ page }) => {
        await page.goto('http://localhost:3000/products');

        // Open filters
        await page.click('text=Filters');

        // Set price range
        await page.fill('[name="minPrice"]', '100');
        await page.fill('[name="maxPrice"]', '500');

        // Select category
        await page.check('text=Electronics');

        // Set minimum rating
        await page.click('.rating-filter >> text=4');

        // Apply filters
        await page.click('text=Apply Filters');

        // Verify filtered results
        await expect(page.locator('.product-card')).toHaveCount(await page.locator('.product-card').count());

        // Verify price is within range
        const prices = await page.locator('.product-price').allTextContents();
        prices.forEach((price) => {
            const numPrice = parseFloat(price.replace('$', ''));
            expect(numPrice).toBeGreaterThanOrEqual(100);
            expect(numPrice).toBeLessThanOrEqual(500);
        });
    });

    test('seller dashboard', async ({ page }) => {
        // Login as seller
        await page.goto('http://localhost:3000/login');
        await page.fill('[name="email"]', 'seller@example.com');
        await page.fill('[name="password"]', 'password123');
        await page.click('text=Login');

        // Navigate to seller dashboard
        await page.goto('http://localhost:3000/seller');
        await expect(page).toHaveURL(/\/seller/);

        // Verify dashboard elements
        await expect(page.locator('text=Total Sales')).toBeVisible();
        await expect(page.locator('text=Total Orders')).toBeVisible();
        await expect(page.locator('.sales-chart')).toBeVisible();

        // Add new product
        await page.click('text=Add Product');
        await page.fill('[name="name"]', 'New Product');
        await page.fill('[name="description"]', 'Product description');
        await page.fill('[name="price"]', '99.99');
        await page.selectOption('[name="category"]', 'Electronics');
        await page.click('text=Save Product');

        // Verify product added
        await expect(page.locator('text=Product added successfully')).toBeVisible();
    });
});

test.describe('Authentication', () => {
    test('register new user', async ({ page }) => {
        await page.goto('http://localhost:3000/register');

        await page.fill('[name="name"]', 'Test User');
        await page.fill('[name="email"]', `test${Date.now()}@example.com`);
        await page.fill('[name="password"]', 'password123');
        await page.fill('[name="confirmPassword"]', 'password123');

        await page.click('text=Register');

        await expect(page).toHaveURL('http://localhost:3000/');
        await expect(page.locator('text=Welcome')).toBeVisible();
    });

    test('login existing user', async ({ page }) => {
        await page.goto('http://localhost:3000/login');

        await page.fill('[name="email"]', 'user@example.com');
        await page.fill('[name="password"]', 'password123');
        await page.click('text=Login');

        await expect(page).toHaveURL('http://localhost:3000/');
        await expect(page.locator('[aria-label="User menu"]')).toBeVisible();
    });

    test('logout user', async ({ page }) => {
        // Login first
        await page.goto('http://localhost:3000/login');
        await page.fill('[name="email"]', 'user@example.com');
        await page.fill('[name="password"]', 'password123');
        await page.click('text=Login');

        // Logout
        await page.click('[aria-label="User menu"]');
        await page.click('text=Logout');

        await expect(page).toHaveURL('http://localhost:3000/');
        await expect(page.locator('text=Login')).toBeVisible();
    });
});
