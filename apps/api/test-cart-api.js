const http = require('http');

const BASE_URL = 'http://localhost:4000';

async function request(path, options = {}) {
  const url = new URL(path, BASE_URL);
  const headers = { ...options.headers };
  let body = options.body;

  if (body && typeof body === 'object') {
    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }

  return new Promise((resolve, reject) => {
    const req = http.request(
      url,
      {
        method: options.method || 'GET',
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({ status: res.statusCode, body: parsed, headers: res.headers });
        });
      },
    );

    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTests() {
  console.log('🧪 Starting Cart API Comprehensive Verification Suite...\n');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}`);
      console.error(`   ${err.message}`);
    }
  }

  // 1. GET /cart without auth -> 401
  await test('GET /cart without authentication returns 401', async () => {
    const res = await request('/cart');
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test('GET /api/cart without authentication returns 401', async () => {
    const res = await request('/api/cart');
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  // 2. RolesGuard check: Admin token on /cart -> 403
  let adminToken = '';
  await test('Login as Admin (admin@blinkit.com)', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@blinkit.com', password: 'Admin@123' },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.accessToken, 'Expected accessToken');
    adminToken = res.body.accessToken;
  });

  await test('GET /cart with ADMIN role returns 403 Forbidden', async () => {
    const res = await request('/cart', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);
  });

  // 3. Customer login
  let customerToken = '';
  let customerId = '';
  await test('Login as Seeded Customer (customer@blinkit.com)', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: { email: 'customer@blinkit.com', password: 'Customer@123' },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.accessToken, 'Expected accessToken');
    customerToken = res.body.accessToken;
    customerId = res.body.user.id;
  });

  // 4. GET /cart for Customer
  let initialCart;
  await test('GET /cart returns authenticated customer cart', async () => {
    const res = await request('/cart', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.id, 'Cart must have id');
    assert(Array.isArray(res.body.items), 'Cart must have items array');
    assert(typeof res.body.totalItems === 'number', 'Cart must have totalItems number');
    assert(typeof res.body.subtotal === 'number', 'Cart must have subtotal number');
    initialCart = res.body;
  });

  // 5. DELETE /cart to ensure clean start
  await test('DELETE /cart clears all items and preserves cart record', async () => {
    const res = await request('/cart', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.id === initialCart.id, 'Cart ID must remain unchanged');
    assert(res.body.items.length === 0, 'Items should be empty');
    assert(res.body.totalItems === 0, 'totalItems should be 0');
    assert(res.body.subtotal === 0, 'subtotal should be 0');
  });

  // 6. Fetch products to get test products
  let products = [];
  await test('Fetch products list for testing', async () => {
    const res = await request('/products');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.body) && res.body.length >= 2, 'Expected at least 2 products');
    products = res.body;
  });

  const p1 = products[0]; // e.g. Banana
  const p2 = products[1]; // e.g. Apple

  // 7. Validation: non-existent product
  await test('POST /cart/items with non-existent product returns 404', async () => {
    const res = await request('/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { productId: '00000000-0000-0000-0000-000000000000', quantity: 1 },
    });
    assert(res.status === 404, `Expected 404, got ${res.status}`);
  });

  // 8. Validation: negative/zero quantity
  await test('POST /cart/items with invalid quantity (0 or negative) returns 400', async () => {
    const resZero = await request('/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { productId: p1.id, quantity: 0 },
    });
    assert(resZero.status === 400, `Expected 400 for qty=0, got ${resZero.status}`);

    const resNeg = await request('/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { productId: p1.id, quantity: -2 },
    });
    assert(resNeg.status === 400, `Expected 400 for qty=-2, got ${resNeg.status}`);
  });

  // 9. Stock validation on POST
  await test('POST /cart/items exceeding available stock returns 400', async () => {
    const res = await request('/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { productId: p1.id, quantity: p1.stock + 10 },
    });
    assert(res.status === 400, `Expected 400, got ${res.status}: ${JSON.stringify(res.body)}`);
  });

  // 10. POST /cart/items adding product 1 (quantity: 2)
  let cartAfterAdd1;
  await test('POST /cart/items successfully adds product with quantity 2', async () => {
    const res = await request('/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { productId: p1.id, quantity: 2 },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.items.length === 1, `Expected 1 item, got ${res.body.items.length}`);
    const item = res.body.items[0];
    assert(item.quantity === 2, `Expected item quantity 2, got ${item.quantity}`);
    assert(item.product.id === p1.id, `Product ID mismatch`);
    assert(item.product.name === p1.name, `Product name mismatch`);
    assert(item.product.price === p1.price, `Product price mismatch`);
    assert(item.subtotal === Math.round(2 * p1.price * 100) / 100, `Item subtotal mismatch: expected ${2 * p1.price}, got ${item.subtotal}`);
    assert(res.body.totalItems === 2, `Cart totalItems mismatch: expected 2, got ${res.body.totalItems}`);
    assert(res.body.subtotal === Math.round(2 * p1.price * 100) / 100, `Cart subtotal mismatch: expected ${2 * p1.price}, got ${res.body.subtotal}`);
    cartAfterAdd1 = res.body;
  });

  // 11. POST /cart/items increment existing product (quantity: 1 more)
  await test('POST /cart/items increments existing item without creating duplicate', async () => {
    const res = await request('/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { productId: p1.id, quantity: 1 },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.items.length === 1, `Expected still 1 item in items list, got ${res.body.items.length}`);
    const item = res.body.items[0];
    assert(item.quantity === 3, `Expected quantity 3 (2+1), got ${item.quantity}`);
    assert(item.subtotal === Math.round(3 * p1.price * 100) / 100, `Item subtotal mismatch`);
    assert(res.body.totalItems === 3, `totalItems should be 3, got ${res.body.totalItems}`);
    assert(res.body.subtotal === Math.round(3 * p1.price * 100) / 100, `Cart subtotal should be ${3 * p1.price}, got ${res.body.subtotal}`);
  });

  // 12. PATCH /cart/items/:productId updates quantity
  await test('PATCH /cart/items/:productId updates quantity to 5', async () => {
    const res = await request(`/cart/items/${p1.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { quantity: 5 },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.items.length === 1, `Expected 1 item, got ${res.body.items.length}`);
    const item = res.body.items[0];
    assert(item.quantity === 5, `Expected quantity 5, got ${item.quantity}`);
    assert(item.subtotal === Math.round(5 * p1.price * 100) / 100, `Item subtotal mismatch`);
    assert(res.body.totalItems === 5, `totalItems should be 5, got ${res.body.totalItems}`);
    assert(res.body.subtotal === Math.round(5 * p1.price * 100) / 100, `Cart subtotal mismatch`);
  });

  // 13. PATCH stock check
  await test('PATCH /cart/items/:productId with quantity exceeding stock returns 400', async () => {
    const res = await request(`/cart/items/${p1.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { quantity: p1.stock + 999 },
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  // 14. PATCH quantity <= 0 validation
  await test('PATCH /cart/items/:productId with quantity <= 0 returns 400', async () => {
    const res = await request(`/cart/items/${p1.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { quantity: 0 },
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  // 15. PATCH product not in cart
  await test('PATCH /cart/items/:productId on product not in cart returns 404', async () => {
    const res = await request(`/cart/items/${p2.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { quantity: 1 },
    });
    assert(res.status === 404, `Expected 404, got ${res.status}`);
  });

  // 16. Add second product (p2, quantity: 2)
  await test('POST /cart/items adds second distinct product', async () => {
    const res = await request('/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { productId: p2.id, quantity: 2 },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.items.length === 2, `Expected 2 items, got ${res.body.items.length}`);
    const expectedSubtotal = Math.round((5 * p1.price + 2 * p2.price) * 100) / 100;
    assert(res.body.totalItems === 7, `Expected totalItems 7 (5+2), got ${res.body.totalItems}`);
    assert(res.body.subtotal === expectedSubtotal, `Expected subtotal ${expectedSubtotal}, got ${res.body.subtotal}`);
  });

  // 17. DELETE /cart/items/:productId for product not in cart -> 404
  await test('DELETE /cart/items/:productId for non-existent item returns 404', async () => {
    const res = await request('/cart/items/non-existent-id', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(res.status === 404, `Expected 404, got ${res.status}`);
  });

  // 18. DELETE /cart/items/:productId removes specific product
  await test('DELETE /cart/items/:productId removes p1 from cart', async () => {
    const res = await request(`/cart/items/${p1.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.items.length === 1, `Expected 1 item remaining, got ${res.body.items.length}`);
    assert(res.body.items[0].product.id === p2.id, `Remaining item should be p2`);
    assert(res.body.totalItems === 2, `Remaining totalItems should be 2`);
    assert(res.body.subtotal === Math.round(2 * p2.price * 100) / 100, `Subtotal mismatch`);
  });

  // 19. Customer isolation test
  let customer2Token = '';
  await test('Customer isolation: register second customer and verify separated cart', async () => {
    const randomEmail = `test_customer_${Date.now()}@blinkit.com`;
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: {
        email: randomEmail,
        password: 'Password@123',
        name: 'Test Customer 2',
      },
    });
    assert(regRes.status === 201 || regRes.status === 200, `Registration status ${regRes.status}`);
    customer2Token = regRes.body.accessToken;

    // Customer 2's cart should be empty
    const c2CartRes = await request('/cart', {
      headers: { Authorization: `Bearer ${customer2Token}` },
    });
    assert(c2CartRes.status === 200, `C2 getCart status ${c2CartRes.status}`);
    assert(c2CartRes.body.items.length === 0, `Customer 2 cart should be empty`);
    assert(c2CartRes.body.id !== initialCart.id, `Customer 2 cart ID should be different from Customer 1`);

    // Customer 2 adds p1
    await request('/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customer2Token}` },
      body: { productId: p1.id, quantity: 1 },
    });

    // Customer 1's cart should still only contain p2 with quantity 2
    const c1CartRes = await request('/cart', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(c1CartRes.body.items.length === 1, 'Customer 1 cart items unaffected');
    assert(c1CartRes.body.items[0].product.id === p2.id, 'Customer 1 cart has p2');
    assert(c1CartRes.body.totalItems === 2, 'Customer 1 totalItems unaffected');

    // Customer 1 trying to delete p1 (which only exists in Customer 2 cart) -> 404
    const crossDeleteRes = await request(`/cart/items/${p1.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(crossDeleteRes.status === 404, `Cross-user delete must return 404, got ${crossDeleteRes.status}`);
  });

  // 20. DELETE /cart clears customer 1 cart
  await test('DELETE /cart clears customer 1 cart', async () => {
    const res = await request('/cart', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.items.length === 0, 'Items should be empty');
    assert(res.body.totalItems === 0, 'totalItems should be 0');
    assert(res.body.subtotal === 0, 'subtotal should be 0');
  });

  // 21. Check other existing APIs are intact
  await test('Health endpoint /api/health is operational', async () => {
    const res = await request('/health');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.status === 'ok', `Expected status ok, got ${res.body.status}`);
  });

  await test('Categories endpoint /categories is operational', async () => {
    const res = await request('/categories');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.body) && res.body.length > 0, 'Categories returned');
  });

  console.log(`\n========================================`);
  console.log(`Summary: ${passed}/${total} tests passed!`);
  console.log(`========================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
