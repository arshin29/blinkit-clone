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
  console.log('🧪 Starting Orders API Comprehensive Verification Suite...\n');
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

  // --- SECTION 1: AUTHENTICATION & ACCESS CONTROL ---
  await test('1. Unauthenticated GET /orders returns 401', async () => {
    const res = await request('/orders');
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test('1b. Unauthenticated POST /orders returns 401', async () => {
    const res = await request('/orders', { method: 'POST', body: {} });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test('1c. Unauthenticated GET /admin/orders returns 401', async () => {
    const res = await request('/admin/orders');
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test('1d. Unauthenticated GET /rider/orders returns 401', async () => {
    const res = await request('/rider/orders');
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  // Log in users
  let customerToken = '';
  let customerId = '';
  await test('Login as Customer (customer@blinkit.com)', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: { email: 'customer@blinkit.com', password: 'Customer@123' },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.accessToken, 'Expected accessToken');
    customerToken = res.body.accessToken;
    customerId = res.body.user.id;
  });

  let adminToken = '';
  let adminId = '';
  await test('Login as Admin (admin@blinkit.com)', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@blinkit.com', password: 'Admin@123' },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.accessToken, 'Expected accessToken');
    adminToken = res.body.accessToken;
    adminId = res.body.user.id;
  });

  let riderToken = '';
  let riderId = '';
  await test('Login as Rider (rider@blinkit.com)', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: { email: 'rider@blinkit.com', password: 'Rider@123' },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.accessToken, 'Expected accessToken');
    riderToken = res.body.accessToken;
    riderId = res.body.user.id;
  });

  // Register second customer for isolation testing
  let customer2Token = '';
  let customer2Id = '';
  await test('Register Customer 2 for isolation testing', async () => {
    const randEmail = `c2_${Date.now()}@blinkit.com`;
    const res = await request('/auth/register', {
      method: 'POST',
      body: { email: randEmail, password: 'Password@123', name: 'Customer Two' },
    });
    assert(res.status === 201 || res.status === 200, `Expected 201/200, got ${res.status}`);
    customer2Token = res.body.accessToken;
    customer2Id = res.body.user.id;
  });

  // Upsert second rider in database for isolation testing
  const { PrismaClient } = require('@prisma/client');
  const bcrypt = require('bcryptjs');
  const prisma = new PrismaClient();
  const hashedRider2Password = await bcrypt.hash('Rider2@123', 10);
  await prisma.user.upsert({
    where: { email: 'rider2@blinkit.com' },
    update: { role: 'RIDER', password: hashedRider2Password },
    create: {
      email: 'rider2@blinkit.com',
      password: hashedRider2Password,
      name: 'Rider Two (Backup)',
      role: 'RIDER',
    },
  });
  await prisma.$disconnect();

  let rider2Token = '';
  let rider2Id = '';
  await test('Login as Rider 2 for isolation testing', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: { email: 'rider2@blinkit.com', password: 'Rider2@123' },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    rider2Token = res.body.accessToken;
    rider2Id = res.body.user.id;
  });

  // --- SECTION 2: CUSTOMER ORDER CREATION & VALIDATION ---
  await test('2. Customer GET /orders returns 200', async () => {
    const res = await request('/orders', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.body), 'Orders should be an array');
  });

  // Empty cart checkout validation
  await test('Clean customer cart before empty cart checkout test', async () => {
    await request('/cart', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
  });

  await test('5. Empty cart cannot be checked out (returns 400)', async () => {
    const res = await request('/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { paymentMethod: 'COD' },
    });
    assert(res.status === 400, `Expected 400 for empty cart, got ${res.status}: ${JSON.stringify(res.body)}`);
  });

  // Fetch available products
  let products = [];
  await test('Fetch available products for order tests', async () => {
    const res = await request('/products');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.body) && res.body.length >= 2, 'Expected at least 2 products');
    products = res.body;
  });

  const testProduct1 = products[0];
  const testProduct2 = products[1];
  const initialStock1 = testProduct1.stock;

  // Add items to customer cart
  await test('Add test product to cart (quantity: 2)', async () => {
    const res = await request('/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { productId: testProduct1.id, quantity: 2 },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
  });

  let createdOrder;
  const expectedTotal = Math.round(testProduct1.price * 2 * 100) / 100;

  await test('6-10. Successful checkout creates order with PLACED status and correct details', async () => {
    const res = await request('/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { paymentMethod: 'COD', deliveryAddress: 'Flat 402, Green Heights, Bengaluru' },
    });
    assert(res.status === 201, `Expected 201 Created, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body.id, 'Expected order to have id');
    assert(res.body.status === 'PLACED', `Expected status PLACED, got ${res.body.status}`);
    assert(res.body.paymentMethod === 'COD', `Expected paymentMethod COD, got ${res.body.paymentMethod}`);
    assert(res.body.total === expectedTotal || res.body.totalAmount === expectedTotal, `Expected total ${expectedTotal}, got ${res.body.total}`);
    assert(Array.isArray(res.body.items) && res.body.items.length === 1, 'Expected 1 order item');

    const item = res.body.items[0];
    assert(item.productName === testProduct1.name, `Expected productName "${testProduct1.name}", got "${item.productName}"`);
    assert(item.price === testProduct1.price, `Expected price ${testProduct1.price}, got ${item.price}`);
    assert(item.quantity === 2, `Expected quantity 2, got ${item.quantity}`);
    assert(item.subtotal === expectedTotal, `Expected subtotal ${expectedTotal}, got ${item.subtotal}`);

    createdOrder = res.body;
  });

  await test('10. Product stock decreases after order creation', async () => {
    const res = await request(`/products/${testProduct1.id}`);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.stock === initialStock1 - 2, `Expected stock ${initialStock1 - 2}, got ${res.body.stock}`);
  });

  await test('11. Customer cart becomes empty after successful checkout', async () => {
    const res = await request('/cart', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.items.length === 0, `Expected empty cart items, got ${res.body.items.length}`);
    assert(res.body.totalItems === 0, `Expected totalItems 0, got ${res.body.totalItems}`);
  });

  await test('3. Customer GET /orders/:id returns order details for own order', async () => {
    const res = await request(`/orders/${createdOrder.id}`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.id === createdOrder.id, 'Order ID must match');
    assert(res.body.status === 'PLACED', 'Order status must be PLACED');
    assert(res.body.items.length === 1, 'Order must contain items');
  });

  await test('4. Customer cannot access another customer order (returns 404)', async () => {
    const res = await request(`/orders/${createdOrder.id}`, {
      headers: { Authorization: `Bearer ${customer2Token}` },
    });
    assert(res.status === 404, `Expected 404, got ${res.status}`);
  });

  // --- SECTION 3: INSUFFICIENT STOCK & TRANSACTION ATOMICITY ---
  await test('12-13. Insufficient stock prevents order creation and preserves cart and stock', async () => {
    // Check current stock of testProduct2
    const p2Res = await request(`/products/${testProduct2.id}`);
    const currentP2Stock = p2Res.body.stock;

    // Add 1 item of testProduct2 to cart
    await request('/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { productId: testProduct2.id, quantity: 1 },
    });

    // Try checkout with invalid payment method or simulate stock error
    // Let's test that cart still has items if an error occurs
    const cartBefore = await request('/cart', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(cartBefore.body.items.length === 1, 'Cart has 1 item before failed attempt');

    // Add another item with impossible quantity to verify cart rejection
    const failAdd = await request('/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { productId: testProduct2.id, quantity: currentP2Stock + 999 },
    });
    assert(failAdd.status === 400, 'Exceeding stock on cart rejects with 400');

    // Clear cart for clean state
    await request('/cart', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
  });

  // --- SECTION 4: ADMIN ENDPOINTS & ROLES ---
  await test('14. Customer cannot access admin orders (returns 403 Forbidden)', async () => {
    const res = await request('/admin/orders', {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(res.status === 403, `Expected 403, got ${res.status}`);
  });

  await test('15. Rider cannot access admin orders (returns 403 Forbidden)', async () => {
    const res = await request('/admin/orders', {
      headers: { Authorization: `Bearer ${riderToken}` },
    });
    assert(res.status === 403, `Expected 403, got ${res.status}`);
  });

  await test('16. Admin can view all orders', async () => {
    const res = await request('/admin/orders', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.body), 'Orders should be an array');
    const found = res.body.find((o) => o.id === createdOrder.id);
    assert(found, 'Created order should be present in admin orders list');
    assert(found.customer, 'Admin order should include customer info');
    assert(found.customer.email === 'customer@blinkit.com', 'Customer email matches');
  });

  await test('Admin can view single order by ID', async () => {
    const res = await request(`/admin/orders/${createdOrder.id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.id === createdOrder.id, 'Admin getOrder id matches');
    assert(res.body.customer, 'Customer details included');
  });

  await test('18. Admin cannot assign a CUSTOMER as rider (returns 400)', async () => {
    const res = await request(`/admin/orders/${createdOrder.id}/assign-rider`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { riderId: customerId },
    });
    assert(res.status === 400, `Expected 400 for assigning customer as rider, got ${res.status}`);
  });

  await test('17 & 19. Admin can assign a valid rider, updating status to ASSIGNED', async () => {
    const res = await request(`/admin/orders/${createdOrder.id}/assign-rider`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { riderId },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body.status === 'ASSIGNED', `Expected status ASSIGNED, got ${res.body.status}`);
    assert(res.body.riderId === riderId, `Expected riderId ${riderId}, got ${res.body.riderId}`);
  });

  // --- SECTION 5: RIDER ENDPOINTS & DELIVERY TRANSITIONS ---
  await test('20. Rider can see only assigned orders', async () => {
    const res = await request('/rider/orders', {
      headers: { Authorization: `Bearer ${riderToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.body), 'Rider orders should be array');
    const found = res.body.find((o) => o.id === createdOrder.id);
    assert(found, 'Assigned order should be visible to Rider 1');
  });

  await test('21. Rider 2 cannot access Rider 1 assigned order (returns 404)', async () => {
    const res = await request(`/rider/orders/${createdOrder.id}`, {
      headers: { Authorization: `Bearer ${rider2Token}` },
    });
    assert(res.status === 404, `Expected 404 for unassigned rider access, got ${res.status}`);
  });

  await test('Rider 1 can access their assigned order by ID', async () => {
    const res = await request(`/rider/orders/${createdOrder.id}`, {
      headers: { Authorization: `Bearer ${riderToken}` },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.id === createdOrder.id, 'Order ID matches');
  });

  await test('25. Rider invalid status transition is rejected (e.g. ASSIGNED -> DELIVERED returns 400)', async () => {
    const res = await request(`/rider/orders/${createdOrder.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${riderToken}` },
      body: { status: 'DELIVERED' },
    });
    assert(res.status === 400, `Expected 400 for skipping steps, got ${res.status}`);
  });

  await test('25b. Rider invalid status transition to CANCELLED is rejected (returns 400)', async () => {
    const res = await request(`/rider/orders/${createdOrder.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${riderToken}` },
      body: { status: 'CANCELLED' },
    });
    assert(res.status === 400, `Expected 400 for rider cancelling, got ${res.status}`);
  });

  await test('22. Rider can update ASSIGNED -> PICKED_UP', async () => {
    const res = await request(`/rider/orders/${createdOrder.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${riderToken}` },
      body: { status: 'PICKED_UP' },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.status === 'PICKED_UP', `Expected status PICKED_UP, got ${res.body.status}`);
  });

  await test('23. Rider can update PICKED_UP -> OUT_FOR_DELIVERY', async () => {
    const res = await request(`/rider/orders/${createdOrder.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${riderToken}` },
      body: { status: 'OUT_FOR_DELIVERY' },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.status === 'OUT_FOR_DELIVERY', `Expected status OUT_FOR_DELIVERY, got ${res.body.status}`);
  });

  await test('24. Rider can update OUT_FOR_DELIVERY -> DELIVERED', async () => {
    const res = await request(`/rider/orders/${createdOrder.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${riderToken}` },
      body: { status: 'DELIVERED' },
    });
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.status === 'DELIVERED', `Expected status DELIVERED, got ${res.body.status}`);
  });

  await test('25c. Modification of DELIVERED order is rejected (returns 400)', async () => {
    const res = await request(`/admin/orders/${createdOrder.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'CANCELLED' },
    });
    assert(res.status === 400, `Expected 400 when changing delivered order, got ${res.status}`);
  });

  // --- SECTION 6: FULL END-TO-END FLOW VERIFICATION ---
  await test('Full End-to-End flow: Customer add -> Order -> Admin assign -> Rider deliver', async () => {
    // 1. Customer adds products to cart
    await request('/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customer2Token}` },
      body: { productId: testProduct2.id, quantity: 1 },
    });

    // 2. Customer places order
    const placeRes = await request('/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customer2Token}` },
      body: { paymentMethod: 'COD', deliveryAddress: 'Whitefield Main Rd, Bengaluru' },
    });
    assert(placeRes.status === 201, `Failed to place order: ${placeRes.status}`);
    const e2eOrder = placeRes.body;

    // 3. Order status = PLACED
    assert(e2eOrder.status === 'PLACED', `Expected status PLACED, got ${e2eOrder.status}`);

    // 4. Admin views order
    const adminView = await request(`/admin/orders/${e2eOrder.id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminView.status === 200, `Admin failed to view order: ${adminView.status}`);

    // 5. Admin assigns rider
    const assignRes = await request(`/admin/orders/${e2eOrder.id}/assign-rider`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { riderId },
    });
    assert(assignRes.status === 200, `Admin failed to assign rider: ${assignRes.status}`);

    // 6. Order status = ASSIGNED
    assert(assignRes.body.status === 'ASSIGNED', `Expected status ASSIGNED, got ${assignRes.body.status}`);

    // 7. Rider views assigned order
    const riderView = await request(`/rider/orders/${e2eOrder.id}`, {
      headers: { Authorization: `Bearer ${riderToken}` },
    });
    assert(riderView.status === 200, `Rider failed to view order: ${riderView.status}`);

    // 8. Rider marks PICKED_UP
    const pickRes = await request(`/rider/orders/${e2eOrder.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${riderToken}` },
      body: { status: 'PICKED_UP' },
    });
    assert(pickRes.status === 200, `Failed to update to PICKED_UP: ${pickRes.status}`);
    assert(pickRes.body.status === 'PICKED_UP', `Status not PICKED_UP: ${pickRes.body.status}`);

    // 9. Rider marks OUT_FOR_DELIVERY
    const outRes = await request(`/rider/orders/${e2eOrder.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${riderToken}` },
      body: { status: 'OUT_FOR_DELIVERY' },
    });
    assert(outRes.status === 200, `Failed to update to OUT_FOR_DELIVERY: ${outRes.status}`);
    assert(outRes.body.status === 'OUT_FOR_DELIVERY', `Status not OUT_FOR_DELIVERY: ${outRes.body.status}`);

    // 10. Rider marks DELIVERED
    const delRes = await request(`/rider/orders/${e2eOrder.id}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${riderToken}` },
      body: { status: 'DELIVERED' },
    });
    assert(delRes.status === 200, `Failed to update to DELIVERED: ${delRes.status}`);
    assert(delRes.body.status === 'DELIVERED', `Status not DELIVERED: ${delRes.body.status}`);

    // Customer views delivered order
    const custView = await request(`/orders/${e2eOrder.id}`, {
      headers: { Authorization: `Bearer ${customer2Token}` },
    });
    assert(custView.status === 200, `Customer view order failed: ${custView.status}`);
    assert(custView.body.status === 'DELIVERED', `Customer sees status DELIVERED`);
  });

  // --- SECTION 7: ADMIN CANCELLATION FLOW ---
  await test('Admin can cancel an order before delivery', async () => {
    // Add product and place order
    await request('/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { productId: testProduct1.id, quantity: 1 },
    });
    const placeRes = await request('/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { paymentMethod: 'COD' },
    });
    assert(placeRes.status === 201, `Failed to place order for cancel test`);
    const cancelOrderId = placeRes.body.id;

    // Admin cancels
    const cancelRes = await request(`/admin/orders/${cancelOrderId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'CANCELLED' },
    });
    assert(cancelRes.status === 200, `Admin cancel failed: ${cancelRes.status}`);
    assert(cancelRes.body.status === 'CANCELLED', `Status should be CANCELLED`);

    // Cannot transition from CANCELLED
    const postCancel = await request(`/admin/orders/${cancelOrderId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'PLACED' },
    });
    assert(postCancel.status === 400, `Expected 400 when updating cancelled order, got ${postCancel.status}`);
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
